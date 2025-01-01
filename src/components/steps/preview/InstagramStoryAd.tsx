import React from "react";

interface InstagramStoryAdProps {
  media: string[];
  cta: string;
  link: string;
}

const InstagramStoryAd: React.FC<InstagramStoryAdProps> = ({ media, cta, link }) => {
  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <img src={media[0]} alt="Story Ad" className="w-full h-full object-cover" />
      <div className="absolute bottom-4 w-full text-center">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pink-500 text-white px-4 py-2 rounded-full"
        >
          {cta}
        </a>
      </div>
    </div>
  );
};

export default InstagramStoryAd;
