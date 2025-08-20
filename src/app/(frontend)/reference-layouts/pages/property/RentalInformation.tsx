import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import type { PropertyApiResponse } from '~/domains/property/types';
import { formatDate } from './utils';

interface RentalInformationProps {
  property: PropertyApiResponse;
}

export const RentalInformation = ({ property }: RentalInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <div className="text-sm text-muted-foreground">Occupancy</div>
          <div className="font-semibold capitalize">
            {property.dueDiligence.propertyOccupancy}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Current Weekly Rent</div>
          <div className="font-semibold">
            ${property.dueDiligence.currentWeeklyRent}/week
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Lease Expiry</div>
          <div className="font-semibold">
            {formatDate(property.dueDiligence.leaseExpiryDate)}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Expected Weekly Rent</div>
          <div className="font-semibold">
            ${property.valueProposition.expectedResults.expectedWeeklyRent}/week
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
