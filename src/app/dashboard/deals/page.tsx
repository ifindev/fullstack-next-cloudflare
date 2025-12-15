import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDealsAction } from "@/modules/deals/actions/get-deals.action";
import { DealCard } from "@/modules/deals/components/deal-card";
import dealsRoutes from "@/modules/deals/deals.route";
import { dealStageEnum } from "@/modules/deals/models/deal.enum";

export default async function DealsPage() {
    const allDeals = await getDealsAction();

    // Group deals by stage
    const dealsByStage = dealStageEnum.reduce(
        (acc, stage) => {
            acc[stage] = allDeals.filter((deal) => deal.stage === stage);
            return acc;
        },
        {} as Record<string, typeof allDeals>,
    );

    // Calculate total pipeline value (excluding closed deals)
    const pipelineValue = allDeals
        .filter(
            (deal) =>
                deal.stage !== "Closed Won" && deal.stage !== "Closed Lost",
        )
        .reduce((sum, deal) => sum + deal.value, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Pipeline</h1>
                    <p className="text-muted-foreground">
                        {allDeals.length} deals · Pipeline value: ${pipelineValue.toLocaleString("en-AU")}
                    </p>
                </div>
                <Button asChild>
                    <Link href={dealsRoutes.new}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Deal
                    </Link>
                </Button>
            </div>

            {allDeals.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">No deals yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Get started by creating your first deal
                    </p>
                    <Button asChild>
                        <Link href={dealsRoutes.new}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Deal
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {dealStageEnum.map((stage) => (
                        <div key={stage} className="flex flex-col">
                            <div className="mb-3 sticky top-0 bg-background z-10 pb-2">
                                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                                    {stage}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {dealsByStage[stage].length} deal
                                    {dealsByStage[stage].length !== 1 ? "s" : ""}
                                </p>
                            </div>
                            <div className="space-y-3">
                                {dealsByStage[stage].map((deal) => (
                                    <DealCard key={deal.id} deal={deal} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
