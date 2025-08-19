'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { Slider } from '~/components/ui/slider'
import type { Property as ClientProperty } from '~/types/payload-types'
import {
  calculateAnnualGrossYield,
  calculateAnnualNetYield,
  calculateAllPropertyMetrics,
  formatAsPercentage,
} from '~/utilities/propertyCalculations'

// Image URL utility function matching reference layouts
const getImageUrl = (url: string) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `https://cms.hassen.com.au${url}`
}

// Price formatting utility matching reference layouts
const formatPrice = (price: number | null | undefined): string => {
  if (!price) return 'Price on Application'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

interface Region {
  id: number
  name: string
}

interface Suburb {
  id: number
  name: string
  region: {
    id: number
    name: string
  }
}

interface PropertiesClientProps {
  properties: ClientProperty[]
  regions: Region[]
  suburbs: Suburb[]
}

// Property Card Component matching reference layout patterns
const PropertyCard = ({ property }: { property: ClientProperty }) => {
  const fullAddress = `${property.generalInformation.address.streetAddress}, ${property.generalInformation.address.postcode} ${property.generalInformation.address.state}`

  // Calculate yields using our utility functions (fallback for null display values)
  const metrics = calculateAllPropertyMetrics(property)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
      <div className="relative">
        {property.generalInformation.heroImage && property.generalInformation.heroImage.url ? (
          <img
            src={getImageUrl(property.generalInformation.heroImage.url)}
            alt={property.generalInformation.heroImage.alt || property.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-56 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}

        {/* Price Badge - matching reference layout styling */}
        <Badge className="absolute top-4 right-4 bg-primary/90 text-primary-foreground backdrop-blur-sm">
          {formatPrice(property.generalInformation.purchasePrice)}
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Property Name and Address */}
          <div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {property.name}
            </h3>
            <p className="text-muted-foreground text-sm">{fullAddress}</p>
          </div>

          {/* Property Details - matching reference PropertyDetails component */}
          <div className="flex items-center gap-6 text-sm">
            {property.generalInformation.format.bedrooms > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 4v16" />
                    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                    <path d="M2 17h20" />
                    <path d="M6 8v9" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">{property.generalInformation.format.bedrooms}</div>
                  <div className="text-xs text-muted-foreground">Beds</div>
                </div>
              </div>
            )}

            {property.generalInformation.format.bathrooms > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 4 8 6" />
                    <path d="M17 19v2" />
                    <path d="M2 12h20" />
                    <path d="M7 19v2" />
                    <path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">
                    {property.generalInformation.format.bathrooms}
                  </div>
                  <div className="text-xs text-muted-foreground">Baths</div>
                </div>
              </div>
            )}

            {property.generalInformation.format.carSpaces > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">
                    {property.generalInformation.format.carSpaces}
                  </div>
                  <div className="text-xs text-muted-foreground">Cars</div>
                </div>
              </div>
            )}
          </div>

          {/* Investment Yields - Updated to use calculated values with fallback */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Use calculated gross yield with fallback to display field */}
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Gross Yield</div>
                <div className="font-bold text-green-600">
                  {property.valueProposition.expectedResults.annualGrossYieldDisplay ||
                    metrics.formatted.annualGrossYield}
                </div>
              </div>

              {/* Use calculated net yield with fallback to display field */}
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Net Yield</div>
                <div className="font-bold text-blue-600">
                  {property.valueProposition.expectedResults.annualNetYieldDisplay ||
                    metrics.formatted.annualNetYield}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link href={`/properties/${property.id}`} className="block">
            <Button className="w-full" variant="outline">
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Filter Controls Component matching reference layout patterns
const FilterControls = ({
  priceRange,
  searchTerm,
  onPriceRangeChange,
  onSearchTermChange,
  onClearFilters,
}: {
  priceRange: [number, number]
  searchTerm: string
  onPriceRangeChange: (value: [number, number]) => void
  onSearchTermChange: (value: string) => void
  onClearFilters: () => void
}) => {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-semibold mb-3">Search Properties</h3>
        <input
          type="text"
          placeholder="Search by name, address, suburb, or postcode..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            max={2000000}
            min={100000}
            step={25000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Button variant="outline" onClick={onClearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  )
}

// Main Properties Archive Component matching reference layout structure
export default function PropertiesClient({ properties, regions, suburbs }: PropertiesClientProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([100000, 2000000])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Price filter
      const price = property.generalInformation.purchasePrice || 0
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesName = property.name.toLowerCase().includes(searchLower)
        const matchesAddress = property.generalInformation.address.streetAddress
          .toLowerCase()
          .includes(searchLower)
        const matchesSuburb = property.generalInformation.address.suburbName
          ?.toLowerCase()
          .includes(searchLower)
        const matchesPostcode = property.generalInformation.address.postcode.includes(searchTerm)

        if (!matchesName && !matchesAddress && !matchesSuburb && !matchesPostcode) {
          return false
        }
      }

      return true
    })
  }, [properties, priceRange, searchTerm])

  const clearFilters = () => {
    setPriceRange([100000, 2000000])
    setSearchTerm('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header matching reference layout styling */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Investment Properties</h1>
        <p className="text-muted-foreground text-lg">
          Discover high-yield investment opportunities in prime locations
        </p>
      </div>

      {/* Layout matching PropertyPage structure - sidebar + main content */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block space-y-6">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader>
              <CardTitle>Filter Properties</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <FilterControls
                priceRange={priceRange}
                searchTerm={searchTerm}
                onPriceRangeChange={setPriceRange}
                onSearchTermChange={setSearchTerm}
                onClearFilters={clearFilters}
              />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{filteredProperties.length}</div>
                  <div className="text-sm text-muted-foreground">Properties Available</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredProperties.length > 0
                      ? Math.round(
                          (filteredProperties.reduce((acc, p) => {
                            // Use calculated gross yield if display field is null or 0
                            const grossYieldStr =
                              p.valueProposition.expectedResults.annualGrossYieldDisplay
                            let yieldValue = 0

                            if (grossYieldStr && grossYieldStr !== '0.00%') {
                              yieldValue = parseFloat(grossYieldStr.replace('%', ''))
                            } else {
                              // Fallback to calculated value
                              yieldValue = calculateAnnualGrossYield(p)
                            }

                            return acc + yieldValue
                          }, 0) /
                            filteredProperties.length) *
                            10,
                        ) / 10
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Gross Yield</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mobile Filters */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
                  </svg>
                  Filter Properties ({filteredProperties.length})
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filter Properties</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterControls
                    priceRange={priceRange}
                    searchTerm={searchTerm}
                    onPriceRangeChange={setPriceRange}
                    onSearchTermChange={setSearchTerm}
                    onClearFilters={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredProperties.length} of {properties.length} properties
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setSearchTerm('')}
                >
                  Search: {searchTerm} ×
                </Badge>
              )}
              {(priceRange[0] !== 100000 || priceRange[1] !== 2000000) && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setPriceRange([100000, 2000000])}
                >
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])} ×
                </Badge>
              )}
            </div>
          </div>

          {/* Properties Grid matching CollectionArchive structure */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-4"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to see more results
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
