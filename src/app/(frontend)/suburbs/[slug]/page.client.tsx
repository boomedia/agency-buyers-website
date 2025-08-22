'use client'

import React from 'react'
import type { Suburb, Region } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

interface SuburbDetailsProps {
  suburb: Suburb
}

export function SuburbDetails({ suburb }: SuburbDetailsProps) {
  const region = suburb.region as Region

  // Prepare chart data for median values
  const chartData =
    suburb.medianValueByYear?.map((item) => ({
      year: item.year,
      value: item.medianValue,
    })) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full sm:max-w-2xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {region && (
              <>
                <span>{region.name}</span>
                <span>•</span>
              </>
            )}
            <span>Suburb</span>
          </div>

          <h1 className="text-4xl font-bold">{suburb.name}</h1>

          {/* Hero Image */}
          {suburb.heroImage && typeof suburb.heroImage === 'object' && (
            <div className="w-full h-64 lg:h-96 rounded-lg overflow-hidden">
              <Media resource={suburb.heroImage} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Key Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {region && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Region</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{region.name}</p>
              </CardContent>
            </Card>
          )}

          {suburb.vacancyRate !== null && suburb.vacancyRate !== undefined && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Vacancy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{suburb.vacancyRate}%</p>
              </CardContent>
            </Card>
          )}

          {chartData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Latest Median Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${chartData[chartData.length - 1]?.value?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {chartData[chartData.length - 1]?.year}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Description */}
        {suburb.description && (
          <Card>
            <CardHeader>
              <CardTitle>About {suburb.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <RichText data={suburb.description} enableGutter={false} />
            </CardContent>
          </Card>
        )}

        {/* Median Value Trends */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Median Value Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {chartData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border rounded"
                    >
                      <span className="font-medium">{item.year}</span>
                      <span className="text-lg font-semibold">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Region Information */}
        {region && (
          <Card>
            <CardHeader>
              <CardTitle>Region: {region.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {region.heroImage && typeof region.heroImage === 'object' && (
                <div className="w-full h-48 rounded overflow-hidden">
                  <Media resource={region.heroImage} className="w-full h-full object-cover" />
                </div>
              )}

              {region.description && (
                <div>
                  <RichText data={region.description} enableGutter={false} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
