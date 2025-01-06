// Your imports and global declarations remain unchanged
import Image1 from '@/assets/Tiger.png';
import Image2 from '@/assets/Screenshot.png';
import Image3 from '@/assets/image1.png';
import Image from 'next/image';
import { useContext } from 'react';
import { Campaign } from '@/context/CampaignContext';
import React, { useEffect, useState } from 'react';
import { auth, db } from "../../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';

interface FacebookAuthResponse {
  authResponse: {
    accessToken: string;
    scope: any;
    userID: string;
    expiresIn: string;
    signedRequest: string;
    grantedScopes: any;

  } | null;
  status: string;
}

declare global {
  interface Window {
    FB: {
      [x: string]: any;
      init(params: { appId: string; xfbml: boolean; version: string; cookie: boolean; status: boolean; }): void;
      login(
        callback: (response: FacebookAuthResponse) => void,
        options: { scope: string, return_scopes: boolean, auth_type: string, }
      ): void;
    };
  }
}

export const LinkCampaign = () => {
  const { isConnected, setIsConnected } = useContext(Campaign);
  const router = useRouter()

  const [accounts, setAccounts] = useState([
    { name: "Facebook", icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",  isConnected  },
    { name: "Instagram", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",  isConnected  },
  ]);
  const user = auth.currentUser;
  const images = [Image1, Image2, Image3];
  
  // const [status, setStatus] = useState<ConnectionStatus>({
  //   facebook: false,
  // });

  useEffect(() => {
    if (!user) return;

    const fetchAccountStatus = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const connectedAccounts = userData.accounts || {};

          // Update local state based on Firestore data
          setAccounts((prevAccounts) =>
            prevAccounts.map((account) => ({
              ...account,
              isConnected: !!connectedAccounts[account.name]?.isConnected,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching account status from Firestore:", error);
      }
    };

    fetchAccountStatus();
  }, [user]);

  // Update Firestore when account connection status changes
  const updateFirestore = async (accountName: string, isConnected: boolean, accessToken?: string, additionalData = {}) => {
    if (!user) return;
  
    try {
      const userDocRef = doc(db, "users", user.uid);
      const updateData = isConnected
        ? {
            [`accounts.${accountName}`]: {
              accessToken,
              isConnected,
              lastUpdated: new Date().toISOString(),
              connectedAt: new Date().toISOString(),
              ...additionalData
            },
          }
        : {
            [`accounts.${accountName}`]: {
              accessToken: null,
              isConnected,
              lastUpdated: new Date().toISOString(),
              disconnectedAt: new Date().toISOString(),
            },
          };
  
      await updateDoc(userDocRef, updateData);
  
      // Update local UI state after Firestore update is successful
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.name === accountName ? { ...acc, isConnected } : acc
        )
      );
    } catch (error) {
      console.error("Error updating Firestore:", error);
      throw error; // Propagate error to handle it in the calling function
    }
  };
  

  // Initialize Facebook SDK with additional options
useEffect(() => {
  const loadFacebookSDK = () => {
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.FB?.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        version: "v18.0",
        xfbml: true,
        cookie: true, // Enable cookies to allow the server to access the session
        status: true  // Check login status
      });
    };
  };

  loadFacebookSDK();
}, []);
  


  const handleFacebookLogin = async () => { 
    if (!window.FB) {
      alert("Facebook SDK not loaded");
      return;
    }

  
    try {
      const loginResponse = await new Promise<FacebookAuthResponse>((resolve, reject) => {
        window.FB.login((response: FacebookAuthResponse) => {
          if (response.authResponse) {
            resolve(response);
          } else {
            reject(new Error("Facebook login failed or was cancelled by user"));
          }
        }, { scope: "ads_read,ads_management,business_management,pages_manage_ads", return_scopes: true, auth_type: "rerequest" });
      });
  
      if (!loginResponse?.authResponse?.accessToken) {
        throw new Error("No access token received");
      }
  
      const accessToken = loginResponse.authResponse.accessToken;
  
      // Check for Facebook Pages first
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token&access_token=${accessToken}`
      );
      
      if (!pagesResponse.ok) {
        throw new Error("Failed to fetch Facebook pages");
      }
  
      const pagesData = await pagesResponse.json();
      if (!pagesData.data?.length) {
        throw new Error(
          "No Facebook pages found. Please create a Facebook page before connecting your account for ads."
        );
      }
  
      // Then check for ad accounts
      const adAccountsResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status&access_token=${accessToken}`
      );
      
      if (!adAccountsResponse.ok) {
        throw new Error("Failed to fetch ad accounts");
      }
  
      const adAccountsData = await adAccountsResponse.json();
      if (!adAccountsData.data?.length) {
        throw new Error(
          "No ad accounts found. Please set up a Facebook Ads account before connecting."
        );
      }
  
      return {
        accessToken,
        pages: pagesData.data,
        adAccounts: adAccountsData.data
      };
    } catch (error: any) {
      // Convert specific errors into user-friendly messages
      const errorMessage = error.message.includes("Facebook page")
      ? error.message
      : error.message.includes("ad accounts")
      ? error.message
      : "Failed to connect Facebook account. Please try again.";
      
      throw new Error(errorMessage);
    }
  };
  
  const handleInstagramLogin = async () => {
    if (!window.FB) {
      alert("Facebook SDK not loaded");
      return;
    }

  
    try {
      // Initiate Facebook login
      const loginResponse = await new Promise<FacebookAuthResponse>((resolve, reject) => {
        window.FB.login((response: FacebookAuthResponse) => {
          if (response.authResponse) {
            resolve(response);
          } else {
            reject(new Error("Facebook login failed or was cancelled by the user."));
          }
        }, { scope: "instagram_basic,instagram_manage_insights,pages_show_list", return_scopes: true, auth_type: "rerequest", });
      });
  
      if (loginResponse?.authResponse?.accessToken) {
        // Use access token to get Instagram account info
        const accessToken = loginResponse.authResponse.accessToken;
  
        const instagramResponse = await fetch(
          `https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account{name,username}&access_token=${accessToken}`
        );
  
        if (!instagramResponse.ok) {
          throw new Error("Failed to fetch Instagram account details.");
        }
  
        const { data } = await instagramResponse.json();
        if (data.length === 0) {
          throw new Error("No Instagram business account connected.");
        }
  
        const instagramAccount = data[0];
  
        // Update Firestore with Instagram account details
        await updateFirestore("Instagram", true, accessToken);
  
        // Update local state
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.name === "Instagram" ? { ...acc, isConnected: true } : acc
          )
        );
  
        alert(`Connected Instagram account: ${instagramAccount.name}`);
      }
    } catch (error: any) {
      console.error("Error connecting Instagram account:", error);
      alert(`Failed to connect Instagram account: ${error.message}`);
      throw error;
    }
  };
  
const handleDisconnect = async (accountName: string) => {
    if (!user) {
      console.error("No user logged in");
      return;
    }
    switch (accountName) {
      case "Facebook":
        try {
          if (!window.FB) {
            throw new Error("Facebook SDK is not loaded.");
          }

          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            throw new Error("User document does not exist in Firestore.");
          }

          const userData = userDoc.data();
          const accessToken = userData?.accounts?.Facebook?.accessToken;

           // First, try to revoke the token if we have one
          if (accessToken) {
            try {
              const response = await fetch('/api/revoke-facebook-token', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for CORS
                body: JSON.stringify({ accessToken }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                console.error('Token revocation failed:', errorData);
              }
            } catch (error) {
              console.error('Token revocation error:', error);
              // Continue with disconnect process even if token revocation fails
            }
          }

          // Logout from Facebook session
          await new Promise<void>((resolve) => {
            window.FB.getLoginStatus((response: any) => {
              if (response.status === 'connected') {
                window.FB.logout(() => resolve());
              } else {
                resolve();
              }
            });
          });


          // Update Firestore to reflect disconnection
          await updateDoc(userDocRef, {
            "accounts.Facebook": {
              accessToken: null,
              isConnected: false,
              disconnectedAt: new Date().toISOString(),
            },
          });

          // Clear local storage
          localStorage.removeItem("fb_access_token");

          // Update UI state
          setAccounts((prev) =>
            prev.map((acc) =>
              acc.name === accountName ? { ...acc, isConnected: false } : acc
            )
          );

          console.log(`${accountName} account successfully disconnected`);
        } catch (error) {
          console.error(`Error disconnecting ${accountName} account:`, error);
          // Show user-friendly error message
          alert(`Failed to disconnect ${accountName} account. Please try again.`);
          throw error;
        }
        break;

    case "Instagram":
      try {
        // Instagram disconnect logic would go here
        // For now, just update the UI state
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.name === "Instagram" ? { ...acc, isConnected: false } : acc
          )
        );

        console.log("Instagram account successfully disconnected");
      } catch (error) {
        console.error("Error disconnecting Instagram account:", error);
        throw error;
      }
      break;

    default:
      throw new Error(`Unsupported platform: ${accountName}`);
  }
};

const handleAccountToggle = async (accountName: string, isCurrentlyConnected: boolean) => {
  if (!isConnected) {
    router.push("#start-campaign")
  }
  setIsConnected(!isConnected);
  try {
    if (isCurrentlyConnected) {
      // Disconnect logic
      await handleDisconnect(accountName);
      await updateFirestore(accountName, false);
    } else {
      // Connect logic
      if (accountName === "Facebook") {
        const fbData: any = await handleFacebookLogin();
        
        await updateFirestore(accountName, true, fbData.accessToken, {
          adAccounts: fbData.adAccounts,
          pages: fbData.pages,
          lastUpdated: new Date().toISOString()
        });
      } else if (accountName === "Instagram") {
        await handleInstagramLogin();
      }
    }
  } catch (error) {
    console.error(`Failed to toggle ${accountName} connection:`, error);

    // Reset UI state to previous value in case of failure
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.name === accountName ? { ...acc, isConnected: isCurrentlyConnected } : acc
      )
    );

    alert(`Failed to ${isCurrentlyConnected ? "disconnect" : "connect"} ${accountName}.`);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-16 sm:p-4">
      <h2 className="text-xl font-bold mb-2">Ad Accounts</h2>
      <p className="text-gray-500 mb-6">
        Connect or disconnect your ad accounts at any time.
      </p>

      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.name}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <Image
                width={50}
                height={50}
                src={account.icon}
                alt={`${account.name} logo`}
                className="h-8 w-8 object-contain"
              />
              <span className="font-medium text-gray-800">{account.name}</span>
            </div>
            <button
              onClick={() => handleAccountToggle(account.name, account.isConnected)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 border-2 border-blue-500 ${
                account.isConnected
                  ? "bg-red-500 hover:bg-white border-red-500 text-white active:text-red-500 active:bg-white hover:text-red-500"
                  : "bg-blue-500 hover:bg-white border-blue-500 text-white hover:text-blue-500 active:bg-white active:text-blue-500"
              }`}
            >
              {account.isConnected ? "Disconnect Account" : "Connect Account"}
            </button>
          </div>
        ))}
      </div>

      {/* Grid for Images */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`rounded-lg overflow-hidden shadow-sm ${
              index >= 2 && "lg:block hidden" // Hide the third image on small and medium devices
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


