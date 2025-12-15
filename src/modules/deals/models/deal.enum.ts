export const DealStage = {
    PROSPECTING: "Prospecting",
    QUALIFICATION: "Qualification",
    PROPOSAL: "Proposal",
    NEGOTIATION: "Negotiation",
    CLOSED_WON: "Closed Won",
    CLOSED_LOST: "Closed Lost",
} as const;

export type DealStageType = (typeof DealStage)[keyof typeof DealStage];

export const dealStageEnum = [
    DealStage.PROSPECTING,
    DealStage.QUALIFICATION,
    DealStage.PROPOSAL,
    DealStage.NEGOTIATION,
    DealStage.CLOSED_WON,
    DealStage.CLOSED_LOST,
] as const;
