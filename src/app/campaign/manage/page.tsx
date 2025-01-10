import { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Manage Campaigns",
  description: "Manage ad campaigns and customer requests",
};

export default function AdminPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <AdminDashboard />
      </SidebarInset>
    </SidebarProvider>
  );
}
