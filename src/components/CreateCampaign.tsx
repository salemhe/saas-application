import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
// import { useRouter } from "next/navigation";
import { FaXTwitter } from "react-icons/fa6";
import { GoogleMock } from "./social-mocks/GoogleMock";

export type CampaignData = {
  campaignName: string;
  platform: string;
  adType: string;
  CompanyName: string;
  CompanyLogo: File | null;
  headline?: string;
  description?: string;
  image?: File | null;
  video?: File | null;
  url?: string;
};

const googleAdTypes = [
  "Search ads",
  "Display ads",
  "Video ads",
  "App campaigns",
  "Shopping ads",
  "Bumper ads",
  "Dynamic Search Ads",
  "Discovery ads",
  "Local campaigns",
];
const facebookAdTypes = ["Image Ad", "Video Ad", "Text Ad"];

const platforms = [
  {
    name: "Google",
    icon: <FcGoogle size={24} className="size-9 md:size-14" />,
  },
  {
    name: "Facebook",
    icon: <FaFacebook fill="#3333ff" size={24} className="size-9 md:size-14" />,
  },
  {
    name: "Youtube",
    icon: <FaYoutube fill="red" size={24} className="size-9 md:size-14" />,
  },
  {
    name: "X",
    icon: <FaXTwitter size={24} className="size-9 md:size-14" />,
  },
  {
    name: "Instagram",
    icon: (
      <FaInstagram size={24} fill="#E4405F" className="size-9 md:size-14" />
    ),
  },
];

const CreateCampaign = () => {
  const [step, setStep] = useState<number>(1);
  const [posts, setPosts] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CampaignData>({
    campaignName: "",
    platform: "",
    adType: "",
    CompanyName: "",
    CompanyLogo: null,
    headline: "",
    description: "",
    image: null,
    video: null,
    url: "",
  });

  // const router = useRouter();
  useEffect(() => {
    setFormData((prev) => ({ ...prev, adType: "" }));
  }, [formData.platform]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log(formData);
      // router.push("/campaign");
    }, 2000);
  };

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setStep((prev) => prev + 1);
      setLoading(false);
    }, 2000);
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <>
      <form onKeyDown={(e) => e.isPropagationStopped()} onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="flex flex-col gap-6 w-full max-w-[600px] mx-auto">
            <div className="flex flex-col gap-4">
              <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
                Campaign Name
              </h1>
              <p className="text-base font-normal text-gray-500">
                create a name for your campaign
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="campaignName">Campaign name</label>
              <input
                className="rounded-md w-full px-4 "
                id="campaignName"
                type="text"
                value={formData.campaignName}
                onChange={handleChange}
                name="campaignName"
                placeholder="Campaign Name"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleNext}
              type="button"
              className="max-w-[600px]"
              disabled={!formData.campaignName || loading}
            >
              {loading ? "Loading..." : "Next"}
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-6 w-full max-w-[600px] mx-auto">
            <div className="flex flex-col gap-4">
              <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
                Choose Campaign Platform
              </h1>
              <p className="text-base font-normal text-gray-500">
                choose the platform of your choice to run your Campaigns, and
                generate leads with ease.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full auto-rows-min max-w-[600px] gap-4 mx-auto">
              {platforms.map((platform, i) => (
                <>
                  <label
                    htmlFor={platform.name}
                    key={i}
                    className="has-[:checked]:border-blue-600 has-[:checked]:bg-opacity-95 bg-blue-50 bg-opacity-20 hover:bg-opacity-90 border-2 hover:cursor-pointer w-full h-[200px] rounded-xl p-10 flex flex-col items-center gap-4"
                  >
                    {platform.icon}
                    <h2 className="text-primary text-lg">{platform.name}</h2>
                    <input
                      type="radio"
                      id={platform.name}
                      value={platform.name}
                      checked={formData.platform === platform.name}
                      name="platform"
                      className="hidden"
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </label>
                </>
              ))}
            </div>
            <Button
              onClick={handleNext}
              type="button"
              className="max-w-[600px]"
              disabled={!formData.platform || loading}
            >
              {loading ? "Loading..." : "Next"}
            </Button>
            <div className="w-full flex items-center justify-center">
              <Button
                type="button"
                className="text-center bg-transparent text-primary font-bold hover:bg-transparent"
                onClick={handlePrevious}
              >
                Go back
              </Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6 w-full max-w-[600px] mx-auto">
              {formData.platform === "Google" && (
                <div className="flex flex-col gap-4">
                  <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
                    Google Campaign
                  </h1>
                  <p className="text-base font-normal text-gray-500">
                    fill in the Form to Create your Google ads Campaign
                  </p>
                  <div className="flex flex-col gap-4">
                    <label htmlFor="GoogleAdType">Ad Type</label>
                    <select
                      name="adType"
                      id="GoogleAdType"
                      className="rounded-md w-full bg-transparent"
                      value={formData.adType}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="" disabled>
                        Select Ad Type
                      </option>
                      {googleAdTypes.map((type, i) => (
                        <>
                          <option value={type} key={i}>
                            {type}
                          </option>
                        </>
                      ))}
                    </select>
                  </div>
                  {formData.adType === "Search ads" && (
                    <>
                      <div className="flex flex-col gap-4">
                        <label htmlFor="GoogleSearchAdsName">
                          Company Name
                        </label>
                        <input
                          className="rounded-md w-full px-4 "
                          id="GoogleSearchAdsName"
                          value={formData.CompanyName}
                          onChange={handleChange}
                          name="CompanyName"
                          placeholder="Enter Company Name"
                          disabled={loading}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <label htmlFor="GoogleSearchAdsLink">
                          Website Link
                        </label>
                        <input
                          className="rounded-md w-full px-4 "
                          id="GoogleSearchAdsLink"
                          type="url"
                          value={formData.url}
                          onChange={handleChange}
                          name="url"
                          placeholder="Enter Website Link"
                          disabled={loading}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <label htmlFor="GoogleSearchAdsTopic">Headline</label>
                        <input
                          className="rounded-md w-full px-4 "
                          id="GoogleSearchAdsTopic"
                          value={formData.headline}
                          onChange={handleChange}
                          name="headline"
                          placeholder="Enter Headline"
                          disabled={loading}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <label htmlFor="GoogleSearchAdsDetails">
                          Description
                        </label>
                        <textarea
                          className=" min-h-[100px] rounded-md w-full px-4"
                          id="GoogleSearchAdsDetails"
                          value={formData.description}
                          onChange={handleChange}
                          name="description"
                          placeholder="Enter Description"
                          disabled={loading}
                        ></textarea>
                      </div>
                    </>
                  )}
                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      !formData.adType ||
                      !googleAdTypes.includes(formData.adType)
                    }
                    className="max-w-[600px]"
                  >
                    {loading ? "Loading..." : "Submit"}
                  </Button>
                </div>
              )}
              {formData.platform === "Facebook" && (
                <div className="flex flex-col gap-4">
                  <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
                    Facebook Campaign
                  </h1>
                  <p className="text-base font-normal text-gray-500">
                    fill in the Form to Create your Facebook ads Campaign
                  </p>
                  <div className="flex flex-col gap-4">
                    <label htmlFor="FacebookAdType">Ad Type</label>
                    <select
                      name="adType"
                      id="FacebookAdType"
                      className="rounded-md w-full bg-transparent"
                      value={formData.adType}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select Ad Type
                      </option>
                      {facebookAdTypes.map((type, i) => (
                        <>
                          <option value={type} key={i}>
                            {type}
                          </option>
                        </>
                      ))}
                    </select>
                  </div>
                  {formData.adType === "Text Ad" && (
                    <>
                      <div className="flex flex-col gap-4">
                        <label htmlFor="FacebookAdsTopic">Headline</label>
                        <input
                          className="rounded-md w-full px-4 "
                          id="FacebookAdsTopic"
                          name="headline"
                          value={formData.headline}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <label htmlFor="FacebookAdsDetails">Description</label>
                        <input
                          className="rounded-md w-full px-4 "
                          id="FacebookAdsDetails"
                        />
                      </div>
                    </>
                  )}
                  <Button
                    type="submit"
                    disabled={
                      !formData.adType ||
                      !facebookAdTypes.includes(formData.adType)
                    }
                    className="max-w-[600px]"
                  >
                    Submit
                  </Button>
                </div>
              )}
              {formData.platform === "X" && (
                <div className="flex flex-col gap-4">
                  <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
                    X Campaign
                  </h1>
                  <p className="text-base font-normal text-gray-500">
                    fill in the Form to Create your X ads Campaign
                  </p>
                  <textarea
                    onChange={(e) => setPosts(e.target.value)}
                    placeholder="your post"
                    value={posts}
                  ></textarea>
                </div>
              )}
              <div className="w-full flex items-center justify-center">
                <Button
                  type="button"
                  className="text-center bg-transparent text-primary font-bold hover:bg-transparent"
                  onClick={handlePrevious}
                >
                  Go back
                </Button>
              </div>
            </div>
            <div className="flex-1 w-full max-w-[600px] mx-auto">
              {formData.platform === "Google" && (
                <GoogleMock formData={formData} />
              )}
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default CreateCampaign;
