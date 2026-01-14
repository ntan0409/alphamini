'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Save, Gamepad2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useAction } from '@/features/activities/hooks/use-action';
import { useDance } from '@/features/activities/hooks/use-dance';
import { useExpression } from '@/features/activities/hooks/use-expression';
import { useSkill } from '@/features/activities/hooks/use-skill';
import { useExtendedActions } from '@/features/activities/hooks/use-extended-actions';
import { useJoystick } from '@/features/activities/hooks/use-joystick';
import { Joystick } from '@/types/joystick';
import { Action } from '@/types/action';
import { Dance } from '@/types/dance';
import { Expression } from '@/types/expression';
import { Skill } from '@/types/skill';
import { ExtendedAction } from '@/types/extended-action';
import { getUserInfoFromToken } from '@/utils/tokenUtils';
import { useRobotStore } from '@/hooks/use-robot-store';

type ButtonName = 'A' | 'B' | 'X' | 'Y';

type ActionType = 'action' | 'dance' | 'expression' | 'skill' | 'extendedaction';

interface JoystickConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  existingJoysticks?: Joystick[];
}

interface ButtonConfig {
  buttonCode: ButtonName;
  actionType: ActionType;
  actionId: string;
  actionCode: string;
  actionName: string;
}

export default function JoystickConfigurationModal({
  isOpen,
  onClose,
  onSuccess,
  existingJoysticks = [],
}: JoystickConfigurationModalProps) {
  const [selectedButton, setSelectedButton] = useState<ButtonName>('A');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ActionType>('action');
  const [isSaving, setIsSaving] = useState(false); // Add saving state to prevent multiple calls
  const [buttonConfigs, setButtonConfigs] = useState<Record<ButtonName, ButtonConfig | null>>({
    A: null,
    B: null,
    X: null,
    Y: null,
  });

  // API hooks
  const { useGetPagedActions } = useAction();
  const { useGetPagedDances } = useDance();
  const { useGetPagedExpressions } = useExpression();
  const { useGetPagedSkills } = useSkill();
  const { useGetPagedExtendedActions } = useExtendedActions();
  const { useCreateJoystick, useUpdateJoystick } = useJoystick();

  // React Query mutations
  const createJoystickMutation = useCreateJoystick();
  const updateJoystickMutation = useUpdateJoystick();
  const { selectedRobot } = useRobotStore();

  const { data: actionsData } = useGetPagedActions(1, 100, searchTerm);
  const { data: dancesData } = useGetPagedDances(1, 100, searchTerm);
  const { data: expressionsData } = useGetPagedExpressions(1, 100, searchTerm);
  const { data: skillsData } = useGetPagedSkills(1, 100, searchTerm);
  const { data: extendedActionsData } = useGetPagedExtendedActions(1, 100, searchTerm);

  const actions = actionsData?.data || [];
  const dances = dancesData?.data || [];
  const expressions = expressionsData?.data || [];
  const skills = skillsData?.data || [];
  const extendedActions = extendedActionsData?.data || [];

  // Sync existing joystick configurations with local state when modal opens
  useEffect(() => {
    if (isOpen && existingJoysticks.length > 0) {
      const configs: Record<ButtonName, ButtonConfig | null> = {
        A: null,
        B: null,
        X: null,
        Y: null,
      };

      existingJoysticks.forEach(joystick => {
        const buttonCode = joystick.buttonCode as ButtonName;
        if (buttonCode in configs) {
          // Determine action type and create config
          let actionType: ActionType;
          let actionId: string;
          let actionCode: string;
          let actionName: string;

          if (joystick.actionId && joystick.actionCode && joystick.actionName) {
            actionType = 'action';
            actionId = joystick.actionId;
            actionCode = joystick.actionCode;
            actionName = joystick.actionName;
          } else if (joystick.danceId && joystick.danceCode && joystick.danceName) {
            actionType = 'dance';
            actionId = joystick.danceId;
            actionCode = joystick.danceCode;
            actionName = joystick.danceName;
          } else if (joystick.expressionId && joystick.expressionCode && joystick.expressionName) {
            actionType = 'expression';
            actionId = joystick.expressionId;
            actionCode = joystick.expressionCode;
            actionName = joystick.expressionName;
          } else if (joystick.skillId && joystick.skillCode && joystick.skillName) {
            actionType = 'skill';
            actionId = joystick.skillId;
            actionCode = joystick.skillCode;
            actionName = joystick.skillName;
          } else if (joystick.extendedActionId && joystick.extendedActionCode && joystick.extendedActionName) {
            actionType = 'extendedaction';
            actionId = joystick.extendedActionId;
            actionCode = joystick.extendedActionCode;
            actionName = joystick.extendedActionName;
          } else {
            return; // Skip if no valid action found
          }

          configs[buttonCode] = {
            buttonCode,
            actionType,
            actionId,
            actionCode,
            actionName,
          };
        }
      });

      setButtonConfigs(configs);
    } else if (isOpen) {
      // Reset configs when modal opens with no existing data
      setButtonConfigs({
        A: null,
        B: null,
        X: null,
        Y: null,
      });
    }

    // Reset search and selected button when modal opens
    if (isOpen) {
      setSelectedButton('A');
      setSearchTerm('');
      setActiveTab('action');
    }
  }, [isOpen, existingJoysticks]);

  const buttonLabels: Record<ButtonName, { icon: string; label: string; color: string }> = {
    A: { icon: '🟡', label: 'A Button', color: 'bg-yellow-500' },
    B: { icon: '🔴', label: 'B Button', color: 'bg-red-500' },
    X: { icon: '🔵', label: 'X Button', color: 'bg-blue-500' },
    Y: { icon: '🟢', label: 'Y Button', color: 'bg-green-500' },
  };

  // Get current user accountId from token
  const getCurrentUserAccountId = (): string => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const userInfo = getUserInfoFromToken(accessToken);
        return userInfo?.id || '';
      }
    }
    return '';
  };

  const handleAssignAction = (item: Action | Dance | Expression | Skill | ExtendedAction, type: ActionType) => {
    const config: ButtonConfig = {
      buttonCode: selectedButton,
      actionType: type,
      actionId: item.id,
      actionCode: item.code,
      actionName: item.name,
    };

    setButtonConfigs(prev => ({
      ...prev,
      [selectedButton]: config,
    }));
  };

  const handleSaveConfiguration = async () => {
    if (isSaving) return;

    setIsSaving(true);
    const accountId = getCurrentUserAccountId();

    if (!accountId) {
      toast.error('Không thể lấy thông tin tài khoản. Vui lòng đăng nhập lại!');
      setIsSaving(false);
      return;
    }

    try {
      const configs = Object.values(buttonConfigs).filter(Boolean) as ButtonConfig[];

      if (configs.length === 0) {
        console.warn('No actions assigned to buttons');
        setIsSaving(false);
        return;
      }

      // Validate each config before sending
      for (const config of configs) {
        if (!config.actionId || !config.actionCode || !config.actionName) {
          console.error(`Invalid config for button ${config.buttonCode}:`, config);
          setIsSaving(false);
          return;
        }
      }


      for (const config of configs) {
        console.log('🎮 Processing config:', config);

        // Map action type to correct backend type
        const getBackendType = (actionType: ActionType): string => {
          switch (actionType) {
            case 'action':
            case 'dance':
              return 'action';
            case 'expression':
              return 'expression';
            case 'skill':
              return 'skill_helper';
            case 'extendedaction':
              return 'extended_action';
            default:
              return 'action';
          }
        };

        const joystickData: Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate'> = {
          accountId: accountId,
          robotId: selectedRobot?.id || '',
          buttonCode: config.buttonCode.toString(),
          type: getBackendType(config.actionType),
          status: 1,

          // Action fields
          actionId: config.actionType === 'action' ? config.actionId : null,
          actionCode: config.actionType === 'action' ? config.actionCode : null,
          actionName: config.actionType === 'action' ? config.actionName : null,

          // Dance fields
          danceId: config.actionType === 'dance' ? config.actionId : null,
          danceCode: config.actionType === 'dance' ? config.actionCode : null,
          danceName: config.actionType === 'dance' ? config.actionName : null,

          // Expression fields
          expressionId: config.actionType === 'expression' ? config.actionId : null,
          expressionCode: config.actionType === 'expression' ? config.actionCode : null,
          expressionName: config.actionType === 'expression' ? config.actionName : null,

          // Extended action fields
          extendedActionId: config.actionType === 'extendedaction' ? config.actionId : null,
          extendedActionCode: config.actionType === 'extendedaction' ? config.actionCode : null,
          extendedActionName: config.actionType === 'extendedaction' ? config.actionName : null,

          // Skill fields
          skillId: config.actionType === 'skill' ? config.actionId : null,
          skillCode: config.actionType === 'skill' ? config.actionCode : null,
          skillName: config.actionType === 'skill' ? config.actionName : null,
        };

        const existingConfig = existingJoysticks.find(
          joystick => {
            const buttonCodeToCompare = config.buttonCode.toString();
            console.log(`Comparing: "${joystick.buttonCode}" === "${buttonCodeToCompare}"`, joystick.buttonCode === buttonCodeToCompare);
            return joystick.buttonCode === buttonCodeToCompare;
          }
        );

        if (existingConfig) {
          await updateJoystickMutation.mutateAsync({ id: existingConfig.id, joystickData });
        } else {
          await createJoystickMutation.mutateAsync(joystickData);
        }
      }

      toast.success('Cấu hình joystick đã được lưu thành công!');
      onSuccess?.();
      onClose();
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra khi lưu cấu hình!';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string };
          }
        };

        if (axiosError.response?.status === 400) {
          errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Bạn cần đăng nhập lại!';
        } else if (axiosError.response?.status === 403) {
          errorMessage = 'Bạn không có quyền thực hiện hành động này!';
        } else if (axiosError.response?.status === 429) {
          errorMessage = 'Quá nhiều yêu cầu! Vui lòng thử lại sau ít phút.';
          setTimeout(() => {
            if (!isSaving) {
              handleSaveConfiguration();
            }
          }, 2000);
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const renderActionGrid = (items: (Action | Dance | Expression | Skill | ExtendedAction)[], type: ActionType) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto scrollbar-hide p-2">
      {items.map((item) => (
        <Card
          key={item.id}
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-400 hover:scale-105 group min-h-[100px] flex flex-col items-center justify-center p-4"
          onClick={() => handleAssignAction(item, type)}
        >
          <div className="max-w-[70vh] flex flex-col items-center gap-3 text-center">
            {/* Icon from API field */}
            <div className="text-3xl flex items-center justify-center">
              {type === 'expression'
                ? (item as Expression).imageUrl
                  ? <Image
                    src={(item as Expression).imageUrl}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  : '😊'
                : type === 'skill'
                  ? (item as Skill).icon || '🎯'
                  : type === 'extendedaction'
                    ? (item as ExtendedAction).icon || '⚡'
                    : (item as Action).icon || (type === 'action' ? '🎯' : '')
              }
            </div>

            <div className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
              {item.name}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'action':
        return { items: actions, type: 'action' as ActionType };
      case 'dance':
        return { items: dances, type: 'dance' as ActionType };
      case 'expression':
        return { items: expressions, type: 'expression' as ActionType };
      case 'skill':
        return { items: skills, type: 'skill' as ActionType };
      case 'extendedaction':
        return { items: extendedActions, type: 'extendedaction' as ActionType };
      default:
        return { items: actions, type: 'action' as ActionType };
    }
  };

  const { items, type } = getCurrentItems();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" !w-[70vw] !max-w-none h-[90vh] flex flex-col scrollbar-hide">
        <DialogHeader className="pb-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            Cấu hình Joystick
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Gán hành động cho các nút của tay cầm. Chọn nút và sau đó chọn hành động tương ứng.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-6 p-6">
            {/* Top Row - Current Button Selection */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                  Chọn hành động cho nút:
                  <div className="flex items-center justify-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-bold ${buttonLabels[selectedButton].color} shadow-sm`}>
                      {selectedButton}
                    </div>
                  </div>
                </h3>
              </div>
              <Button
                onClick={handleSaveConfiguration}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
              </Button>
            </div>

            {/* Middle Row - Button Selection (Horizontal Layout) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gamepad2 className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Chọn nút</h3>
              </div>

              <div className="flex justify-center gap-6">
                {(Object.keys(buttonLabels) as ButtonName[]).map((button) => {
                  const buttonInfo = buttonLabels[button];
                  const isSelected = selectedButton === button;
                  const isAssigned = buttonConfigs[button];

                  return (
                    <div
                      key={button}
                      className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-110 ${isSelected ? 'scale-110' : ''
                        }`}
                      onClick={() => setSelectedButton(button)}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${buttonInfo.color} shadow-lg transition-all duration-200 ${isSelected
                        ? 'ring-4 ring-blue-400 shadow-xl'
                        : 'hover:shadow-xl'
                        }`}>
                        {button}
                      </div>

                      {/* Assignment indicator */}
                      {isAssigned && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Show assigned action for selected button */}
              {buttonConfigs[selectedButton] && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                  <div className="text-sm text-gray-600 mb-1">Hành động đã gán:</div>
                  <div className="font-semibold text-blue-700">{buttonConfigs[selectedButton]?.actionName}</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{buttonConfigs[selectedButton]?.actionType}</div>
                </div>
              )}
            </div>

            {/* Bottom Row - Action Selection */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm hành động..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Enhanced Tabs */}
              <div className="w-full">
                <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
                  {[
                    { key: 'action', label: 'Hành động', icon: '🎯', count: actions.length },
                    { key: 'dance', label: 'Điệu nhảy', icon: '💃', count: dances.length },
                    { key: 'expression', label: 'Biểu cảm', icon: '😊', count: expressions.length },
                    { key: 'skill', label: 'Kỹ năng', icon: '🎯', count: skills.length },
                    { key: 'extendedaction', label: 'Hành động mở rộng', icon: '⚡', count: extendedActions.length },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as ActionType)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === tab.key
                        ? 'bg-white text-blue-600 shadow-md ring-1 ring-blue-200'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-base">{tab.icon}</span>
                      <span>{tab.label}</span>
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        {tab.count}
                      </Badge>
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {items.length > 0 ? (
                    renderActionGrid(items, type)
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">🔍</div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Không tìm thấy {
                          activeTab === 'action' ? 'hành động' :
                            activeTab === 'dance' ? 'điệu nhảy' :
                              activeTab === 'expression' ? 'biểu cảm' :
                                activeTab === 'skill' ? 'kỹ năng' :
                                  'hành động mở rộng'
                        } nào
                      </h3>
                      <p className="text-gray-500 text-sm">Thử thay đổi từ khóa tìm kiếm</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}