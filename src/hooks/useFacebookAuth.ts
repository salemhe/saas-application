import { useState, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

interface FacebookAuthResponse {
  authResponse: {
    accessToken: string;
    expiresIn: string;
    userID: string;
  } | null;
  status: string;
}

export const useFacebookAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const refreshFacebookToken = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      window.FB.login((response: FacebookAuthResponse) => {
        if (response.authResponse?.accessToken) {
          setAccessToken(response.authResponse.accessToken);
          setIsTokenExpired(false);
          resolve(response.authResponse.accessToken);
        } else {
          setAccessToken(null);
          setIsTokenExpired(true);
          reject(new Error('Failed to refresh Facebook token'));
        }
      }, {
        scope: 'ads_read,ads_management,business_management,pages_manage_ads',
        return_scopes: true,
        auth_type: 'reauthorize'
      });
    });
  }, []);

  const updateFirestoreToken = async (newToken: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      'accounts.Facebook.accessToken': newToken,
      'accounts.Facebook.lastUpdated': new Date().toISOString()
    });
  };

  const getValidToken = useCallback(async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // If we have a token in state, try to use it first
    if (accessToken && !isTokenExpired) {
      try {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/debug_token?input_token=${accessToken}&access_token=${accessToken}`
        );
        const data = await response.json();
        if (data.data?.is_valid) {
          return accessToken;
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        setIsTokenExpired(true);
      }
    }

    // If no valid token in state, try Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    const storedToken = userData?.accounts?.Facebook?.accessToken;

    if (!storedToken) {
      setIsTokenExpired(true);
      throw new Error('No Facebook token found');
    }

    // Validate stored token
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/debug_token?input_token=${storedToken}&access_token=${storedToken}`
      );
      const data = await response.json();
      
      if (data.data?.is_valid) {
        setAccessToken(storedToken);
        setIsTokenExpired(false);
        return storedToken;
      }
      
      setIsTokenExpired(true);
    } catch (error) {
      console.error('Token validation failed:', error);
      setIsTokenExpired(true);
    }

    // If we get here, token is invalid or expired - refresh it
    try {
      const newToken = await refreshFacebookToken();
      await updateFirestoreToken(newToken);
      setAccessToken(newToken);
      setIsTokenExpired(false);
      return newToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setAccessToken(null);
      setIsTokenExpired(true);
      throw new Error('Failed to refresh Facebook token');
    }
  }, [accessToken, isTokenExpired, refreshFacebookToken]);

  const logout = useCallback(async () => {
    setAccessToken(null);
    setIsTokenExpired(true);
    
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        'accounts.Facebook.accessToken': null,
        'accounts.Facebook.lastUpdated': new Date().toISOString(),
        'accounts.Facebook.isConnected': false
      });
    }
  }, []);

  return {
    accessToken,
    isTokenExpired,
    getValidToken,
    refreshFacebookToken,
    logout
  };
};