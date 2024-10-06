"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Tag, Package, Activity, ArrowRight } from "lucide-react";

function AdminDashboard() {
  const [sidebarState, setSidebarState] = useState(false);
  const [stats] = useState({
    totalUsers: 1250,
    totalCategories: 15,
    totalTags: 48,
    totalProducts: 324,
  });

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} />
      <div
        style={{
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarState ? "250px" : "0",
          width: "100%",
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/users" className="w-full">
                  <Button className="w-full">
                    Go to Users
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activity Categories</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCategories}</div>
                <p className="text-xs text-muted-foreground">+1 new category this week</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/categories" className="w-full">
                  <Button className="w-full">
                    Manage Categories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Preference Tags</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTags}</div>
                <p className="text-xs text-muted-foreground">+3 new tags this month</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/tags" className="w-full">
                  <Button className="w-full">
                    Manage Tags
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">+12 new products this week</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/products" className="w-full">
                  <Button className="w-full">
                    Manage Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
export default AdminDashboard;