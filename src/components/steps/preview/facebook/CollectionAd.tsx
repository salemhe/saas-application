import Image from 'next/image';
import { mockAd, mockUser, commonStyles } from '../../../../../utils/addUtils';

export default function FacebookCollectionAd() {
  return (
    <div className={`${commonStyles.adContainer} bg-white`}>
      <div className={commonStyles.header}>
        <Image src={mockUser.avatar} alt={mockUser.name} width={32} height={32} className={commonStyles.avatar} />
        <div>
          <span className={commonStyles.username}>{mockUser.name}</span>
          <p className="text-xs text-gray-500">Sponsored</p>
        </div>
      </div>
      <div className="p-2">
        <p className="text-sm mb-2">{mockAd.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="col-span-2">
          <Image src="/placeholder.svg?height=200&width=400&text=Main Image" alt="Main Ad" width={400} height={200} />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Image src={`/placeholder.svg?height=100&width=200&text=Product ${i}`} alt={`Product ${i}`} width={200} height={100} />
          </div>
        ))}
      </div>
      <div className="p-2">
        <h3 className="font-bold text-lg mb-1">{mockAd.title}</h3>
        <button className={`${commonStyles.cta} w-full`}>{mockAd.cta}</button>
      </div>
    </div>
  );
}

