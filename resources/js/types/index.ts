export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface Metrics {
    total_sales_30d: number;
    sales_today: number;
    sales_month: number;
    orders_30d: number;
    orders_today: number;
    low_stock_count: number;
    avg_basket: number;
}

export interface SalesChart {
    labels: string[];
    data: number[];
    data_online: number[];
    data_pos: number[];
    order_counts: number[];
}

export interface LowStockItem {
    id: number;
    nom: string;
    sku: string;
    stock_reel: number;
    stock_minimal: number;
}

export interface TopProduct {
    produit_id: number;
    nom: string;
    sku: string;
    qty: number;
    revenue: number;
}

export interface RecentOrder {
    id: number;
    client: string;
    status: string;
    source: string | null;
    montant: number;
    created_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface SourceBreakdown {
    [key: string]: {
        total: number;
        count: number;
    };
}

export interface DashboardProps {
    metrics: Metrics;
    sales_chart: SalesChart;
    low_stock: LowStockItem[];
    top_products: TopProduct[];
    status_counts?: Record<string, number>;
    source_breakdown?: SourceBreakdown;
    recent_orders?: PaginatedData<RecentOrder>;
    filters?: { source: string | null };
}