import { Card } from "./ui/card";
import { CardContent } from "./ui/card";
import { CardTitle } from "./ui/card";
import { CardDescription } from "./ui/card";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { PieChart, Paintbrush, Megaphone, LineChart } from "lucide-react";
// import Image1 from "@/assets/Tiger.png";
// import Image2 from "@/assets/Screenshot.png";
// import Image3 from "@/assets/image1.png";
// import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { Campaign } from "@/context/CampaignContext";
import { CampaignPopup } from "./Campaign-Popup";

const AdsRunningSection = () => {
  // const images = [Image1, Image2, Image3];

  const { isConnected } = useContext(Campaign);

  return (
    <div id="start-campaign" className="p-4 md:p-16 sm:p-4 sm:mt-10 mt-8">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Text Section */}
        <div className="md:w-1/2 text-left mt-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Boost Your Ad Campaigns
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-lg">
            From understanding your audience to tracking success, our tools and
            platforms ensure your campaigns are impactful.
          </p>
          <div
            className={`mt-6 ${
              isConnected ? " flex" : "hidden"
            }`}
          >
            <CampaignPopup />
          </div>
        </div>

        {/* Grid Section */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:w-1/2">
          {/* Analyze */}
          <Card className="bg-white bg-opacity-70 backdrop-blur-md h-34 hover:shadow-lg transition-all duration-200">
            <CardContent className="flex flex-col items-center text-center p-3">
              <PieChart className="text-[#5A67D8] w-5 h-5 mb-1" />
              <CardTitle className="text-gray-800 text-sm">Analyze</CardTitle>
              <CardDescription className="text-gray-600 text-xs">
                Understand your audience better.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Design */}
          <Card className="bg-white bg-opacity-70 backdrop-blur-md h-34 hover:shadow-lg transition-all duration-200">
            <CardContent className="flex flex-col items-center text-center p-3">
              <Paintbrush className="text-[#319795] w-5 h-5 mb-1" />
              <CardTitle className="text-gray-800 text-sm">Design</CardTitle>
              <CardDescription className="text-gray-600 text-xs">
                Create stunning visuals easily.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Launch */}
          <Card className="bg-white bg-opacity-70 backdrop-blur-md h-34 hover:shadow-lg transition-all duration-200">
            <CardContent className="flex flex-col items-center text-center p-3">
              <Megaphone className="text-[#D69E2E] w-5 h-5 mb-1" />
              <CardTitle className="text-gray-800 text-sm">Launch</CardTitle>
              <CardDescription className="text-gray-600 text-xs">
                Deploy your ads effectively.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Measure */}
          <Card className="bg-white bg-opacity-70 backdrop-blur-md h-34 hover:shadow-lg transition-all duration-200">
            <CardContent className="flex flex-col items-center text-center p-3">
              <LineChart className="text-[#E53E3E] w-5 h-5 mb-1" />
              <CardTitle className="text-gray-800 text-sm">Measure</CardTitle>
              <CardDescription className="text-gray-600 text-xs">
                Track your campaign{"'"}s success.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10">
        {/* Section Title */}
        <h2 className="text-3xl font-bold">Ad Platforms</h2>

        {/* Social Media Icons */}
        <div className="flex mt-6 gap-8">
          <Link href="/" className="text-[#E4405F]" aria-label="Instagram">
            <FaInstagram size={24} />
          </Link>
          <Link href="/" className="text-[#1877F2]" aria-label="Facebook">
            <FaFacebook size={24} />
          </Link>
          <Link href="/" className="text-[#FF0000]" aria-label="YouTube">
            <FaYoutube size={24} />
          </Link>
          <Link href="/" className="text-black" aria-label="X">
            <FaXTwitter size={24} />
          </Link>
        </div>

        {/* Description */}
        <p className="text-base text-gray-900 mt-8">
          Additional Platforms Include
        </p>
        <p className="mt-2">
          <span className="text-purple-600 underline font-semibold">
            Billboard
          </span>
          <span className="mx-1">and</span>
          <span className="text-purple-600 underline font-semibold">Radio</span>
        </p>
      </div>

      {/* Grid for Images */}
      {/* <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {images.map((image, index) => (
          <div
             key={index}
            className={`rounded-lg overflow-hidden shadow-sm ${
               index >= 2 && "lg:block hidden" // Show third image only on large screens
             }`}
           >
             <Image
               src={image}
               alt={`Ad Campaign ${index + 1}`}
              className="w-full h-56 object-cover"
            />
           </div>
         ))}
      </div> */}
    </div>
  );
};

export default AdsRunningSection;
