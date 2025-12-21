"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { useAuth } from "@/hooks/useAuth";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

/**
 * Header Component
 * Global navigation bar with logo, menu, search, and theme toggle
 */
export function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, isLoading } = useAuth();

    const navigation = [
        { name: "Home", href: "/" },
        { name: "AI Tools", href: "/ai-tools" },
        { name: "Digital Tools", href: "/digital-tools" },
        { name: "Blog", href: "/blog" },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-light-border dark:border-dark-border bg-light-bg-primary/95 dark:bg-dark-bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-light-bg-primary/60 dark:supports-[backdrop-filter]:bg-dark-bg-primary/60">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center space-x-2 font-bold text-xl"
                >
                    {/* SVG Logo - Compact Toolbox */}
                    <svg 
                        width="40" 
                        height="40" 
                        viewBox="0 0 200 200" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-light-text-primary dark:text-dark-text-primary"
                    >
                        {/* 外框 - 工具箱容器 */}
                        <rect x="40" y="40" width="120" height="120" rx="24" 
                              fill="none" stroke="currentColor" strokeWidth="8"/>
                        
                        {/* 工具箱把手 */}
                        <path d="M 80 40 Q 80 55 100 55 Q 120 55 120 40" 
                              fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                        
                        {/* 扳手符号 */}
                        <g transform="translate(100, 115)">
                            <rect x="-4" y="-25" width="8" height="35" rx="2" fill="currentColor"/>
                            <rect x="-12" y="-28" width="24" height="6" rx="1" fill="currentColor"/>
                            <rect x="-12" y="-35" width="24" height="4" rx="1" fill="currentColor"/>
                        </g>
                        
                        {/* 向上箭头 */}
                        <polygon points="100,75 95,85 105,85" fill="currentColor" opacity="0.4"/>
                    </svg>
                    <span className="text-light-text-primary dark:text-dark-text-primary">
                        Toolsail
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`text-sm font-medium transition-colors hover:text-light-text-secondary dark:hover:text-dark-text-secondary ${
                                isActive(item.href)
                                    ? "text-light-text-primary dark:text-dark-text-primary underline underline-offset-4"
                                    : "text-light-text-secondary dark:text-dark-text-secondary"
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2">
                    {/* Search Button */}
                    <button
                        className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                    </button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* User Menu or Login Button */}
                    {!isLoading && (
                        <>
                            {isAuthenticated ? (
                                <>
                                    {/* Submit Button (logged in users) */}
                                    <Link
                                        href="/submit"
                                        className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Submit Tool
                                    </Link>
                                    {/* User Menu */}
                                    <div className="hidden sm:block">
                                        <UserMenu />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Submit Button */}
                                    <Link
                                        href="/submit"
                                        className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Submit Tool
                                    </Link>
                                    {/* Login Button */}
                                    <Link
                                        href="/auth/login"
                                        className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-white dark:bg-gray-950">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive(item.href)
                                        ? "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary"
                                        : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/submit"
                            className="block px-4 py-2 text-sm font-semibold text-center text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Submit Tool
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
