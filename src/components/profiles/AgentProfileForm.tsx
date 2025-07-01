
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building, Award, MapPin, Globe, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { EnhancedProfile, AgentDetails, AgentSpecialty } from '@/types/profile';

interface AgentProfileFormProps {
  profile: EnhancedProfile;
  onUpdate: (updates: Partial<EnhancedProfile>) => Promise<void>;
  saving: boolean;
}

const AgentProfileForm: React.FC<AgentProfileFormProps> = ({
  profile,
  onUpdate,
  saving
}) => {
  const [details, setDetails] = useState<AgentDetails>(
    profile.agent_details || {}
  );
  const [specialties, setSpecialties] = useState<AgentSpecialty[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);

  const dcMaryland = [
    'Washington, DC',
    'Montgomery County, MD',
    'Prince George\'s County, MD',
    'Arlington, VA',
    'Alexandria, VA',
    'Fairfax County, VA'
  ];

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_specialties')
        .select('*')
        .order('name');

      if (error) throw error;
      setSpecialties(data || []);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    } finally {
      setLoadingSpecialties(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({ agent_details: details });
  };

  const updateDetail = (key: keyof AgentDetails, value: any) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (array: string[] = [], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brokerage">Brokerage *</Label>
              <Input
                id="brokerage"
                value={details.brokerage || ''}
                onChange={(e) => updateDetail('brokerage', e.target.value)}
                placeholder="e.g., Compass, Keller Williams"
                disabled={saving}
                required
              />
            </div>
            <div>
              <Label htmlFor="licenseNumber">License Number *</Label>
              <Input
                id="licenseNumber"
                value={details.licenseNumber || ''}
                onChange={(e) => updateDetail('licenseNumber', e.target.value)}
                placeholder="e.g., D12345678"
                disabled={saving}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="yearsExperience">Years of Experience</Label>
            <Select
              value={details.yearsExperience?.toString() || ''}
              onValueChange={(value) => updateDetail('yearsExperience', parseInt(value))}
              disabled={saving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select years of experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Less than 1 year</SelectItem>
                <SelectItem value="1">1 year</SelectItem>
                <SelectItem value="2">2 years</SelectItem>
                <SelectItem value="3">3 years</SelectItem>
                <SelectItem value="5">5 years</SelectItem>
                <SelectItem value="10">10+ years</SelectItem>
                <SelectItem value="15">15+ years</SelectItem>
                <SelectItem value="20">20+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={details.bio || ''}
              onChange={(e) => updateDetail('bio', e.target.value)}
              placeholder="Tell potential clients about your experience and approach..."
              disabled={saving}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Areas Served
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dcMaryland.map(area => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={area}
                  checked={details.areasServed?.includes(area) || false}
                  onCheckedChange={(checked) => {
                    updateDetail('areasServed', 
                      toggleArrayItem(details.areasServed, area)
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

      {/* Specialties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Specialties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSpecialties ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {specialties.map(specialty => (
                <div key={specialty.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialty.id}
                    checked={details.specialties?.includes(specialty.name) || false}
                    onCheckedChange={(checked) => {
                      updateDetail('specialties', 
                        toggleArrayItem(details.specialties, specialty.name)
                      );
                    }}
                    disabled={saving}
                  />
                  <div>
                    <Label htmlFor={specialty.id} className="text-sm font-medium">
                      {specialty.name}
                    </Label>
                    {specialty.description && (
                      <p className="text-xs text-gray-500">{specialty.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Online Presence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Online Presence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              type="url"
              value={details.website || ''}
              onChange={(e) => updateDetail('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Business Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="referralFee">Referral Fee Percentage</Label>
            <Select
              value={details.referralFeePercent?.toString() || ''}
              onValueChange={(value) => updateDetail('referralFeePercent', parseInt(value))}
              disabled={saving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select referral fee percentage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20%</SelectItem>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="30">30%</SelectItem>
                <SelectItem value="35">35%</SelectItem>
                <SelectItem value="40">40%</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Percentage of commission you'll pay as referral fee
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="commissionRebate"
              checked={details.commissionRebateOffered || false}
              onCheckedChange={(checked) => 
                updateDetail('commissionRebateOffered', checked)
              }
              disabled={saving}
            />
            <Label htmlFor="commissionRebate">
              I offer commission rebates to buyers
            </Label>
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
          'Save Professional Profile'
        )}
      </Button>
    </form>
  );
};

export default AgentProfileForm;
