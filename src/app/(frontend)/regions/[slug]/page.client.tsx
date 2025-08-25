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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {region.communityEconomicLandscape.map((item, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-lg">
                    {/* Icon or Image */}
                    {item.icon && typeof item.icon === 'object' && (
                      <div className="w-12 h-12">
                        <Media resource={item.icon} className="w-full h-full object-contain" />
                      </div>
                    )}
                    {!item.icon && item.image && typeof item.image === 'object' && (
                      <div className="w-full h-32 rounded overflow-hidden">
                        <Media resource={item.image} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <h3 className="font-semibold text-lg">{item.title}</h3>

                    {item.description && (
                      <div className="text-sm text-muted-foreground">
                        <RichText data={item.description} enableGutter={false} />
                      </div>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-link hover:underline hover:text-link-hover"
                      >
                        Learn more →
                      </a>
                    )}
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {region.infrastructureFutureDevelopment.map((item, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg">
                      {/* Icon or Image */}
                      {item.icon && typeof item.icon === 'object' && (
                        <div className="w-12 h-12">
                          <Media resource={item.icon} className="w-full h-full object-contain" />
                        </div>
                      )}
                      {!item.icon && item.image && typeof item.image === 'object' && (
                        <div className="w-full h-32 rounded overflow-hidden">
                          <Media resource={item.image} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <h3 className="font-semibold text-lg">{item.title}</h3>

                      {item.description && (
                        <div className="text-sm text-muted-foreground">
                          <RichText data={item.description} enableGutter={false} />
                        </div>
                      )}

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-link hover:underline hover:text-link-hover"
                        >
                          Learn more →
                        </a>
                      )}
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
