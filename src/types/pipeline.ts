type Deal = {
    deal_id: string;
    company: string;
    vertical: string;
    stage: string;
    status: string;
    owner: string;
    source: string;
    value_usd: number;
    created_date: string;
    last_activity: string;
  }
  
type PipelineMetrics = {
    totalPipelineValue: number;
    totalDeals: number;
    wonDeals: number;
    closedWonValue: number;
    wonShareOfPipeline: number;
    largestWonDealValue: number;
    averageDealValue: number;
    minDealValue: number;
    maxDealValue: number;
    dealsByStage: Record<string, number>;
    revenueByStage: Record<string, number>;
    revenueByVertical: Record<string, number>;
    dealsByVertical: Record<string, number>;
    winRateByOwner: Record<string, { won: number; total: number; rate: number }>;
    dealsBySource: Record<string, number>;
    topPerformingVertical: string;
    topOwnerByDeals: { owner: string; dealCount: number } | null;
    valueByOwner: Record<string, number>;
    wonValueByOwner: Record<string, number>;
    valueBySource: Record<string, number>;
    wonValueBySource: Record<string, number>;
    pipelineTrendByDay: PipelineTrendPoint[];
  }

type PipelineTrendPoint = {
    date: string;
    deals: number;
    value: number;
  }


export type { Deal, PipelineMetrics, PipelineTrendPoint };