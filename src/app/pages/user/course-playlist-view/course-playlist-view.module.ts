import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursePlaylistViewRoutingModule } from './course-playlist-view-routing.module';
import { CoursePlaylistViewComponent } from './course-playlist-view.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [CoursePlaylistViewComponent],
  imports: [
    CommonModule,
    CoursePlaylistViewRoutingModule,
    MatExpansionModule,
    MatIconModule,
    PipesModule,
    FormsModule,
    FontAwesomeModule,
    PdfViewerModule
  ],
})
export class CoursePlaylistViewModule {}
