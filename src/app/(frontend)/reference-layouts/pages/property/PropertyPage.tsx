import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import type { PropertyApiResponse } from '~/domains/property/types'
import { 
  PropertyMainContent, 
  PropertySidebar,
  MarketInformation,
} from './index'

interface Props {
  property: PropertyApiResponse
}

export const PropertyPage= ({ property }: Props) => {
  const fullAddress = `${property.generalInformation.address.streetAddress}, ${property.generalInformation.address.postcode} ${property.generalInformation.address.state?.toUpperCase()}`;

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Mobile: Single column, Desktop: Grid with sidebar */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="lg:col-span-2 space-y-8">
          <PropertyMainContent property={property} fullAddress={fullAddress} />
          
          {/* Market Information */}
          <MarketInformation property={property} />
        </div>

        <PropertySidebar property={property} />
      </div>

      {/* Back to Home */}
      <div className="mt-8 pt-8 border-t">
        <Link to="/">
          <Button variant="outline">
            ← Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );

}
