import Image from 'next/image';
import { mockUser, commonStyles } from '../../../../../utils/addUtils';

interface InstagramImageAdProps {
  media: string[];
  cta: string;
  primaryText: string;
  headline: string;
}

export default function InstagramPhotoAd({media, cta, primaryText, headline}: InstagramImageAdProps) {
  return (
    <div className={commonStyles.adContainer}>
      <div className={commonStyles.header}>
        <Image src={mockUser.avatar} alt={mockUser.name} width={32} height={32} className={commonStyles.avatar} />
        <span className={commonStyles.username}>{mockUser.name}</span>
      </div>
      <div className={commonStyles.content}>
        <Image src={media[0]} alt="Ad" width={400} height={400} />
        <div className={commonStyles.overlay}>
          <h3 className={commonStyles.title}>{headline}</h3>
          <p className={commonStyles.description}>{primaryText}</p>
          <button className={commonStyles.cta}>{cta}</button>
        </div>
      </div>
    </div>
  );
}

