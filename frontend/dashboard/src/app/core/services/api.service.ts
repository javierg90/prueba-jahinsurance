import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  kpisOverview() {
    return this.http.get<{ sales: number; customers: number; products: number }>(`${environment.apiUrl}/api/v1/reports/kpis`);
  }
  salesSeries() {
    return this.http.get<Array<{ date: string; total: number }>>(`${environment.apiUrl}/api/v1/reports/sales-series`);
  }

  topProducts() {
    return this.http.get<Array<{ name: string; total: number }>>(`${environment.apiUrl}/api/v1/reports/top-products`);
  }
}
