import { Card, CardContent } from '~/components/ui/card';
import type { PropertyApiResponse } from '~/domains/property/types';
import { renderRichText } from './utils';

interface PropertyAgentSummaryProps {
  property: PropertyApiResponse;
}

export const PropertyAgentSummary = ({ property }: PropertyAgentSummaryProps) => {
  const hasAgentSummary = property.generalInformation.agentSummary && 
    property.generalInformation.agentSummary !== null;
  
  // Don't render anything if there's no agent summary
  if (!hasAgentSummary) {
    return null;
  }
  
  return (
    <Card>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-semibold mb-2">Why is this a good option for you?</h4>
          <div className="text-muted-foreground leading-relaxed">
            {renderRichText(property.generalInformation.agentSummary)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
