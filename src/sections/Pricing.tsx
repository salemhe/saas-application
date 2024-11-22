import CheckIcon from '@/assets/check.svg'
import { twMerge } from 'tailwind-merge';

const pricingTiers = [
  {
    title: "Free",
    monthlyPrice: 0,
    buttonText: "Get started for free",
    popular: false,
    inverse: false,
    features: [
      "Up to 5 marketing campaigns",
      "1GB storage",
      "AI-generated ad copy",
      "Access to the marketing dashboard",
      "Basic integrations",
    ],
  },
  {
    title: "Pro",
    monthlyPrice: 15,
    buttonText: "Sign up now",
    popular: true,
    inverse: true,
    features: [
      "Up to 20 marketing campaigns",
      "10GB storage",
      "AI-generated ad copy + images",
      "Advanced integrations (Google, Meta, YouTube)",
      "Priority support",
      "Analytics and reporting",
      "Advanced support",
    ],
  },
  {
    title: "Business",
    monthlyPrice: 30,
    buttonText: "Sign up now",
    popular: false,
    inverse: false,
    features: [
      "Unlimited marketing campaigns",
      "50GB storage",
      "AI-generated ad copy, images, and custom ads",
      "Full integrations with Google, Meta, YouTube, and more",
      "Dedicated support & advanced analyticsr",
      "A/B testing",
      "Advanced analytics",
      "Campaign optimization tools",
      "API access for custom solutions",
      "Advanced security features",
    ],
  },
];

export const Pricing = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Pricing</h2>
          <p className="section-description mt-5">
          Get started for free. Unlock advanced marketing tools, automated campaigns, and premium features with an upgrade.
          </p>
        </div>
        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {pricingTiers.map(
            ({
              title,
              monthlyPrice,
              buttonText,
              popular,
              inverse,
              features,
            }) => (
              <div
                className={twMerge(
                  "card",
                  inverse ? "border-black bg-black text-white" : "bg-white"
                )}
              >
                <div className="flex justify-between">
                  <h3
                    className={twMerge(
                      "text-lg font-bold text-black/50",
                      inverse && "text-white/60"
                    )}
                  >
                    {title}
                  </h3>
                  {popular && (
                    <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                      <span className="bg-gradient-to-r from-[#DD7DDF] via-[#E1CD86] to-[#3BFFFF] text-transparent bg-clip-text font-medium">
                        Popular
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mt-[30px]">
                  <span className="text-4xl font-bold tracking-tighter leading-none">
                    ${monthlyPrice}
                  </span>
                  <span className="tracking-tight font-bold text-black/50">
                    /month
                  </span>
                </div>
                <button
                  className={twMerge(
                    "btn btn-primary w-full mt-[30px]",
                    inverse && "bg-white text-black"
                  )}
                >
                  {buttonText}
                </button>

                <ul className="flex flex-col gap-5 mt-8">
                  {features.map((feature) => (
                    <li className="text-sm flex items-center gap-4">
                      <CheckIcon className="h-6 w-6" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};


