"use client";

import { useState, createContext, useContext } from "react";
import Image from "next/image";
import { 
  Home, 
  LayoutDashboard, 
  StickyNote, 
  Calendar, 
  Layers, 
  Flag, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  UserCircle, 
  PlusCircle 
} from "lucide-react";  

import Logo from "@/assets/logosaas.png";  

const SidebarContext = createContext<{ expanded: boolean } | undefined>(undefined);

const menuItems = [
  { icon: <Home size={20} />, text: "Home", alert: true },
  { icon: <LayoutDashboard size={20} />, text: "Dashboard", active: true },
  { icon: <StickyNote size={20} />, text: "Projects", alert: true },
  { icon: <Calendar size={20} />, text: "Calendar" },
  { icon: <Layers size={20} />, text: "Tasks" },
  { icon: <Flag size={20} />, text: "Reporting" },
  { icon: <Settings size={20} />, text: "Settings" },
  { icon: <PlusCircle size={20} />, text: "Upgrade" },  
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <aside className="h-screen flex flex-col bg-white shadow-sm border-r">
        <div className="p-4 flex justify-between items-center">
          <Image src={Logo} alt="SaaS Logo" height={40} width={40} />
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
            aria-label="Toggle Sidebar"
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem key={item.text} {...item} />
          ))}
        </nav>

        <div className="border-t p-3 flex items-center">
          <UserCircle size={40} /> 
          {expanded && (
            <div className="ml-3 flex-1">
              <h4 className="font-semibold">user</h4>
              <p className="text-xs text-gray-600">user@gmail.com</p>
            </div>
          )}
          <MoreVertical size={20} />
        </div>
      </aside>
    </SidebarContext.Provider>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
}

const SidebarItem = ({ icon, text, active = false, alert = false }: SidebarItemProps) => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarContext must be used within a SidebarProvider");
  }

  const { expanded } = context;

  return (
    <li
      className={`relative flex items-center py-2 px-3 rounded-md cursor-pointer group transition-colors ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {icon}
      {expanded && <span className="ml-3">{text}</span>}
      {alert && <span className="absolute right-2 w-2 h-2 rounded-full bg-indigo-400"></span>}
      {!expanded && (
        <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-sm transition-all invisible opacity-0 group-hover:visible group-hover:opacity-100">
          {text}
        </div>
      )}
    </li>
  );
};

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">Content goes here</main>
    </div>
  );
}
