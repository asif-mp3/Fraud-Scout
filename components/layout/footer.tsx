'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Mail, Phone, Instagram } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background text-foreground ">
      <div className="container mx-auto px-6 py-12 pt-7">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">
              FraudScout
            </h3>
            <p className="text-sm text-muted-foreground">
              Smart Solutions for Safer Transactions.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={cn(
                    "rounded-full p-2 transition-all duration-300",
                    "hover:bg-primary/10 hover:text-primary",
                    "group relative",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                  <span className="absolute inset-0 -z-10 rounded-full bg-primary/0 transition-all duration-300 group-hover:bg-primary/5 group-hover:blur-md" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Product</h4>
            <ul className="space-y-3 text-sm">
              {['Features', 'Pricing', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="space-y-3 text-sm">
              {['About Us', 'Contact', 'Careers'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="space-y-3 text-sm">
              {['Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FraudScout. All rights reserved.
            </p>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
              <a
                href="mailto:asifoned@gmail.com"
                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                <span>asifoned@gmail.com</span>
              </a>
              <a
                href="tel:+919444202524"
                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                <span>+91 9444202524</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}