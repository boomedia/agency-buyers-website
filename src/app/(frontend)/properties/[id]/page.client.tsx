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
  return new Date(dateString).toLocaleDateString('en-AU', {
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
  return url.startsWith('http') ? url : `https://bat.hassen.com.au${url}`
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
      <div className="w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary">
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
  // Function to render rich text (lexical editor) format as HTML
  const renderRichText = (richTextObj: any): React.ReactNode => {
    if (!richTextObj || !richTextObj.root || !richTextObj.root.children) {
      return null
    }

    const renderNode = (node: any, index: number): React.ReactNode => {
      if (node.type === 'text') {
        let text = node.text || ''

        // Apply text formatting
        if (node.format & 1) text = <strong key={index}>{text}</strong> // Bold
        if (node.format & 2) text = <em key={index}>{text}</em> // Italic
        if (node.format & 8) text = <u key={index}>{text}</u> // Underline
        if (node.format & 16) text = <s key={index}>{text}</s> // Strikethrough

        return text
      }

      if (node.type === 'paragraph') {
        const children = node.children ? node.children.map(renderNode) : []
        return (
          <p key={index} className="mb-4 last:mb-0">
            {children}
          </p>
        )
      }

      if (node.type === 'heading') {
        const children = node.children ? node.children.map(renderNode) : []
        const HeadingTag = node.tag || 'h2'

        const headingClasses = {
          h1: 'text-3xl font-bold mb-4',
          h2: 'text-2xl font-bold mb-3',
          h3: 'text-xl font-bold mb-3',
          h4: 'text-lg font-bold mb-2',
          h5: 'text-base font-bold mb-2',
          h6: 'text-sm font-bold mb-2',
        }

        return React.createElement(
          HeadingTag,
          {
            key: index,
            className:
              headingClasses[HeadingTag as keyof typeof headingClasses] || headingClasses.h2,
          },
          children,
        )
      }

      if (node.type === 'list') {
        const children = node.children ? node.children.map(renderNode) : []
        const ListTag = node.listType === 'number' ? 'ol' : 'ul'
        return (
          <ListTag key={index} className="list-disc list-inside mb-4 space-y-1">
            {children}
          </ListTag>
        )
      }

      if (node.type === 'listitem') {
        const children = node.children ? node.children.map(renderNode) : []
        return (
          <li key={index} className="ml-4">
            {children}
          </li>
        )
      }

      if (node.type === 'link') {
        const children = node.children ? node.children.map(renderNode) : []
        return (
          <a
            key={index}
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline"
          >
            {children}
          </a>
        )
      }

      // Handle line breaks
      if (node.type === 'linebreak') {
        return <br key={index} />
      }

      // Fallback for unknown types - render children if they exist
      if (node.children) {
        return <div key={index}>{node.children.map(renderNode)}</div>
      }

      return null
    }

    return <div className="rich-text-content">{richTextObj.root.children.map(renderNode)}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground leading-relaxed">
          {renderRichText(property.generalInformation.agentSummary)}
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
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
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
              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
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
        {property.generalInformation.comparableSales.slice(0, 2).map((sale: any) => (
          <div
            key={sale.id}
            className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow hover:border-primary"
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
              <div className="text-lg font-bold text-primary mb-2">
                {formatPrice(sale.salePrice)}
              </div>
              <a
                href={sale.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-xs font-medium"
              >
                View Listing →
              </a>
            </div>
          </div>
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
                    <img
                      src={getImageUrl(zone.image.url)}
                      alt={zone.image.alt || zone.type}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted rounded flex items-center justify-center mb-3">
                      <span className="text-muted-foreground text-sm">No image available</span>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">{zone.details}</div>
                  {zone.agentNotes && (
                    <div className="bg-primary/5 border-l-4 border-primary p-3 my-3">
                      <p className="text-sm text-foreground">
                        <strong>Agent Note:</strong> {zone.agentNotes}
                      </p>
                    </div>
                  )}
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
