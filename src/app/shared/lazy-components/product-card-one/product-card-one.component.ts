import {Component, Input, SimpleChanges} from '@angular/core';
import {Course} from '../../../interfaces/common/course.interface';
import {RAW_SRC} from '../../../core/utils/app-data';
import { faFilePdf, faPlay, faVideoCamera } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-card-one',
  templateUrl: './product-card-one.component.html',
  styleUrls: ['./product-card-one.component.scss'],
})
export class ProductCardOneComponent {
  //Font Awesome Icon
  faVideoCamera = faVideoCamera;
  faFilePdf = faFilePdf;
  faPlay = faPlay;

  @Input({ required: true }) data: Course;

  // Static Data
  readonly rawSrcset = RAW_SRC;

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("data---", this.data);
  }
}
