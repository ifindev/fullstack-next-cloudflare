import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

/**
 * Footer Component
 * Global footer with links, social media, and copyright
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: "AI Tools", href: "/categories/ai-tools" },
            { name: "Digital Tools", href: "/categories/digital-tools" },
            { name: "Submit Tool", href: "/submit" },
            { name: "Blog", href: "/blog" },
        ],
        resources: [
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
        ],
    };

    const socialLinks = [
        {
            name: "GitHub",
            href: "https://github.com",
            icon: Github,
        },
        {
            name: "Twitter",
            href: "https://twitter.com",
            icon: Twitter,
        },
        {
            name: "Email",
            href: "mailto:contact@toolsail.top",
            icon: Mail,
        },
    ];

    return (
        <footer className="border-t border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 font-bold text-lg"
                        >
                            {/* SVG Logo - Compact Toolbox */}
                            <svg
                                width="32"
                                height="32"
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
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            Discover the best AI and digital tools to boost your
                            productivity.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            Product
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                            Get the latest tools and updates delivered to your
                            inbox.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 text-sm border rounded-md bg-light-bg-primary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-semibold text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border">
                    <p className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        © {currentYear} Toolsail. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
