import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-enrolled-course-card',
  templateUrl: './enrolled-course-card.component.html',
  styleUrls: ['./enrolled-course-card.component.scss']
})
export class EnrolledCourseCardComponent implements OnInit {
  @Input() data?:any;
  constructor() { }

  ngOnInit(): void {
  }

}
