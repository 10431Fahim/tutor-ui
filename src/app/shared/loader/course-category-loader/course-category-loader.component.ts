import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-category-loader',
  templateUrl: './course-category-loader.component.html',
  styleUrls: ['./course-category-loader.component.scss'],
})
export class CourseCategoryLoaderComponent {
  @Input() type: string = 'grid';
  constructor() {}

  ngOnInit(): void {}
}
