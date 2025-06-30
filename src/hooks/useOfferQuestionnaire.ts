
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BuyerQualificationData {
  preApprovalStatus: 'approved' | 'pending' | 'not_started';
  preApprovalAmount?: number;
  budgetMin?: number;
  budgetMax?: number;
  downPaymentAmount?: number;
  downPaymentSource: string;
  employmentStatus: string;
  incomeVerified: boolean;
  creditScoreRange: string;
  buyingTimeline: string;
  currentHomeStatus: 'own' | 'rent' | 'living_with_family';
  needToSellFirst: boolean;
}

export interface PropertyAnalysisData {
  propertyAddress?: string;
  propertyType: string;
  listingPrice: number;
  daysOnMarket?: number;
  priceHistory?: Array<{date: string, price: number}>;
  comparableSales?: Array<{address: string, price: number, date: string}>;
  marketConditions: 'hot' | 'balanced' | 'slow';
  neighborhoodTrends: string;
  specialFeatures?: string[];
}

export interface OfferTermsData {
  offerPrice: number;
  offerStrategy: 'below_asking' | 'at_asking' | 'above_asking';
  escalationClause: boolean;
  maxEscalationPrice?: number;
  escalationIncrement?: number;
  settlementDate: string;
  possessionDate: string;
  offerExpiration: string;
  personalPropertyIncluded?: string[];
  personalPropertyExcluded?: string[];
}

export interface FinancingData {
  loanType: 'conventional' | 'fha' | 'va' | 'usda' | 'cash';
  loanAmount?: number;
  interestRate?: number;
  loanTerm?: number;
  lenderName?: string;
  lenderContact?: string;
  financingContingencyDays: number;
  appraisalContingency: boolean;
  appraisalContingencyDays?: number;
}

export interface ContingenciesData {
  homeInspection: boolean;
  homeInspectionDays?: number;
  inspectionType: 'general' | 'negotiate_repairs' | 'void_only';
  radonTesting: boolean;
  radonTestingDays?: number;
  leadPaintInspection: boolean;
  leadPaintInspectionDays?: number;
  termiteInspection: boolean;
  homeWarranty: boolean;
  homeWarrantyPaidBy: 'buyer' | 'seller' | 'split';
  saleOfCurrentHome: boolean;
  saleContingencyDate?: string;
  kickoutClause?: boolean;
}

export interface AdditionalTermsData {
  sellerConcessions: boolean;
  sellerConcessionsAmount?: number;
  specialConditions?: string[];
  attorneySelection?: string;
  titleCompany?: string;
  surveyRequired: boolean;
  hoa: boolean;
  hoaFees?: number;
  condoAssociation: boolean;
  condoFees?: number;
  specialInstructions?: string;
}

export interface QuestionnaireStep {
  stepNumber: number;
  stepName: string;
  title: string;
  description: string;
  isComplete: boolean;
  data: any;
}

export const useOfferQuestionnaire = (offerIntentId: string) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<QuestionnaireStep[]>([
    {
      stepNumber: 1,
      stepName: 'buyer_qualification',
      title: 'Buyer Information & Qualification',
      description: 'Pre-approval status, budget, and financial qualification',
      isComplete: false,
      data: {}
    },
    {
      stepNumber: 2,
      stepName: 'property_analysis',
      title: 'Property & Market Analysis',
      description: 'Property details, market conditions, and comparable sales',
      isComplete: false,
      data: {}
    },
    {
      stepNumber: 3,
      stepName: 'offer_terms',
      title: 'Offer Terms & Pricing',
      description: 'Offer price, escalation, settlement dates, and terms',
      isComplete: false,
      data: {}
    },
    {
      stepNumber: 4,
      stepName: 'financing',
      title: 'Financing Details',
      description: 'Loan information, contingency periods, and lender details',
      isComplete: false,
      data: {}
    },
    {
      stepNumber: 5,
      stepName: 'contingencies',
      title: 'Contingencies & Conditions',
      description: 'Inspection, appraisal, and other contingencies',
      isComplete: false,
      data: {}
    },
    {
      stepNumber: 6,
      stepName: 'additional_terms',
      title: 'Additional Terms & Disclosures',
      description: 'Special conditions, concessions, and final details',
      isComplete: false,
      data: {}
    }
  ]);

  const saveStepData = useCallback(async (stepNumber: number, data: any) => {
    setLoading(true);
    try {
      const step = steps.find(s => s.stepNumber === stepNumber);
      if (!step) throw new Error('Step not found');

      // Save to database
      const { error } = await supabase
        .from('offer_questionnaire_responses')
        .upsert({
          offer_intent_id: offerIntentId,
          step_number: stepNumber,
          step_name: step.stepName,
          responses: data
        }, {
          onConflict: 'offer_intent_id,step_number'
        });

      if (error) throw error;

      // Update local state
      setSteps(prevSteps => 
        prevSteps.map(s => 
          s.stepNumber === stepNumber 
            ? { ...s, data, isComplete: true }
            : s
        )
      );

      toast({
        title: "Progress Saved",
        description: `${step.title} information saved successfully.`
      });

    } catch (error) {
      console.error('Error saving step data:', error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [offerIntentId, steps, toast]);

  const goToNextStep = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      setCurrentStep(stepNumber);
    }
  }, [steps.length]);

  const generateAgentSummary = useCallback(async () => {
    setLoading(true);
    try {
      // Collect all step data
      const allData = steps.reduce((acc, step) => {
        acc[step.stepName] = step.data;
        return acc;
      }, {} as Record<string, any>);

      // Generate comprehensive summary
      const summary = {
        buyer_qualification_summary: {
          preApprovalStatus: allData.buyer_qualification?.preApprovalStatus,
          preApprovalAmount: allData.buyer_qualification?.preApprovalAmount,
          budget: {
            min: allData.buyer_qualification?.budgetMin,
            max: allData.buyer_qualification?.budgetMax
          },
          downPayment: {
            amount: allData.buyer_qualification?.downPaymentAmount,
            source: allData.buyer_qualification?.downPaymentSource
          },
          creditScore: allData.buyer_qualification?.creditScoreRange,
          timeline: allData.buyer_qualification?.buyingTimeline
        },
        offer_strategy_summary: {
          listingPrice: allData.property_analysis?.listingPrice,
          offerPrice: allData.offer_terms?.offerPrice,
          strategy: allData.offer_terms?.offerStrategy,
          escalation: allData.offer_terms?.escalationClause ? {
            maxPrice: allData.offer_terms?.maxEscalationPrice,
            increment: allData.offer_terms?.escalationIncrement
          } : null,
          marketConditions: allData.property_analysis?.marketConditions
        },
        financing_summary: {
          loanType: allData.financing?.loanType,
          loanAmount: allData.financing?.loanAmount,
          lender: allData.financing?.lenderName,
          contingencyDays: allData.financing?.financingContingencyDays
        },
        contingencies_summary: {
          inspection: allData.contingencies?.homeInspection,
          inspectionDays: allData.contingencies?.homeInspectionDays,
          inspectionType: allData.contingencies?.inspectionType,
          saleOfHome: allData.contingencies?.saleOfCurrentHome,
          appraisal: allData.financing?.appraisalContingency
        },
        required_documents: [
          'Pre-approval letter',
          'Proof of down payment funds',
          'Employment verification',
          ...(allData.buyer_qualification?.needToSellFirst ? ['Current home listing agreement'] : [])
        ],
        required_forms: [
          allData.property_analysis?.propertyType?.includes('DC') ? 'GCAAR Form 1301' : 'MAR Residential Contract',
          ...(allData.financing?.loanType === 'fha' ? ['FHA Financing Addendum'] : []),
          ...(allData.financing?.loanType === 'va' ? ['VA Financing Addendum'] : []),
          ...(allData.contingencies?.homeInspection ? ['Property Inspection Addendum'] : []),
          ...(allData.additional_terms?.hoa ? ['HOA Addendum'] : []),
          ...(allData.additional_terms?.condoAssociation ? ['Condo Resale Addendum'] : [])
        ],
        special_conditions: allData.additional_terms?.specialConditions || [],
        agent_checklist: [
          'Review buyer qualification documents',
          'Verify funds availability',
          'Check comparable sales',
          'Prepare offer documents',
          'Schedule settlement',
          'Coordinate inspections',
          ...(allData.offer_terms?.escalationClause ? ['Set up escalation monitoring'] : [])
        ]
      };

      // Save summary to database
      const { error } = await supabase
        .from('offer_preparation_summaries')
        .insert({
          offer_intent_id: offerIntentId,
          ...summary,
          contract_type: allData.property_analysis?.propertyType?.includes('DC') ? 'gcaar' : 'mar'
        });

      if (error) throw error;

      // Update offer_intents with completion timestamp
      await supabase
        .from('offer_intents')
        .update({
          questionnaire_completed_at: new Date().toISOString(),
          agent_summary_generated_at: new Date().toISOString()
        })
        .eq('id', offerIntentId);

      toast({
        title: "Summary Generated",
        description: "Agent-ready offer summary has been created successfully."
      });

      return summary;

    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [steps, offerIntentId, toast]);

  const loadExistingData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('offer_questionnaire_responses')
        .select('*')
        .eq('offer_intent_id', offerIntentId)
        .order('step_number');

      if (error) throw error;

      if (data && data.length > 0) {
        setSteps(prevSteps => 
          prevSteps.map(step => {
            const existingData = data.find(d => d.step_number === step.stepNumber);
            return existingData 
              ? { ...step, data: existingData.responses, isComplete: true }
              : step;
          })
        );
      }

    } catch (error) {
      console.error('Error loading existing data:', error);
    } finally {
      setLoading(false);
    }
  }, [offerIntentId]);

  return {
    currentStep,
    steps,
    loading,
    saveStepData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    generateAgentSummary,
    loadExistingData
  };
};
