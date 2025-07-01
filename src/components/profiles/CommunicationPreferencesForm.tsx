
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Loader2, Phone, Mail, MessageSquare, Bell } from 'lucide-react';
import type { EnhancedProfile, CommunicationPreferences } from '@/types/profile';

interface CommunicationPreferencesFormProps {
  profile: EnhancedProfile;
  onUpdate: (updates: Partial<EnhancedProfile>) => Promise<void>;
  saving: boolean;
}

const CommunicationPreferencesForm: React.FC<CommunicationPreferencesFormProps> = ({
  profile,
  onUpdate,
  saving
}) => {
  const [preferences, setPreferences] = useState<CommunicationPreferences>(
    profile.communication_preferences || {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({ communication_preferences: preferences });
  };

  const updatePreference = (key: keyof CommunicationPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preferred Contact Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Preferred Contact Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.contactMethod || 'email'}
            onValueChange={(value) => updatePreference('contactMethod', value as 'email' | 'sms' | 'phone')}
            disabled={saving}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sms" id="sms" />
              <Label htmlFor="sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Text Message (SMS)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone" />
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Call
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="newMatches">New Property Matches</Label>
              <p className="text-sm text-gray-500">
                Get notified when new properties match your preferences
              </p>
            </div>
            <Switch
              id="newMatches"
              checked={preferences.notifyOnNewMatches !== false}
              onCheckedChange={(checked) => updatePreference('notifyOnNewMatches', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="statusUpdates">Status Updates</Label>
              <p className="text-sm text-gray-500">
                Get notified about showing confirmations and status changes
              </p>
            </div>
            <Switch
              id="statusUpdates"
              checked={preferences.notifyOnStatusUpdates !== false}
              onCheckedChange={(checked) => updatePreference('notifyOnStatusUpdates', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="messages">New Messages</Label>
              <p className="text-sm text-gray-500">
                Get notified when you receive new messages from agents
              </p>
            </div>
            <Switch
              id="messages"
              checked={preferences.notifyOnMessages !== false}
              onCheckedChange={(checked) => updatePreference('notifyOnMessages', checked)}
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Preferences for Agents */}
      {profile.user_type === 'agent' && (
        <Card>
          <CardHeader>
            <CardTitle>Agent-Specific Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="newLeads">New Lead Notifications</Label>
                <p className="text-sm text-gray-500">
                  Get notified when you receive new showing requests
                </p>
              </div>
              <Switch
                id="newLeads"
                checked={preferences.notifyOnMessages !== false}
                onCheckedChange={(checked) => updatePreference('notifyOnMessages', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reviewRequests">Review Requests</Label>
                <p className="text-sm text-gray-500">
                  Get notified when buyers leave reviews or feedback
                </p>
              </div>
              <Switch
                id="reviewRequests"
                checked={preferences.notifyOnStatusUpdates !== false}
                onCheckedChange={(checked) => updatePreference('notifyOnStatusUpdates', checked)}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Communication Preferences'
        )}
      </Button>
    </form>
  );
};

export default CommunicationPreferencesForm;
