"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";

// Validation schema
const toolSubmissionSchema = z.object({
    toolName: z
        .string()
        .min(2, "Tool name must be at least 2 characters")
        .max(100),
    toolUrl: z.string().url("Please enter a valid URL"),
    logoUrl: z
        .string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal("")),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(200, "Description must be less than 200 characters"),
    parentCategory: z.string().min(1, "Please select a parent category"),
    category: z.string().min(1, "Please select a category"),
    pricing: z.enum(["Free", "Freemium", "Paid"]),
    email: z.string().email("Please enter a valid email"),
    verificationCode: z
        .string()
        .min(6, "Verification code is required")
        .optional(),
});

type ToolSubmissionForm = z.infer<typeof toolSubmissionSchema>;

/**
 * Submit Tool Page
 * Allows users to submit tools for review
 * Route: /submit
 * Based on DESIGN_LAYOUT.md Section 8
 */
export default function SubmitToolPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoPreview, setLogoPreview] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<ToolSubmissionForm>({
        resolver: zodResolver(toolSubmissionSchema),
        defaultValues: {
            pricing: "Free",
        },
    });

    const logoUrl = watch("logoUrl");
    const description = watch("description");

    // Update logo preview when URL changes
    useState(() => {
        if (logoUrl && logoUrl.startsWith("http")) {
            setLogoPreview(logoUrl);
        } else {
            setLogoPreview("");
        }
    });

    const sendVerificationCode = async () => {
        // Simulate sending verification code
        setCodeSent(true);
        setCountdown(600); // 10 minutes

        // Countdown timer
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const onSubmit = async (data: ToolSubmissionForm) => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Form data:", data);
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const handleReset = () => {
        reset();
        setIsSubmitted(false);
        setLogoPreview("");
        setCodeSent(false);
    };

    if (isSubmitted) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="max-w-md w-full mx-auto px-4">
                    <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg shadow-lg p-8 text-center border border-light-border dark:border-dark-border">
                        <CheckCircle className="w-16 h-16 text-light-text-primary dark:text-dark-text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                            Thank you for your submission!
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                            We will review your tool within 48 hours. You can
                            check the submission status in your dashboard.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/"
                                className="px-6 py-3 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary rounded-lg hover:opacity-80 transition-opacity"
                            >
                                Back to Home
                            </Link>
                            <button
                                onClick={handleReset}
                                className="px-6 py-3 bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary rounded-lg hover:opacity-90 transition-colors"
                            >
                                Submit Another
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-light-bg-secondary dark:from-dark-bg-secondary to-light-bg-primary dark:to-dark-bg-primary py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                            Submit Your Tool
                        </h1>
                        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                            Help others discover your amazing tool
                        </p>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-12 bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            {/* Tool Information */}
                            <div>
                                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6 pb-3 border-b border-light-border dark:border-dark-border">
                                    Tool Information
                                </h2>

                                {/* Tool Name */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                        Tool Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("toolName")}
                                        type="text"
                                        placeholder="e.g., ChatGPT"
                                        className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                    />
                                    {errors.toolName && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.toolName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Tool URL */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                        Tool Website{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("toolUrl")}
                                        type="url"
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                    />
                                    {errors.toolUrl && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.toolUrl.message}
                                        </p>
                                    )}
                                </div>

                                {/* Logo URL */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                        Logo URL (Optional)
                                    </label>
                                    <input
                                        {...register("logoUrl")}
                                        type="url"
                                        placeholder="Paste logo URL"
                                        className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                    />
                                    {logoPreview && (
                                        <div className="mt-3 flex items-center gap-3">
                                            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                                📷 Preview:
                                            </span>
                                            <Image
                                                src={logoPreview}
                                                alt="Logo preview"
                                                width={48}
                                                height={48}
                                                className="rounded"
                                            />
                                        </div>
                                    )}
                                    {errors.logoUrl && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.logoUrl.message}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                        Description{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register("description")}
                                        rows={4}
                                        placeholder="Briefly describe what your tool does..."
                                        className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary resize-none"
                                    />
                                    <div className="mt-1 flex justify-between items-center">
                                        {errors.description ? (
                                            <p className="text-sm text-red-500">
                                                {errors.description.message}
                                            </p>
                                        ) : (
                                            <span />
                                        )}
                                        <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                                            {description?.length || 0}/200
                                        </span>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                            Parent Category{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            {...register("parentCategory")}
                                            className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                        >
                                            <option value="">Select...</option>
                                            <option value="ai-tools">
                                                AI Tools
                                            </option>
                                            <option value="digital-tools">
                                                Digital Tools
                                            </option>
                                        </select>
                                        {errors.parentCategory && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.parentCategory.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                            Category{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            {...register("category")}
                                            className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                        >
                                            <option value="">Select...</option>
                                            <option value="ai-writing">
                                                AI Writing
                                            </option>
                                            <option value="ai-design">
                                                AI Design
                                            </option>
                                            <option value="ai-coding">
                                                AI Coding
                                            </option>
                                            <option value="design-tools">
                                                Design Tools
                                            </option>
                                            <option value="productivity">
                                                Productivity
                                            </option>
                                        </select>
                                        {errors.category && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.category.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                        Pricing Type{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-6">
                                        {(
                                            [
                                                "Free",
                                                "Freemium",
                                                "Paid",
                                            ] as const
                                        ).map((type) => (
                                            <label
                                                key={type}
                                                className="flex items-center cursor-pointer"
                                            >
                                                <input
                                                    {...register("pricing")}
                                                    type="radio"
                                                    value={type}
                                                    className="w-4 h-4 text-light-text-primary focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary border-light-border dark:border-dark-border"
                                                />
                                                <span className="ml-2 text-light-text-secondary dark:text-dark-text-secondary">
                                                    {type}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Submitter Information */}
                            <div>
                                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6 pb-3 border-b border-light-border dark:border-dark-border">
                                    Submitter Information
                                </h2>

                                {/* Email */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                        Email Address{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Verification Code */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                        Verification Code{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-3">
                                        <input
                                            {...register("verificationCode")}
                                            type="text"
                                            placeholder="Enter code"
                                            className="flex-1 px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                        />
                                        <button
                                            type="button"
                                            onClick={sendVerificationCode}
                                            disabled={codeSent && countdown > 0}
                                            className="px-6 py-3 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {codeSent && countdown > 0
                                                ? `Resend (${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, "0")})`
                                                : "Send Code"}
                                        </button>
                                    </div>
                                    {codeSent && (
                                        <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                            Verification code sent to your
                                            email. Valid for 10 minutes.
                                        </p>
                                    )}
                                    {errors.verificationCode && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.verificationCode.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    )}
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                                <Link
                                    href="/"
                                    className="px-6 py-3 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary rounded-lg hover:opacity-80 transition-opacity text-center"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
