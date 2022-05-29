import { Component, OnInit } from '@angular/core';
import { SideMenuService } from 'src/app/services/side-menu.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  menuButtonColor = 'primary';
  menuButton = false;

  panButtonColor = 'primary';
  panButton = false;

  pauseButtonColor = 'primary';
  pauseButton = false;

  throwButtonColor = 'primary';
  throwButton = false;

  speed = 0.5


  constructor(private sideMenuService: SideMenuService) { }

  ngOnInit() { }

  toggleMenuButton(): void {
    if (this.menuButton) {
      this.menuButtonColor = 'primary'
    } else {
      this.menuButtonColor = 'secondary'
    }
    this.menuButton = !this.menuButton;
  }

  togglePanButton(): void {
    if (this.panButton) {
      this.panButtonColor = 'primary'
    } else {
      this.panButtonColor = 'secondary'
    }
    this.panButton = !this.panButton;
    this.sideMenuService.controlConfig.enablePan = this.panButton;
  }

  toggleThrowButton(): void {
    if (this.throwButton) {
      this.throwButtonColor = 'primary'
      
    } else {
      this.throwButtonColor = 'secondary'
    }
    this.throwButton = !this.throwButton;
    this.sideMenuService.controlConfig.throwMode = this.throwButton;
  }

  togglePauseButton(): void {
    if (this.pauseButton) {
      this.pauseButtonColor = 'primary'
    } else {
      this.pauseButtonColor = 'secondary'
    }
    this.pauseButton = !this.pauseButton;
    this.sideMenuService.controlConfig.pause = this.pauseButton;
  }

  speedUp() {
    switch (this.speed) {
      case 0.1:
        this.speed = 0.3
        break;
      case 0.3:
        this.speed = 0.5
        break;
      case 0.5:
        this.speed = 0.8
        break;
      case 0.8:
        this.speed = 1.0
        break;
    }
    this.sideMenuService.controlConfig.dt = this.speed;
  }

  slowDown() {
    switch (this.speed) {
      case 0.3:
        this.speed = 0.1
        break;
      case 0.5:
        this.speed = 0.3
        break;
      case 0.8:
        this.speed = 0.5
        break;
      case 1.0:
        this.speed = 0.8
        break;
    }
    this.sideMenuService.controlConfig.dt = this.speed;
  }

}
