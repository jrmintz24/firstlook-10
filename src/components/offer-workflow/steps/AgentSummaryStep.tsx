
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, FileText, DollarSign, Calendar, Home, AlertCircle } from 'lucide-react';

interface AgentSummaryStepProps {
  offerIntentId: string;
  onComplete: () => void;
  loading: boolean;
}

const AgentSummaryStep = ({ offerIntentId, onComplete, loading }: AgentSummaryStepProps) => {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    // In a real implementation, this would fetch the generated summary
    // For now, we'll use mock data
    setSummary({
      buyer_qualification_summary: {
        preApprovalStatus: 'approved',
        preApprovalAmount: 600000,
        budget: { min: 500000, max: 650000 },
        downPayment: { amount: 120000, source: 'savings' },
        creditScore: 'excellent',
        timeline: 'soon'
      },
      offer_strategy_summary: {
        listingPrice: 575000,
        offerPrice: 580000,
        strategy: 'above_asking',
        escalation: { maxPrice: 590000, increment: 2500 },
        marketConditions: 'hot'
      },
      financing_summary: {
        loanType: 'conventional',
        loanAmount: 460000,
        lender: 'ABC Mortgage',
        contingencyDays: 21
      },
      contingencies_summary: {
        inspection: true,
        inspectionDays: 7,
        inspectionType: 'negotiate_repairs',
        saleOfHome: false,
        appraisal: true
      },
      required_documents: [
        'Pre-approval letter',
        'Proof of down payment funds',
        'Employment verification'
      ],
      required_forms: [
        'GCAAR Form 1301',
        'Conventional Financing Addendum',
        'Property Inspection Addendum'
      ],
      special_conditions: [
        'Seller to include all appliances',
        'Settlement within 45 days'
      ],
      agent_checklist: [
        'Review buyer qualification documents',
        'Verify funds availability',
        'Check comparable sales',
        'Prepare offer documents',
        'Schedule settlement',
        'Coordinate inspections'
      ]
    });
  }, [offerIntentId]);

  if (!summary) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating your offer summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Offer Preparation Complete!</h2>
        <p className="text-gray-600 mt-2">
          Your comprehensive offer information has been compiled for your agent.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Buyer Qualification Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Pre-Approval Status</p>
              <Badge variant="outline" className="mt-1">
                {summary.buyer_qualification_summary.preApprovalStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pre-Approval Amount</p>
              <p className="font-semibold">${summary.buyer_qualification_summary.preApprovalAmount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Range</p>
              <p className="font-semibold">
                ${summary.buyer_qualification_summary.budget.min?.toLocaleString()} - 
                ${summary.buyer_qualification_summary.budget.max?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Down Payment</p>
              <p className="font-semibold">${summary.buyer_qualification_summary.downPayment.amount?.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Offer Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Listing Price</p>
              <p className="font-semibold">${summary.offer_strategy_summary.listingPrice?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Offer Price</p>
              <p className="font-semibold text-blue-600">${summary.offer_strategy_summary.offerPrice?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Strategy</p>
              <Badge variant="secondary">{summary.offer_strategy_summary.strategy?.replace('_', ' ')}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Market Conditions</p>
              <Badge variant="outline">{summary.offer_strategy_summary.marketConditions}</Badge>
            </div>
          </div>
          
          {summary.offer_strategy_summary.escalation && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Escalation Clause</p>
              <p className="text-sm text-blue-700">
                Up to ${summary.offer_strategy_summary.escalation.maxPrice?.toLocaleString()} 
                in ${summary.offer_strategy_summary.escalation.increment?.toLocaleString()} increments
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Financing & Contingencies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Loan Type</p>
              <Badge variant="outline">{summary.financing_summary.loanType}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Loan Amount</p>
              <p className="font-semibold">${summary.financing_summary.loanAmount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Lender</p>
              <p className="font-semibold">{summary.financing_summary.lender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Financing Contingency</p>
              <p className="font-semibold">{summary.financing_summary.contingencyDays} days</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Contingencies</p>
            <div className="flex flex-wrap gap-2">
              {summary.contingencies_summary.inspection && (
                <Badge variant="secondary">
                  Inspection ({summary.contingencies_summary.inspectionDays} days)
                </Badge>
              )}
              {summary.contingencies_summary.appraisal && (
                <Badge variant="secondary">Appraisal</Badge>
              )}
              {summary.contingencies_summary.saleOfHome && (
                <Badge variant="secondary">Sale of Home</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Required Documents & Forms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Required Documents</p>
            <ul className="space-y-1">
              {summary.required_documents.map((doc: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Required Forms</p>
            <ul className="space-y-1">
              {summary.required_forms.map((form: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-500" />
                  {form}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {summary.special_conditions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Special Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {summary.special_conditions.map((condition: string, index: number) => (
                <li key={index} className="text-sm">• {condition}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Agent Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {summary.agent_checklist.map((item: string, index: number) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 border border-gray-300 rounded"></div>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Next Steps:</strong> This comprehensive summary has been prepared for your agent. 
          They now have all the information needed to prepare your offer documents efficiently and accurately 
          for the DC/Maryland market.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onComplete}
          disabled={loading}
          className="min-w-32 bg-green-600 hover:bg-green-700"
        >
          Complete & Close
        </Button>
      </div>
    </div>
  );
};

export default AgentSummaryStep;
