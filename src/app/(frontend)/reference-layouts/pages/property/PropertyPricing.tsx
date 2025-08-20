import { Card, CardContent } from '~/components/ui/card';
import type { PropertyApiResponse } from '~/domains/property/types';
import { formatPrice } from './utils';

interface PropertyPricingProps {
  property: PropertyApiResponse;
}

export const PropertyPricing = ({ property }: PropertyPricingProps) => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Purchase Price</div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(property.generalInformation.purchasePrice)}
            </div>
          </div>
          <div className="text-center text-2xl">|</div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Asking Price</div>
            <div className="text-xl font-semibold">
              {formatPrice(property.generalInformation.askingPrice)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
