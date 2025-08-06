import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import type { PropertyApiResponse } from '~/domains/property/types';
import { getImageUrl, renderRichText } from './utils';

interface DueDiligenceProps {
  property: PropertyApiResponse;
}

export const DueDiligence = ({ property }: DueDiligenceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Due Diligence</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {property.dueDiligence.zoneData.map((zone: any) => (
            <AccordionItem key={zone.id} value={zone.id}>
              <AccordionTrigger className="text-left">
                <div className="flex justify-between items-center w-full mr-4">
                  <div className="font-medium capitalize">{zone.type}</div>
                  <div className={`text-xs px-2 py-1 rounded capitalize ${
                    zone.effected === 'yes' ? 'bg-destructive/20 text-destructive' :
                      zone.effected === 'no' ? 'bg-primary/10 text-secondary-foreground' :
                        zone.effected === 'partial' ? 'bg-destructive/10 text-primary' :
                          'bg-destructive/10 text-destructive'
                  }`}>
                    {zone.effected}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {zone.image && (
                    <img
                      src={getImageUrl(zone.image.url)}
                      alt={zone.image.alt}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                  )}
                  <div className="text-sm text-muted-foreground">
                    {typeof zone.details === 'string' ? zone.details : renderRichText(zone.details)}
                  </div>
                  {zone.url && (
                    <a
                      href={zone.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:text-primary text-sm font-medium transition-colors"
                    >
                      More Information &nbsp;
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
  );
};
