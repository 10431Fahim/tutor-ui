import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoPlayerDialogComponent } from './video-player-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';



@NgModule({
  declarations: [
    VideoPlayerDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ]
})
export class VideoPlayerDialogModule { }
