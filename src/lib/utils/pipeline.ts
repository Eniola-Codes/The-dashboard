import pipelineData from '../data/pipeline.json';
import { DateRange, Deal, FilterOptions, PipelineMetrics } from '@/types/pipeline';

export const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
    { value: 'all', label: 'All time' },
    { value: 'last_month', label: 'Last month' },
    { value: 'last_3_months', label: 'Last 3 months' },
    { value: 'last_6_months', label: 'Last 6 months' },
];

export const getRawDeals = (): Deal[] => {
    return pipelineData as Deal[];
};

function startOfDay(date: Date): Date {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
}

function getDateRangeBounds(dateRange: DateRange): { start: Date; end: Date } | null {
    const now = new Date();
    const today = startOfDay(now);

    switch (dateRange) {
        case 'last_month': {
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = new Date(now.getFullYear(), now.getMonth(), 0);
            return { start: startOfDay(start), end: startOfDay(end) };
        }
        case 'last_3_months': {
            const start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            return { start: startOfDay(start), end: today };
        }
        case 'last_6_months': {
            const start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
            return { start: startOfDay(start), end: today };
        }
        default:
            return null;
    }
}

function isWithinDateRange(createdDate: string, dateRange?: DateRange): boolean {
    if (!dateRange || dateRange === 'all') return true;

    const bounds = getDateRangeBounds(dateRange);
    if (!bounds) return true;

    const created = startOfDay(new Date(createdDate));
    return created >= bounds.start && created <= bounds.end;
}

export const filterDeals = (deals: Deal[], filters: FilterOptions): Deal[] => {
    return deals.filter((deal) => {
        if (filters.vertical && deal.vertical !== filters.vertical) return false;
        if (filters.owner && deal.owner !== filters.owner) return false;
        if (filters.stage && deal.stage !== filters.stage) return false;
        if (!isWithinDateRange(deal.created_date, filters.dateRange)) return false;
        return true;
    });
};

export const getFilterOptions = (deals: Deal[]) => ({
    verticals: [...new Set(deals.map((d) => d.vertical))].sort(),
    owners: [...new Set(deals.map((d) => d.owner))].sort(),
    stages: [...new Set(deals.map((d) => d.stage))].sort(),
});

export const formatCurrency = (value: number): string => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(1)}`;
};

export const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

export const getTotalPipelineValue = (deals: Deal[]): number =>
    deals.reduce((sum, d) => sum + d.value_usd, 0);

export const getAverageDealValue = (deals: Deal[]): number =>
    deals.length > 0 ? getTotalPipelineValue(deals) / deals.length : 0;

export const getDealValueRange = (deals: Deal[]): { min: number; max: number } => {
    const values = deals.map((d) => d.value_usd);
    return {
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
    };
};

export const getWonDeals = (deals: Deal[]): Deal[] =>
    deals.filter((d) => d.stage === 'Won');

export const getClosedWonValue = (deals: Deal[]): number =>
    getWonDeals(deals).reduce((sum, d) => sum + d.value_usd, 0);

export const getLargestWonDealValue = (deals: Deal[]): number => {
    const wonValues = getWonDeals(deals).map((d) => d.value_usd);
    return wonValues.length > 0 ? Math.max(...wonValues) : 0;
};

export const getWonShareOfPipeline = (
    closedWonValue: number,
    totalPipelineValue: number,
): number =>
    totalPipelineValue > 0 ? (closedWonValue / totalPipelineValue) * 100 : 0;

export const groupDealsByStage = (deals: Deal[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    deals.forEach((d) => {
        counts[d.stage] = (counts[d.stage] || 0) + 1;
    });
    return counts;
};

export const groupRevenueByVertical = (deals: Deal[]): Record<string, number> => {
    const revenue: Record<string, number> = {};
    deals.forEach((d) => {
        revenue[d.vertical] = (revenue[d.vertical] || 0) + d.value_usd;
    });
    return revenue;
};

export const groupDealsByVertical = (deals: Deal[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    deals.forEach((d) => {
        counts[d.vertical] = (counts[d.vertical] || 0) + 1;
    });
    return counts;
};

export const getTopPerformingVertical = (
    revenueByVertical: Record<string, number>,
): string =>
    Object.entries(revenueByVertical).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

export const getWinRateByOwner = (
    deals: Deal[],
): Record<string, { won: number; total: number; rate: number }> => {
    const ownerStats: Record<string, { won: number; total: number }> = {};
    deals.forEach((d) => {
        if (!ownerStats[d.owner]) ownerStats[d.owner] = { won: 0, total: 0 };
        ownerStats[d.owner].total += 1;
        if (d.stage === 'Won') ownerStats[d.owner].won += 1;
    });

    const winRateByOwner: Record<string, { won: number; total: number; rate: number }> = {};
    Object.entries(ownerStats).forEach(([owner, stats]) => {
        winRateByOwner[owner] = {
            ...stats,
            rate: stats.total > 0 ? (stats.won / stats.total) * 100 : 0,
        };
    });
    return winRateByOwner;
};

export const groupDealsBySource = (deals: Deal[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    deals.forEach((d) => {
        counts[d.source] = (counts[d.source] || 0) + 1;
    });
    return counts;
};

export const groupValueByOwner = (deals: Deal[]): Record<string, number> => {
    const values: Record<string, number> = {};
    deals.forEach((d) => {
        values[d.owner] = (values[d.owner] || 0) + d.value_usd;
    });
    return values;
};

export const getTopOwnerByDeals = (
    deals: Deal[],
): { owner: string; dealCount: number } | null => {
    const counts: Record<string, number> = {};
    deals.forEach((d) => {
        counts[d.owner] = (counts[d.owner] || 0) + 1;
    });

    const topOwner = Object.entries(counts).sort(([, a], [, b]) => b - a)[0];
    return topOwner ? { owner: topOwner[0], dealCount: topOwner[1] } : null;
};

export const computeMetrics = (deals: Deal[]): PipelineMetrics => {
    const totalPipelineValue = getTotalPipelineValue(deals);
    const closedWonValue = getClosedWonValue(deals);
    const { min, max } = getDealValueRange(deals);
    const revenueByVertical = groupRevenueByVertical(deals);

    return {
        totalPipelineValue,
        totalDeals: deals.length,
        wonDeals: getWonDeals(deals).length,
        closedWonValue,
        wonShareOfPipeline: getWonShareOfPipeline(closedWonValue, totalPipelineValue),
        largestWonDealValue: getLargestWonDealValue(deals),
        averageDealValue: getAverageDealValue(deals),
        minDealValue: min,
        maxDealValue: max,
        dealsByStage: groupDealsByStage(deals),
        revenueByVertical,
        dealsByVertical: groupDealsByVertical(deals),
        winRateByOwner: getWinRateByOwner(deals),
        dealsBySource: groupDealsBySource(deals),
        topPerformingVertical: getTopPerformingVertical(revenueByVertical),
        topOwnerByDeals: getTopOwnerByDeals(deals),
        valueByOwner: groupValueByOwner(deals),
    };
};

