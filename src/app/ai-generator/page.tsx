"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Header from "../../components/header"
import Chatbot from "@/components/Chatbot"





function Page() {
   const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

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
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="max-w-[900px] w-full mx-auto text-center">
          <Chatbot />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page


