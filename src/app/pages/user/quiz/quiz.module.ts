import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizComponent } from './quiz.component';
import { QuizDetailsComponent } from './quiz-details/quiz-details.component';
import { QuizResultComponent } from './quiz-result/quiz-result.component';
import { QuizCardComponent } from '../../../shared/components/quiz-card/quiz-card.component';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {GalleryComponent} from "../../../shared/components/gallery/gallery.component";
import {DropZoneModule} from "../../../shared/components/drop-zone/drop-zone.module";
import {QuizCardTwoComponent} from "../../../shared/components/quiz-card-two/quiz-card-two.component";

@NgModule({
  declarations: [
    QuizComponent,
    QuizDetailsComponent,
    QuizResultComponent,
    QuizCardTwoComponent,
    QuizCardComponent,
    GalleryComponent,
  ],
  imports: [CommonModule, QuizRoutingModule, PipesModule, FontAwesomeModule, DropZoneModule],
})
export class QuizModule {}
