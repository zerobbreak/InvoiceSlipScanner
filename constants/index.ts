import { ReviewInputProps } from "./types";

// Define and initialize formData using useState
import React, { useState } from "react";
interface HomeCardProps {
  route: any;
  icon: any;
  title: string;
  description: string;
}

export const homeCards: HomeCardProps[] = [
  {
    route: "/scan",
    icon: "camera-outline",
    title: "Scan Slip",
    description: "Capture a new invoice or receipt",
  },
  {
    route: "/budget",
    icon: "wallet-outline",
    title: "Manage Budgets",
    description: "Create, edit and view budgets",
  },
  {
    route: "/document",
    icon: "document-text-outline",
    title: "View Documents",
    description: "Access 12 stored slips",
  },
];

export interface RecentSlip {
  id: number;
  title: string;
  date: string;
  budget: string;
  category: string;
}

export const recentSlips: RecentSlip[] = [
  {
    id: 1,
    title: "Slip #1",
    date: "2025-04-15",
    budget: "SmartHydro",
    category: "Expense Claim",
  },
  {
    id: 2,
    title: "Slip #2",
    date: "2025-04-14",
    budget: "MovewithMe",
    category: "Purchase Order",
  },
  {
    id: 3,
    title: "Slip #3",
    date: "2025-04-13",
    budget: "SATNAC Conference",
    category: "Advance",
  },
];

export const stats = [
  { label: "Total Slips", value: "12", icon: "document-text-outline" },
  { label: "Monthly Spending", value: "$450", icon: "cash-outline" },
  { label: "Pending Reviews", value: "3", icon: "alert-circle-outline" },
];

export const documents = [
  {
    id: 1,
    title: "Slip #1",
    date: "2025-04-15",
    budget: "SmartHydro",
    category: "Expense Claim",
  },
  {
    id: 2,
    title: "Slip #2",
    date: "2025-04-16",
    budget: "MovewithMe",
    category: "Travel",
  },
  {
    id: 3,
    title: "Slip #3",
    date: "2025-04-17",
    budget: "SATNAC Conference",
    category: "Hotel",
  },
  {
    id: 4,
    title: "Slip #4",
    date: "2025-04-18",
    budget: "SmartHydro",
    category: "Supplies",
  },
  {
    id: 5,
    title: "Slip #5",
    date: "2025-04-19",
    budget: "MovewithMe",
    category: "Food",
  },
  {
    id: 6,
    title: "Slip #6",
    date: "2025-04-20",
    budget: "SmartHydro",
    category: "Expense Claim",
  },
  {
    id: 7,
    title: "Slip #7",
    date: "2025-04-21",
    budget: "SATNAC Conference",
    category: "Conference Fee",
  },
  {
    id: 8,
    title: "Slip #8",
    date: "2025-04-22",
    budget: "MovewithMe",
    category: "Transport",
  },
  {
    id: 9,
    title: "Slip #9",
    date: "2025-04-23",
    budget: "SmartHydro",
    category: "Equipment",
  },
  {
    id: 10,
    title: "Slip #10",
    date: "2025-04-24",
    budget: "MovewithMe",
    category: "Travel",
  },
  {
    id: 11,
    title: "Slip #11",
    date: "2025-04-25",
    budget: "SATNAC Conference",
    category: "Accommodation",
  },
  {
    id: 12,
    title: "Slip #12",
    date: "2025-04-26",
    budget: "SmartHydro",
    category: "Supplies",
  },
];
