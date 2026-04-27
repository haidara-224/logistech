export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface Metrics {
    total_sales_30d: number;
    orders_30d: number;
    orders_today: number;
    low_stock_count: number;
}

export interface SalesChart {
    labels: string[];
    data: number[];
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
}

export interface DashboardProps {
    metrics: Metrics;
    sales_chart: SalesChart;
    low_stock: LowStockItem[];
    top_products: TopProduct[];
}