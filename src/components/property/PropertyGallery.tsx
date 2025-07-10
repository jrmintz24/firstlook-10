
import { useState } from "react"
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react"
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
      <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400 font-light">No photos available</span>
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
        <div className="relative group cursor-pointer overflow-hidden rounded-2xl" onClick={openFullscreen}>
          <img
            src={photos[currentIndex]}
            alt={`${propertyAddress} - Photo ${currentIndex + 1}`}
            className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay with controls */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  prevPhoto()
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  nextPhoto()
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {/* Expand button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg"
            onClick={(e) => {
              e.stopPropagation()
              openFullscreen()
            }}
          >
            <Expand className="h-4 w-4" />
          </Button>
          
          {/* Photo Counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-xl text-sm font-light backdrop-blur-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  index === currentIndex
                    ? 'ring-2 ring-gray-900 scale-105'
                    : 'hover:ring-2 hover:ring-gray-300 hover:scale-105'
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={photo}
                  alt={`${propertyAddress} - Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-6 right-6 z-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg"
            onClick={closeFullscreen}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Navigation */}
          {photos.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg"
                onClick={prevPhoto}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg"
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
            className="max-w-full max-h-full object-contain cursor-pointer"
            onClick={closeFullscreen}
          />

          {/* Photo Counter */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-xl backdrop-blur-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}
