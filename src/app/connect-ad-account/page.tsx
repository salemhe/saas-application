"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConnectionStatus {
  facebook: boolean;
  google: boolean;
}

interface FacebookAuthResponse {
  authResponse: {
    accessToken: string;
    userID: string;
    expiresIn: string;
    signedRequest: string;
  } | null;
  status: string;
}

interface GoogleAuthResponse {
  getAuthResponse(): {
    access_token: string;
    id_token: string;
    expires_at: number;
    expires_in: number;
    scope: string;
  };
}

declare global {
  interface Window {
    FB: {
      init(params: { appId: string; xfbml: boolean; version: string }): void;
      login(
        callback: (response: FacebookAuthResponse) => void,
        options: { scope: string }
      ): void;
    };
    gapi: {
      auth2: {
        init(params: { client_id: string; scope: string }): Promise<void>;
        getAuthInstance(): {
          signIn(): Promise<GoogleAuthResponse>;
        };
      };
    };
  }
}

export default function AdAccountConnector(): JSX.Element {
  const [status, setStatus] = useState<ConnectionStatus>({
    facebook: false,
    google: false,
  });

  useEffect(() => {
    // Load Facebook SDK
    const loadFacebookSDK = () => {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
         console.log("Facebook SDK loaded");
         window.FB?.init({
           appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
           version: "v18.0",
           xfbml: true,
         });
       };
       
    };

    // Load Google Ads API
    const loadGoogleAdsAPI = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadFacebookSDK();
    loadGoogleAdsAPI();
  }, []);

  const connectFacebookAds = (): void => {
   if (!window.FB) {
     console.error("Facebook SDK not loaded");
     return;
   }
 
   window.FB.login(
     async (response: FacebookAuthResponse) => {
       if (response.authResponse) {
         setStatus((prev) => ({ ...prev, facebook: true }));
         const accessToken = response.authResponse.accessToken;
 
         try {
           const res = await fetch("/api/connect-ad-account", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               token: accessToken,
               adAccountId: "Dynamic-Ad-Account-ID", // Update or remove if not needed
             }),
           });
 
           if (!res.ok) {
             const errorData = await res.json();
             console.error("API Error:", errorData.message || "Unknown error");
             return;
           }
 
           localStorage.setItem("fb_access_token", accessToken);
         } catch (error) {
           console.error("Error connecting to Facebook Ads:", error);
         }
       }
     },
     { scope: "ads_management,ads_read" }
   );
 };
 

  const connectGoogleAds = async (): Promise<void> => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const scope = "https://www.googleapis.com/auth/adwords";

    try {
      await window.gapi.auth2.init({
        client_id: clientId,
        scope,
      });

      const response = await window.gapi.auth2.getAuthInstance().signIn();
      setStatus((prev) => ({ ...prev, google: true }));
      const token = response.getAuthResponse().access_token;

      // Call backend API
      try {
        const res = await fetch("/api/connect-ad-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            adAccountId: "Your-Google-Ad-Account-ID", // Replace with actual ad account ID if available
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to connect to Google Ads account");
        }

        localStorage.setItem("google_access_token", token);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error("Google Ads connection failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Connect Ad Accounts</h2>
      </CardHeader>
      <CardContent className="space-y-4">
      <Button
         onClick={() => connectFacebookAds()} // Correct: Wrap async call in a regular function
         className="w-full"
         disabled={status.facebook}
         >
         {status.facebook ? "Facebook Ads Connected" : "Connect Facebook Ads"}
         </Button>

         <Button
         onClick={() => connectGoogleAds()} // Correct: Wrap async call in a regular function
         className="w-full"
         disabled={status.google}
         >
         {status.google ? "Google Ads Connected" : "Connect Google Ads"}
         </Button>

      </CardContent>
    </Card>
  );
}
