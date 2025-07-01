
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import type { OnboardingStepProps } from '@/types/onboarding';

const PreferencesStep: React.FC<OnboardingStepProps> = ({ profile, onUpdate, onNext, onSkip, isLoading }) => {
  const [buyerPrefs, setBuyerPrefs] = useState({
    budget: profile.buyer_preferences?.budget || { min: '', max: '' },
    desiredAreas: profile.buyer_preferences?.desiredAreas || [],
    homeTypes: profile.buyer_preferences?.homeTypes || []
  });

  const [agentDetails, setAgentDetails] = useState({
    brokerage: profile.agent_details?.brokerage || '',
    licenseNumber: profile.agent_details?.licenseNumber || '',
    areasServed: profile.agent_details?.areasServed || [],
    bio: profile.agent_details?.bio || ''
  });

  const [newArea, setNewArea] = useState('');
  const [newHomeType, setNewHomeType] = useState('');

  const addArea = (list: string[], setList: (areas: string[]) => void) => {
    if (newArea.trim() && !list.includes(newArea.trim())) {
      setList([...list, newArea.trim()]);
      setNewArea('');
    }
  };

  const removeArea = (area: string, list: string[], setList: (areas: string[]) => void) => {
    setList(list.filter(a => a !== area));
  };

  const addHomeType = () => {
    if (newHomeType.trim() && !buyerPrefs.homeTypes.includes(newHomeType.trim())) {
      setBuyerPrefs(prev => ({
        ...prev,
        homeTypes: [...prev.homeTypes, newHomeType.trim()]
      }));
      setNewHomeType('');
    }
  };

  const removeHomeType = (type: string) => {
    setBuyerPrefs(prev => ({
      ...prev,
      homeTypes: prev.homeTypes.filter(t => t !== type)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: any = {};
    
    if (profile.user_type === 'buyer') {
      updates.buyer_preferences = {
        ...profile.buyer_preferences,
        budget: {
          min: buyerPrefs.budget.min ? parseInt(buyerPrefs.budget.min) : undefined,
          max: buyerPrefs.budget.max ? parseInt(buyerPrefs.budget.max) : undefined
        },
        desiredAreas: buyerPrefs.desiredAreas,
        homeTypes: buyerPrefs.homeTypes
      };
    } else if (profile.user_type === 'agent') {
      updates.agent_details = {
        ...profile.agent_details,
        brokerage: agentDetails.brokerage,
        licenseNumber: agentDetails.licenseNumber,
        areasServed: agentDetails.areasServed,
        bio: agentDetails.bio
      };
    }
    
    await onUpdate(updates);
    onNext();
  };

  if (profile.user_type === 'buyer') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            What are you looking for?
          </h2>
          <p className="text-gray-600">
            Help us find properties that match your preferences
          </p>
        </div>

        {/* Budget */}
        <div>
          <Label className="text-base font-medium">Budget Range</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="minBudget" className="text-sm">Minimum</Label>
              <Input
                id="minBudget"
                type="number"
                placeholder="Min price"
                value={buyerPrefs.budget.min}
                onChange={(e) => setBuyerPrefs(prev => ({
                  ...prev,
                  budget: { ...prev.budget, min: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="maxBudget" className="text-sm">Maximum</Label>
              <Input
                id="maxBudget"
                type="number"
                placeholder="Max price"
                value={buyerPrefs.budget.max}
                onChange={(e) => setBuyerPrefs(prev => ({
                  ...prev,
                  budget: { ...prev.budget, max: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Desired Areas */}
        <div>
          <Label className="text-base font-medium">Preferred Areas</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add area (e.g., Capitol Hill, Georgetown)"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArea(buyerPrefs.desiredAreas, (areas) => setBuyerPrefs(prev => ({ ...prev, desiredAreas: areas }))))}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addArea(buyerPrefs.desiredAreas, (areas) => setBuyerPrefs(prev => ({ ...prev, desiredAreas: areas })))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {buyerPrefs.desiredAreas.map((area) => (
              <Badge key={area} variant="secondary">
                {area}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => removeArea(area, buyerPrefs.desiredAreas, (areas) => setBuyerPrefs(prev => ({ ...prev, desiredAreas: areas })))}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Home Types */}
        <div>
          <Label className="text-base font-medium">Preferred Home Types</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add type (e.g., Condo, Townhouse)"
              value={newHomeType}
              onChange={(e) => setNewHomeType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHomeType())}
            />
            <Button type="button" variant="outline" onClick={addHomeType}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {buyerPrefs.homeTypes.map((type) => (
              <Badge key={type} variant="secondary">
                {type}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => removeHomeType(type)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {onSkip && (
            <Button type="button" variant="ghost" onClick={onSkip}>
              Skip for now
            </Button>
          )}
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </form>
    );
  }

  // Agent preferences
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Tell us about your practice
        </h2>
        <p className="text-gray-600">
          This helps us match you with the right buyers
        </p>
      </div>

      <div>
        <Label htmlFor="brokerage">Brokerage</Label>
        <Input
          id="brokerage"
          value={agentDetails.brokerage}
          onChange={(e) => setAgentDetails(prev => ({ ...prev, brokerage: e.target.value }))}
          placeholder="Your brokerage name"
        />
      </div>

      <div>
        <Label htmlFor="license">License Number</Label>
        <Input
          id="license"
          value={agentDetails.licenseNumber}
          onChange={(e) => setAgentDetails(prev => ({ ...prev, licenseNumber: e.target.value }))}
          placeholder="Your license number"
        />
      </div>

      <div>
        <Label className="text-base font-medium">Areas You Serve</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add area (e.g., Capitol Hill, Georgetown)"
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArea(agentDetails.areasServed, (areas) => setAgentDetails(prev => ({ ...prev, areasServed: areas }))))}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addArea(agentDetails.areasServed, (areas) => setAgentDetails(prev => ({ ...prev, areasServed: areas })))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {agentDetails.areasServed.map((area) => (
            <Badge key={area} variant="secondary">
              {area}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => removeArea(area, agentDetails.areasServed, (areas) => setAgentDetails(prev => ({ ...prev, areasServed: areas })))}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Brief Bio (Optional)</Label>
        <Textarea
          id="bio"
          value={agentDetails.bio}
          onChange={(e) => setAgentDetails(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell buyers about your experience and specialties..."
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        {onSkip && (
          <Button type="button" variant="ghost" onClick={onSkip}>
            Skip for now
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </form>
  );
};

export default PreferencesStep;
