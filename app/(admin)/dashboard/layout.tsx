"use client"
import { useAuth } from "@/hooks/useAuth";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const authToken = useAuth();

  if (!authToken) {
    return null;
  }
  return <main className="w-screen h-screen overflow-hidden ">{children}</main>;
};

export default DashboardLayout;
