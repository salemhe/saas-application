import React from "react";

interface InstagramReelsAdProps {
  media: string[];
  cta: string;
  link: string;
}

const InstagramReelsAd: React.FC<InstagramReelsAdProps> = ({ media, cta, link }) => {
  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <video
        src={media[0]}
        autoPlay
        loop
        muted
        className="w-full h-full object-cover"
      ></video>
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

export default InstagramReelsAd;
