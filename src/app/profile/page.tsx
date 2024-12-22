"use client"
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../firebase'; 
import ProfileComponent from '../../components/UserProfile'; 
import { onAuthStateChanged } from 'firebase/auth';

export default function ProfilePage() {
   const [authenticated, setAuthenticated] = useState(false);
   const router = useRouter()
 
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (user) {
         setAuthenticated(true); // User is logged in
       } else {
         setAuthenticated(false); // User is not logged in
         router.push("/auth?mode=login"); // Redirect to login page
       }
     });
 
     // Cleanup subscription on unmount
     return () => unsubscribe();
   }, [router]);

   if (!authenticated) {
      return null; // Avoid rendering the component until redirection completes
    }

  return  <ProfileComponent />;
}