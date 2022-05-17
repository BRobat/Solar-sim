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

  constructor(private sideMenuService: SideMenuService) { }

  ngOnInit() {}

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

}
