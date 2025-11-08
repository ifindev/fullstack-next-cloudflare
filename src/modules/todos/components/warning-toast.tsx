"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

interface WarningToastProps {
    warning: string | null;
}

export function WarningToast({ warning }: WarningToastProps) {
    useEffect(() => {
        if (warning) {
            toast.error(warning, {
                duration: 6000, // Show warning for 6 seconds
                icon: "⚠️",
            });
        }
    }, [warning]);

    return null; // This component doesn't render anything
}
