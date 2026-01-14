'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRobotCommand } from '@/hooks/use-robot-command';
import { useRobotStore } from '@/hooks/use-robot-store';
import JoystickConfigurationModal from '@/components/parent/joystick/joystick-configuration-modal';
import { useJoystick } from '@/features/activities/hooks/use-joystick';
import { Joystick } from '@/types/joystick';
import { getUserInfoFromToken } from '@/utils/tokenUtils';
import RobotVideoStream from '@/components/parent/robot/robot-video-stream';
import ProtectLicense from '@/components/protect-license';

interface JoystickPosition { x: number; y: number; }
interface ButtonState { [key: string]: boolean; }

export default function JoystickPage() {
  const [leftJoystick, setLeftJoystick] = useState<JoystickPosition>({ x: 0, y: 0 });
  const [buttons, setButtons] = useState<ButtonState>({ A:false,B:false,X:false,Y:false,START:false,SELECT:false,up:false,down:false,left:false,right:false });
  const [notify, setNotifyState] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [lastJoystickCommand, setLastJoystickCommand] = useState<string | null>(null);
  const [joystickCommandTimeout, setJoystickCommandTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastCommandTime, setLastCommandTime] = useState<number>(0);
  const [isCommandPending, setIsCommandPending] = useState<boolean>(false);

  const setNotify = (msg: string, type: 'success' | 'error') => { setNotifyState({ msg, type }); setTimeout(() => setNotifyState(null), 3000); };

  const { sendCommandToBackend } = useRobotCommand(setNotify);
  const { selectedRobot, selectedRobotSerial } = useRobotStore();
  const { useGetJoystickByAccountRobot } = useJoystick();

  const [accountId, setAccountId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  const robotSerial = Array.isArray(selectedRobotSerial) ? selectedRobotSerial[0] : selectedRobotSerial;

  useEffect(() => {
    try {
      setIsClient(true);
      if (typeof window !== 'undefined') {
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
          const userInfo = getUserInfoFromToken(accessToken);
          const id = userInfo?.id || '';
          setAccountId(id);
        }
      }
    } catch (error) {
      console.error('Error getting account ID:', error);
      setHasError(true);
    }
  }, []);

  const robotId = selectedRobot?.id || '';
  const { data: joystickData, error: joystickError } = useGetJoystickByAccountRobot(accountId || '', robotId);

  const effectiveJoystickData = useMemo(() => {
    try {
      if (joystickData) {
        const cacheKey = `joystick_${accountId}_${robotId}`;
        try { localStorage.setItem(cacheKey, JSON.stringify(joystickData)); } catch {}
        return joystickData;
      }
      if (joystickError) {
        const cacheKey = `joystick_${accountId}_${robotId}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) { try { return JSON.parse(cachedData); } catch {} }
      }
    } catch (error) { console.error('Error in effectiveJoystickData:', error); }
    return joystickData;
  }, [joystickData, joystickError, accountId, robotId]);

  const [actionCodes, setActionCodes] = useState<Record<string, string>>({});
  const [actionDescriptions, setActionDescriptions] = useState<{ [key: string]: { name: string; category: 'action' | 'dance' | 'expression' | 'skill' | 'extended_action' }; }>({});

  useEffect(() => {
    try {
      if (effectiveJoystickData?.joysticks && effectiveJoystickData.joysticks.length > 0) {
        const newActionCodes: Record<string, string> = {};
        const newActionDescriptions: Record<string, { name: string; category: 'action' | 'dance' | 'expression' | 'skill' | 'extended_action' }> = {};
        effectiveJoystickData.joysticks.forEach((joystick: Joystick) => {
          try {
            const buttonName = joystick.buttonCode as 'A' | 'B' | 'X' | 'Y';
            if (['A','B','X','Y'].includes(buttonName)) {
              let actionCode = ''; let actionName = ''; let category: 'action'|'dance'|'expression'|'skill'|'extended_action' = 'action';
              if (joystick.actionId && joystick.actionName && joystick.actionCode) { actionCode = joystick.actionCode; actionName = joystick.actionName; category = 'action'; }
              else if (joystick.danceId && joystick.danceName && joystick.danceCode) { actionCode = joystick.danceCode; actionName = joystick.danceName; category = 'dance'; }
              else if (joystick.expressionId && joystick.expressionName && joystick.expressionCode) { actionCode = joystick.expressionCode; actionName = joystick.expressionName; category = 'expression'; }
              else if (joystick.skillId && joystick.skillName && joystick.skillCode) { actionCode = joystick.skillCode; actionName = joystick.skillName; category = 'skill'; }
              else if (joystick.extendedActionId && joystick.extendedActionName && joystick.extendedActionCode) { actionCode = joystick.extendedActionCode; actionName = joystick.extendedActionName; category = 'extended_action'; }
              if (actionCode && actionName) { newActionCodes[buttonName] = actionCode; newActionDescriptions[buttonName] = { name: actionName, category }; }
            }
          } catch (error) { console.warn('Error processing joystick config:', error); }
        });
        setActionCodes(newActionCodes); setActionDescriptions(newActionDescriptions);
      } else { setActionCodes({}); setActionDescriptions({}); }
    } catch (error) { console.error('Error in joystick configuration effect:', error); setActionCodes({}); setActionDescriptions({}); }
  }, [effectiveJoystickData]);

  useEffect(() => () => { if (joystickCommandTimeout) { clearTimeout(joystickCommandTimeout); } }, [joystickCommandTimeout]);

  const leftJoystickRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const computePositionFromPointer = useCallback((clientX: number, clientY: number, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.width / 2; const centerY = rect.height / 2; const maxRadius = centerX - 16;
    const x = clientX - rect.left - centerX; const y = clientY - rect.top - centerY; const distance = Math.sqrt(x*x + y*y);
    const limitedDistance = Math.min(distance, maxRadius); const angle = Math.atan2(y, x);
    const limitedX = Math.cos(angle) * limitedDistance; const limitedY = Math.sin(angle) * limitedDistance;
    return { x: limitedX / maxRadius, y: limitedY / maxRadius };
  }, []);

  const getJoystickDirection = useCallback((x: number, y: number): string | null => {
    const threshold = 0.3; const distance = Math.sqrt(x*x + y*y); if (distance < threshold) return null;
    const angle = Math.atan2(-y, x) * (180 / Math.PI); const normalizedAngle = ((angle % 360) + 360) % 360;
    if (normalizedAngle >= 315 || normalizedAngle < 45) return 'Keep_turning_right';
    if (normalizedAngle >= 45 && normalizedAngle < 135) return 'Keep_moving_forward';
    if (normalizedAngle >= 135 && normalizedAngle < 225) return 'Keep_turning_left';
    if (normalizedAngle >= 225 && normalizedAngle < 315) return 'Keep_going_backwards';
    return null;
  }, []);

  const handleJoystickMovement = useCallback(async (x: number, y: number) => {
    const direction = getJoystickDirection(x, y); const currentTime = Date.now(); const COMMAND_THROTTLE_MS = 300;
    if (direction === lastJoystickCommand && currentTime - lastCommandTime < COMMAND_THROTTLE_MS) { return; }
    if (isCommandPending) { return; }
    if (direction !== lastJoystickCommand) {
      if (joystickCommandTimeout) { clearTimeout(joystickCommandTimeout); }
      if (direction) {
        if (!selectedRobotSerial || !selectedRobot) { setNotify('Bạn chưa chọn robot!', 'error'); return; }
        if (selectedRobot.status === 'offline') { setNotify(`Robot ${selectedRobot.name} đang offline!`, 'error'); return; }
        setIsCommandPending(true);
        try {
          await sendCommandToBackend(direction, robotSerial as string, 'skill_helper');
          setLastJoystickCommand(direction); setLastCommandTime(currentTime);
          const timeout = setTimeout(() => { setLastJoystickCommand(null); }, 500); setJoystickCommandTimeout(timeout);
        } catch {} finally { setTimeout(() => { setIsCommandPending(false); }, 100); }
      } else { setLastJoystickCommand(null); setIsCommandPending(false); }
    }
  }, [lastJoystickCommand, joystickCommandTimeout, selectedRobotSerial, selectedRobot, sendCommandToBackend, setNotify, getJoystickDirection, lastCommandTime, isCommandPending]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!draggingRef.current || !leftJoystickRef.current) return; const pos = computePositionFromPointer(e.clientX, e.clientY, leftJoystickRef.current); setLeftJoystick(pos);
    if (!isCommandPending) { handleJoystickMovement(pos.x, pos.y); }
  }, [computePositionFromPointer, handleJoystickMovement, isCommandPending]);

  const onPointerUp = useCallback(() => {
    draggingRef.current = false; setLeftJoystick({ x: 0, y: 0 }); if (joystickCommandTimeout) { clearTimeout(joystickCommandTimeout); }
    setLastJoystickCommand(null); setIsCommandPending(false); window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('pointerup', onPointerUp);
  }, [onPointerMove, joystickCommandTimeout]);

  const handlePointerDown = (e: React.PointerEvent) => { (e.target as Element).setPointerCapture?.(e.pointerId); draggingRef.current = true; window.addEventListener('pointermove', onPointerMove); window.addEventListener('pointerup', onPointerUp); if (leftJoystickRef.current) { const pos = computePositionFromPointer(e.clientX, e.clientY, leftJoystickRef.current); setLeftJoystick(pos); handleJoystickMovement(pos.x, pos.y); } };

  useEffect(() => {
    const touchMove = (ev: TouchEvent) => { if (!draggingRef.current || !leftJoystickRef.current) return; const t = ev.touches[0]; if (!t) return; const pos = computePositionFromPointer(t.clientX, t.clientY, leftJoystickRef.current); setLeftJoystick(pos); if (!isCommandPending) { handleJoystickMovement(pos.x, pos.y); } };
    const handleTouchEnd = () => { draggingRef.current = false; setLeftJoystick({ x: 0, y: 0 }); if (joystickCommandTimeout) { clearTimeout(joystickCommandTimeout); } setLastJoystickCommand(null); setIsCommandPending(false); };
    window.addEventListener('touchmove', touchMove, { passive: true }); window.addEventListener('touchend', handleTouchEnd); window.addEventListener('touchcancel', handleTouchEnd);
    return () => { window.removeEventListener('touchmove', touchMove); window.removeEventListener('touchend', handleTouchEnd); window.removeEventListener('touchcancel', handleTouchEnd); };
  }, [computePositionFromPointer, handleJoystickMovement, joystickCommandTimeout, isCommandPending]);

  const handleButtonPress = (buttonName: string) => { setButtons(prev => ({ ...prev, [buttonName]: !prev[buttonName] })); setTimeout(() => { setButtons(prev => ({ ...prev, [buttonName]: false })); }, 150); };

  const handleActionButtonPress = async (buttonName: 'A' | 'B' | 'X' | 'Y') => {
    setButtons(prev => ({ ...prev, [buttonName]: true })); setTimeout(() => { setButtons(prev => ({ ...prev, [buttonName]: false })); }, 150);
    if (!actionCodes[buttonName]) { setNotify(`Nút ${buttonName} chưa được cấu hình!`, 'error'); return; }
    const actionCategory = actionDescriptions[buttonName]?.category || 'action';
    let actionType: 'action' | 'expression' | 'skill_helper' | 'extended_action';
    switch (actionCategory) { case 'expression': actionType = 'expression'; break; case 'skill': actionType = 'skill_helper'; break; case 'extended_action': actionType = 'extended_action'; break; default: actionType = 'action'; }
    await handleSendCommand(actionCodes[buttonName], actionType);
  };

  const handleDPadButtonPress = async (direction: 'up' | 'down' | 'left' | 'right') => {
    setButtons(prev => ({ ...prev, [direction]: true })); setTimeout(() => { setButtons(prev => ({ ...prev, [direction]: false })); }, 150);
    const commandMap = { up:'Keep_moving_forward', down:'Keep_going_backwards', left:'Keep_turning_left', right:'Keep_turning_right' } as const;
    await handleSendCommand(commandMap[direction], 'skill_helper');
  };

  const handleSendCommand = async (actionCode: string, type: 'action' | 'expression' | 'skill_helper' | 'extended_action' = 'action') => {
    if (!selectedRobotSerial || !selectedRobot) { setNotify('Bạn chưa chọn robot!', 'error'); return Promise.resolve(); }
    if (selectedRobot.status === 'offline') { setNotify(`Robot ${selectedRobot.name} đang offline!`, 'error'); return Promise.resolve(); }
    await sendCommandToBackend(actionCode, robotSerial as string, type);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4"><span className="text-2xl text-white font-bold">🎮</span></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Controller...</h2>
          <p className="text-sm text-gray-500 mt-2">Initializing joystick interface</p>
        </div>
      </div>
    );
  }
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4"><span className="text-2xl text-white font-bold">⚠️</span></div>
          <h2 className="text-xl font-semibold text-gray-700">Lỗi khởi tạo</h2>
          <p className="text-sm text-gray-500 mt-2">Không thể tải trang joystick</p>
          <button onClick={() => { setHasError(false); window.location.reload(); }} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <ProtectLicense>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-6">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900">🎮 Trung Tâm Điều Khiển</h1>
              <p className="text-sm text-gray-600">Mô phỏng • Xem trước tương tác • Gán nút cho hành động robot</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button 
                onClick={() => setIsConfigModalOpen(true)} 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:text-white shadow-lg"
              >
                ⚙️ Cấu hình Joystick
              </Button>
            </div>
          </header>

          <div className="relative rounded-[3rem] overflow-visible mb-6">
            <div className="absolute inset-x-6 -bottom-8 h-24 blur-3xl opacity-20 rounded-3xl bg-gray-500/60" />
            <div className="relative z-10 mx-auto bg-gradient-to-br from-gray-100 via-gray-50 to-white rounded-[2.5rem] border border-gray-300 shadow-2xl p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="flex flex-col items-center gap-6 w-full lg:w-1/3">
                  <Badge variant="secondary" className="mb-2 bg-gray-200 text-gray-700">Cần điều khiển trái</Badge>
                    <div ref={leftJoystickRef as React.RefObject<HTMLDivElement>} onPointerDown={handlePointerDown} className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-gray-400 flex items-center justify-center shadow-inner cursor-grab active:cursor-grabbing" style={{ touchAction: 'none' }}>
                      <motion.div className="absolute w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg border-2 border-white" animate={{ x: leftJoystick.x * 24, y: leftJoystick.y * 24 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                    <div className="absolute inset-2 rounded-full border border-gray-300 opacity-50" />
                  </div>
                    <div className="text-xs text-gray-500 text-center">({(leftJoystick.x * 100).toFixed(1)}, {(leftJoystick.y * 100).toFixed(1)})</div>
                  <div className="mt-4">
                    <Badge variant="secondary" className="bg-gray-200 text-gray-700">Phím hướng</Badge>
                      <div className="mt-3 grid grid-cols-3 gap-1 w-20 h-20 sm:w-24 sm:h-24">
                      <div />
                        <Button variant={buttons.up ? 'default' : 'outline'} size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-sm text-sm font-bold" onClick={() => handleDPadButtonPress('up')}>↑</Button>
                      <div />
                        <Button variant={buttons.left ? 'default' : 'outline'} size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-sm text-sm font-bold" onClick={() => handleDPadButtonPress('left')}>←</Button>
                      <div className="w-8 h-8 bg-gray-300 rounded-sm" />
                        <Button variant={buttons.right ? 'default' : 'outline'} size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-sm text-sm font-bold" onClick={() => handleDPadButtonPress('right')}>→</Button>
                      <div />
                        <Button variant={buttons.down ? 'default' : 'outline'} size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-sm text-sm font-bold" onClick={() => handleDPadButtonPress('down')}>↓</Button>
                      <div />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 w-full lg:w-1/3">
                  <div className="w-full max-w-xs">
                    <div className="text-center mb-2"><Badge variant="outline" className="text-xs">🎥 Camera Robot{selectedRobot && (<span className="ml-1">• {selectedRobot.name}</span>)}</Badge></div>
                    <RobotVideoStream robotSerial={robotSerial} className="w-full h-40 md:h-48 rounded-xl border-2 border-gray-300 shadow-lg" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"><span className="text-2xl text-white font-bold">🤖</span></div>
                    <div className="text-sm font-semibold text-gray-700">Alpha Mini</div>
                    <div className="text-xs text-gray-500">Giao diện điều khiển</div>
                  </div>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <Button variant={buttons.SELECT ? 'default' : 'outline'} size="sm" onClick={() => handleButtonPress('SELECT')} className="px-3 py-1 text-xs font-semibold w-28 sm:w-auto">SELECT</Button>
                    <Button variant={buttons.START ? 'default' : 'outline'} size="sm" onClick={() => handleButtonPress('START')} className="px-3 py-1 text-xs font-semibold w-28 sm:w-auto">START</Button>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 w-full lg:w-1/3">
                  <Badge variant="secondary" className="mb-2 bg-gray-200 text-gray-700">Nút hành động</Badge>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                    <motion.button className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white font-bold text-base md:text-lg shadow-lg border-2 border-white flex items-center justify-center" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }} animate={{ scale: buttons.Y ? 0.95 : 1 }} onClick={() => handleActionButtonPress('Y')}>Y</motion.button>
                    <motion.button className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold text-base md:text-lg shadow-lg border-2 border-white flex items-center justify-center" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }} animate={{ scale: buttons.X ? 0.95 : 1 }} onClick={() => handleActionButtonPress('X')}>X</motion.button>
                    <motion.button className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-400 to-red-500 text-white font-bold text-base md:text-lg shadow-lg border-2 border-white flex items-center justify-center" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }} animate={{ scale: buttons.B ? 0.95 : 1 }} onClick={() => handleActionButtonPress('B')}>B</motion.button>
                    <motion.button className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white font-bold text-base md:text-lg shadow-lg border-2 border-white flex items-center justify-center" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }} animate={{ scale: buttons.A ? 0.95 : 1 }} onClick={() => handleActionButtonPress('A')}>A</motion.button>
                  </div>
                  <div className="text-sm text-gray-700 text-center space-y-1 mt-2">
                    <div className="flex items-center gap-2"><span>🟡 A:</span><span className="font-medium">{actionDescriptions.A?.name || 'Chưa cấu hình'}</span></div>
                    <div className="flex items-center gap-2"><span>🔴 B:</span><span className="font-medium">{actionDescriptions.B?.name || 'Chưa cấu hình'}</span></div>
                    <div className="flex items-center gap-2"><span>🔵 X:</span><span className="font-medium">{actionDescriptions.X?.name || 'Chưa cấu hình'}</span></div>
                    <div className="flex items-center gap-2"><span>🟢 Y:</span><span className="font-medium">{actionDescriptions.Y?.name || 'Chưa cấu hình'}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Joystick</h4>
                <div className="text-xs text-gray-600">Left: ({(leftJoystick.x * 100).toFixed(1)}, {(leftJoystick.y * 100).toFixed(1)})</div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Các nút</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(buttons).map(([btn, pressed]) => (
                    <Badge key={btn} variant={pressed ? 'default' : 'outline'} className={`px-3 py-1 ${pressed ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{btn}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Hành động đã gán</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>🟡 A: {actionDescriptions.A?.name || 'Chưa cấu hình'}</div>
                  <div>🔴 B: {actionDescriptions.B?.name || 'Chưa cấu hình'}</div>
                  <div>🔵 X: {actionDescriptions.X?.name || 'Chưa cấu hình'}</div>
                  <div>🟢 Y: {actionDescriptions.Y?.name || 'Chưa cấu hình'}</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Hướng dẫn</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• Kéo/nhấn cần để di chuyển</div>
                  <div>• Nhấn ABXY để thực hiện hành động</div>
                  <div>• Chọn robot trước khi điều khiển</div>
                  <div>• Mở cấu hình để gán nút</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {notify && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold ${notify.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{notify.msg}</div>
        )}

        <JoystickConfigurationModal isOpen={isConfigModalOpen} onClose={() => { setIsConfigModalOpen(false); }} existingJoysticks={effectiveJoystickData?.joysticks || []} onSuccess={() => {}} />
      </div>
    </ProtectLicense>
  );
}
