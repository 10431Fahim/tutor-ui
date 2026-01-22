import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-detail-loader-right',
  templateUrl: './course-detail-loader-right.component.html',
  styleUrls: ['./course-detail-loader-right.component.scss'],
})
export class CourseDetailLoaderRightComponent {
  @Input() type: string = 'grid';
  constructor() {}

  ngOnInit(): void {}
}
