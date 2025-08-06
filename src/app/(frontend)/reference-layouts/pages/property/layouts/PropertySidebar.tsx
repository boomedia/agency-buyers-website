import type { PropertyApiResponse } from '~/domains/property/types';
import { PropertyPresentation } from '../PropertyPresentation';
import { RentalInformation } from '../RentalInformation';
import { ComparableSales } from '../ComparableSales';

interface PropertySidebarProps {
  property: PropertyApiResponse;
  children?: React.ReactNode;
}

export const PropertySidebar = ({ property, children }: PropertySidebarProps) => {
  return (
    <div className="hidden lg:block space-y-4">
      <PropertyPresentation property={property} />
      
      <RentalInformation property={property} />

      <ComparableSales property={property} />
      
      {/* Additional sidebar content */}
      {children}
    </div>
  );
};
