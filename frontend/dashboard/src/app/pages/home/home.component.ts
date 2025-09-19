import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { ApiService } from '../../core/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, MatCardModule, MatGridListModule, MatDividerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  kpis: { sales: number; customers: number; products: number } | null = null;
  lineOpts: any = {}; // ECharts option
  barOpts: any = {};

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.kpisOverview().subscribe(k => this.kpis = k);
    this.api.salesSeries().subscribe(series => {
      const dates = series.map(s => s.date);
      const totals = series.map(s => s.total);
      this.lineOpts = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: dates },
        yAxis: { type: 'value' },
        series: [{ type: 'line', smooth: true, data: totals }]
      };
    });
    this.api.topProducts().subscribe(items => {
      this.barOpts = {
        tooltip: {},
        xAxis: { type: 'category', data: items.map(i => i.name) },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: items.map(i => i.total) }]
      };
    });
  }
}
