// types/facebook.ts

export const FACEBOOK_CTA_TYPES = {
   // Most commonly used CTAs
   SHOP_NOW: "Shop Now",
   LEARN_MORE: "Learn More",
   SIGN_UP: "Sign Up",
   BOOK_NOW: "Book Now",
   DOWNLOAD: "Download",
   GET_OFFER: "Get Offer",
   CONTACT_US: "Contact Us",
   MESSAGE_PAGE: "Message Page",
   WATCH_MORE: "Watch More",
   // Additional CTAs
   BUY_NOW: "Buy Now",
   GET_QUOTE: "Get Quote",
   SUBSCRIBE: "Subscribe",
   CALL_NOW: "Call Now",
   DONATE_NOW: "Donate Now",
   APPLY_NOW: "Apply Now"
 } as const;
 
 // Utility type to get API values
 export type FacebookCtaType = keyof typeof FACEBOOK_CTA_TYPES;
 
 // Utility functions
 export const getCtaDisplayName = (apiValue: FacebookCtaType): string => {
   return FACEBOOK_CTA_TYPES[apiValue] || apiValue;
 };
 
 export const getCtaApiValue = (displayName: string): FacebookCtaType => {
   const entry = Object.entries(FACEBOOK_CTA_TYPES).find(
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     ([_, value]) => value === displayName
   );
   return (entry?.[0] as FacebookCtaType) || "LEARN_MORE";
 };
 
 