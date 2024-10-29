"use client";

import * as React from "react";
import Link from "next/link";
import { CreditCard, Menu, Moon, Sun, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md transition-shadow duration-200 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Left - Mobile Menu and Logo */}
        <div className="flex items-center">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {["Home", "Dashboard", "Reports", "Settings", "Contact"].map(
                  (item) => (
                    <Link
                      key={item}
                      href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {item}
                    </Link>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              FraudScout
            </span>
          </Link>
        </div>

        {/* Center - Desktop Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {["Home", "Dashboard", "Reports", "Settings", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="transition-colors hover:text-primary"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right - User and Theme Settings */}
        <div className="flex items-center space-x-4">
          <Button>Get Started</Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" aria-label="Toggle theme">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
