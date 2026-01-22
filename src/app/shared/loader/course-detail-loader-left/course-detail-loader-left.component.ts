import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-detail-loader-left',
  templateUrl: './course-detail-loader-left.component.html',
  styleUrls: ['./course-detail-loader-left.component.scss'],
})
export class CourseDetailLoaderLeftComponent {
  @Input() type: string = 'grid';
  constructor() {}

  ngOnInit(): void {}
}
