import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { forkJoin, map } from 'rxjs';

// Tipos mínimos basados en el CRUD del backend
export interface PagedResponse<T> { data: T[]; meta: { count: number } }
export interface Customer { id: number; name: string; email: string }
export interface Product { id: number; name: string; sku: string; price: number; category: string }
export interface Order { id: number; customer_id: number; order_date: string; status: string; payment_method: string; total_amount: number }
export interface OrderItem { id: number; order_id: number; product_id: number; quantity: number; unit_price: number; product?: { id: number; name: string; sku: string; price: number } }


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // Counts usando meta.count del CRUD
  customersCount() {
    const params = new HttpParams().set('page', 1).set('pageSize', 1);
    return this.http.get<PagedResponse<Customer>>(`${environment.apiUrl}/api/v1/customers`, { params }).pipe(map(r => r.meta.count));
  }

  productsCount() {
    const params = new HttpParams().set('page', 1).set('pageSize', 1);
    return this.http.get<PagedResponse<Product>>(`${environment.apiUrl}/api/v1/products`, { params }).pipe(map(r => r.meta.count));
  }

  // Listados para cálculos en el front
  ordersList(limit = 500) {
    const params = new HttpParams().set('page', 1).set('pageSize', limit).set('sortBy', 'order_date').set('sortDir', 'ASC');
    return this.http.get<PagedResponse<Order>>(`${environment.apiUrl}/api/v1/orders`, { params });
  }
  orderItemsList(limit = 1000) {
    const params = new HttpParams().set('page', 1).set('pageSize', limit);
    return this.http.get<PagedResponse<OrderItem>>(`${environment.apiUrl}/api/v1/order-items`, { params });
  }


  // KPI agregados en cliente (ventas totales, conteos)
  kpisOverview() {
    return forkJoin({
      customers: this.customersCount(),
      products: this.productsCount(),
      orders: this.ordersList(500),
    }).pipe(map(({ customers, products, orders }) => {
      const sales = orders.data.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);
      return { sales, customers, products };
    }));
  }


  // Serie de ventas por fecha (sum total_amount por día desde Orders)
  salesSeries() {
    return this.ordersList(500).pipe(map(({ data }) => {
      const byDate = new Map<string, number>();
      for (const o of data) {
        const d = new Date(o.order_date);
        const key = isNaN(d.getTime()) ? String(o.order_date).slice(0, 10) : d.toISOString().slice(0, 10);
        byDate.set(key, (byDate.get(key) || 0) + Number(o.total_amount || 0));
      }
      return Array.from(byDate.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([date, total]) => ({ date, total }));
    }));
  }


  // Top productos por monto vendido (desde OrderItems con include product en el CRUD)
  topProducts(limit = 1000) {
    return this.orderItemsList(limit).pipe(map(({ data }) => {
      const byName = new Map<string, number>();
      for (const it of data) {
        const name = it.product?.name ?? `#${it.product_id}`;
        const amount = Number(it.unit_price || 0) * Number(it.quantity || 0);
        byName.set(name, (byName.get(name) || 0) + amount);
      }
      return Array.from(byName.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, total]) => ({ name, total }));
    }));
  }
}

