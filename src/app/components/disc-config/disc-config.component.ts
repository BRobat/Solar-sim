import { Component, OnInit } from '@angular/core';
import { DiscConfig } from 'src/app/model/configs/discConfig';
import { DiscService } from 'src/app/services/disc.service';
import { SideMenuService } from 'src/app/services/side-menu.service';

@Component({
  selector: 'app-disc-config',
  templateUrl: './disc-config.component.html',
  styleUrls: ['./disc-config.component.scss'],
})
export class DiscConfigComponent implements OnInit {

  discConfig: DiscConfig

  constructor(private sideMenuService: SideMenuService, private discService: DiscService) {
    this.discConfig = discService.discConfig;
   }

  ngOnInit() {}

  createNewDisc() {
    this.sideMenuService.generateNewDisc.emit(true);
    this.sideMenuService.controlConfig.isDiscMenuOpen = false;
  }

  updateCentralEntity() {
    this.discConfig.centralEntity = !this.discConfig.centralEntity;
  }

}
