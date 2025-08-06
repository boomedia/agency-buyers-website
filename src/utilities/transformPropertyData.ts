import type { Property as PayloadProperty } from '@/payload-types'
import type { Property as ClientProperty } from '~/types/payload-types'

// Transform Payload property data to match the client component interface
export function transformPropertyData(payloadProperty: PayloadProperty): ClientProperty {
  // Map the Payload property structure to the expected client structure
  return {
    id: typeof payloadProperty.id === 'string' ? parseInt(payloadProperty.id) : payloadProperty.id,
    name: payloadProperty.name,
    generalInformation: {
      heroImage: (payloadProperty as any).info?.heroImage || null,
      agentNotes: (payloadProperty as any).info?.agentNotes || [],
      agentSummary: (payloadProperty as any).info?.agentSummary || null,
      videoUrl: (payloadProperty as any).info?.videoUrl || null,
      purchasePrice: (payloadProperty as any).info?.purchasePrice || 0,
      askingPrice: (payloadProperty as any).info?.askingPrice || 0,
      address: {
        streetAddress: (payloadProperty as any).info?.addr?.streetAddress || '',
        suburbName: (payloadProperty as any).info?.addr?.suburbName || null,
        region: (payloadProperty as any).info?.addr?.region || null,
        postcode: (payloadProperty as any).info?.addr?.postcode || '',
        state: (payloadProperty as any).info?.addr?.state || '',
      },
      saleHistory: (payloadProperty as any).info?.saleHistory || [],
      format: {
        bedrooms: (payloadProperty as any).info?.format?.bedrooms || 0,
        bathrooms: (payloadProperty as any).info?.format?.bathrooms || 0,
        carSpaces: (payloadProperty as any).info?.format?.carSpaces || 0,
      },
      internal: (payloadProperty as any).info?.internal || 0,
      land: (payloadProperty as any).info?.land || 0,
      buildYear: (payloadProperty as any).info?.buildYear || 0,
      images: (payloadProperty as any).info?.images || [],
      comparableSales: (payloadProperty as any).info?.comparableSales || [],
    },
    dueDiligence: {
      zoneData: (payloadProperty as any).dueDiligence?.zoneData || [],
      propertyOccupancy: (payloadProperty as any).dueDiligence?.propertyOccupancy || '',
      leaseExpiryDate: (payloadProperty as any).dueDiligence?.leaseExpiryDate || '',
      lastRentalIncrease: (payloadProperty as any).dueDiligence?.lastRentalIncrease || '',
      currentWeeklyRent: (payloadProperty as any).dueDiligence?.currentWeeklyRent || 0,
    },
    valueProposition: {
      purchaseCost: {
        purchasePriceDisplay:
          (payloadProperty as any).valProp?.purchaseCost?.purchasePriceDisplay || null,
        loanTerm: (payloadProperty as any).valProp?.purchaseCost?.loanTerm || 0,
        loanAmountDisplay:
          (payloadProperty as any).valProp?.purchaseCost?.loanAmountDisplay || null,
        interestRate: (payloadProperty as any).valProp?.purchaseCost?.interestRate || 0,
        depositCash: (payloadProperty as any).valProp?.purchaseCost?.depositCash || 0,
        equityRelease: (payloadProperty as any).valProp?.purchaseCost?.equityRelease || 0,
        equityReleaseInterestRate:
          (payloadProperty as any).valProp?.purchaseCost?.equityReleaseInterestRate || 0,
        depositTotalDisplay:
          (payloadProperty as any).valProp?.purchaseCost?.depositTotalDisplay || null,
        depositPercentageDisplay:
          (payloadProperty as any).valProp?.purchaseCost?.depositPercentageDisplay || null,
        stampDuty: (payloadProperty as any).valProp?.purchaseCost?.stampDuty || 0,
        renovationsCost: (payloadProperty as any).valProp?.purchaseCost?.renovationsCost || 0,
        buildingAndPest: (payloadProperty as any).valProp?.purchaseCost?.buildingAndPest || 0,
        conveyancing: (payloadProperty as any).valProp?.purchaseCost?.conveyancing || 0,
        bankFees: (payloadProperty as any).valProp?.purchaseCost?.bankFees || 0,
        lendersMortgageInsurance:
          (payloadProperty as any).valProp?.purchaseCost?.lendersMortgageInsurance || 0,
        totalPurchaseCostDisplay:
          (payloadProperty as any).valProp?.purchaseCost?.totalPurchaseCostDisplay || null,
      },
      annualExpenses: {
        councilRates: (payloadProperty as any).valProp?.annualExpenses?.councilRates || 0,
        insuranceCosts: (payloadProperty as any).valProp?.annualExpenses?.insuranceCosts || 0,
        utilities: (payloadProperty as any).valProp?.annualExpenses?.utilities || 0,
        pmPercentage: (payloadProperty as any).valProp?.annualExpenses?.pmPercentage || 0,
        pmFeesDisplay: (payloadProperty as any).valProp?.annualExpenses?.pmFeesDisplay || null,
        repairsAndMaintenance:
          (payloadProperty as any).valProp?.annualExpenses?.repairsAndMaintenance || 0,
        loanRepaymentsDisp:
          (payloadProperty as any).valProp?.annualExpenses?.loanRepaymentsDisp || null,
        totalExpensesDisp:
          (payloadProperty as any).valProp?.annualExpenses?.totalExpensesDisp || null,
      },
      expectedResults: {
        expectedWeeklyRent:
          (payloadProperty as any).valProp?.expectedResults?.expectedWeeklyRent || 0,
        annualGrossIncomeDisplay:
          (payloadProperty as any).valProp?.expectedResults?.annualGrossIncomeDisplay || null,
        annualGrossYieldDisplay:
          (payloadProperty as any).valProp?.expectedResults?.annualGrossYieldDisplay || null,
        annualNetIncomeDisplay:
          (payloadProperty as any).valProp?.expectedResults?.annualNetIncomeDisplay || null,
        annualNetYieldDisplay:
          (payloadProperty as any).valProp?.expectedResults?.annualNetYieldDisplay || null,
        depreciationPotential:
          (payloadProperty as any).valProp?.expectedResults?.depreciationPotential || 0,
        equityAt8Display:
          (payloadProperty as any).valProp?.expectedResults?.equityAt8Display || null,
        equityAt10Display:
          (payloadProperty as any).valProp?.expectedResults?.equityAt10Display || null,
        equityAt12Display:
          (payloadProperty as any).valProp?.expectedResults?.equityAt12Display || null,
        equityAt16Display:
          (payloadProperty as any).valProp?.expectedResults?.equityAt16Display || null,
      },
    },
    updatedAt: payloadProperty.updatedAt,
    createdAt: payloadProperty.createdAt,
  }
}
