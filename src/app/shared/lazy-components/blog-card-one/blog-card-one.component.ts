import {Component, Input} from '@angular/core';
import {Blog} from "../../../interfaces/common/blog.interface";

@Component({
  selector: 'app-blog-card-one',
  templateUrl: './blog-card-one.component.html',
  styleUrls: ['./blog-card-one.component.scss']
})
export class BlogCardOneComponent {
  @Input() data: Blog;
}
