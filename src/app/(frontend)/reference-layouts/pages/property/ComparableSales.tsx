import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import type { PropertyApiResponse } from '~/domains/property/types';
import { getImageUrl, formatPrice } from './utils';

interface ComparableSalesProps {
  property: PropertyApiResponse;
}

export const ComparableSales = ({ property }: ComparableSalesProps) => {
  const hasComparableSales = property.generalInformation.comparableSales.length > 0;

  if (hasComparableSales) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Comparable Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {property.generalInformation.comparableSales.map((sale: any) => (
              <a
                key={sale.id}
                href={sale.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow hover:border-primary cursor-pointer"
              >
                <img
                  src={getImageUrl(sale.heroImage.url)}
                  alt={sale.heroImage.alt}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2">
                  <h5 className="font-semibold text-sm mb-1">{sale.address}</h5>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-primary">{formatPrice(sale.salePrice)}</div>
                    <div className="inline-flex items-center gap-1 hover:text-primary text-xs font-medium transition-colors">
                      View Listing
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Comparable Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-2">
          <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">No comparable sales available</p>
        </div>
      </CardContent>
    </Card>
  );
};
