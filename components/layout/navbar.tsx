'use client'

import * as React from "react"
import { CreditCard, Menu, Moon, Sun, User, Bell, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "@/components/layout/ThemeContext"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "Dashboard", href: "#dashboard" },
  { name: "Features", href: "#features" },
  { name: "FAQs", href: "#faq" },
  { name: "Contact", href: "#footer" },
]

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleScroll = React.useCallback(() => {
    setIsScrolled(window.scrollY > 0)
  }, [])

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search query:", searchQuery)
    setSearchOpen(false)
    setSearchQuery("")
  }

  const handleLogout = () => {
    // Implement logout logic here
    window.location.href = "/login"
  }

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Left - Mobile Menu and Logo */}
        <div className="flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => scrollToSection(item.href)}
                  >
                    {item.name}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            onClick={() => scrollToSection('#home')}
            className="flex items-center space-x-2"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <CreditCard className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="hidden font-bold sm:inline-block">
              FraudScout
            </span>
          </Button>
        </div>

        {/* Center - Desktop Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className="relative transition-colors hover:text-primary group"
              onClick={() => scrollToSection(item.href)}
            >
              {item.name}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transition-transform scale-x-0 group-hover:scale-x-100" />
            </Button>
          ))}
        </nav>

        {/* Right - User and Theme Settings */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "200px" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute right-20 top-3"
                onSubmit={handleSearchSubmit}
              >
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <Button onClick={() => scrollToSection('#home')}>Get Started</Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => scrollToSection('#home')}>New message</DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection('#dashboard')}>Account update</DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection('#features')}>Security alert</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                aria-label="User menu"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => scrollToSection('#home')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection('#dashboard')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection('#faqs')}>FAQs</DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection('#contact')}>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <Sun className={`h-5 w-5 transition-all duration-300 ${isDarkMode ? "rotate-0 scale-0" : "rotate-0 scale-100"}`} />
            <Moon className={`absolute h-5 w-5 transition-all duration-300 ${isDarkMode ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}