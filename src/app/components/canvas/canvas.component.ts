import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Camera } from 'src/app/model/camera';
import { Data } from 'src/app/model/data';
import { Entity } from 'src/app/model/entity';
import { GraphicEngineOne } from 'src/app/model/graphicEngines/graphicEngineOne';
import { Vector } from 'src/app/model/vector';
import { Physics } from 'src/app/utils/physics';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {

  private ctx: CanvasRenderingContext2D;
  private data: Data;
  private camera: Camera;


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

    this.initCamera();

    this.initData();

    this.requestFrame();
  }

  requestFrame(): void {
    window.requestAnimationFrame(() => {
      // check how to use it properly
      this.drawBackgroud();
      this.data.calculateNextFrame();
      this.cameraFollowCenter();
      this.draw2d();


      this.requestFrame();
    })
  }

  initData(): void {
    this.data = new Data();
    for (let i = 0; i < 1000; i++) {
      this.data.addEntity(new Entity(Math.random() * 30, { x: Math.random() * window.innerWidth / 2, y: Math.random() * window.innerHeight / 2, z: 0 } as Vector, { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3, z: (Math.random() - 0.5) * 2 } as Vector, ''))
      // this.data.addEntity(new Entity(Math.random() * 10, { x: Math.random() * window.innerWidth / 2, y: Math.random() * window.innerHeight / 2, z: 0 } as Vector, { x: 0, y: 0, z: (Math.random() - 0.5) * 2 } as Vector, ''))
    }
    // this.data.addEntity(new Entity(5000, { x: window.innerWidth / 4, y: window.innerHeight / 2, z: 0 } as Vector, { x: 0, y: 0, z: 0 } as Vector, ''))
  }

  initCamera(): void {
    this.camera = new Camera({x: window.innerWidth / 2, y: window.innerHeight / 2, z: 500} as Vector)
  }

  draw2d(): void {
    if (!this.data.entities || this.data.entities.length === 0 || !this.camera) {
      return;
    }
    GraphicEngineOne.drawScene(this.data, this.camera, this.ctx)

  }

  drawBackgroud(): void {
    this.ctx.fillStyle = '#F7FFDD';
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  cameraFollowCenter(): void {
    this.camera.position = Physics.getMassCenter(this.data.entities);
    this.camera.position.z = window.innerHeight;
  }



}
