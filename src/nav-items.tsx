
import { HomeIcon, SearchIcon, HeartIcon, MessageSquareIcon, UserIcon } from "lucide-react";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import ListingDetails from "./pages/ListingDetails";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Search",
    to: "/listings",
    icon: <SearchIcon className="h-4 w-4" />,
    page: <Listings />,
  },
  {
    title: "Listing Details",
    to: "/listing",
    icon: <SearchIcon className="h-4 w-4" />,
    page: <ListingDetails />,
    hidden: true, // Hide from navigation menu
  },
  {
    title: "Favorites",
    to: "/favorites",
    icon: <HeartIcon className="h-4 w-4" />,
    page: <div>Favorites Page</div>,
  },
  {
    title: "Messages",
    to: "/messages",
    icon: <MessageSquareIcon className="h-4 w-4" />,
    page: <div>Messages Page</div>,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <UserIcon className="h-4 w-4" />,
    page: <div>Profile Page</div>,
  },
];
