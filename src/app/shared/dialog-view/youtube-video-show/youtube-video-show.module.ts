import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubeVideoShowComponent } from './youtube-video-show.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MaterialModule } from 'src/app/materials/materials.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    YoutubeVideoShowComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MaterialModule,
    FontAwesomeModule
  ]
})
export class YoutubeVideoShowModule { }
