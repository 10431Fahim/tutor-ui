import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Course} from '../../../interfaces/common/course.interface';
import {PricePipe} from '../../pipes/price.pipe';
import { faFilePdf, faPlay, faVideoCamera } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
  providers: [PricePipe],
})
export class CourseCardComponent implements OnInit, OnChanges {
  //Font Awesome Icon
  faVideoCamera = faVideoCamera;
  faFilePdf = faFilePdf;
  faPlay = faPlay;

  @Input({ required: true }) data: Course;
  @Input() type: string;

  constructor(private pricePipe: PricePipe) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.type === 'lecture-sheet') {
      this.data.salePrice = this.data.attachmentSalePrice;
      this.data.discountAmount = this.data.attachmentDiscountAmount;
      this.data.discountType = this.data.attachmentDiscountType;
    }
  }

  get checkDiscount(): boolean {
    const salePrice = this.pricePipe.transform(
      this.data,
      'salePrice',
      this.data.isMultiplePrice ? this.data[0] : null
    );
    const regularPrice = this.pricePipe.transform(
      this.data,
      'regularPrice',
      this.data.isMultiplePrice ? this.data[0] : null
    );
    return salePrice !== regularPrice;
  }
}
