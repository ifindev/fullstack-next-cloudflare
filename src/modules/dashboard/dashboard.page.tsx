import {
    Award,
    DollarSign,
    Plus,
    Target,
    TrendingUp,
    UserPlus,
    Users,
} from "lucide-react";
import { getDashboardMetricsAction } from "@/modules/dashboard/actions/get-dashboard-metrics.action";
import { QuickActionCard } from "@/modules/dashboard/components/quick-action-card";
import { StatCard } from "@/modules/dashboard/components/stat-card";
import contactsRoutes from "@/modules/contacts/contacts.route";
import dealsRoutes from "@/modules/deals/deals.route";

export default async function Dashboard() {
    const metrics = await getDashboardMetricsAction();

    // Format pipeline value as AUD currency
    const formattedPipelineValue = `$${metrics.pipelineValue.toLocaleString("en-AU")}`;

    // Format win rate as percentage
    const formattedWinRate = `${metrics.winRate.toFixed(1)}%`;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your CRM activity
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Contacts"
                    value={metrics.totalContacts}
                    description={
                        metrics.newContactsThisMonth > 0
                            ? `+${metrics.newContactsThisMonth} this month`
                            : undefined
                    }
                    icon={Users}
                    trend={
                        metrics.newContactsThisMonth > 0 ? "up" : "neutral"
                    }
                />

                <StatCard
                    title="New Contacts This Month"
                    value={metrics.newContactsThisMonth}
                    icon={UserPlus}
                />

                <StatCard
                    title="Active Deals"
                    value={metrics.activeDeals}
                    description="In pipeline"
                    icon={TrendingUp}
                />

                <StatCard
                    title="Pipeline Value"
                    value={formattedPipelineValue}
                    description="Active deals total"
                    icon={DollarSign}
                />

                <StatCard
                    title="Deals Won This Month"
                    value={metrics.dealsWonThisMonth}
                    icon={Award}
                    trend={metrics.dealsWonThisMonth > 0 ? "up" : "neutral"}
                />

                <StatCard
                    title="Win Rate"
                    value={formattedWinRate}
                    description="Of closed deals"
                    icon={Target}
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="New Contact"
                        description="Add a new contact to your CRM"
                        href={contactsRoutes.new}
                        icon={UserPlus}
                    />

                    <QuickActionCard
                        title="New Deal"
                        description="Create a new deal in your pipeline"
                        href={dealsRoutes.new}
                        icon={Plus}
                    />

                    <QuickActionCard
                        title="View Pipeline"
                        description="Manage your deals across all stages"
                        href={dealsRoutes.board}
                        icon={TrendingUp}
                    />
                </div>
            </div>
        </div>
    );
}
