import { Card, CardContent } from '~/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import type { PropertyApiResponse } from '~/domains/property/types';
import { getEmbedUrl } from './utils';

interface PropertyPresentationProps {
  property: PropertyApiResponse;
}

export const PropertyPresentation = ({ property }: PropertyPresentationProps) => {
  if (!property.generalInformation.presentationUrl && !property.generalInformation.videoUrl) {
    return null;
  }

  const videoUrl = property.generalInformation.presentationUrl || property.generalInformation.videoUrl || '';

  return (
    <Card>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:shadow-md hover:border-primary transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
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
                    height: '100%'
                  }}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => {
                    console.warn('Video iframe failed to load, likely due to X-Frame-Options');
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open video in new tab
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
