import { Component, Input } from '@angular/core';
import {Course} from '../../../interfaces/common/course.interface';
import {
  faFilePdf,
  faPlay,
  faVideoCamera,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-card-two',
  templateUrl: './product-card-two.component.html',
  styleUrls: ['./product-card-two.component.scss'],
})
export class ProductCardTwoComponent {
  //Font Awesome Icon
  faVideoCamera = faVideoCamera;
  faFilePdf = faFilePdf;
  faPlay = faPlay;

  @Input() data: Course;
}
