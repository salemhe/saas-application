"use client"
import React, {useEffect, useState} from 'react';
import { redirect } from 'next/navigation';
import { auth } from '../../../firebase'; // Adjust the import path as needed
import ProfileComponent from '../../components/UserProfile'; // We'll create this component next
import { onAuthStateChanged } from 'firebase/auth';

export default function ProfilePage() {
   const [authenticated, setAuthenticated] = useState(false);
   
 
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (user) {
         setAuthenticated(true); // User is logged in
       } else {
         setAuthenticated(false); // User is not logged in
         redirect("/auth?mode=login"); // Redirect to login page
       }
     });
 
     // Cleanup subscription on unmount
     return () => unsubscribe();
   }, []);

   if (!authenticated) {
      return null; // Avoid rendering the component until redirection completes
    }

  return <ProfileComponent />;
}