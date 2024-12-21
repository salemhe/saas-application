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
import CampaignForm from "@/components/CampainForm";

function Page() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
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

  // Simulate loader timeout for 3 seconds before content renders
  useEffect(() => {
    if (authenticated) {
      setTimeout(() => {
        setLoading(false);  // Hide loader after 3 seconds
      }, 2000);
    }
  }, [authenticated]);

  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <Header />
      <main className="flex-1">
        {loading ? (
          <div className="flex-1 p-6 flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-dashed border-blue-500 animate-spin border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="max-w-4xl w-full mx-auto mt-12 p-12 flex-1">
            <CampaignForm/>
            {/* <h1 className="text-2xl font-semibold">Campaign Content</h1>
            <p className="mt-4 text-gray-600">This is the content for Campaign.</p> */}
          </div>
        )}
      </main>
    </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;