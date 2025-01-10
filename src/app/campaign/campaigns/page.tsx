import { Metadata } from "next";
import CampaignList from "@/components/CampaignList";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "All Campaigns",
  description: "View and manage all your advertising campaigns",
};

export default function CampaignsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <CampaignList />
      </SidebarInset>
    </SidebarProvider>
  );
}
