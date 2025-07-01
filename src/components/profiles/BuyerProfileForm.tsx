
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2, Home, DollarSign, MapPin, Calendar } from 'lucide-react';
import type { EnhancedProfile, BuyerPreferences } from '@/types/profile';

interface BuyerProfileFormProps {
  profile: EnhancedProfile;
  onUpdate: (updates: Partial<EnhancedProfile>) => Promise<void>;
  saving: boolean;
}

const BuyerProfileForm: React.FC<BuyerProfileFormProps> = ({
  profile,
  onUpdate,
  saving
}) => {
  const [preferences, setPreferences] = useState<BuyerPreferences>(
    profile.buyer_preferences || {}
  );

  const homeTypes = [
    'Single Family',
    'Townhouse',
    'Condo',
    'Co-op',
    'Multi-Family'
  ];

  const dcAreas = [
    'Adams Morgan',
    'Capitol Hill',
    'Dupont Circle',
    'Georgetown',
    'Logan Circle',
    'Penn Quarter',
    'Petworth',
    'Shaw',
    'U Street Corridor',
    'Woodley Park'
  ];

  const mustHaveOptions = [
    'Parking',
    'Yard/Garden',
    'Balcony/Deck',
    'Fireplace',
    'Updated Kitchen',
    'Hardwood Floors',
    'In-Unit Laundry',
    'Pet Friendly',
    'Gym/Fitness Center',
    'Doorman/Concierge'
  ];

  const preferredDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const preferredTimes = [
    'Morning (9-12 PM)',
    'Afternoon (12-5 PM)',
    'Evening (5-8 PM)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({ buyer_preferences: preferences });
  };

  const updatePreference = (key: keyof BuyerPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (array: string[] = [], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Budget Range */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minBudget">Minimum Budget</Label>
              <Input
                id="minBudget"
                type="number"
                value={preferences.budget?.min || ''}
                onChange={(e) => updatePreference('budget', {
                  ...preferences.budget,
                  min: parseInt(e.target.value) || 0
                })}
                placeholder="e.g., 400000"
                disabled={saving}
              />
            </div>
            <div>
              <Label htmlFor="maxBudget">Maximum Budget</Label>
              <Input
                id="maxBudget"
                type="number"
                value={preferences.budget?.max || ''}
                onChange={(e) => updatePreference('budget', {
                  ...preferences.budget,
                  max: parseInt(e.target.value) || 0
                })}
                placeholder="e.g., 600000"
                disabled={saving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desired Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Preferred Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dcAreas.map(area => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={area}
                  checked={preferences.desiredAreas?.includes(area) || false}
                  onCheckedChange={(checked) => {
                    updatePreference('desiredAreas', 
                      toggleArrayItem(preferences.desiredAreas, area)
                    );
                  }}
                  disabled={saving}
                />
                <Label htmlFor={area} className="text-sm">{area}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Home Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Home Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {homeTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={preferences.homeTypes?.includes(type) || false}
                  onCheckedChange={(checked) => {
                    updatePreference('homeTypes', 
                      toggleArrayItem(preferences.homeTypes, type)
                    );
                  }}
                  disabled={saving}
                />
                <Label htmlFor={type} className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bedrooms & Bathrooms */}
      <Card>
        <CardHeader>
          <CardTitle>Bedrooms & Bathrooms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minBeds">Minimum Bedrooms</Label>
              <Select
                value={preferences.bedrooms?.min?.toString() || ''}
                onValueChange={(value) => updatePreference('bedrooms', {
                  ...preferences.bedrooms,
                  min: parseInt(value)
                })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num === 0 ? 'Studio' : `${num} Bedroom${num > 1 ? 's' : ''}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="minBaths">Minimum Bathrooms</Label>
              <Select
                value={preferences.bathrooms?.min?.toString() || ''}
                onValueChange={(value) => updatePreference('bathrooms', {
                  ...preferences.bathrooms,
                  min: parseInt(value)
                })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Bathroom{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Must-Haves */}
      <Card>
        <CardHeader>
          <CardTitle>Must-Have Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {mustHaveOptions.map(feature => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={preferences.mustHaves?.includes(feature) || false}
                  onCheckedChange={(checked) => {
                    updatePreference('mustHaves', 
                      toggleArrayItem(preferences.mustHaves, feature)
                    );
                  }}
                  disabled={saving}
                />
                <Label htmlFor={feature} className="text-sm">{feature}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tour Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Tour Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Preferred Days</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {preferredDays.map(day => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={day}
                    checked={preferences.tourPreferences?.preferredDays?.includes(day) || false}
                    onCheckedChange={(checked) => {
                      updatePreference('tourPreferences', {
                        ...preferences.tourPreferences,
                        preferredDays: toggleArrayItem(
                          preferences.tourPreferences?.preferredDays, 
                          day
                        )
                      });
                    }}
                    disabled={saving}
                  />
                  <Label htmlFor={day} className="text-sm">{day}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Preferred Times</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              {preferredTimes.map(time => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox
                    id={time}
                    checked={preferences.tourPreferences?.preferredTimes?.includes(time) || false}
                    onCheckedChange={(checked) => {
                      updatePreference('tourPreferences', {
                        ...preferences.tourPreferences,
                        preferredTimes: toggleArrayItem(
                          preferences.tourPreferences?.preferredTimes, 
                          time
                        )
                      });
                    }}
                    disabled={saving}
                  />
                  <Label htmlFor={time} className="text-sm">{time}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="advanceNotice">Advance Notice (hours)</Label>
            <Select
              value={preferences.tourPreferences?.advanceNotice?.toString() || '24'}
              onValueChange={(value) => updatePreference('tourPreferences', {
                ...preferences.tourPreferences,
                advanceNotice: parseInt(value)
              })}
              disabled={saving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select advance notice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Buyer Preferences'
        )}
      </Button>
    </form>
  );
};

export default BuyerProfileForm;
