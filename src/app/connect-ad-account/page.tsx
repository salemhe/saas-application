// "use client";
// import React, { useState, useEffect } from "react";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface ConnectionStatus {
//   facebook: boolean;
//   google: boolean;
// }

// interface FacebookAuthResponse {
//   authResponse: {
//     accessToken: string;
//     userID: string;
//     expiresIn: string;
//     signedRequest: string;
//   } | null;
//   status: string;
// }

// interface GoogleAuthResponse {
//   getAuthResponse(): {
//     access_token: string;
//     id_token: string;
//     expires_at: number;
//     expires_in: number;
//     scope: string;
//   };
// }

// declare global {
//   interface Window {
//     FB: {
//       init(params: { appId: string; xfbml: boolean; version: string }): void;
//       login(
//         callback: (response: FacebookAuthResponse) => void,
//         options: { scope: string }
//       ): void;
//     };
//     gapi: {
//       auth2: {
//         init(params: { client_id: string; scope: string }): Promise<void>;
//         getAuthInstance(): {
//           signIn(): Promise<GoogleAuthResponse>;
//         };
//       };
//     };
//   }
// }

// export default function AdAccountConnector(): JSX.Element {
//   const [status, setStatus] = useState<ConnectionStatus>({
//     facebook: false,
//     google: false,
//   });

//   useEffect(() => {
//     const loadFacebookSDK = () => {
//       const script = document.createElement("script");
//       script.src = "https://connect.facebook.net/en_US/sdk.js";
//       script.async = true;
//       script.defer = true;
//       document.body.appendChild(script);

//       script.onload = () => {
//         console.log("Facebook SDK loaded");
//         window.FB?.init({
//           appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
//           version: "v18.0",
//           xfbml: true,
//         });
//       };
//     };

//     const loadGoogleAdsAPI = () => {
//       const script = document.createElement("script");
//       script.src = "https://apis.google.com/js/api.js";
//       script.async = true;
//       script.defer = true;
//       document.body.appendChild(script);
//     };

//     loadFacebookSDK();
//     loadGoogleAdsAPI();
//   }, []);

//   const handleFacebookLogin = () => {
//     if (!window.FB) {
//         console.error("Facebook SDK not loaded");
//         return;
//     }

//     window.FB.login(
//         (response: FacebookAuthResponse) => {
//             if (response.authResponse) {
//                 console.log("Facebook login successful:", response);
//                 setStatus((prev) => ({ ...prev, facebook: true }));
//                 const accessToken = response.authResponse.accessToken;
//                 handleFacebookTokenSubmission(accessToken).catch(console.error);
//             } else {
//                 console.error("Facebook login failed:", response);
//             }
//         },
//         {
//             scope: "ads_read business_management",
//         }
//     );
// };


//   const handleFacebookTokenSubmission = async (accessToken: string) => {
//     try {
//       const res = await fetch("/api/connect-ad-account", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           token: accessToken,
//           adAccountId: "Dynamic-Ad-Account-ID",
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Unknown error");
//       }

//       localStorage.setItem("fb_access_token", accessToken);
//     } catch (error) {
//       console.error("Error connecting to Facebook Ads:", error);
//       setStatus((prev) => ({ ...prev, facebook: false }));
//     }
//   };

//   const handleGoogleLogin = () => {
//     void connectGoogleAds();
//   };

//   const connectGoogleAds = async () => {
//     const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
//     const scope = "https://www.googleapis.com/auth/adwords";

//     try {
//       await window.gapi.auth2.init({
//         client_id: clientId,
//         scope,
//       });

//       const response = await window.gapi.auth2.getAuthInstance().signIn();
//       setStatus((prev) => ({ ...prev, google: true }));
//       const token = response.getAuthResponse().access_token;

//       try {
//         const res = await fetch("/api/connect-ad-account", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             token,
//             adAccountId: "Your-Google-Ad-Account-ID",
//           }),
//         });

//         if (!res.ok) {
//           throw new Error("Failed to connect to Google Ads account");
//         }

//         localStorage.setItem("google_access_token", token);
//       } catch (error) {
//         console.error(error);
//         setStatus((prev) => ({ ...prev, google: false }));
//       }
//     } catch (error) {
//       console.error("Google Ads connection failed:", error);
//       setStatus((prev) => ({ ...prev, google: false }));
//     }
//   };

//   const fetchFacebookAdReports = async (adAccountId: string, accessToken: string | null) => {
//     if (!accessToken) {
//       throw new Error("No access token available");
//     }
    
//     const url = `https://graph.facebook.com/v18.0/${adAccountId}/insights?access_token=${accessToken}`;
//     const response = await fetch(url);
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error?.message || "Failed to fetch Facebook ad reports");
//     }

//     return data;
//   };

//   const fetchGoogleAdReports = async (accessToken: string | null) => {
//     if (!accessToken) {
//       throw new Error("No access token available");
//     }

//     const url = "https://googleads.googleapis.com/v12/customers/YOUR_CUSTOMER_ID/googleAds:search";
//     const body = {
//       query: "SELECT campaign.id, campaign.name, metrics.impressions, metrics.clicks FROM campaign",
//     };

//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error?.message || "Failed to fetch Google ad reports");
//     }

//     return data;
//   };

//   const handleFetchReports = () => {
//     void (async () => {
//       try {
//         if (status.facebook) {
//           const fbAccessToken = localStorage.getItem("fb_access_token");
//           const adReports = await fetchFacebookAdReports("YOUR_AD_ACCOUNT_ID", fbAccessToken);
//           console.log("Facebook Ad Reports:", adReports);
//         }

//         if (status.google) {
//           const googleAccessToken = localStorage.getItem("google_access_token");
//           const adReports = await fetchGoogleAdReports(googleAccessToken);
//           console.log("Google Ad Reports:", adReports);
//         }
//       } catch (error) {
//         console.error("Error fetching ad reports:", error);
//       }
//     })();
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <h2 className="text-2xl font-bold">Connect Ad Accounts</h2>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <Button
//           onClick={handleFacebookLogin}
//           className="w-full"
//           disabled={status.facebook}
//         >
//           {status.facebook ? "Facebook Ads Connected" : "Connect Facebook Ads"}
//         </Button>

//         <Button
//           onClick={handleGoogleLogin}
//           className="w-full"
//           disabled={status.google}
//         >
//           {status.google ? "Google Ads Connected" : "Connect Google Ads"}
//         </Button>

//         <Button
//           onClick={handleFetchReports}
//           className="w-full"
//         >
//           Fetch Ad Reports
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }


function page() {
  return (
    <div>
      
    </div>
  )
}

export default page

// const handleFacebookTokenSubmission = async (accessToken: string) => {
  //   if (!user) return;
  
  //   try {
  //     // const tokenURL = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`;
  //     // First verify the token is valid
  //     const tokenVerificationResponse = await fetch(
  //       `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`
  //     );
  
  //     if (!tokenVerificationResponse.ok) {
  //       throw new Error('Failed to verify Facebook token');
  //     }
  
  //     // Prepare the request body
  //     const requestBody = {
  //       token: accessToken,
  //       adAccountId: "Dynamic-Ad-Account-ID", // You might want to make this dynamic
  //       userId: user.uid
  //     };
  //     console.log("AccessToken before saving:", accessToken);

  //     // Make the API call
  //     const response = await fetch("/api/connect-ad-account", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // Add any additional headers your API needs
  //         "Accept": "application/json"
  //       },
  //       body: JSON.stringify(requestBody)
  //     });
  
  //     // Check if response is ok before trying to parse JSON
  //     if (!response.ok) {
  //       // Try to get error message from response
  //       let errorMessage;
  //       try {
  //         const errorData = await response.json();
  //         errorMessage = errorData.message;
  //       } catch {
  //         errorMessage = `HTTP error! status: ${response.status}`;
  //       }
  //       throw new Error(errorMessage || "Failed to connect ad account");
  //     }
  
  //     // Ensure we have a valid JSON response
  //     let responseData;
  //     try {
  //       responseData = await response.json();
  //     } catch {
  //       throw new Error("Invalid response from server")
  //     }
  
  //     // If we get here, the connection was successful
  //     // Update Firestore
  //     const userDocRef = doc(db, "users", user.uid);
  //     await updateDoc(userDocRef, {
  //       "accounts.Facebook": {
  //         accessToken: accessToken,
  //         isConnected: true,
  //         connectedAt: new Date().toISOString(),
  //         lastUpdated: new Date().toISOString()
  //       }
  //     });
  
  //     // Update local storage
  //     localStorage.setItem("fb_access_token", accessToken);
      
  //     // Update UI state
  //     setAccounts((prev) =>
  //       prev.map((acc) =>
  //         acc.name === "Facebook" ? { ...acc, isConnected: true } : acc
  //       )
  //     );
  
  //     return responseData;
  
  //   } catch (error: any) {
  //     console.error("Error connecting to Facebook Ads:", error);
      
  //     // Show user-friendly error message
  //     const errorMessage = error.message || "Failed to connect to Facebook Ads";
  //     // You might want to add a toast or alert here
  //     alert(errorMessage)
  //     // Reset states
  //     setStatus((prev) => ({ ...prev, facebook: false }));
  //     throw error;
  //   }
  // };
  
  // Modified login handler with better error handling