import Image from "next/image";
import { mockUser } from "../../../../../utils/addUtils";

interface InstagramCarouselAdProps {
  media: string[]; // Array of image URLs for the carousel
  cta: string; // Call to action text (e.g., "Shop Now")
  primaryText: string; // Text describing the ad (e.g., product description)
  headline: string; // Headline for the ad (e.g., product name or slogan)
}

export default function InstagramCarouselAd({
  media,
  cta,
  primaryText,
  headline,
}: InstagramCarouselAdProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 my-4 max-w-sm mx-auto">
      {/* Header Section */}
      <div className="flex items-center mb-4">
        <Image
          src={mockUser.avatar}
          alt={mockUser.name}
          width={32}
          height={32}
          className="rounded-full mr-2"
        />
        <span className="font-semibold text-sm">{mockUser.name}</span>
      </div>

      {/* Carousel Section */}
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide space-x-2">
          {media.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-full h-[300px]">
              <Image
                src={image}
                alt={`carousel-item-${index}`}
                width={192}
                height={192}
                className="object-cover rounded-lg h-[300px] w-full"
              />
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center space-x-1 mt-2">
          {media.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === 0 ? "bg-blue-500" : "bg-gray-300"}`}
            ></div>
          ))}
        </div>
      </div>

      {/* Text and CTA Section */}
      <div className="mt-4">
        <h3 className="text-lg font-bold">{headline}</h3>
        <p className="text-sm text-gray-600 mt-1">{primaryText}</p>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg">{cta}</button>
      </div>
    </div>
  );
}
