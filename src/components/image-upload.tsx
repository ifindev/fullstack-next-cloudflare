"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export function ImageUpload({ value, onChange, className = "" }: ImageUploadProps) {
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [error, setError] = useState<string>("");
    const [dragActive, setDragActive] = useState(false);

    const handleUpload = useCallback(async (file: File) => {
        setStatus("uploading");
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json() as { url?: string; error?: string };

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            onChange(data.url || "");
            setStatus("success");
            
            // Reset status after 2 seconds
            setTimeout(() => setStatus("idle"), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
            setStatus("error");
        }
    }, [onChange]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            handleUpload(file);
        } else {
            setError("Please drop an image file");
            setStatus("error");
        }
    }, [handleUpload]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    }, [handleUpload]);

    const handleRemove = useCallback(() => {
        onChange("");
        setStatus("idle");
        setError("");
    }, [onChange]);

    return (
        <div className={className}>
            {value ? (
                // Preview mode
                <div className="relative rounded-lg overflow-hidden border border-light-border dark:border-dark-border">
                    <div className="relative aspect-video">
                        <Image
                            src={value}
                            alt="Uploaded image"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary shadow-md hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                        title="Remove image"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                // Upload mode
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${dragActive 
                            ? "border-light-text-primary dark:border-dark-text-primary bg-light-bg-secondary dark:bg-dark-bg-secondary" 
                            : "border-light-border dark:border-dark-border hover:border-light-text-tertiary dark:hover:border-dark-text-tertiary"
                        }
                        ${status === "error" ? "border-red-500" : ""}
                    `}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={status === "uploading"}
                    />
                    
                    <div className="flex flex-col items-center gap-3">
                        {status === "uploading" ? (
                            <>
                                <Loader2 className="w-10 h-10 text-light-text-tertiary dark:text-dark-text-tertiary animate-spin" />
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    Uploading...
                                </p>
                            </>
                        ) : status === "success" ? (
                            <>
                                <CheckCircle className="w-10 h-10 text-green-500" />
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Upload successful!
                                </p>
                            </>
                        ) : status === "error" ? (
                            <>
                                <AlertCircle className="w-10 h-10 text-red-500" />
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {error || "Upload failed"}
                                </p>
                                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                    Click or drag to try again
                                </p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    <span className="font-medium">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                    PNG, JPG, WebP, GIF up to 5MB
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
