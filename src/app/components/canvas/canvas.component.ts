import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UsefulConsts } from 'src/app/consts/usefulConsts';
import { Camera } from 'src/app/model/camera';
import { ControlConfig } from 'src/app/model/configs/controlConfig';
import { DiscConfig } from 'src/app/model/configs/discConfig';
import { ThrowConfig } from 'src/app/model/configs/throwConfig';
import { Data } from 'src/app/model/data';
import { Entity } from 'src/app/model/entity';
import { GraphicEngineOne } from 'src/app/model/graphicEngines/graphicEngineOne';
import { GraphicEngineTwo } from 'src/app/model/graphicEngines/graphicEngineTwo/graphicEngineTwo';
import { Vector } from 'src/app/model/vector';
import { DiscService } from 'src/app/services/disc.service';
import { SideMenuService } from 'src/app/services/side-menu.service';
import { ThrowService } from 'src/app/services/throw.service';
import { Calculus } from 'src/app/utils/calculus';
import { Physics } from 'src/app/utils/physics';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, OnDestroy {

  private ctx: WebGL2RenderingContext;
  private data: Data;
  private camera: Camera;
  private controlConfig: ControlConfig;
  private throwConfig: ThrowConfig;
  private discConfig: DiscConfig;


  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  generateNewDiscSub

  ge: GraphicEngineTwo;


  constructor(private sideMenuService: SideMenuService, private throwService: ThrowService, private discService: DiscService) {
    this.controlConfig = sideMenuService.controlConfig;
    this.throwConfig = throwService.throwConfig;
    this.discConfig = discService.discConfig;

    this.generateNewDiscSub = this.sideMenuService.generateNewDisc.subscribe((x: boolean) => {
      this.data.generateProtoDisk(this.discConfig);
    })
  }

  ngOnInit() {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    console.log(this.canvas)


    // this.ctx = this.canvas.nativeElement.getContext('webgl');
    // this.ctx.scale(2, 2)

    this.initListeners();

    this.initCamera();

    this.initData();

    this.ge = new GraphicEngineTwo(this.canvas)

    // this.ge.drawScene(this.data, this.camera)

    this.requestFrame();
  }

  ngOnDestroy(): void {
    this.generateNewDiscSub.unsubscribe();
  }

  requestFrame(): void {
    window.requestAnimationFrame(() => {
      // check how to use it properly
      if (!this.controlConfig.pause) {
        this.data.calculateNextFrame(this.controlConfig.dt);
      }
      this.cameraFollowCenter();
      // this.draw2d();
      this.ge.drawScene(this.data, this.camera)


      this.requestFrame();
    })
  }

  initData(): void {
    this.data = new Data();
    // this.data.generateProtoDisk(this.discConfig)
    // for (let i = 0; i < 1; i++) {
    //   // this.data.addEntity(new Entity(500,
    //   //   {
    //   //     x: window.innerWidth / 2 + (100 * i),
    //   //     y: window.innerHeight / 2,
    //   //     z: 0.1
    //   //   } as Vector,
    //   //   {
    //   //     x: (0.5 * i),
    //   //     y: 0,
    //   //     z: 0
    //   //   } as Vector,
    //   //   ''))
    //   // this.data.addEntity(new Entity(Math.random() * 10, { x: Math.random() * window.innerWidth / 2, y: Math.random() * window.innerHeight / 2, z: 0 } as Vector, { x: 0, y: 0, z: (Math.random() - 0.5) * 2 } as Vector, ''))
    // }
    // // this.data.addEntity(new Entity(5000, { x: window.innerWidth / 4, y: window.innerHeight / 2, z: 0 } as Vector, { x: 0, y: 0, z: 0 } as Vector, ''))
  }

  initCamera(): void {
    this.camera = new Camera({ x: window.innerWidth / 2, y: window.innerHeight / 2, z: 500 } as Vector)
  }

  initListeners(): void {
    window.addEventListener('mousedown', (event) => this.mousedown(event));
    window.addEventListener('mousemove', (event) => this.mousemove(event));
    window.addEventListener('mouseup', (event) => this.mouseup(event));
    window.addEventListener('touchstart', (event) => this.touchdown(event), false);
    window.addEventListener('touchmove', (event) => this.touchmove(event), false);
    window.addEventListener('touchend', (event) => this.touchup(event), false);
  }

  draw2d(): void {
    if (!this.data.entities || this.data.entities.length === 0 || !this.camera) {
      return;
    }
    GraphicEngineOne.drawScene(this.data, this.camera, this.ctx)

  }

  cameraFollowCenter(): void {
    if (!this.controlConfig.enablePan) {
      if (this.data.entities) {
        this.camera.position = Physics.getMassCenter(this.data.entities);
      } else {
        this.camera.position = { x: 0, y: 0, z: 100 } as Vector;
      }
      this.camera.position.z = window.innerHeight;
    }
  }

  addEntity(position: Vector, isMobile: boolean) {
    let count = 1;

    if (this.throwConfig.countRange) {
      count = Calculus.randomize(this.throwConfig.minMaxCount.lower, this.throwConfig.minMaxCount.upper)
    }

    for (let i = 0; i < count; i++) {
      let mass = this.throwConfig.mass;
      if (this.throwConfig.massRange) {
        mass = Calculus.randomize(this.throwConfig.minMaxMass.lower, this.throwConfig.minMaxMass.upper)
      }
      GraphicEngineOne.throwEntity(mass,
        this.controlConfig.tempMousePos,
        Calculus.antySuperposition({ x: position.x, y: position.y, z: 0.01 } as Vector, this.controlConfig.tempMousePos),
        this.data,
        this.camera,
        this.ctx)
    }
  }

  mousedown(event): void {
    this.controlConfig.mouseDown = true;
    this.controlConfig.tempMousePos = { x: event.x, y: event.y, z: 0 } as Vector;
    this.controlConfig.virtualCamPos = this.camera.position;
  }

  mouseup(event): void {
    if (this.controlConfig.mouseDown && this.controlConfig.throwMode && event.x < window.innerWidth - UsefulConsts.SIDE_MENU_WIDTH && !this.controlConfig.isThrowMenuOpen) {
      this.addEntity({ x: event.x, y: event.y, z: 0 } as Vector, false)
    }
    this.controlConfig.mouseDown = false;

  }

  mousemove(event): void {

    if (this.controlConfig.mouseDown && this.controlConfig.enablePan) {
      this.controlConfig.mousePos = Calculus.antySuperposition({ x: event.x, y: event.y, z: 0 } as Vector, this.controlConfig.tempMousePos);
      this.camera.position = Calculus.superposition(this.controlConfig.virtualCamPos, this.controlConfig.mousePos);
    }
  }

  touchdown(event): void {
    this.controlConfig.mouseDown = true;
    this.controlConfig.tempMousePos = { x: event.touches[0].clientX, y: event.touches[0].clientY, z: 0 } as Vector;
    this.controlConfig.virtualCamPos = this.camera.position;
  }


  touchup(event): void {
    if (this.controlConfig.mouseDown && this.controlConfig.throwMode && event.changedTouches[0].clientX < window.innerWidth - UsefulConsts.SIDE_MENU_WIDTH && !this.controlConfig.isThrowMenuOpen) {
      this.addEntity({ x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY, z: 0 } as Vector, true)
    }
    this.controlConfig.mouseDown = false;
  }

  touchmove(event): void {

    if (this.controlConfig.mouseDown && this.controlConfig.enablePan) {
      this.controlConfig.mousePos = Calculus.antySuperposition({ x: event.touches[0].clientX, y: event.touches[0].clientY, z: 0 } as Vector, this.controlConfig.tempMousePos);
      this.camera.position = Calculus.superposition(this.controlConfig.virtualCamPos, this.controlConfig.mousePos);
    }
  }
}
