import { Component, Input, OnInit } from '@angular/core';
import { Review } from "../../../interfaces/common/review.interface";

@Component({
  selector: 'app-course-review',
  templateUrl: './course-review.component.html',
  styleUrls: ['./course-review.component.scss']
})
export class CourseReviewComponent implements OnInit {

  // Store Data
  panelOpenState = false;
  @Input() data: Review;


  ngOnInit() {
    // Base Data
    // this.countLines();
  }


  /**
  * panelOpen()
  * countLines()
  */

  panelOpen() {
    this.panelOpenState = !this.panelOpenState;
  }

  public countLines() {
    const el = document.getElementById('content');
    const divHeight = el.offsetHeight;
    const lineHeight = parseInt(el.style.lineHeight);
    const lines = divHeight / lineHeight;
    alert("Lines: " + lines);
    // console.log('lines', lines)
  }

}
