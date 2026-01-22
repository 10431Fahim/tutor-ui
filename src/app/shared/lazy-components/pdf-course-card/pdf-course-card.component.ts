import {Component, Input, OnInit} from '@angular/core';
import {Course} from '../../../interfaces/common/course.interface';
import { faPlay, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-pdf-course-card',
  templateUrl: './pdf-course-card.component.html',
  styleUrls: ['./pdf-course-card.component.scss'],
})
export class PdfCourseCardComponent implements OnInit {
  //Font Awesome Icon
  faVideoCamera = faVideoCamera;
  faFilePdf = faFilePdf;
  faPlay = faPlay;

  @Input() data: Course;

  constructor() {}

  ngOnInit(): void {}
}
