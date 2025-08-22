'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { SuburbMedianChart } from '~/components/ui/suburb-median-chart'
import RichText from '~/components/RichText'
import type { Property } from '~/types/payload-types'
import {
  calculateAllPropertyMetrics,
  calculateLoanAmount,
  calculateDepositTotal,
  calculateDepositPercentage,
  formatAsCurrency,
  formatAsPercentage,
} from '~/utilities/propertyCalculations'

interface EnhancedPropertyDetailsProps {
  property: Property
}

// Utility functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'N/A'

  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Legacy calculation functions for backwards compatibility
// These now use the utility module functions
const calculateLoanAmount_legacy = (property: Property) => {
  return calculateLoanAmount(property)
}

const calculateDepositTotal_legacy = (property: Property) => {
  return calculateDepositTotal(property)
}

const calculateDepositPercentage_legacy = (property: Property) => {
  return calculateDepositPercentage(property)
}

const calculateTotalPurchaseCost = (property: Property) => {
  const purchasePrice = property.generalInformation.purchasePrice || 0
  const stampDuty = property.valueProposition.purchaseCost.stampDuty || 0
  const renovationsCost = property.valueProposition.purchaseCost.renovationsCost || 0
  const buildingAndPest = property.valueProposition.purchaseCost.buildingAndPest || 0
  const conveyancing = property.valueProposition.purchaseCost.conveyancing || 0
  const bankFees = property.valueProposition.purchaseCost.bankFees || 0
  const lendersMortgageInsurance =
    property.valueProposition.purchaseCost.lendersMortgageInsurance || 0
  const loanTerm = property.valueProposition.purchaseCost.loanTerm || 0

  const lmiAnnual = loanTerm && lendersMortgageInsurance ? lendersMortgageInsurance / loanTerm : 0

  return (
    purchasePrice +
    stampDuty +
    renovationsCost +
    buildingAndPest +
    conveyancing +
    bankFees +
    lmiAnnual
  )
}

const getImageUrl = (url: string) => {
  if (!url) return ''
  return url.startsWith('http') ? url : url
}

// Error handling for image loading
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
  // Show a fallback or placeholder
}

// Location utility functions for Market Information
const getSuburbName = (suburb: string | null | { name: string } | undefined): string | null => {
  if (!suburb) return null
  if (typeof suburb === 'string') return suburb
  if (typeof suburb === 'object' && 'name' in suburb) return suburb.name
  return null
}

const getRegionName = (region: string | null | { name: string } | undefined): string | null => {
  if (!region) return null
  if (typeof region === 'string') return region
  if (typeof region === 'object' && 'name' in region) return region.name
  return null
}

const getSuburbImage = (
  suburb: string | null | { heroImage?: { url: string } } | undefined,
): string => {
  if (!suburb) return '/img/generic-suburb.webp'
  if (typeof suburb === 'string') return '/img/generic-suburb.webp'
  if (typeof suburb === 'object' && suburb.heroImage?.url) {
    return getImageUrl(suburb.heroImage.url)
  }
  return '/img/generic-suburb.webp'
}

const getRegionImage = (
  region: string | null | { heroImage?: { url: string } } | undefined,
): string => {
  if (!region) return '/img/generic-region.webp'
  if (typeof region === 'string') return '/img/generic-region.webp'
  if (typeof region === 'object' && region.heroImage?.url) {
    return getImageUrl(region.heroImage.url)
  }
  return '/img/generic-region.webp'
}

// Safe rich text renderer using Payload's RichText component
const safeRenderRichText = (
  content: any,
  fallbackText: string = 'No content available',
): React.ReactNode => {
  // Handle null, undefined, or empty values
  if (!content) {
    return fallbackText
  }

  // Handle simple string content
  if (typeof content === 'string') {
    return content
  }

  // Handle non-object content
  if (typeof content !== 'object') {
    return String(content)
  }

  // Check if it's a proper Lexical editor state
  if (content.root && content.root.children && Array.isArray(content.root.children)) {
    try {
      return <RichText data={content} enableGutter={false} enableProse={false} />
    } catch (error) {
      console.error('Error rendering rich text with RichText component:', error)
      return fallbackText
    }
  }

  // If it's an object but not in Lexical format, try to extract meaningful content
  if (content.text) {
    return content.text
  }
  if (content.content) {
    // Recursively call with improved validation for nested content
    if (content.content && typeof content.content === 'object') {
      if (
        content.content.root &&
        typeof content.content.root === 'object' &&
        content.content.root.children &&
        Array.isArray(content.content.root.children)
      ) {
        try {
          return <RichText data={content.content} enableGutter={false} enableProse={false} />
        } catch (error) {
          console.error('Error rendering nested rich text:', error)
          return fallbackText
        }
      }
      return String(content.content)
    }
    return String(content.content)
  }

  console.warn('Invalid rich text format:', content)
  return fallbackText
}

const getEmbedUrl = (url: string) => {
  if (!url) return ''

  // Handle YouTube URLs
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  // Handle Vimeo URLs
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url
  }

  return url
}

// Property Hero Component
const PropertyHero = ({ property, fullAddress }: { property: Property; fullAddress: string }) => {
  return (
    <>
      <h1 className="text-2xl md:text-4xl mb-4">{fullAddress}</h1>
      <Card className="overflow-hidden p-0 mb-4">
        <div className="relative">
          {property.generalInformation.heroImage && property.generalInformation.heroImage.url ? (
            <img
              src={getImageUrl(property.generalInformation.heroImage.url)}
              alt={property.generalInformation.heroImage.alt || property.name}
              className="w-full h-96 object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-lg">No image available</span>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}

// Property Pricing Component
const PropertyPricing = ({ property }: { property: Property }) => {
  return (
    <Card className="border-none shadow-none bg-transparent mb-4">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Purchase Price</div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(property.generalInformation.purchasePrice)}
            </div>
          </div>
          <div className="text-center text-2xl">|</div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Asking Price</div>
            <div className="text-xl font-semibold">
              {formatPrice(property.generalInformation.askingPrice)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Property Details Component
const PropertyDetails = ({ property }: { property: Property }) => {
  const PropertyDetailItem = ({
    icon,
    value,
    label,
  }: {
    icon: React.ReactNode
    value: string | number | null
    label: string
  }) => (
    <div className="flex items-center gap-2 md:gap-4 py-1 md:py-0 px-1 md:px-2 border-0 md:border rounded-lg bg-card hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <div className="w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-sm md:text-lg text-foreground">
          {value ?? 'N/A'}{' '}
          <span className="text-sm text-muted-foreground hidden md:inline">{label}</span>
        </div>
      </div>
    </div>
  )

  const details = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 md:w-6 md:h-6 text-primary"
        >
          <path d="M2 4v16" />
          <path d="M2 8h18a2 2 0 0 1 2 2v10" />
          <path d="M2 17h20" />
          <path d="M6 8v9" />
        </svg>
      ),
      value: property.generalInformation.format.bedrooms,
      label: 'Bedrooms',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 md:w-6 md:h-6 text-primary"
        >
          <path d="M10 4 8 6" />
          <path d="M17 19v2" />
          <path d="M2 12h20" />
          <path d="M7 19v2" />
          <path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
        </svg>
      ),
      value: property.generalInformation.format.bathrooms,
      label: 'Bathrooms',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 md:w-6 md:h-6 text-primary"
        >
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
      value: property.generalInformation.format.carSpaces,
      label: 'Car Spaces',
    },
    {
      icon: (
        <svg
          className="w-4 h-4 md:w-6 md:h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      value: property.generalInformation.buildYear,
      label: 'Built',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 md:w-6 md:h-6 text-primary"
        >
          <path d="m12 8 6-3-6-3v10" />
          <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12" />
          <path d="m6.49 12.85 11.02 6.3" />
          <path d="M17.51 12.85 6.5 19.15" />
        </svg>
      ),
      value: property.generalInformation.land ? `${property.generalInformation.land} m²` : null,
      label: 'Land Size',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 md:w-6 md:h-6 text-primary"
        >
          <path d="M12 15v-3.014" />
          <path d="M16 15v-3.014" />
          <path d="M20 6H4" />
          <path d="M20 8V4" />
          <path d="M4 8V4" />
          <path d="M8 15v-3.014" />
          <rect x="3" y="12" width="18" height="7" rx="1" />
        </svg>
      ),
      value: property.generalInformation.internal
        ? `${property.generalInformation.internal} m²`
        : null,
      label: 'Internal Size',
    },
  ]

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-0.5 md:gap-6 pt-6">
          {details.map((detail, index) => (
            <PropertyDetailItem
              key={index}
              icon={detail.icon}
              value={detail.value}
              label={detail.label}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// PropertyAgentSummary Component
function PropertyAgentSummary({ property }: { property: Property }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {(() => {
            const agentSummary = property.generalInformation.agentSummary

            if (!agentSummary) {
              return <p className="text-muted-foreground">No agent summary available</p>
            }

            if (typeof agentSummary === 'string') {
              return <p>{agentSummary}</p>
            } else if (agentSummary && typeof agentSummary === 'object') {
              // More robust validation for Lexical editor state
              if (
                agentSummary.root &&
                typeof agentSummary.root === 'object' &&
                agentSummary.root.children &&
                Array.isArray(agentSummary.root.children) &&
                agentSummary.root.children.length >= 0 // Allow empty arrays
              ) {
                try {
                  return <RichText data={agentSummary} enableGutter={false} enableProse={true} />
                } catch (error) {
                  console.error('Error rendering agent summary with RichText:', error)
                  return <p className="text-muted-foreground">Agent summary format not supported</p>
                }
              } else {
                // Try to extract text content if it's not a proper Lexical format
                console.warn('Invalid Lexical format for agent summary:', agentSummary)
                return <p className="text-muted-foreground">Agent summary not available</p>
              }
            }
            return <p className="text-muted-foreground">No agent summary available</p>
          })()}
        </div>
      </CardContent>
    </Card>
  )
}

// PropertyPresentation Component
function PropertyPresentation({ property }: { property: Property }) {
  if (!property.generalInformation.videoUrl) {
    return null
  }

  const videoUrl = property.generalInformation.videoUrl || ''

  return (
    <Card>
      <CardContent className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:shadow-md hover:border-primary transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Your Presentation</div>
                <div className="text-sm text-muted-foreground">Click to view video</div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-6xl overflow-hidden">
            <DialogHeader>
              <DialogTitle>Property Presentation</DialogTitle>
            </DialogHeader>
            <div className="w-full">
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={getEmbedUrl(videoUrl)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => {
                    console.warn('Video iframe failed to load, likely due to X-Frame-Options')
                  }}
                />
              </div>

              {/* Fallback message and external link */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-link hover:text-link-hover font-medium text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open video in new tab
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// RentalInformation Component
function RentalInformation({ property }: { property: Property }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Current Rent</span>
          <span className="font-semibold">${property.dueDiligence.currentWeeklyRent}/week</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Expected Rent</span>
          <span className="font-semibold text-primary">
            ${property.valueProposition.expectedResults.expectedWeeklyRent}/week
          </span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Occupancy</span>
            <div
              className={`inline-flex px-3 py-1 rounded text-xs font-semibold ${
                property.dueDiligence.propertyOccupancy === 'occupied'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {property.dueDiligence.propertyOccupancy.charAt(0).toUpperCase() +
                property.dueDiligence.propertyOccupancy.slice(1)}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Lease Expiry</span>
            <span className="font-semibold">
              {formatDate(property.dueDiligence.leaseExpiryDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ComparableSales Component
function ComparableSales({ property }: { property: Property }) {
  if (
    !property.generalInformation.comparableSales ||
    property.generalInformation.comparableSales.length === 0
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparable Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">No comparable sales available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparable Sales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {property.generalInformation.comparableSales.map((sale: any) => (
          <a
            key={sale.id}
            href={sale.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow hover:border-primary cursor-pointer"
          >
            {sale.heroImage && sale.heroImage.url ? (
              <img
                src={getImageUrl(sale.heroImage.url)}
                alt={sale.heroImage.alt || sale.address}
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
            <div className="p-3">
              <h5 className="font-semibold text-sm mb-1">{sale.address}</h5>
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold text-primary">{formatPrice(sale.salePrice)}</div>
                {sale.comparison && (
                  <div
                    className={`text-xs px-2 py-1 rounded font-medium capitalize ${
                      sale.comparison === 'superior'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : sale.comparison === 'similar'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : sale.comparison === 'inferior'
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {sale.comparison}
                  </div>
                )}
              </div>
              <div className="text-primary hover:text-primary/80 text-xs font-medium">
                View Listing →
              </div>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  )
}

// DueDiligence Component
function DueDiligence({ property }: { property: Property }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Due Diligence</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {property.dueDiligence.zoneData.map((zone: any) => (
            <AccordionItem key={zone.id} value={zone.id}>
              <AccordionTrigger className="text-left">
                <div className="flex justify-between items-center w-full mr-4">
                  <div className="font-medium capitalize">{zone.type}</div>
                  <div
                    className={`text-xs px-2 py-1 rounded capitalize ${
                      zone.effected === 'yes'
                        ? 'bg-destructive/20 text-destructive'
                        : zone.effected === 'no'
                          ? 'bg-primary/10 text-primary'
                          : zone.effected === 'partial'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {zone.effected}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {zone.image && zone.image.url ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={getImageUrl(zone.image.url)}
                          alt={zone.image.alt || zone.type}
                          className="w-full h-48 object-cover rounded mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl overflow-hidden">
                        <DialogHeader>
                          <DialogTitle className="capitalize">
                            {zone.type} - Zone Information
                          </DialogTitle>
                        </DialogHeader>
                        <div className="w-full">
                          <img
                            src={getImageUrl(zone.image.url)}
                            alt={zone.image.alt || zone.type}
                            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="w-full h-48 bg-muted rounded flex items-center justify-center mb-3">
                      <span className="text-muted-foreground text-sm">No image available</span>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {(() => {
                      const details = zone.details

                      if (typeof details === 'string') {
                        return details
                      } else if (details && typeof details === 'object') {
                        // More robust validation for Lexical editor state
                        if (
                          details.root &&
                          typeof details.root === 'object' &&
                          details.root.children &&
                          Array.isArray(details.root.children) &&
                          details.root.children.length >= 0 // Allow empty arrays
                        ) {
                          try {
                            return (
                              <RichText data={details} enableGutter={false} enableProse={false} />
                            )
                          } catch (error) {
                            console.error('Error rendering zone details with RichText:', error)
                            return 'Details format not supported'
                          }
                        } else {
                          // Try to extract text content if it's not a proper Lexical format
                          console.warn('Invalid Lexical format for zone details:', details)
                          return 'Details not available'
                        }
                      }
                      return 'No details available'
                    })()}
                  </div>
                  {zone.url && (
                    <a
                      href={zone.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:text-primary text-sm font-medium transition-colors text-primary/80"
                    >
                      More Information &nbsp;
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

// ValueProposition Component
function ValueProposition({ property }: { property: Property }) {
  // Calculate all metrics using our utility functions
  const metrics = calculateAllPropertyMetrics(property)

  return (
    <Card className="pb-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Value Proposition</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Tabs defaultValue="purchase-costs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted h-12">
            <TabsTrigger
              value="purchase-costs"
              className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap text-center leading-tight"
            >
              Purchase Costs
            </TabsTrigger>
            <TabsTrigger
              value="annual-expenses"
              className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap text-center leading-tight"
            >
              Annual Expenses
            </TabsTrigger>
            <TabsTrigger
              value="expected-results"
              className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap text-center leading-tight"
            >
              Expected Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchase-costs" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Purchase Price:</span>
                  <span>{formatPrice(property.generalInformation.purchasePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Loan Amount:</span>
                  <span>{formatPrice(calculateLoanAmount(property))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Loan Term:</span>
                  <span>{property.valueProposition.purchaseCost.loanTerm} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Interest Rate:</span>
                  <span>{property.valueProposition.purchaseCost.interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Deposit Cash:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.depositCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Equity Release:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.equityRelease)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Equity Release Rate:</span>
                  <span>{property.valueProposition.purchaseCost.equityReleaseInterestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Total Deposit:</span>
                  <span>{formatPrice(calculateDepositTotal(property))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Deposit Percentage:</span>
                  <span>{calculateDepositPercentage(property).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Stamp Duty:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.stampDuty)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Renovations:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.renovationsCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Building & Pest:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.buildingAndPest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Conveyancing:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.conveyancing)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Bank Fees:</span>
                  <span>{formatPrice(property.valueProposition.purchaseCost.bankFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground block">Lenders Mortgage Insurance:</span>
                  <span>
                    {formatPrice(property.valueProposition.purchaseCost.lendersMortgageInsurance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Total Purchase Cost:</span>
                  <span>{formatPrice(calculateTotalPurchaseCost(property))}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="annual-expenses" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Council Rates:</span>
                  <span>{formatPrice(property.valueProposition.annualExpenses.councilRates)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Insurance:</span>
                  <span>
                    {formatPrice(property.valueProposition.annualExpenses.insuranceCosts)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Utilities:</span>
                  <span>{formatPrice(property.valueProposition.annualExpenses.utilities)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Property Management:</span>
                  <span>{property.valueProposition.annualExpenses.pmPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Repairs & Maintenance:</span>
                  <span>
                    {formatPrice(property.valueProposition.annualExpenses.repairsAndMaintenance)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expected-results" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Expected Weekly Rent:</span>
                  <span>${property.valueProposition.expectedResults.expectedWeeklyRent}/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Annual Gross Income:</span>
                  <span>
                    {property.valueProposition.expectedResults.annualGrossIncomeDisplay ||
                      metrics.formatted.annualGrossIncome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Annual Gross Yield:</span>
                  <span>
                    {property.valueProposition.expectedResults.annualGrossYieldDisplay ||
                      metrics.formatted.annualGrossYield}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Annual Net Income:</span>
                  <span>
                    {property.valueProposition.expectedResults.annualNetIncomeDisplay ||
                      metrics.formatted.annualNetIncome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Annual Net Yield:</span>
                  <span>
                    {property.valueProposition.expectedResults.annualNetYieldDisplay ||
                      metrics.formatted.annualNetYield}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Weekly Cash Flow:</span>
                  <span>${(metrics.annualNetIncome / 52).toFixed(2)}/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 block">Depreciation Potential:</span>
                  <span>
                    {formatPrice(property.valueProposition.expectedResults.depreciationPotential)}
                  </span>
                </div>
              </div>

              {/* Equity Projections */}
              <div className="border-t pt-4">
                <h5 className="font-medium mb-3 text-gray-600">Equity Projections</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 block">8% Growth:</span>
                    <span>
                      {property.valueProposition.expectedResults.equityAt8Display ||
                        metrics.formatted.equityAt8}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 block">10% Growth:</span>
                    <span>
                      {property.valueProposition.expectedResults.equityAt10Display ||
                        metrics.formatted.equityAt10}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 block">12% Growth:</span>
                    <span>
                      {property.valueProposition.expectedResults.equityAt12Display ||
                        metrics.formatted.equityAt12}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 block">16% Growth:</span>
                    <span>
                      {property.valueProposition.expectedResults.equityAt16Display ||
                        metrics.formatted.equityAt16}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Market Information Component
const MarketInformation = ({ property }: { property: Property }) => {
  const suburbName = getSuburbName(property.generalInformation.address.suburbName)
  const regionName = getRegionName(property.generalInformation.address.region)

  if (!suburbName && !regionName) {
    return null
  }

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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
                <SheetHeader className="p-0 px-4 pt-4">
                  <SheetTitle className="font-semibold text-2xl">
                    {suburbName} -{' '}
                    <span className="uppercase">
                      {property.generalInformation.address.state}{' '}
                      {property.generalInformation.address.postcode}
                    </span>
                  </SheetTitle>
                  <SheetDescription className="px-4 text-sm text-muted-foreground">
                    Detailed information about {suburbName} including market data, vacancy rates,
                    and property insights.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Suburb Hero Image */}
                  {typeof property.generalInformation.address.suburbName === 'object' &&
                    (property.generalInformation.address.suburbName as any)?.heroImage && (
                      <div className="w-full">
                        <img
                          src={getImageUrl(
                            (property.generalInformation.address.suburbName as any).heroImage.url,
                          )}
                          alt={
                            (property.generalInformation.address.suburbName as any).heroImage.alt ||
                            `${suburbName} hero image`
                          }
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                  {/* Suburb Description */}
                  {typeof property.generalInformation.address.suburbName === 'object' &&
                    (property.generalInformation.address.suburbName as any)?.description && (
                      <div>
                        <h4 className="font-semibold text-base mb-2">About {suburbName}</h4>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {(() => {
                            const description = (
                              property.generalInformation.address.suburbName as any
                            ).description

                            if (typeof description === 'string') {
                              return description
                            } else if (description && typeof description === 'object') {
                              // More robust validation for Lexical editor state
                              if (
                                description.root &&
                                typeof description.root === 'object' &&
                                description.root.children &&
                                Array.isArray(description.root.children) &&
                                description.root.children.length >= 0 // Allow empty arrays
                              ) {
                                try {
                                  return (
                                    <RichText
                                      data={description}
                                      enableGutter={false}
                                      enableProse={false}
                                    />
                                  )
                                } catch (error) {
                                  console.error(
                                    'Error rendering suburb description with RichText:',
                                    error,
                                  )
                                  return 'Description format not supported'
                                }
                              } else {
                                // Try to extract text content if it's not a proper Lexical format
                                console.warn(
                                  'Invalid Lexical format for suburb description:',
                                  description,
                                )
                                return 'Description not available'
                              }
                            }
                            return 'Description not available'
                          })()}
                        </div>
                      </div>
                    )}

                  {/* Suburb Vacancy Rate */}
                  {typeof property.generalInformation.address.suburbName === 'object' &&
                    (property.generalInformation.address.suburbName as any)?.vacancyRate !==
                      undefined &&
                    (property.generalInformation.address.suburbName as any)?.vacancyRate !==
                      null && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-muted-foreground">
                              Vacancy Rate
                            </div>
                            <div className="text-lg font-bold text-primary">
                              {(property.generalInformation.address.suburbName as any).vacancyRate}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Suburb Median Chart */}
                  {typeof property.generalInformation.address.suburbName === 'object' &&
                    (property.generalInformation.address.suburbName as any)?.medianValueByYear &&
                    Array.isArray(
                      (property.generalInformation.address.suburbName as any).medianValueByYear,
                    ) &&
                    (property.generalInformation.address.suburbName as any).medianValueByYear
                      .length > 0 &&
                    (property.generalInformation.address.suburbName as any).medianValueByYear.some(
                      (yearData: any) =>
                        (yearData.medianValue && yearData.medianValue > 0) ||
                        (yearData.value && yearData.value > 0),
                    ) && (
                      <SuburbMedianChart
                        data={(
                          property.generalInformation.address.suburbName as any
                        ).medianValueByYear
                          .filter(
                            (yearData: any) =>
                              (yearData.medianValue && yearData.medianValue > 0) ||
                              (yearData.value && yearData.value > 0),
                          )
                          .map((yearData: any) => ({
                            year: yearData.year || '2024',
                            value: yearData.medianValue || yearData.value || 0,
                          }))}
                        suburbName={suburbName || 'Unknown Suburb'}
                        className="w-full"
                      />
                    )}

                  {/* Fallback message when no detailed suburb data is available */}
                  {typeof property.generalInformation.address.suburbName === 'string' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{suburbName}</h3>
                      <p className="text-muted-foreground text-sm">
                        Detailed suburb information is not available for this location.
                      </p>
                    </div>
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
                <SheetHeader className="p-0 px-4 pt-4">
                  <SheetTitle className="font-semibold text-2xl">
                    {regionName} -{' '}
                    <span className="uppercase">{property.generalInformation.address.state}</span>
                  </SheetTitle>
                  <SheetDescription className="px-4 text-sm text-muted-foreground">
                    Comprehensive regional information including community landscape, infrastructure
                    developments, and area insights.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Region Hero Image */}
                  {typeof property.generalInformation.address.region === 'object' &&
                    (property.generalInformation.address.region as any)?.heroImage && (
                      <div className="w-full">
                        <img
                          src={getImageUrl(
                            (property.generalInformation.address.region as any).heroImage.url,
                          )}
                          alt={
                            (property.generalInformation.address.region as any).heroImage.alt ||
                            `${regionName} hero image`
                          }
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                  {/* Region Description */}
                  {typeof property.generalInformation.address.region === 'object' &&
                    (property.generalInformation.address.region as any)?.description && (
                      <div>
                        <h4 className="font-semibold text-base mb-2">About {regionName}</h4>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {(() => {
                            const description = (property.generalInformation.address.region as any)
                              .description

                            if (typeof description === 'string') {
                              return description
                            } else if (description && typeof description === 'object') {
                              // More robust validation for Lexical editor state
                              if (
                                description.root &&
                                typeof description.root === 'object' &&
                                description.root.children &&
                                Array.isArray(description.root.children) &&
                                description.root.children.length >= 0 // Allow empty arrays
                              ) {
                                try {
                                  return (
                                    <RichText
                                      data={description}
                                      enableGutter={false}
                                      enableProse={false}
                                    />
                                  )
                                } catch (error) {
                                  console.error(
                                    'Error rendering region description with RichText:',
                                    error,
                                  )
                                  return 'Description format not supported'
                                }
                              } else {
                                // Try to extract text content if it's not a proper Lexical format
                                console.warn(
                                  'Invalid Lexical format for region description:',
                                  description,
                                )
                                return 'Description not available'
                              }
                            }
                            return 'Description not available'
                          })()}
                        </div>
                      </div>
                    )}

                  {/* Region Video */}
                  {typeof property.generalInformation.address.region === 'object' &&
                    (property.generalInformation.address.region as any)?.video && (
                      <div>
                        <h4 className="font-semibold text-base mb-3">Region Overview Video</h4>
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <iframe
                            src={getEmbedUrl(
                              (property.generalInformation.address.region as any).video,
                            )}
                            title={`${regionName} Overview Video`}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}

                  {/* Community & Economic Landscape */}
                  {typeof property.generalInformation.address.region === 'object' &&
                    (property.generalInformation.address.region as any)
                      ?.communityEconomicLandscape &&
                    Array.isArray(
                      (property.generalInformation.address.region as any)
                        .communityEconomicLandscape,
                    ) &&
                    (property.generalInformation.address.region as any).communityEconomicLandscape
                      .length > 0 && (
                      <div>
                        <h4 className="font-semibold text-base mb-3">
                          Community & Economic Landscape
                        </h4>
                        <div className="grid gap-4">
                          {(
                            property.generalInformation.address.region as any
                          ).communityEconomicLandscape.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                {item.icon && (
                                  <div className="w-8 h-8 flex-shrink-0">
                                    <img
                                      src={getImageUrl(item.icon.url)}
                                      alt={item.icon.alt || item.title}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h5 className="font-semibold text-sm mb-1">{item.title}</h5>
                                  {item.description && (
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {safeRenderRichText(
                                        item.description,
                                        'No description available',
                                      )}
                                    </div>
                                  )}
                                  {item.url && (
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
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
                              {item.image && (
                                <div className="mt-3">
                                  <img
                                    src={getImageUrl(item.image.url)}
                                    alt={item.image.alt || item.title}
                                    className="w-full h-32 object-cover rounded"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Infrastructure & Future Development */}
                  {typeof property.generalInformation.address.region === 'object' &&
                    (property.generalInformation.address.region as any)
                      ?.infrastructureFutureDevelopment &&
                    Array.isArray(
                      (property.generalInformation.address.region as any)
                        .infrastructureFutureDevelopment,
                    ) &&
                    (property.generalInformation.address.region as any)
                      .infrastructureFutureDevelopment.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-base mb-3">
                          Infrastructure & Future Development
                        </h4>
                        <div className="grid gap-4">
                          {(
                            property.generalInformation.address.region as any
                          ).infrastructureFutureDevelopment.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                {item.icon && (
                                  <div className="w-8 h-8 flex-shrink-0">
                                    <img
                                      src={getImageUrl(item.icon.url)}
                                      alt={item.icon.alt || item.title}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h5 className="font-semibold text-sm mb-1">{item.title}</h5>
                                  {item.description && (
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {safeRenderRichText(
                                        item.description,
                                        'No description available',
                                      )}
                                    </div>
                                  )}
                                  {item.url && (
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
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
                              {item.image && (
                                <div className="mt-3">
                                  <img
                                    src={getImageUrl(item.image.url)}
                                    alt={item.image.alt || item.title}
                                    className="w-full h-32 object-cover rounded"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Fallback message when no detailed region data is available */}
                  {typeof property.generalInformation.address.region === 'string' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{regionName}</h3>
                      <p className="text-muted-foreground text-sm">
                        Detailed region information is not available for this location.
                      </p>
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
                <svg
                  className="w-6 h-6 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground text-sm">Market information not available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function EnhancedPropertyDetails({ property: typedProperty }: EnhancedPropertyDetailsProps) {
  const fullAddress = `${typedProperty.generalInformation.address.streetAddress}, ${typedProperty.generalInformation.address.postcode} ${typedProperty.generalInformation.address.state?.toUpperCase()}`

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile: Single column, Desktop: Grid with sidebar */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="lg:col-span-2 space-y-4">
          <PropertyHero property={typedProperty} fullAddress={fullAddress} />

          <PropertyPricing property={typedProperty} />

          <PropertyDetails property={typedProperty} />

          <PropertyAgentSummary property={typedProperty} />

          {/* Mobile-only sidebar components */}
          <div className="lg:hidden space-y-4">
            <PropertyPresentation property={typedProperty} />
            <RentalInformation property={typedProperty} />
            <ComparableSales property={typedProperty} />
          </div>

          <DueDiligence property={typedProperty} />

          <ValueProposition property={typedProperty} />

          <MarketInformation property={typedProperty} />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block space-y-4">
          <PropertyPresentation property={typedProperty} />

          <RentalInformation property={typedProperty} />

          <ComparableSales property={typedProperty} />
        </div>
      </div>

      {/* Back to Properties */}
      <div className="mt-8 pt-8 border-t">
        <Link href="/properties">
          <Button variant="outline">← Back to Properties</Button>
        </Link>
      </div>
    </div>
  )
}
