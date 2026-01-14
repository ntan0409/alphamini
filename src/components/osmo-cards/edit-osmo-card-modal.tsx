import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, X, Palette, Activity, Music, Zap, Smile, DatabaseZapIcon, Brain } from 'lucide-react';
import { OsmoCard } from '@/types/osmo-card';
import { ApiResponse } from '@/types/api-error';
import { useAction } from '@/features/activities/hooks/use-action';
import { useExpression } from '@/features/activities/hooks/use-expression';
import { useDance } from '@/features/activities/hooks/use-dance';
import { useExtendedActions } from '@/features/activities/hooks/use-extended-actions';
import { useSkill } from '@/features/activities/hooks/use-skill';

interface EditOsmoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardId: string, updatedData: Partial<OsmoCard>) => void;
  card: OsmoCard | null;
  isLoading?: boolean;
  apiError?: ApiResponse; // Add API error prop with proper type
}

interface FormData {
  name: string;
  color: string;
  status: number;
  actionId: string;
  actionName: string;
  expressionId: string;
  expressionName: string;
  danceId: string;
  danceName: string;
  extendedActionId: string,
  extendedActionName: string,
  skillId: string,
  skillName: string
}

interface FormErrors {
  name?: string;
  color?: string;
  status?: string;
  actionId?: string;
  actionName?: string;
  expressionId?: string;
  expressionName?: string;
  danceId?: string;
  danceName?: string;
  extendedActionId?: string,
  extendedActionName?: string,
  skillId?: string,
  skillName?: string
}

export default function EditOsmoCardModal({
  isOpen,
  onClose,
  onSave,
  card,
  isLoading = false,
  apiError
}: EditOsmoCardModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    color: '',
    status: 1,
    actionId: '',
    actionName: '',
    expressionId: '',
    expressionName: '',
    danceId: '',
    danceName: '',
    extendedActionId: '',
    extendedActionName: '',
    skillId: '',
    skillName: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch data from APIs
  const actionHooks = useAction();
  const expressionHooks = useExpression();
  const danceHooks = useDance();
  const extendedActionHooks = useExtendedActions();
  const skillHooks = useSkill()

  // Fetch actions, expressions, and dances
  const { data: actionsResponse, isLoading: actionsLoading, error: actionsError } = actionHooks.useGetPagedActions(1, 100); // Get all actions
  const { data: expressionsResponse, isLoading: expressionsLoading, error: expressionsError } = expressionHooks.useGetPagedExpressions(1, 100); // Get all expressions  
  const { data: dancesResponse, isLoading: dancesLoading, error: dancesError } = danceHooks.useGetPagedDances(1, 100); // Get all dances
  const { data: extendedActionResponse, isLoading: extendedLoading, error: extendedError } = extendedActionHooks.useGetPagedExtendedActions(1, 100)
  const { data: skillResponse, isLoading: skillLoading, error: skillError } = skillHooks.useGetPagedSkills(1, 100)

  const actions = actionsResponse?.data || [];
  const expressions = expressionsResponse?.data || [];
  const dances = dancesResponse?.data || [];
  const extendedActions = extendedActionResponse?.data || []
  const skills = skillResponse?.data || []

  // Check if any API is loading
  const isDataLoading = actionsLoading || expressionsLoading || dancesLoading;
  const hasApiError = actionsError || expressionsError || dancesError;

  // Available options
  const colorOptions = [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' },
    { value: 'orange', label: 'Orange' },
    // removed yellow and gray per requested constraints
  ];

  // Initialize form data when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name || '',
        color: card.color || '',
        status: card.status !== undefined ? card.status : 1,
        actionId: card.actionId || '',
        actionName: card.actionName || '',
        expressionId: card.expressionId || '',
        expressionName: card.expressionName || '',
        danceId: card.danceId || '',
        danceName: card.danceName || '',
        extendedActionId: '',
        extendedActionName: '',
        skillId: '',
        skillName: ''
      });
      setErrors({});
    }
  }, [card]);

  // Handle API validation errors
  useEffect(() => {
    if (apiError?.status === 422 && typeof apiError?.message === 'object') {
      const apiErrors: FormErrors = {};
      const serverErrors = apiError.message as unknown as Record<string, string[]>; // Type assertion for error object

      // Map server field names to form field names
      const fieldMapping: { [key: string]: keyof FormErrors } = {
        'name': 'name',
        'color': 'color',
        'actionId': 'actionId',
        'actionName': 'actionName',
        'expressionId': 'expressionId',
        'expressionName': 'expressionName',
        'danceId': 'danceId',
        'danceName': 'danceName',
      };

      Object.keys(serverErrors).forEach(serverField => {
        const formField = fieldMapping[serverField];
        if (formField && serverErrors[serverField]) {
          apiErrors[formField] = Array.isArray(serverErrors[serverField])
            ? serverErrors[serverField][0]
            : serverErrors[serverField];
        }
      });

      setErrors(apiErrors);
    }
  }, [apiError]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleActionChange = (actionId: string) => {
    const selectedAction = actions.find(action => action.id === actionId);
    setFormData(prev => ({
      ...prev,
      actionId: actionId === 'none' ? '' : actionId,
      actionName: actionId === 'none' ? '' : (selectedAction?.name || '')
    }));
  };

  const handleExpressionChange = (expressionId: string) => {
    const selectedExpression = expressions.find(expr => expr.id === expressionId);
    setFormData(prev => ({
      ...prev,
      expressionId: expressionId === 'none' ? '' : expressionId,
      expressionName: expressionId === 'none' ? '' : (selectedExpression?.name || '')
    }));
  };

  const handleDanceChange = (danceId: string) => {
    const selectedDance = dances.find(dance => dance.id === danceId);
    setFormData(prev => ({
      ...prev,
      danceId: danceId === 'none' ? '' : danceId,
      danceName: danceId === 'none' ? '' : (selectedDance?.name || '')
    }));
  };

  const handleExtActionChange = (extActionId: string) => {
    const seletedAction = extendedActions.find(v => v.id === extActionId);
    setFormData(prev => ({
      ...prev,
      extendedActionId: extActionId === 'none' ? '' : extActionId,
      extendedActionName: extActionId === 'none' ? '' : (seletedAction?.name || '')
    }));
  };

  const handleSkillChange = (skillId: string) => {
    const selectedSkill = skills.find(v => v.id === skillId);
    setFormData(prev => ({
      ...prev,
      skillId: skillId === 'none' ? '' : skillId,
      skillName: skillId === 'none' ? '' : (selectedSkill?.name || '')
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Card name is required';
    }

    if (!formData.color) {
      newErrors.color = 'Color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!card || !validateForm()) return;

    // Build a full partial payload containing current form values so backend receives necessary fields
    const updatedData: Partial<OsmoCard> = {
      name: formData.name,
      color: formData.color,
      status: formData.status,
      actionId: formData.actionId || undefined,
      actionName: formData.actionName || undefined,
      expressionId: formData.expressionId || undefined,
      expressionName: formData.expressionName || undefined,
      danceId: formData.danceId || undefined,
      danceName: formData.danceName || undefined,
      extendedActionId: formData.extendedActionId || undefined,
      extendedActionName: formData.extendedActionName || undefined,
      skillId: formData.skillId || undefined,
      skillName: formData.skillName || undefined,
    };

    // Only call API if there are actual values to send
    if (Object.keys(updatedData).length > 0) {
      onSave(card!.id, updatedData);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getColorPreview = (colorValue: string) => {
    const colorMap: { [key: string]: string } = {
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#22c55e',
      'yellow': '#eab308',
      'purple': '#a855f7',
      'pink': '#ec4899',
      'orange': '#f97316',
      'gray': '#6b7280',
    };

    return colorMap[colorValue] || '#6b7280';
  };

  if (!card) return null;

  const lockSelect = (exceptId: string) => {
    console.log(exceptId);

    const set = new Set<string>()
    set.add(formData.actionId)
    set.add(formData.expressionId)
    set.add(formData.danceId)
    set.add(formData.extendedActionId)
    set.add(formData.skillId)
    //This select doesn't have a value. Lock it if there's already an id selected somewhere
    if (exceptId.length == 0) {
      return set.size >= 2
    }
    //We are at the select with value, don't lock it
    return false
  }

  // Show loading state if data is still loading
  if (isDataLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Edit Osmo Card</h2>
                <p className="text-sm text-gray-500">Loading data...</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading actions, expressions, and dances...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show error state if there's an API error
  if (hasApiError) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-500 text-white">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Edit Osmo Card</h2>
                <p className="text-sm text-red-500">Error loading data</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-red-500">
              <X className="h-12 w-12" />
            </div>
            <p className="text-gray-600 text-center">
              Failed to load actions, expressions, or dances. Please try again later.
            </p>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500 text-white">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Edit Osmo Card</h2>
              <p className="text-sm text-gray-500">Update card information and activities</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Card Name *</Label>
                <Input
                  id="cardName"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter card name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardColor">Color *</Label>
                <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                  <SelectTrigger className={errors.color ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select color">
                      {formData.color && (
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: getColorPreview(formData.color) }}
                          />
                          <span className="capitalize">{formData.color}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: getColorPreview(color.value) }}
                          />
                          <span>{color.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.color && (
                  <p className="text-sm text-red-500">{errors.color}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="cardStatus"
                checked={formData.status === 1}
                onCheckedChange={(checked) => handleInputChange('status', checked ? 1 : 0)}
              />
              <Label htmlFor="cardStatus">
                Active Status {formData.status === 1 ? '(Active)' : '(Inactive)'}
              </Label>
            </div>
          </div>

          <Separator />

          {/* Activity Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Activity Configuration</h3>

            <div className="space-y-4">
              {/* Action */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  <Label className="text-base font-medium">Action</Label>
                </div>
                <Select value={formData.actionId || 'none'} disabled={lockSelect(formData.actionId)} onValueChange={handleActionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Action</SelectItem>
                    {actions.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        {action.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Expression */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <Smile className="h-4 w-4 text-blue-500" />
                  <Label className="text-base font-medium">Expression</Label>
                </div>
                <Select value={formData.expressionId || 'none'} disabled={lockSelect(formData.expressionId)} onValueChange={handleExpressionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an expression" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Expression</SelectItem>
                    {expressions.map((expression) => (
                      <SelectItem key={expression.id} value={expression.id}>
                        {expression.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dance */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-orange-500" />
                  <Label className="text-base font-medium">Dance</Label>
                </div>
                <Select value={formData.danceId || 'none'} onValueChange={handleDanceChange}
                  disabled={lockSelect(formData.danceId)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Dance</SelectItem>
                    {dances.map((dance) => (
                      <SelectItem key={dance.id} value={dance.id}>
                        {dance.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Extended action */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <DatabaseZapIcon className="h-4 w-4 text-yellow-500" />
                  <Label className="text-base font-medium">Extended action</Label>
                </div>
                <Select
                  disabled={lockSelect(formData.extendedActionId)}
                  value={formData.extendedActionId || 'none'} onValueChange={handleExtActionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an extended action (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No extended action</SelectItem>
                    {extendedActions.length === 0 && !extendedLoading ? (
                      <SelectItem value="no-data" disabled>No extended actions available</SelectItem>
                    ) : (
                      extendedActions.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Skill */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-green-500" />
                  <Label className="text-base font-medium">Skill</Label>
                </div>
                <Select
                  disabled={lockSelect(formData.skillId)}
                  value={formData.skillId || 'none'} onValueChange={handleSkillChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dance (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Skill</SelectItem>
                    {skills.length === 0 && !skillLoading ? (
                      <SelectItem value="no-data" disabled>No skills available</SelectItem>
                    ) : (
                      skills.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
