import type { PropertyApiResponse } from '~/domains/property/types';

interface PropertyDetailsProps {
  property: PropertyApiResponse;
}

const PropertyDetailItem = ({ icon, value, label }: { icon: React.ReactNode; value: string | number | null; label: string }) => (
  <div className="flex items-center gap-2 md:gap-4 py-1 md:py-0 px-1 md:px-2 border-0 md:border rounded-lg bg-card dark:bg-transparent hover:shadow-md transition-shadow">
    <div className="w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <div className="font-semibold text-sm md:text-lg">
        {value ?? 'N/A'} <span className="text-sm text-muted-foreground hidden md:inline">{label}</span>
      </div>
    </div>
  </div>
);

export const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const details = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bed-icon lucide-bed">
          <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
        </svg>
      ),
      value: property.generalInformation.format.bedrooms,
      label: 'Bedrooms'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bath-icon lucide-bath">
          <path d="M10 4 8 6"/><path d="M17 19v2"/><path d="M2 12h20"/><path d="M7 19v2"/><path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
        </svg>
      ),
      value: property.generalInformation.format.bathrooms,
      label: 'Bathrooms'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car-icon lucide-car">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
        </svg>
      ),
      value: property.generalInformation.format.carSpaces,
      label: 'Car Spaces'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      value: property.generalInformation.buildYear,
      label: 'Built'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-land-plot-icon lucide-land-plot">
          <path d="m12 8 6-3-6-3v10"/><path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12"/><path d="m6.49 12.85 11.02 6.3"/><path d="M17.51 12.85 6.5 19.15"/>
        </svg>
      ),
      value: property.generalInformation.land ? `${property.generalInformation.land} m²` : null,
      label: 'Land Size'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ruler-dimension-line-icon lucide-ruler-dimension-line">
          <path d="M12 15v-3.014"/><path d="M16 15v-3.014"/><path d="M20 6H4"/><path d="M20 8V4"/><path d="M4 8V4"/><path d="M8 15v-3.014"/><rect x="3" y="12" width="18" height="7" rx="1"/>
        </svg>
      ),
      value: property.generalInformation.internal ? `${property.generalInformation.internal} m²` : null,
      label: 'Internal Size'
    }
  ];

  return (
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
  );
};
