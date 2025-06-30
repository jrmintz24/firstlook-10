
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateBuyerQualification = (data: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.preApprovalStatus) {
    errors.push('Pre-approval status is required');
  }

  if (data.preApprovalStatus === 'approved' && !data.preApprovalAmount) {
    errors.push('Pre-approval amount is required when approved');
  }

  if (!data.budgetMin || !data.budgetMax) {
    errors.push('Budget range is required');
  }

  if (data.budgetMin && data.budgetMax && data.budgetMin >= data.budgetMax) {
    errors.push('Maximum budget must be greater than minimum budget');
  }

  if (!data.downPaymentAmount) {
    errors.push('Down payment amount is required');
  }

  if (data.downPaymentAmount && data.budgetMax && data.downPaymentAmount > data.budgetMax) {
    errors.push('Down payment cannot exceed maximum budget');
  }

  if (data.preApprovalStatus === 'pending') {
    warnings.push('Consider obtaining pre-approval before making an offer for a stronger position');
  }

  if (data.needToSellFirst) {
    warnings.push('Sale contingency may make your offer less competitive in hot markets');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateOfferTerms = (data: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.offerPrice || data.offerPrice <= 0) {
    errors.push('Offer price is required and must be greater than 0');
  }

  if (!data.settlementDate) {
    errors.push('Settlement date is required');
  }

  if (!data.possessionDate) {
    errors.push('Possession date is required');
  }

  if (!data.offerExpiration) {
    errors.push('Offer expiration is required');
  }

  if (data.settlementDate && data.possessionDate) {
    const settlementDate = new Date(data.settlementDate);
    const possessionDate = new Date(data.possessionDate);
    
    if (possessionDate < settlementDate) {
      errors.push('Possession date cannot be before settlement date');
    }
  }

  if (data.escalationClause) {
    if (!data.maxEscalationPrice) {
      errors.push('Maximum escalation price is required when using escalation clause');
    }
    if (!data.escalationIncrement) {
      errors.push('Escalation increment is required when using escalation clause');
    }
    if (data.maxEscalationPrice && data.offerPrice && data.maxEscalationPrice <= data.offerPrice) {
      errors.push('Maximum escalation price must be higher than initial offer price');
    }
  }

  const today = new Date();
  const expirationDate = new Date(data.offerExpiration);
  if (expirationDate <= today) {
    warnings.push('Offer expiration should be in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateFinancing = (data: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.loanType) {
    errors.push('Loan type is required');
  }

  if (data.loanType !== 'cash') {
    if (!data.loanAmount || data.loanAmount <= 0) {
      errors.push('Loan amount is required for financed purchases');
    }

    if (!data.financingContingencyDays || data.financingContingencyDays <= 0) {
      errors.push('Financing contingency period is required');
    }

    if (!data.lenderName) {
      warnings.push('Lender information would strengthen your offer');
    }

    if (data.financingContingencyDays > 30) {
      warnings.push('Financing contingency over 30 days may weaken your offer in competitive markets');
    }
  }

  if (data.appraisalContingency && (!data.appraisalContingencyDays || data.appraisalContingencyDays <= 0)) {
    errors.push('Appraisal contingency period is required when appraisal contingency is selected');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateContingencies = (data: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (data.homeInspection && (!data.homeInspectionDays || data.homeInspectionDays <= 0)) {
    errors.push('Home inspection period is required when inspection contingency is selected');
  }

  if (data.radonTesting && (!data.radonTestingDays || data.radonTestingDays <= 0)) {
    errors.push('Radon testing period is required when selected');
  }

  if (data.leadPaintInspection && (!data.leadPaintInspectionDays || data.leadPaintInspectionDays <= 0)) {
    errors.push('Lead paint inspection period is required when selected');
  }

  if (data.saleOfCurrentHome && !data.saleContingencyDate) {
    errors.push('Sale contingency date is required when sale of current home is selected');
  }

  if (!data.homeInspection && !data.radonTesting && !data.leadPaintInspection) {
    warnings.push('Consider adding at least one inspection contingency for due diligence');
  }

  if (data.homeInspectionDays && data.homeInspectionDays > 10) {
    warnings.push('Inspection periods over 10 days may weaken your offer competitiveness');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
