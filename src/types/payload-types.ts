
export interface Property {
  id: string; // Changed from number to string to support UUIDs
  name: string;
  generalInformation: {
    heroImage: {
      id: number;
      alt: string;
      url: string;
      thumbnailURL: string | null;
      filename: string;
      mimeType: string;
      filesize: number;
      width: number;
      height: number;
      focalX: number;
      focalY: number;
      updatedAt: string;
      createdAt: string;
    };
    agentNotes: Array<{
      id: string;
      agentName: string;
      agentNote: string;
    }>;
    agentSummary: any;
    videoUrl: string | null;
    purchasePrice: number;
    askingPrice: number;
    address: {
      streetAddress: string;
      suburbName: string | null | {
        id: number;
        name: string;
        region: any;
        vacancyRate?: number | null;
        slug: string;
        heroImage?: any;
        description?: any;
        medianValueByYear?: Array<{
          year: number;
          medianValue: number;
          id?: string | null;
        }> | null;
        updatedAt: string;
        createdAt: string;
        _status?: ('draft' | 'published') | null;
      };
      region: string | null | {
        id: number;
        name: string;
        heroImage?: any;
        description?: any;
        updatedAt: string;
        createdAt: string;
        _status?: ('draft' | 'published') | null;
      };
      postcode: string;
      state: string;
    };
    saleHistory: any[];
    format: {
      bedrooms: number;
      bathrooms: number;
      carSpaces: number;
    };
    internal: number;
    land: number;
    buildYear: number;
    images: any[];
    comparableSales: Array<{
      id: string;
      address: string;
      salePrice: number;
      link: string;
      heroImage: {
        id: number;
        alt: string;
        url: string;
        thumbnailURL: string | null;
        filename: string;
        mimeType: string;
        filesize: number;
        width: number;
        height: number;
        focalX: number;
        focalY: number;
        updatedAt: string;
        createdAt: string;
      };
    }>;
  };
  dueDiligence: {
    zoneData: Array<{
      id: string;
      type: string;
      effected: string;
      details: string;
      agentNotes: string | null;
      url: string | null;
      image: {
        id: number;
        alt: string;
        url: string;
        thumbnailURL: string | null;
        filename: string;
        mimeType: string;
        filesize: number;
        width: number;
        height: number;
        focalX: number;
        focalY: number;
        updatedAt: string;
        createdAt: string;
      };
    }>;
    propertyOccupancy: string;
    leaseExpiryDate: string;
    lastRentalIncrease: string;
    currentWeeklyRent: number;
  };
  valueProposition: {
    purchaseCost: {
      purchasePriceDisplay: string | null;
      loanTerm: number;
      loanAmountDisplay: string | null;
      interestRate: number;
      depositCash: number;
      equityRelease: number;
      equityReleaseInterestRate: number;
      depositTotalDisplay: string | null;
      depositPercentageDisplay: string | null;
      stampDuty: number;
      renovationsCost: number;
      buildingAndPest: number;
      conveyancing: number;
      bankFees: number;
      lendersMortgageInsurance: number;
      totalPurchaseCostDisplay: string | null;
    };
    annualExpenses: {
      councilRates: number;
      insuranceCosts: number;
      utilities: number;
      pmPercentage: number;
      pmFeesDisplay: string | null;
      repairsAndMaintenance: number;
      loanRepaymentsDisp: string | null;
      totalExpensesDisp: string | null;
    };
    expectedResults: {
      expectedWeeklyRent: number;
      annualGrossIncomeDisplay: string | null;
      annualGrossYieldDisplay: string | null;
      annualNetIncomeDisplay: string | null;
      annualNetYieldDisplay: string | null;
      depreciationPotential: number;
      equityAt8Display: string | null;
      equityAt10Display: string | null;
      equityAt12Display: string | null;
      equityAt16Display: string | null;
    };
  };
  updatedAt: string;
  createdAt: string;
}
