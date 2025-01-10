"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CampaignPopup } from "./Campaign-Popup";

const campaigns = [
  {
    id: 1,
    name: "Summer Sale",
    platform: "Facebook",
    status: "Active",
    budget: 5000,
    startDate: "2023-06-01",
    endDate: "2023-06-30",
  },
  {
    id: 2,
    name: "New Product Launch",
    platform: "Instagram",
    status: "Scheduled",
    budget: 10000,
    startDate: "2023-07-01",
    endDate: "2023-07-31",
  },
  {
    id: 3,
    name: "Brand Awareness",
    platform: "Billboard",
    status: "Active",
    budget: 15000,
    startDate: "2023-06-15",
    endDate: "2023-08-15",
  },
  {
    id: 4,
    name: "Holiday Special",
    platform: "Radio",
    status: "Draft",
    budget: 7500,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
  },
  {
    id: 5,
    name: "Back to School",
    platform: "Facebook",
    status: "Ended",
    budget: 6000,
    startDate: "2023-08-01",
    endDate: "2023-08-31",
  },
];

export default function CampaignList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterPlatform === "all" || campaign.platform === filterPlatform)
  );

  return (
    <div className="mx-auto px-4 py-8 space-y-8 w-full p-4 md:p-16 sm:p-4 sm:mt-10 mt-8 max-w-[360px] md:max-w-full">
      <h1 className="text-3xl font-bold mb-6">All Campaigns</h1>
      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>
            View and manage all your advertising campaigns across different
            platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3">
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Billboard">Billboard</SelectItem>
                  <SelectItem value="Radio">Radio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CampaignPopup />
          </div>
          <div className="overflow-x-auto w-full">
            <div className="w-full min-w-max">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        {campaign.name}
                      </TableCell>
                      <TableCell>{campaign.platform}</TableCell>
                      <TableCell>{campaign.status}</TableCell>
                      <TableCell>${campaign.budget.toLocaleString()}</TableCell>
                      <TableCell>{campaign.startDate}</TableCell>
                      <TableCell>{campaign.endDate}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>{" "}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
