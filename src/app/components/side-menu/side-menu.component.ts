import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  menuButtonColor = 'primary'
  menuButton = false;

  constructor() { }

  ngOnInit() {}

  toggleMenuButton(): void {
    if (this.menuButton) {
      this.menuButtonColor = 'primary'
    } else {
      this.menuButtonColor = 'secondary'
    }
    this.menuButton = !this.menuButton;
  }

}
