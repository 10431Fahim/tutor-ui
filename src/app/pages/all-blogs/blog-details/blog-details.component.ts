import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Blog } from 'src/app/interfaces/common/blog.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/services/common/blog.service';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit, OnDestroy {

  faCalender = faCalendar

  // Store Data
  blog: Blog;
  id: string | any;

  // Loader
  isLoading = false;

  // Subscriptions
  private subParamData: Subscription;
  private subGetData: Subscription;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);


  ngOnInit(): void {
    // GET ID FROM PARAM
    this.subParamData = this.activatedRoute.paramMap.subscribe(res => {
      this.id = res.get('id');
      if (this.id) {
        this.getBlogById(this.id);
      }
    })
  }

  /**
   * HTTP REQUEST HANDLE
   * getBlogById()
   */
  getBlogById(id: string | any) {
    this.isLoading = true;
    this.subGetData = this.blogService.getBlogById(id).subscribe({
      next: res => {
        this.blog = res.data;
        this.isLoading = false;
      },
      error: err => {
        console.log(err);
        this.isLoading = true;
      }
    })
  }


  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
    if (this.subParamData) {
      this.subParamData.unsubscribe();
    }
  }

}
