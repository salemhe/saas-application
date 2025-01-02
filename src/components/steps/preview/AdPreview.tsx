"use client";
import React, { useEffect, useState } from "react";
import FacebookFeedAd from "./FacebookFeedAd";
import FacebookStoryAd from "./FacebookStoryAd";
import InstagramFeedAd from "./InstagramFeedAd";
import InstagramStoryAd from "./InstagramStoryAd";
import InstagramReelsAd from "./InstagramReelsAd";
import FacebookImageAd from "./facebook/ImageAd";
import FacebookVideoAd from "./facebook/VideoAd";
import FacebookCarouselAd from "./facebook/CarouselAd";
import InstagramPhotoAd from "./instagram/PhotoAd";
import InstagramVideoAd from "./instagram/VideoAd";
import InstagramCarouselAd from "./instagram/CarouselAd";
import InstagramStoriesAd from "./instagram/StoriesAd";

interface AdPreviewProps {
  platform: "facebook" | "instagram";
  format: "feed" | "story" | "reels" | "carousel" | "video" | "image";
  media: any;
  primaryText?: string;
  headline?: string;
  cta: string;
  link: string;
}

const AdPreview: React.FC<AdPreviewProps> = ({
  platform,
  format,
  media,
  primaryText,
  headline,
  cta,
  link,
}) => {
  const [preview, setPreview] = useState<string[]>([]);
  useEffect(() => {
    if (media && media.length > 0) {
      // Convert FileList to an array
      const filesArray = Array.from(media);
  
      const previews: string[] = [];
  
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
  
          // Set previews after all files are processed
          if (previews.length === filesArray.length) {
            setPreview(previews);
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    } else {
      setPreview([]); // Clear previews when no files are selected
    }
  }, [media]);

  if (platform === "facebook") {
    if (format === "feed") {
      return (
        <FacebookFeedAd
          media={preview}
          primaryText={primaryText || ""}
          headline={headline || ""}
          cta={cta}
          link={link}
        />
      );
    }
    if (format === "story") {
      return <FacebookStoryAd media={preview} cta={cta} link={link} />;
    }
    if (format === "image") {
      return <FacebookImageAd media={preview} cta={cta} primaryText={primaryText as string} headline={headline as string} />;
    }
    if (format === "video") {
      return <FacebookVideoAd media={preview} cta={cta} primaryText={primaryText as string} headline={headline as string} />;
    }
    if (format === "carousel") {
      return <FacebookCarouselAd media={preview} cta={cta} primaryText={primaryText as string} headline={headline as string}  />;
    }
  } else if (platform === "instagram") {
    if (format === "feed") {
      return (
        <InstagramFeedAd
          media={preview}
          primaryText={primaryText || ""}
          cta={cta}
          link={link}
        />
      );
    }
    if (format === "story") {
      return <InstagramStoryAd media={preview} cta={cta} link={link} />;
    }
    if (format === "reels") {
      return <InstagramReelsAd media={preview} cta={cta} link={link} />;
    }
    if (format === "video") {
      return <InstagramVideoAd media={preview} cta={cta} primaryText={primaryText as string} headline={headline as string} />;
    }
    if (format === "carousel") {
      return <InstagramCarouselAd media={preview} cta={cta} primaryText={primaryText as string} headline={headline as string} />;
    }
    if (format === "image") {
      return <InstagramPhotoAd media={preview} cta={cta} primaryText={primaryText as string} headline={headline as string} />;
    }
    if (format === "stories") {
      return <InstagramStoriesAd media={preview} cta={cta} headline={headline as string} />;
    }
  }

  return <div>Wrong Format</div>;
};

export default AdPreview;
