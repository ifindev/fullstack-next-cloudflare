"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Contact } from "@/modules/contacts/schemas/contact.schema";
import { insertDealSchema } from "@/modules/deals/schemas/deal.schema";
import { dealStageEnum } from "../models/deal.enum";
import { createDealAction } from "../actions/create-deal.action";
import { updateDealAction } from "../actions/update-deal.action";
import type { DealWithContact } from "../actions/get-deals.action";

interface DealFormProps {
    initialData?: DealWithContact;
    contacts: Contact[];
}

type FormData = z.infer<typeof insertDealSchema>;

export function DealForm({ initialData, contacts }: DealFormProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(insertDealSchema),
        defaultValues: {
            title: initialData?.title || "",
            contactId: initialData?.contactId || undefined,
            value: initialData?.value || 0,
            currency: initialData?.currency || "AUD",
            stage: initialData?.stage || "Prospecting",
            expectedCloseDate: initialData?.expectedCloseDate || undefined,
            description: initialData?.description || "",
        },
    });

    async function onSubmit(data: FormData) {
        setError(null);
        const formData = new FormData();

        // Add all form fields to FormData
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === "expectedCloseDate" && typeof value === "number") {
                    // Convert timestamp to YYYY-MM-DD
                    const date = new Date(value);
                    formData.append(key, date.toISOString().split("T")[0]);
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        startTransition(async () => {
            try {
                if (initialData) {
                    await updateDealAction(initialData.id, formData);
                } else {
                    await createDealAction(formData);
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to save deal",
                );
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{initialData ? "Edit Deal" : "New Deal"}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deal Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enterprise License"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact (Optional)</FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(
                                                value === "__none__" ? undefined : Number.parseInt(value),
                                            )
                                        }
                                        value={field.value?.toString() || "__none__"}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a contact" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="__none__">None</SelectItem>
                                            {contacts.map((contact) => (
                                                <SelectItem
                                                    key={contact.id}
                                                    value={contact.id.toString()}
                                                >
                                                    {[contact.firstName, contact.lastName]
                                                        .filter(Boolean)
                                                        .join(" ") || contact.email || `Contact #${contact.id}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Link this deal to a contact
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="5000.00"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number.parseFloat(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="AUD">AUD</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="GBP">GBP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="stage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stage</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dealStageEnum.map((stage) => (
                                                    <SelectItem key={stage} value={stage}>
                                                        {stage}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="expectedCloseDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expected Close Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={
                                                    field.value
                                                        ? new Date(field.value)
                                                              .toISOString()
                                                              .split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(
                                                        value ? new Date(value).getTime() : undefined,
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Deal notes and details..."
                                            rows={4}
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? "Saving..."
                                    : initialData
                                      ? "Update Deal"
                                      : "Create Deal"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
