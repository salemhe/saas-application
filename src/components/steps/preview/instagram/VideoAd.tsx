import { mockUser, commonStyles } from "../../../../../utils/addUtils";

interface InstagramVideoAdProps {
  media: string[];
  cta: string;
  primaryText: string;
  headline: string;
}

export default function InstagramVideoAd({
  media,
  cta,
  primaryText,
  headline,
}: InstagramVideoAdProps) {
  return (
    <div className={commonStyles.adContainer}>
      <div className={commonStyles.header}>
        <img
          src={mockUser.avatar}
          alt={mockUser.name}
          className={commonStyles.avatar}
        />
        <span className={commonStyles.username}>{mockUser.name}</span>
      </div>
      <div className={commonStyles.content}>
        <div className="bg-gray-200 h-[400px] flex items-center justify-center">
          <video src={media[0]} autoPlay loop></video>
        </div>
        <div className={commonStyles.overlay}>
          <h3 className={commonStyles.title}>{headline}</h3>
          <p className={commonStyles.description}>{primaryText}</p>
          <button className={commonStyles.cta}>{cta}</button>
        </div>
      </div>
    </div>
  );
}
