"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItemProps {
    question: string;
    answer: string;
}

/**
 * FAQ Item Component
 * 可折叠的FAQ条目
 */
export function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-light-border dark:border-dark-border last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
                <span className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>
            {isOpen && (
                <div className="pb-5 text-light-text-secondary dark:text-dark-text-secondary">
                    {answer}
                </div>
            )}
        </div>
    );
}
