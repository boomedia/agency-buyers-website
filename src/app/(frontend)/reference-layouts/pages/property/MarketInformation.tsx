import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { SuburbMedianChart } from '~/components/ui/suburb-median-chart'
import type { PropertyApiResponse } from '~/domains/property/types'
import {
  getSuburbName,
  getRegionName,
  getSuburbImage,
  getRegionImage,
  getImageUrl,
  getEmbedUrl,
  renderRichText,
} from './utils'

interface MarketInformationProps {
  property: PropertyApiResponse
}

export function MarketInformation({ property }: MarketInformationProps) {
  // Extract suburb and region names safely
  const suburbName = getSuburbName(property.generalInformation.address.suburbName);
  const regionName = getRegionName(property.generalInformation.address.region);

  return (
    <Card className="pb-1">
      <CardHeader>
        <CardTitle>Market Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Suburb Information */}
          {suburbName && (
            <Sheet>
              <SheetTrigger asChild>
                <div className="block border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow hover:border-primary cursor-pointer">
                  <img
                    src={getSuburbImage(property.generalInformation.address.suburbName)}
                    alt={`${suburbName} suburb image`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-sm mb-1">Suburb</h5>
                        <div className="text-lg font-bold text-primary">{suburbName}</div>
                      </div>
                      <div className="inline-flex items-center gap-1 hover:text-primary text-xs font-medium transition-colors">
                        View Details
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
                <SheetHeader className="p-0 px-4 pt-4">
                  <SheetTitle className="font-semibold text-2xl">{suburbName} - <span className="uppercase">{property.generalInformation.address.state} {property.generalInformation.address.postcode}</span></SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Suburb Hero Image */}
                  {typeof property.generalInformation.address.suburbName === 'object' &&
                    property.generalInformation.address.suburbName?.heroImage && (
                      <div className="w-full">
                        <img
                          src={getImageUrl(property.generalInformation.address.suburbName.heroImage.url)}
                          alt={property.generalInformation.address.suburbName.heroImage.alt || `${suburbName} hero image`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                  {/* Suburb Description */}
                  {typeof property.generalInformation.address.suburbName === 'object' &&
                    property.generalInformation.address.suburbName?.description && (
                      <div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {typeof property.generalInformation.address.suburbName.description === 'string'
                            ? property.generalInformation.address.suburbName.description
                            : renderRichText(property.generalInformation.address.suburbName.description)
                          }
                        </div>
                      </div>
                    )}

                  {/* Suburb Median Value Chart - Only show if valid data exists */}
                  {typeof property.generalInformation.address.suburbName === 'object' &&
                    property.generalInformation.address.suburbName?.medianValueByYear &&
                    Array.isArray(property.generalInformation.address.suburbName.medianValueByYear) &&
                    property.generalInformation.address.suburbName.medianValueByYear.length > 0 &&
                    property.generalInformation.address.suburbName.medianValueByYear.some((yearData: any) =>
                      (yearData.medianValue && yearData.medianValue > 0) || (yearData.value && yearData.value > 0)
                    ) && (
                      <SuburbMedianChart
                        data={property.generalInformation.address.suburbName.medianValueByYear
                          .filter((yearData: any) => (yearData.medianValue && yearData.medianValue > 0) || (yearData.value && yearData.value > 0))
                          .map((yearData: any) => ({
                            year: yearData.year || '2024',
                            value: yearData.medianValue || yearData.value || 0
                          }))
                        }
                        suburbName={suburbName || 'Unknown Suburb'}
                      />
                    )}
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Region Information */}
          {regionName && (
            <Sheet>
              <SheetTrigger asChild>
                <div className="block border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow hover:border-primary cursor-pointer">
                  <img
                    src={getRegionImage(property.generalInformation.address.region)}
                    alt={`${regionName} region image`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-sm mb-1">Region</h5>
                        <div className="text-lg font-bold text-primary">{regionName}</div>
                      </div>
                      <div className="inline-flex items-center gap-1 hover:text-primary text-xs font-medium transition-colors">
                        View Details
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
                <SheetHeader className="p-0 px-4 pt-4">
                  <SheetTitle className="font-semibold text-2xl">{regionName} - <span className="uppercase">{property.generalInformation.address.state}</span></SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Region Hero Image */}
                  {typeof property.generalInformation.address.region === 'object' &&
                    property.generalInformation.address.region?.heroImage && (
                      <div className="w-full">
                        <img
                          src={getImageUrl(property.generalInformation.address.region.heroImage.url)}
                          alt={property.generalInformation.address.region.heroImage.alt || `${regionName} hero image`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                  {/* Region Description */}
                  {typeof property.generalInformation.address.region === 'object' &&
                    property.generalInformation.address.region?.description && (
                      <div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {typeof property.generalInformation.address.region.description === 'string'
                            ? property.generalInformation.address.region.description
                            : renderRichText(property.generalInformation.address.region.description)
                          }
                        </div>
                      </div>
                    )}

                  {/* Region Video - Using Property Presentation styling */}
                  {typeof property.generalInformation.address.region === 'object' &&
                    (property.generalInformation.address.region as any)?.video && (
                      <div>
                        <h4 className="font-semibold text-lg mb-3 border-b pb-2">Region Video</h4>
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:shadow-md hover:border-primary transition-all cursor-pointer">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold">Region Overview Video</div>
                                <div className="text-sm text-muted-foreground">Click to view video</div>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl overflow-hidden">
                            <DialogHeader>
                              <DialogTitle>{regionName} Overview</DialogTitle>
                            </DialogHeader>
                            <div className="w-full">
                              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                <iframe
                                  src={getEmbedUrl((property.generalInformation.address.region as any).video)}
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%'
                                  }}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>

                              {/* Fallback message and external link */}
                              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
                                <a
                                  href={(property.generalInformation.address.region as any).video}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  Open video in new tab
                                </a>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                  {/* Community & Economic Landscape */}
                  {typeof property.generalInformation.address.region === 'object' &&
                    (property.generalInformation.address.region as any)?.communityEconomicLandscape && (
                      <div>
                        <h4 className="font-semibold text-lg mb-3 border-b pb-2">Community & Economic Landscape</h4>
                        <div className="space-y-4">
                          {Array.isArray((property.generalInformation.address.region as any).communityEconomicLandscape) ? (
                            (property.generalInformation.address.region as any).communityEconomicLandscape.map((item: any, index: number) => (
                              <div key={index} className="border rounded-lg p-4 bg-muted/20">
                                {item.image && (
                                  <img
                                    src={getImageUrl(item.image.url)}
                                    alt={item.image.alt || item.title}
                                    className="w-full h-64 object-cover rounded-lg mb-3"
                                  />
                                )}
                                {!item.image && item.icon && (
                                  <div className="flex items-end gap-3 mb-3">
                                    <div className="flex-1">
                                      <h5 className="font-semibold mb-2">{item.title}</h5>
                                    </div>
                                    <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <img src={getImageUrl(item.icon.url)} alt={item.icon.alt || item.title} className="w-16 h-16" />
                                    </div>
                                  </div>
                                )}
                                {item.image && (
                                  <h5 className="font-semibold mb-2">{item.title}</h5>
                                )}
                                {item.description && (
                                  <div className="text-sm text-muted-foreground mb-3">
                                    {typeof item.description === 'string'
                                      ? item.description
                                      : renderRichText(item.description)
                                    }
                                  </div>
                                )}
                                {item.url && (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                                  >
                                    Learn More
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg">
                              Community & Economic information available but in non-standard format
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Infrastructure & Future Development */}
                  {typeof property.generalInformation.address.region === 'object' &&
                    (property.generalInformation.address.region as any)?.infrastructureFutureDevelopment && (
                      <div>
                        <h4 className="font-semibold text-lg mb-3 border-b pb-2">Infrastructure & Future Development</h4>
                        <div className="space-y-4">
                          {Array.isArray((property.generalInformation.address.region as any).infrastructureFutureDevelopment) ? (
                            (property.generalInformation.address.region as any).infrastructureFutureDevelopment.map((item: any, index: number) => (
                              <div key={index} className="border rounded-lg p-4 bg-muted/20">
                                {item.image && (
                                  <img
                                    src={getImageUrl(item.image.url)}
                                    alt={item.image.alt || item.title}
                                    className="w-full h-64 object-cover rounded-lg mb-3"
                                  />
                                )}
                                {!item.image && item.icon && (
                                  <div className="flex items-end gap-3 mb-3">
                                    <div className="flex-1">
                                      <h5 className="font-semibold mb-2">{item.title}</h5>
                                    </div>
                                    <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <img src={getImageUrl(item.icon.url)} alt={item.icon.alt || item.title} className="w-16 h-16" />
                                    </div>
                                  </div>
                                )}
                                {item.image && (
                                  <h5 className="font-semibold mb-2">{item.title}</h5>
                                )}
                                {item.description && (
                                  <div className="text-sm text-muted-foreground mb-3">
                                    {typeof item.description === 'string'
                                      ? item.description
                                      : renderRichText(item.description)
                                    }
                                  </div>
                                )}
                                {item.url && (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                                  >
                                    Learn More
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg">
                              Infrastructure & Development information available but in non-standard format
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Fallback for when neither suburb nor region is available */}
          {!suburbName && !regionName && (
            <div className="col-span-full text-center py-2">
              <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-muted-foreground text-sm">Market information not available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
