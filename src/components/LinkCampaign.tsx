import Image1 from '@/assets/Tiger.png';
import Image2 from '@/assets/Screenshot.png';
import Image3 from '@/assets/image1.png';
import Image from 'next/image';

export const LinkCampaign = () => {
  const accounts = [
    { name: "Facebook", icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", isConnected: false },
    { name: "Instagram", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png", isConnected: false },
    { name: "YouTube", icon: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png", isConnected: false },
    { name: "X", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5f/X_logo_2023.svg", isConnected: false },
  ];

  const images = [Image1, Image2, Image3];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-16 sm:p-4 sm:mt-16">
      <h2 className="text-xl font-bold mb-2">Ad Accounts</h2>
      <p className="text-gray-500 mb-6">Connect or disconnect your ad accounts at any time.</p>

      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.name}
            className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              <img
                src={account.icon}
                alt={`${account.name} logo`}
                className="h-8 w-8 object-contain"
              />
              <span className="font-medium text-gray-800">{account.name}</span>
            </div>
            {account.isConnected ? (
              <button className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg">
                Disconnect Account
              </button>
            ) : (
              <button className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
                Connect Account
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Grid for Images */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`rounded-lg overflow-hidden shadow-sm ${
              index >= 2 && 'lg:block hidden' // Hide the third image on small and medium devices
            }`}
          >
            <Image
              src={image}
              alt={`Ad Campaign ${index + 1}`}
              className="w-full h-56 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

