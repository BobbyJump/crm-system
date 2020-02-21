import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip', {static: false}) tooltipRef: ElementRef
  tooltip: MaterialInstance
  isFilterVisible = false

  constructor() { }

  ngOnInit() {

  }

  ngOnDestroy(){
    this.tooltip.destroy()
  }

  ngAfterViewInit(){
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }
}
