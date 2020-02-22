import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/interfaces';
import { Chart } from 'chart.js'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('revenue', {static: false}) revenueRef: ElementRef
  @ViewChild('order', {static: false}) orderRef: ElementRef

  aSub: Subscription
  average: number
  pending = true

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit(){
    const revenueConfig: any = {
      label: 'Revenue',
      color: 'rgb(255, 99, 132)'
    }

    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average
      // For revenue
      revenueConfig.labels = data.chart.map(item => item.label)
      revenueConfig.data = data.chart.map(item => item.revenue)

      const revenueCtx = this.revenueRef.nativeElement.getContext('2d')

      revenueCtx.canvas.height = '300px'
      new Chart(revenueCtx, createChartConfig(revenueConfig))
      
      // For orders
      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)
      
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      
      orderCtx.canvas.height = '300px'
      
      new Chart(orderCtx, createChartConfig(orderConfig))
      
      this.pending = false
    })
  }

  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }

}

function createChartConfig({labels, data, label, color}){
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
