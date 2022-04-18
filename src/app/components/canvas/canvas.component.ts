import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Data } from 'src/app/model/data';
import { Entity } from 'src/app/model/entity';
import { Vector } from 'src/app/model/vector';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {

  private ctx: CanvasRenderingContext2D;
  private data: Data;


  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  constructor() {

  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.scale(2,2)

    this.initData();

    this.requestFrame();
  }

  requestFrame(): void {
    window.requestAnimationFrame(() => {
      // check how to use it properly
      this.drawBackgroud();
      this.data.calculateNextFrame();
      this.draw2d();
      this.requestFrame();
    })
  }

  initData(): void {
    this.data = new Data();
    for (let i = 0; i < 2000; i++) {
      this.data.addEntity(new Entity(Math.random() * 50, { x: Math.random() * 800, y: Math.random() * 800, z: 0 } as Vector, { x: (Math.random() - 0.5) / 2, y: (Math.random() - 0.5) / 2, z: (Math.random() - 0.5) / 2 } as Vector, ''))
    }
  }

  draw2d(): void {
    if (!this.data.entities || this.data.entities.length === 0) {
      return;
    }
    // const omega = 1e15
    // const gamma = 1e10
    this.data.entities.forEach((e: Entity) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'rgb(50,' + (150 + e.position.z) + ',' + e.position.z + ')';
      this.ctx.arc(
        e.position.x,
        e.position.y,
        e.diameter,
        0,
        2 * Math.PI);
      this.ctx.fill();
    })
  }

  drawBackgroud(): void {
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }



}
