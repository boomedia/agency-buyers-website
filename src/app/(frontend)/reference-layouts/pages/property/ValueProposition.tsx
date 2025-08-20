import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import type { PropertyApiResponse } from '~/domains/property/types';
import { 
  formatPrice, 
  calculateLoanAmount, 
  calculateLoanRepayments,
  calculateDepositPercentage,
  calculateTotalPurchaseCost,
  calculateTotalAnnualExpenses,
  calculateAnnualGrossIncome,
  calculateAnnualGrossYield,
  calculateAnnualNetIncome,
  calculateAnnualNetYield,
  calculateEquityAt8,
  calculateEquityAt10,
  calculateEquityAt12,
  calculateEquityAt16
} from './utils';

interface ValuePropositionProps {
  property: PropertyApiResponse;
}

export const ValueProposition = ({ property }: ValuePropositionProps) => {
  return (
    <Card className="pb-1">
      <CardHeader>
        <CardTitle>Value Proposition</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Tabs defaultValue="purchase-costs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-chart-5/20 dark:bg-background h-12 sm:">
            <TabsTrigger value="purchase-costs" className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap text-center leading-tight">
              Purchase Costs
            </TabsTrigger>
            <TabsTrigger value="annual-expenses" className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap text-center leading-tight">
              Annual Expenses
            </TabsTrigger>
            <TabsTrigger value="expected-results" className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap text-center leading-tight">
              Expected Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchase-costs" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Purchase Price:</span>
                  <span>{property.valueProposition.purchaseCost.purchasePriceDisplay || formatPrice(property.generalInformation.purchasePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Loan Amount:</span>
                  <span>{property.valueProposition.purchaseCost.loanAmountDisplay || formatPrice(calculateLoanAmount(property))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Loan Term:</span>
                  <span>{property.valueProposition.purchaseCost.loanTerm} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Interest Rate:</span>
                  <span>{property.valueProposition.purchaseCost.interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Deposit Cash:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.depositCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Equity Release:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.equityRelease)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Equity Release Rate:</span>
                  <span>{property.valueProposition.purchaseCost.equityReleaseInterestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Total Deposit:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.depositCash + property.valueProposition.purchaseCost.equityRelease)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Deposit Percentage:</span>
                  <span>{calculateDepositPercentage(property)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Stamp Duty:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.stampDuty)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Renovations:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.renovationsCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Building & Pest:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.buildingAndPest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Conveyancing:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.conveyancing)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Bank Fees:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.bankFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">LMI:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.lendersMortgageInsurance)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span className="text-muted-foreground block">Total Purchase Cost:</span>
                  <span>{formatPrice(calculateTotalPurchaseCost(property))}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="annual-expenses" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Council Rates:</span>
                  <span>{formatPrice(property.valueProposition.annualExpenses.councilRates)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Insurance:</span>
                  <span>{formatPrice(property.valueProposition.annualExpenses.insuranceCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Utilities:</span>
                  <span>{formatPrice(property.valueProposition.annualExpenses.utilities)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Property Management:</span>
                  <span>{property.valueProposition.annualExpenses.pmPercentage}% / {formatPrice(property.valueProposition.annualExpenses.pmPercentage / 100 * property.valueProposition.expectedResults.expectedWeeklyRent * 52)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Repairs & Maintenance:</span>
                  <span>{formatPrice(property.valueProposition.annualExpenses.repairsAndMaintenance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Loan Repayments:</span>
                  <span>{formatPrice(calculateLoanRepayments(property))}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span className="text-muted-foreground block">Total Annual Expenses:</span>
                  <span>{formatPrice(calculateTotalAnnualExpenses(property))}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expected-results" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Expected Weekly Rent:</span>
                  <span>${property.valueProposition.expectedResults.expectedWeeklyRent}/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Annual Gross Income:</span>
                  <span>{formatPrice(calculateAnnualGrossIncome(property))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Annual Gross Yield:</span>
                  <span>{calculateAnnualGrossYield(property)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Annual Net Income:</span>
                  <span>{formatPrice(calculateAnnualNetIncome(property))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Annual Net Yield:</span>
                  <span>{calculateAnnualNetYield(property)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Weekly Cash Flow:</span>
                  <span>${(calculateAnnualNetIncome(property) / 52).toFixed(2)}/week</span>
                </div>
              </div>

              {/* Equity Projections */}
              <div className="mt-4">
                <h5 className="font-medium mb-3 text-muted-foreground">Equity Projections</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground block">8% Growth:</span>
                    <span>{formatPrice(calculateEquityAt8(property))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground block">10% Growth:</span>
                    <span>{formatPrice(calculateEquityAt10(property))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground block">12% Growth:</span>
                    <span>{formatPrice(calculateEquityAt12(property))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground block">16% Growth:</span>
                    <span>{formatPrice(calculateEquityAt16(property))}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
