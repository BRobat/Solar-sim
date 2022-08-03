import { Component, OnInit } from '@angular/core';
import { ThrowConfig } from 'src/app/model/configs/throwConfig';
import { ThrowService } from 'src/app/services/throw.service';

@Component({
  selector: 'app-throw-menu',
  templateUrl: './throw-menu.component.html',
  styleUrls: ['./throw-menu.component.scss'],
})
export class ThrowMenuComponent implements OnInit {

  throwConfig: ThrowConfig;

  constructor(private throwService: ThrowService) {
    this.throwConfig = throwService.throwConfig;
   }

  ngOnInit() {}

  updateMassRange() {
    this.throwConfig.massRange = !this.throwConfig.massRange;
  }
  
  updateCountRange() {
    this.throwConfig.countRange = !this.throwConfig.countRange;
  }

}
