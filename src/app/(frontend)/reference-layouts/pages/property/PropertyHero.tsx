import { Card } from '~/components/ui/card';
import type { PropertyApiResponse } from '~/domains/property/types';
import { getImageUrl } from './utils';

interface PropertyHeroProps {
  property: PropertyApiResponse;
  fullAddress: string;
}

export const PropertyHero = ({ property, fullAddress }: PropertyHeroProps) => {
  return (
    <>
      <h1 className="text-2xl md:text-4xl">{fullAddress}</h1>
      <Card className="overflow-hidden p-0">
        <div className="relative">
          {property.generalInformation.heroImage ? (
            <img
              src={getImageUrl(property.generalInformation.heroImage.url)}
              alt={property.generalInformation.heroImage.alt}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};
