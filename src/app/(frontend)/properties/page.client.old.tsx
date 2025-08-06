'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '~/components/ui/card'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { Slider } from '~/components/ui/slider'
import type { Property as ClientProperty } from '~/types/payload-types'

// Image URL utility function
const getImageUrl = (url: string) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `https://cms.hassen.com.au${url}`
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

const PropertyCard = ({ property }: { property: ClientProperty }) => {
  const fullAddress = `${property.generalInformation.address.streetAddress}, ${property.generalInformation.address.postcode} ${property.generalInformation.address.state}`

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        <div className="relative">
          {property.generalInformation.heroImage && property.generalInformation.heroImage.url ? (
            <img
              src={getImageUrl(property.generalInformation.heroImage.url)}
              alt={property.generalInformation.heroImage.alt || property.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-64 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}

          {/* Price Badge */}
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            ${property.generalInformation.purchasePrice?.toLocaleString()}
          </Badge>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {property.name}
          </h3>

          <p className="text-muted-foreground mb-4 text-sm">{fullAddress}</p>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {property.generalInformation.format.bedrooms && (
              <div className="flex items-center gap-1">
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
                <span>{property.generalInformation.format.bedrooms}</span>
              </div>
            )}

            {property.generalInformation.format.bathrooms && (
              <div className="flex items-center gap-1">
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
                <span>{property.generalInformation.format.bathrooms}</span>
              </div>
            )}

            {property.generalInformation.format.carSpaces && (
              <div className="flex items-center gap-1">
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
                <span>{property.generalInformation.format.carSpaces}</span>
              </div>
            )}
          </div>

          {/* Investment Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {property.valueProposition.expectedResults.annualGrossYieldDisplay && (
              <div>
                <span className="text-muted-foreground">Gross Yield</span>
                <div className="font-semibold text-green-600">
                  {property.valueProposition.expectedResults.annualGrossYieldDisplay}
                </div>
              </div>
            )}

            {property.valueProposition.expectedResults.annualNetYieldDisplay && (
              <div>
                <span className="text-muted-foreground">Net Yield</span>
                <div className="font-semibold text-green-600">
                  {property.valueProposition.expectedResults.annualNetYieldDisplay}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

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
      <div>
        <h3 className="font-semibold mb-3">Search</h3>
        <input
          type="text"
          placeholder="Search by name, address, suburb, or postcode..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

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
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Button variant="outline" onClick={onClearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  )
}

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

      // Search term filter (search in name and address)
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Investment Properties</h1>
        <p className="text-muted-foreground">
          Discover high-yield investment opportunities in prime locations
        </p>
      </div>

      {/* Mobile/Desktop Layout */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6">Filter Properties</h2>
            <FilterControls
              priceRange={priceRange}
              searchTerm={searchTerm}
              onPriceRangeChange={setPriceRange}
              onSearchTermChange={setSearchTerm}
              onClearFilters={clearFilters}
            />
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Mobile Filters */}
          <div className="lg:hidden mb-6 flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1">
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
                  Filters
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
          <div className="flex items-center justify-between mb-6">
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
                  Price: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} ×
                </Badge>
              )}
            </div>
          </div>

          {/* Property Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
