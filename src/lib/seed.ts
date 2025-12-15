/**
 * Seed script for CRM database
 * Populates D1 with realistic test data for development and testing
 *
 * Usage:
 *   pnpm run db:seed
 *
 * Note: Requires a valid user session. Run this after creating a user account.
 */

import { getDb } from "@/db";
import {
    contacts,
    contactTags,
    contactsToTags,
} from "@/modules/contacts/schemas/contact.schema";
import { deals } from "@/modules/deals/schemas/deal.schema";
import { DealStage } from "@/modules/deals/models/deal.enum";

async function seedCRM() {
    console.log("🌱 Starting CRM seed...");

    try {
        const db = await getDb();

        // Note: You'll need to replace this with your actual user ID
        // Get it from the database or create a user first
        const userId = 1; // CHANGE THIS to match your user ID

        console.log(`Using user ID: ${userId}`);

        // Clear existing data for this user (optional - comment out to keep existing data)
        console.log("🗑️  Clearing existing data...");
        await db.delete(contactsToTags);
        await db.delete(deals);
        await db.delete(contactTags);
        await db.delete(contacts);

        // Create tags
        console.log("📌 Creating tags...");
        const tagsData = [
            { name: "Customer", color: "green", userId },
            { name: "Lead", color: "blue", userId },
            { name: "Partner", color: "purple", userId },
            { name: "Inactive", color: "gray", userId },
            { name: "VIP", color: "yellow", userId },
        ];

        const createdTags = await Promise.all(
            tagsData.map(async (tag) => {
                const [created] = await db
                    .insert(contactTags)
                    .values({
                        ...tag,
                        createdAt: Date.now(),
                    })
                    .returning();
                return created;
            }),
        );

        console.log(`✅ Created ${createdTags.length} tags`);

        // Create contacts
        console.log("👥 Creating contacts...");
        const contactsData = [
            {
                firstName: "Sarah",
                lastName: "Johnson",
                email: "sarah.johnson@techcorp.com",
                phone: "+61 2 9876 5432",
                company: "TechCorp Australia",
                jobTitle: "CTO",
                notes: "Interested in enterprise plan. Follow up Q1 2025.",
                userId,
            },
            {
                firstName: "Michael",
                lastName: "Chen",
                email: "m.chen@innovate.com.au",
                phone: "+61 3 8765 4321",
                company: "Innovate Solutions",
                jobTitle: "CEO",
                notes: "Met at conference. Hot lead.",
                userId,
            },
            {
                firstName: "Emma",
                lastName: "Williams",
                email: "emma.w@startupco.io",
                phone: "+61 4 1234 5678",
                company: "StartupCo",
                jobTitle: "Founder",
                notes: "Early stage startup, limited budget.",
                userId,
            },
            {
                firstName: "James",
                lastName: "Brown",
                email: "james@enterprise.net",
                phone: "+61 2 5555 1234",
                company: "Enterprise Networks",
                jobTitle: "IT Director",
                notes: "Existing customer, renewal coming up.",
                userId,
            },
            {
                firstName: "Olivia",
                lastName: "Taylor",
                email: "olivia.taylor@consulting.com",
                phone: "+61 7 3333 9876",
                company: "Taylor Consulting",
                jobTitle: "Senior Consultant",
                notes: "Referral from James. Interested in partnership.",
                userId,
            },
            {
                firstName: "Daniel",
                lastName: "Martinez",
                email: "d.martinez@global.com",
                phone: null,
                company: "Global Industries",
                jobTitle: "VP Sales",
                notes: null,
                userId,
            },
            {
                firstName: "Sophie",
                lastName: "Anderson",
                email: "sophie@boutique.com.au",
                phone: "+61 8 7777 2222",
                company: "Boutique Agency",
                jobTitle: "Creative Director",
                notes: "Met via LinkedIn. Casual contact.",
                userId,
            },
            {
                firstName: "Lucas",
                lastName: null,
                email: "lucas.white@freelance.com",
                phone: null,
                company: null,
                jobTitle: "Freelance Developer",
                notes: "Minimal info. Cold lead.",
                userId,
            },
            {
                firstName: "Isabella",
                lastName: "Garcia",
                email: "i.garcia@manufacturing.com",
                phone: "+61 2 4444 8888",
                company: "Garcia Manufacturing",
                jobTitle: "Operations Manager",
                notes: "Legacy contact. Not active.",
                userId,
            },
            {
                firstName: "Thomas",
                lastName: "Lee",
                email: "thomas.lee@finance.com.au",
                phone: "+61 3 6666 3333",
                company: "Lee Financial Services",
                jobTitle: "Partner",
                notes: "High-value account. VIP treatment.",
                userId,
            },
        ];

        const createdContacts = await Promise.all(
            contactsData.map(async (contact) => {
                const [created] = await db
                    .insert(contacts)
                    .values({
                        ...contact,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    })
                    .returning();
                return created;
            }),
        );

        console.log(`✅ Created ${createdContacts.length} contacts`);

        // Assign tags to contacts
        console.log("🏷️  Assigning tags to contacts...");
        const tagAssignments = [
            // Sarah - Customer, VIP
            {
                contactId: createdContacts[0].id,
                tagId: createdTags[0].id,
            },
            { contactId: createdContacts[0].id, tagId: createdTags[4].id },
            // Michael - Lead
            { contactId: createdContacts[1].id, tagId: createdTags[1].id },
            // Emma - Lead
            { contactId: createdContacts[2].id, tagId: createdTags[1].id },
            // James - Customer
            {
                contactId: createdContacts[3].id,
                tagId: createdTags[0].id,
            },
            // Olivia - Partner
            {
                contactId: createdContacts[4].id,
                tagId: createdTags[2].id,
            },
            // Isabella - Inactive
            {
                contactId: createdContacts[8].id,
                tagId: createdTags[3].id,
            },
            // Thomas - Customer, VIP
            {
                contactId: createdContacts[9].id,
                tagId: createdTags[0].id,
            },
            { contactId: createdContacts[9].id, tagId: createdTags[4].id },
        ];

        await Promise.all(
            tagAssignments.map((assignment) =>
                db.insert(contactsToTags).values(assignment),
            ),
        );

        console.log(`✅ Assigned ${tagAssignments.length} tags to contacts`);

        // Create deals
        console.log("💼 Creating deals...");
        const now = Date.now();
        const oneMonth = 30 * 24 * 60 * 60 * 1000;

        const dealsData = [
            {
                title: "Enterprise License - TechCorp",
                contactId: createdContacts[0].id, // Sarah
                value: 50000,
                currency: "AUD",
                stage: DealStage.PROPOSAL,
                expectedCloseDate: now + oneMonth,
                description:
                    "50 seat enterprise license with premium support. Annual contract.",
                userId,
            },
            {
                title: "Consulting Package - Innovate",
                contactId: createdContacts[1].id, // Michael
                value: 12000,
                currency: "AUD",
                stage: DealStage.QUALIFICATION,
                expectedCloseDate: now + oneMonth * 2,
                description: "3-month consulting engagement. Scoping phase.",
                userId,
            },
            {
                title: "Startup Plan - StartupCo",
                contactId: createdContacts[2].id, // Emma
                value: 5000,
                currency: "AUD",
                stage: DealStage.PROSPECTING,
                expectedCloseDate: now + oneMonth * 3,
                description:
                    "Early stage startup. Budget constraints. Long sales cycle.",
                userId,
            },
            {
                title: "Annual Renewal - Enterprise Networks",
                contactId: createdContacts[3].id, // James
                value: 75000,
                currency: "AUD",
                stage: DealStage.CLOSED_WON,
                expectedCloseDate: now - oneMonth,
                description: "Existing customer renewal. Signed last month.",
                userId,
            },
            {
                title: "Partnership Agreement - Global",
                contactId: createdContacts[5].id, // Daniel
                value: 8000,
                currency: "USD",
                stage: DealStage.CLOSED_LOST,
                expectedCloseDate: now - oneMonth * 2,
                description:
                    "Lost to competitor. Price was the main factor.",
                userId,
            },
        ];

        const createdDeals = await Promise.all(
            dealsData.map(async (deal) => {
                const [created] = await db
                    .insert(deals)
                    .values({
                        ...deal,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    })
                    .returning();
                return created;
            }),
        );

        console.log(`✅ Created ${createdDeals.length} deals`);

        // Summary
        console.log("\n🎉 Seed complete!");
        console.log("─────────────────────────");
        console.log(`📊 Summary:`);
        console.log(`   • ${createdContacts.length} contacts`);
        console.log(`   • ${createdTags.length} tags`);
        console.log(`   • ${tagAssignments.length} tag assignments`);
        console.log(`   • ${createdDeals.length} deals`);
        console.log("─────────────────────────");
        console.log("\n✨ Visit http://localhost:3000/dashboard to see the data!");
    } catch (error) {
        console.error("❌ Seed failed:", error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    seedCRM()
        .then(() => {
            console.log("✅ Seed script completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("❌ Seed script failed:", error);
            process.exit(1);
        });
}

export { seedCRM };
