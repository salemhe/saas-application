import { EllipsisVertical } from "lucide-react";
import React from "react";
import { CampaignData } from "../CreateCampaign";

type CampaignProps = {
    formData: CampaignData;
}

export const GoogleMock: React.FC<CampaignProps> = ({ formData }) => {
  const { CompanyName, url, adType, headline, description } = formData;
  return (
    <div className="bg-white text-black rounded-lg p-4 mx-auto border w-full inset md:sticky top-[150px]">
      <p className="text-lg mb-4">Ad Preview</p>
      {adType ? (
        <div>
          {adType === "Search ads" && (
            <div>
              <p className="text-sm font-bold mb-2 mr-2">Sponsored</p>
              <div className="flex items-center mb-3">
                <div>
                  <div className="w-7 h-7 bg-gray-300 rounded-full mr-3"></div>
                </div>
                <div className="flex flex-col">
                  <p className="font-normal text-sm">
                    {CompanyName ? CompanyName : "Company Name"}
                  </p>
                  <div className="flex items-center">
                    <p className="text-gray-500 text-xs">
                      {url ? url : "https://www.companysite.com"}
                    </p>
                    <EllipsisVertical className="cursor-pointer" size={18} />
                  </div>
                </div>
              </div>
              <h2 className="text-[#7eaaff] text-xl">
                {headline ? headline : "Company Headline - Topic"}
              </h2>
              <p className=" break-words">
                {description ? description : "Company Description: a well understandable description of your Company, or the service you render, or a Call to action button. "}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
        </div>
      )}
    </div>
  );
};
