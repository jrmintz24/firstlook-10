import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyGalleryProps {
  photos: string[]
  propertyAddress: string
}

export const PropertyGallery = ({ photos, propertyAddress }: PropertyGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No photos available</span>
      </div>
    )
  }

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Primary Image */}
        <div className="relative group cursor-pointer" onClick={openFullscreen}>
          <img
            src={photos[currentIndex]}
            alt={`${propertyAddress} - Photo ${currentIndex + 1}`}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
          
          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  prevPhoto()
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  nextPhoto()
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {/* Photo Counter */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${propertyAddress} - Thumbnail ${index + 1}`}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 object-cover rounded cursor-pointer transition-all ${
                  index === currentIndex
                    ? 'ring-2 ring-blue-500'
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
            onClick={closeFullscreen}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Navigation */}
          {photos.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white"
                onClick={prevPhoto}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white"
                onClick={nextPhoto}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Fullscreen Image */}
          <img
            src={photos[currentIndex]}
            alt={`${propertyAddress} - Photo ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={closeFullscreen}
          />

          {/* Photo Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-2 rounded">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}