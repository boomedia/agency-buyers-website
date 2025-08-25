'use client'

import React from 'react'
import type { Region } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { getEmbedUrl } from '@/utilities/videoUtils'

interface RegionDetailsProps {
  region: Region
}

export function RegionDetails({ region }: RegionDetailsProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full sm:max-w-2xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{region.name}</h1>

          {/* Hero Image */}
          {region.heroImage && typeof region.heroImage === 'object' && (
            <div className="w-full h-64 lg:h-96 rounded-lg overflow-hidden">
              <Media resource={region.heroImage} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Description */}
        {region.description && (
          <Card>
            <CardHeader>
              <CardTitle>About {region.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <RichText data={region.description} enableGutter={false} />
            </CardContent>
          </Card>
        )}

        {/* Video */}
        {region.video && (
          <Card>
            <CardHeader>
              <CardTitle>Region Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video">
                <iframe
                  src={getEmbedUrl(region.video)}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={`${region.name} Video`}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Community & Economic Landscape */}
        {region.communityEconomicLandscape && region.communityEconomicLandscape.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Community & Economic Landscape</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {region.communityEconomicLandscape.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Full-width image at top if no icon */}
                    {!item.icon && item.image && typeof item.image === 'object' && (
                      <div className="w-full h-32 relative overflow-hidden">
                        <Media resource={item.image} fill className="object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon or Image */}
                        {item.icon && typeof item.icon === 'object' && (
                          <div className="w-16 h-16 flex-shrink-0 relative">
                            <Media resource={item.icon} fill className="object-contain" />
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>

                          {item.description && (
                            <div className="text-sm text-muted-foreground mb-3">
                              <RichText data={item.description} enableGutter={false} />
                            </div>
                          )}

                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-link hover:underline hover:text-link-hover"
                            >
                              Learn more
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Infrastructure & Future Development */}
        {region.infrastructureFutureDevelopment &&
          region.infrastructureFutureDevelopment.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure & Future Development</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {region.infrastructureFutureDevelopment.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Full-width image at top if no icon */}
                      {!item.icon && item.image && typeof item.image === 'object' && (
                        <div className="w-full h-32 relative overflow-hidden">
                          <Media resource={item.image} fill className="object-cover" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Icon or Image */}
                          {item.icon && typeof item.icon === 'object' && (
                            <div className="w-16 h-16 flex-shrink-0 relative">
                              <Media resource={item.icon} fill className="object-contain" />
                            </div>
                          )}

                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>

                            {item.description && (
                              <div className="text-sm text-muted-foreground mb-3">
                                <RichText data={item.description} enableGutter={false} />
                              </div>
                            )}

                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-link hover:underline hover:text-link-hover"
                              >
                                Learn more
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}
