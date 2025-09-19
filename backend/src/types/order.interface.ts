export interface OrderAttrs {
    id: number;
    customer_id: number;
    order_date: Date;
    status: string;
    payment_method: string;
    total_amount: number;
}