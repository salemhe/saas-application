import React from "react";

interface FacebookStoryAdProps {
  media: string[];
  cta: string;
  link: string;
}

const FacebookStoryAd: React.FC<FacebookStoryAdProps> = ({ media, cta }) => {
  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <img src={media[0]} alt="Story Ad" className="w-full h-full object-cover" />
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <a
          href="#"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          {cta}
        </a>
      </div>
    </div>
  );
};

export default FacebookStoryAd;
