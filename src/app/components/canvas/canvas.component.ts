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
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    console.log(this.canvas)


    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.scale(2, 2)


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
    for (let i = 0; i < 1000; i++) {
      this.data.addEntity(new Entity(Math.random() * 10, { x: Math.random() * window.innerWidth / 2, y: Math.random() * window.innerHeight / 2, z: 0 } as Vector, { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5), z: 0 } as Vector, ''))
    }
    // this.data.addEntity(new Entity(5000, { x: window.innerHeight / 2, y: window.innerWidth / 2, z: 0 } as Vector, { x: 0, y: 0, z: 0 } as Vector, ''))
  }

  draw2d(): void {
    if (!this.data.entities || this.data.entities.length === 0) {
      return;
    }
    // const omega = 1e15
    // const gamma = 1e10
    this.data.entities.forEach((e: Entity) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'rgb(' + (e.mass) / 300 + ',' + 0 + ',' + (100 + e.position.z) + ')';
      this.ctx.lineWidth = 3
      this.ctx.arc(
        e.position.x,
        e.position.y,
        e.diameter,
        0,
        2 * Math.PI);
      this.ctx.strokeStyle = "#FFFFFF";
      // this.ctx.stroke();
      this.ctx.fill();
    })
  }

  drawBackgroud(): void {
    this.ctx.fillStyle = '#f5eec3';
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }



}
