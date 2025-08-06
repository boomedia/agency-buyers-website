import type { PropertyApiResponse } from '~/domains/property/types';
import { PropertyHero } from '../PropertyHero';
import { PropertyPricing } from '../PropertyPricing';
import { PropertyDetails } from '../PropertyDetails';
import { PropertyAgentSummary } from '../PropertyAgentSummary';
import { DueDiligence } from '../DueDiligence';
import { ValueProposition } from '../ValueProposition';
import { PropertyPresentation } from '../PropertyPresentation';
import { RentalInformation } from '../RentalInformation';
import { ComparableSales } from '../ComparableSales';

interface PropertyMainContentProps {
  property: PropertyApiResponse;
  fullAddress: string;
  children?: React.ReactNode;
}

export const PropertyMainContent = ({ property, fullAddress, children }: PropertyMainContentProps) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      <PropertyHero property={property} fullAddress={fullAddress} />
      
      <PropertyPricing property={property} />
      
      <PropertyDetails property={property} />
      
      <PropertyAgentSummary property={property} />
      
      {/* Mobile-only sidebar components - inserted between Agent Summary and Due Diligence */}
      <div className="lg:hidden space-y-4">
        <PropertyPresentation property={property} />
        <RentalInformation property={property} />
        <ComparableSales property={property} />
      </div>

      {/* Additional content passed as children */}
      {children}

      <DueDiligence property={property} />

      <ValueProposition property={property} />
    </div>
  );
};
