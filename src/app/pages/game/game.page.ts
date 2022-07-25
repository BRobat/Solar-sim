import { Component, OnInit } from '@angular/core';
import { ControlConfig } from 'src/app/model/configs/controlConfig';
import { SideMenuService } from 'src/app/services/side-menu.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  controlConfig: ControlConfig;

  constructor(private sideMenuService: SideMenuService) {
    this.controlConfig = sideMenuService.controlConfig;
  }

  ngOnInit() {
  }

  onThrowMenuDismiss(event): void {
    this.controlConfig.isThrowMenuOpen = false;
  }

  onDiscMenuDismiss(event): void {
    this.controlConfig.isDiscMenuOpen = false;
  }

}
