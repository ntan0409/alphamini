import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { toolbox } from '../../../components/blockly-logic/toolbox';
import { blockControls, Operations } from '@/components/blockly-logic/control';
import { toast } from 'sonner';
import { loadModelIdData } from '@/components/blockly-logic/custom-blocks';
import { JavascriptGenerator } from 'blockly/javascript';
import { buildCodeGeneratorForModelId } from '@/components/blockly-logic/js-generator';
import Image from 'next/image';
import { Play, Square, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'blockly/blocks';
import 'blockly/javascript'; // Or the generator of your choice
import { pythonHttp } from '@/utils/http';
import { apiPythonUrl } from '@/app/constants/constants';

type BlocklyUIProps = {
    robotModelId?: string,
    serial?: string,
    hasAllData?: boolean,
    data?: {
        actions: string[][],
        extActions: string[][],
        exps: string[][],
        skills: string[][]
    }
}

export default function BlocklyUI({ robotModelId, serial, hasAllData, data }: BlocklyUIProps) {
    const blocklyRef = useRef<HTMLDivElement>(null)
    const workspaceRef = useRef<Blockly.WorkspaceSvg>(undefined)
    const drawerRef = useRef<HTMLDivElement | null>(null)
    const toolboxOriginalParent = useRef<HTMLElement | null>(null)
    const toolboxOriginalNextSibling = useRef<ChildNode | null>(null)
    const [isToolboxOpen, setIsToolboxOpen] = useState(false)
    const [wsHelper, setWsHelper] = useState<Operations>()
    const [codeGenerator, setCodeGenerator] = useState<JavascriptGenerator>()
    const [definedModels, setDefinedModel] = useState(new Set<string>())
    const [isRunning, setIsRunning] = useState(false)
    const [showRobot, setShowRobot] = useState(false)
    const pollRef = useRef<number | null>(null)
    const [robotStatus, setRobotStatus] = useState<'idle' | 'connecting' | 'running' | 'finished' | 'unreachable'>('idle')
    const key = 'AlphaCode'
    const stopPolling = () => {
        if (pollRef.current) {
            clearInterval(pollRef.current)
            pollRef.current = null
        }
    }

    const startPolling = () => {
        setRobotStatus('connecting')
        // poll every 2s
        if (pollRef.current) stopPolling()
        pollRef.current = window.setInterval(async () => {
            try {
                const res = await pythonHttp.get('/robot/coding-block/' + serial)
                const json = res.data
                // expected shape: { success: boolean, isRunning: boolean }
                if (!json.success) {
                    setRobotStatus('unreachable')
                    toast.error('❌ Không thể kết nối tới robot')
                    setIsRunning(false)
                    setShowRobot(false)
                    stopPolling()
                } else if (json.isRunning) {
                    setRobotStatus('running')
                    setIsRunning(true)
                    setShowRobot(true)
                } else {
                    setRobotStatus('finished')
                    setIsRunning(false)
                    setShowRobot(false)
                    toast.success('✨ Robot đã hoàn thành thực thi')
                    stopPolling()
                }
            } catch (e) {
                console.error('Polling error', e)
                setRobotStatus('unreachable')
                toast.error('❌ Lỗi khi kiểm tra trạng thái robot')
                setIsRunning(false)
                setShowRobot(false)
                stopPolling()
            }
        }, 1500)
    }

    const executeCode = (code: string) => {
        setIsRunning(true)
        setShowRobot(true)

        try {
            const fn = new Function(code)
            const x = fn()
            if (x?.error) {
                toast.error(x.error)
                setShowRobot(false)
                setIsRunning(false)
            } else {
                toast.success('🎉 Đã gửi mã, bắt đầu kiểm tra trạng thái robot...')
                // start polling the python service for robot status
                startPolling()
            }
        } catch (e) {
            toast.error('❌ Lỗi khi chạy mã. Điều này xảy ra do mã không hợp lệ hoặc lỗi logic trong khối.')
            setShowRobot(false)
            setIsRunning(false)
            stopPolling()
        }
    }

    const actualInit = (helper?: Operations) => {
        const useHelper = helper ?? wsHelper
        if (!workspaceRef.current) return;
        if (!blocklyRef.current) return;
        if (!useHelper) return;
        if (!robotModelId || !data || !serial) return;

        if (!definedModels.has(robotModelId)) {
            const allBlocks = loadModelIdData(robotModelId, data.actions, data.extActions, data.exps, data.skills)
            Blockly.common.defineBlocksWithJsonArray(allBlocks)
        }

        const gen = buildCodeGeneratorForModelId(robotModelId, serial)
        setCodeGenerator(gen)

        workspaceRef.current?.updateToolbox(useHelper.getDefaultToolbox())
        const newToolbox = useHelper.getToolboxForRobotModel(robotModelId)
        // curToolbox.contents.push(robotCategory)
        workspaceRef.current.updateToolbox(newToolbox)
    }

    useEffect(() => {
        if (!blocklyRef || !blocklyRef.current) return;

        workspaceRef.current = Blockly.inject(blocklyRef.current, { toolbox })
        if (!workspaceRef.current) { return; }
        const tmp = blockControls(workspaceRef.current)
        setWsHelper(tmp)
        tmp.addStrayScrollbarDestructor?.(blocklyRef.current)
        tmp.setUpUI()
        // If data already loaded, initialize immediately with the local helper
        if (hasAllData) {
            try {
                tmp.loadFromJson({})
            } catch { }
            actualInit(tmp)
            if (robotModelId) setDefinedModel(prev => {
                const s = new Set(prev); s.add(robotModelId); return s;
            })
        }


        // Give Blockly a chance to measure and render correctly after mount
        setTimeout(() => {
            try {
                if (workspaceRef.current) Blockly.svgResize(workspaceRef.current)
            } catch { /* ignore */ }
        }, 10)

        return () => {
            if (!workspaceRef.current) {
                return;
            }

            workspaceRef.current.dispose()
            workspaceRef.current = undefined
            // restore toolbox if necessary
            try {
                const tb = document.querySelector('.blocklyToolboxDiv') as HTMLElement | null
                if (tb && toolboxOriginalParent.current) {
                    if (toolboxOriginalNextSibling.current) toolboxOriginalParent.current.insertBefore(tb, toolboxOriginalNextSibling.current)
                    else toolboxOriginalParent.current.appendChild(tb)
                }
            } catch { /* ignore */ }
        }
    }, [])

    // Move toolbox DOM into drawer when opening on mobile, restore when closing
    const openToolboxDrawer = () => {
        const tb = document.querySelector('.blocklyToolboxDiv') as HTMLElement | null
        if (!tb || !drawerRef.current) {
            setIsToolboxOpen(true)
            return
        }
        // store original parent and next sibling so we can restore
        toolboxOriginalParent.current = tb.parentElement
        toolboxOriginalNextSibling.current = tb.nextSibling
        drawerRef.current.appendChild(tb)
        setIsToolboxOpen(true)
        // redraw workspace after toolbox moves
        setTimeout(() => { try { if (workspaceRef.current) Blockly.svgResize(workspaceRef.current) } catch { } }, 50)
    }

    const closeToolboxDrawer = () => {
        const tb = document.querySelector('.blocklyToolboxDiv') as HTMLElement | null
        if (tb && toolboxOriginalParent.current) {
            if (toolboxOriginalNextSibling.current) toolboxOriginalParent.current.insertBefore(tb, toolboxOriginalNextSibling.current)
            else toolboxOriginalParent.current.appendChild(tb)
        }
        setIsToolboxOpen(false)
        // redraw workspace after toolbox restores
        setTimeout(() => { try { if (workspaceRef.current) Blockly.svgResize(workspaceRef.current) } catch { } }, 50)
    }

    // initialization: run immediately after injection (above) when possible,
    // and also run when `wsHelper` becomes available later to avoid race conditions
    useEffect(() => {
        if (!hasAllData) return;
        if (!wsHelper) return;
        try { wsHelper.loadFromJson({}) } catch { }
        actualInit(wsHelper)
        if (robotModelId) setDefinedModel(prev => { const s = new Set(prev); s.add(robotModelId); return s; })
    }, [robotModelId, hasAllData, wsHelper])

    /**
     * Rebuild code generator when serial changes (to update websocket target)
     */
    useEffect(() => {
        if (!robotModelId || !data || !serial) return;
        const gen = buildCodeGeneratorForModelId(robotModelId, serial)
        setCodeGenerator(gen)
    }, [serial])

    // Recalc Blockly size on window resize so it stays visible on small screens
    useEffect(() => {
        const onResize = () => {
            try {
                if (workspaceRef.current) Blockly.svgResize(workspaceRef.current)
            } catch { }
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    // cleanup polling on unmount
    useEffect(() => {
        return () => {
            stopPolling()
        }
    }, [])

    const handleRun = () => {
        if (!robotModelId) {
            toast.error('Vui lòng chọn robot trước khi chạy')
            return
        }
        if (!codeGenerator || !wsHelper) return;
        try {
            const code = wsHelper.makeListCode(codeGenerator);
            executeCode(code.code);
        } catch {
            toast.error('Lỗi khi chạy mã')
        }
    }

    const handleStop = () => {
        const f = async () => {
            stopPolling()
            setIsRunning(false);
            setShowRobot(false);
            setRobotStatus('idle')
            toast.info('⏸️ Đã dừng thực thi');
            await pythonHttp.post(`/websocket/command/${serial}`, {
                type: 'stop_all_actions',
                data: {}
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
        }
        f()
    }

    const handleSave = () => {
        if (!wsHelper) return;
        const blockData = wsHelper.serialize();
        localStorage.setItem(key + '.' + robotModelId, JSON.stringify(blockData));
        toast.success("💾 Đã lưu kết quả!");
    }

    const handleLoad = () => {
        if (!wsHelper) return;
        const data = JSON.parse(localStorage.getItem(key + '.' + robotModelId) ?? "{}");
        if (data) {
            wsHelper.loadFromJson(data);
            toast.success("📂 Đã tải không gian làm việc!");
        } else {
            toast.error('❌ Không có dữ liệu để tải')
        }
    }

    const handleClear = () => {
        if (!wsHelper) return;
        wsHelper.loadFromJson({})
        toast.success("🗑️ Đã xóa tất cả khối!");
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden pt-8 lg:pt-0">
            {/* Main Layout - Full Screen */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
                {/* Left Sidebar with Robot */}
                <div className="w-full lg:w-80 flex-shrink-0 bg-white border-b-4 lg:border-b-0 lg:border-r-4 border-blue-500 shadow-2xl flex flex-col">
                    {/* Robot Display Area */}
                    <div className="flex-1 bg-gradient-to-b from-blue-100 to-white p-4 md:p-6 flex flex-col items-center justify-center min-h-0">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                            <div className="relative">
                                <Image
                                    src="/running.png"
                                    alt="Robot"
                                    width={180}
                                    height={180}
                                    className="drop-shadow-2xl"
                                    priority
                                />
                            </div>
                            {showRobot && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                                    <div className="text-6xl">✨</div>
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Robot Alpha</h2>
                            <p className="text-gray-600 text-sm">
                                {robotStatus === 'idle' && 'Sẵn sàng lập trình!'}
                                {robotStatus === 'connecting' && 'Đang kết nối tới robot…'}
                                {robotStatus === 'running' && 'Robot đang thực thi chương trình…'}
                                {robotStatus === 'finished' && 'Robot đã hoàn thành.'}
                                {robotStatus === 'unreachable' && 'Không thể kết nối tới robot.'}
                            </p>
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="bg-gray-900 p-4 md:p-6 space-y-3 border-t-4 border-blue-500">
                        <Button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="w-full h-12 md:h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base md:text-lg font-bold disabled:bg-gray-600 disabled:transform-none disabled:shadow-none"
                        >
                            <Play className="w-6 h-6 md:w-7 md:h-7" />
                            <span className="ml-2 text-sm md:text-xl">Chạy Chương Trình</span>
                        </Button>

                        <Button
                            onClick={handleStop}
                            disabled={!isRunning}
                            className="w-full h-10 md:h-14 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-sm md:text-base font-bold disabled:bg-gray-600 disabled:transform-none disabled:shadow-none"
                        >
                            <Square className="w-5 h-5 md:w-6 md:h-6" />
                            <span>Dừng</span>
                        </Button>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <Button
                                onClick={handleSave}
                                className="h-10 md:h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-sm md:text-base"
                            >
                                <Save className="w-5 h-5" />
                                <span>Lưu</span>
                            </Button>
                            <Button
                                onClick={handleLoad}
                                disabled={isRunning}
                                className="h-10 md:h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-sm md:text-base disabled:bg-gray-600 disabled:transform-none"
                            >
                                <RotateCcw className="w-5 h-5" />
                                <span>Tải bản lưu</span>
                            </Button>
                        </div>

                        <Button
                            onClick={handleClear}
                            disabled={isRunning}
                            className="w-full h-10 md:h-12 bg-gray-700 hover:bg-gray-800 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-sm md:text-base disabled:bg-gray-600 disabled:transform-none"
                        >
                            <span className="text-lg mr-2">🗑️</span>
                            <span>Xóa Hết</span>
                        </Button>
                    </div>
                </div>

                {/* Right Side - Workspace Area */}
                <div className="flex-1 min-w-0 flex flex-col bg-gray-100 overflow-hidden min-h-0 pb-24 lg:pb-0">
                    {/* Workspace Container */}
                    <div className="flex-1 bg-white m-4 rounded-2xl shadow-2xl border-2 border-gray-300 overflow-visible">
                        {/* Ensure a visible height on small screens so Blockly can render */}
                        <div className="relative w-full h-[60vh] lg:h-full">
                            <div
                                ref={blocklyRef}
                                className="absolute inset-0 min-h-0"
                                style={{ width: "100%", height: "100%", zIndex: 20 }}
                            />
                        </div>
                    </div>

                    {/* Info Bar at Bottom */}
                    <div className="bg-white mx-4 mb-4 p-4 rounded-xl shadow-lg border-2 border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                            <p className="text-gray-700 text-sm font-medium">
                                Kéo khối từ bên trái vào không gian làm việc để bắt đầu lập trình robot của bạn!
                            </p>
                        </div>
                    </div>
                    {/* Mobile bottom quick actions (visible on small screens) */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md p-2"
                        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}>
                        <div className="max-w-4xl mx-auto flex items-center justify-between px-2">
                            <Button size="sm" onClick={handleRun} disabled={isRunning} className="flex-1 mx-1">
                                <Play className="w-5 h-5 mr-2" />
                                <span className="text-sm">Chạy</span>
                            </Button>
                            <Button size="sm" onClick={handleStop} disabled={!isRunning} className="flex-1 mx-1">
                                <Square className="w-5 h-5 mr-2" />
                                <span className="text-sm">Dừng</span>
                            </Button>
                            <Button size="sm" onClick={handleSave} className="flex-1 mx-1">
                                <Save className="w-5 h-5 mr-2" />
                                <span className="text-sm">Lưu</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}