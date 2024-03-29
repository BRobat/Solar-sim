import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';

import { GamePage } from './game.page';
import { CanvasComponent } from 'src/app/components/canvas/canvas.component';
import { SideMenuComponent } from 'src/app/components/side-menu/side-menu.component';
import { ThrowMenuComponent } from 'src/app/components/throw-menu/throw-menu.component';
import { DiscConfigComponent } from 'src/app/components/disc-config/disc-config.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageRoutingModule
  ],
  exports: [

  ],
  declarations: [GamePage,
    CanvasComponent,
    SideMenuComponent,
    ThrowMenuComponent,
    DiscConfigComponent]
})
export class GamePageModule { }
