import { Component, OnInit, OnDestroy, inject } from '@angular/core';;
import { Subscription } from 'rxjs';
import { Blog } from 'src/app/interfaces/common/blog.interface';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { BlogService } from 'src/app/services/common/blog.service';

@Component({
  selector: 'app-all-blogs',
  templateUrl: './all-blogs.component.html',
  styleUrls: ['./all-blogs.component.scss']
})
export class AllBlogsComponent implements OnInit, OnDestroy {

  // Store Data
  blogs: Blog[];
  isLoadingBlog: boolean = true;

  // Pagination
  currentPage = 1;
  totalProducts: number;
  productsPerPage = 10;

  // Subscriptions
  private subGetData: Subscription;

  // Inject
  private readonly blogService = inject(BlogService);


  ngOnInit(): void {
    // Base Data
    this.getAllBlogs();
  }

  /**
   * HTTP REQUEST HANDLE
   * getAllBlogs()
   */
  getAllBlogs() {
    let mSelect = {
      name: 1,
      status: 1,
      shortDesc: 1,
      image: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      filter: {status: 'publish'},
      select: mSelect,
      pagination: null,
      sort: { createdAt: -1 }
    }

    this.isLoadingBlog = true;
    this.subGetData = this.blogService.getAllBlog(filterData, null).subscribe({
      next: res => {
        if (res.success) {
          this.blogs = res.data;
          this.isLoadingBlog = false;
          this.totalProducts = res.count;
        }
      },
      error: err => {
        console.log(err);
      }
    }
    )
  }

  /**
   * ON PAGINATION CHANGE
   * onPageChanged()
   */
  onPageChanged(event: number) {
    this.currentPage = event;
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
  }

}
