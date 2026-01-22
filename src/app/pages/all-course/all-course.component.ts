import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { CourseService } from 'src/app/services/common/course.service';
import { Course } from '../../interfaces/common/course.interface';
import { SubCategory } from '../../interfaces/common/sub-category.interface';
import { Pagination } from '../../interfaces/core/pagination.interface';
import { SubCategoryService } from '../../services/common/sub-category.service';
import { CategoryService } from '../../services/common/category.service';
import {faAngleDown, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {Category} from '../../interfaces/common/category.interface';
import {Product} from "../../interfaces/common/product";
import {Tag} from "../../interfaces/common/tag.interface";
import {FILTER_TAGS} from "../../core/utils/app-data";

@Component({
  selector: 'app-all-course',
  templateUrl: './all-course.component.html',
  styleUrls: ['./all-course.component.scss'],
})
export class AllCourseComponent implements OnInit, OnDestroy {
  // Font Awesome Icon
  faArrowRight = faArrowRight;

  // Store Data
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  products: Course[] = [];
  totalProducts = 0;
  isLoadMore = false;
  private searchQuery: string = null;

  // Pagination
  private currentPage: number = 0;
  private productsPerPage = 12;

  // Loader
  isLoading: boolean = true;
  subCategoryLoader: boolean = false;

  // Filter
  filter: any = null;
  activeCategoryFilter: string = null;
  activeSubCategoryFilter: string = null;
  activeTypeFilter: string = 'all';

  // Subscription
  private subRouteOne: Subscription;
  private subGetData1: Subscription;
  private subGetData2: Subscription;

  // Inject
  private readonly courseService = inject(CourseService);
  private readonly categoryService = inject(CategoryService);
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // Get Page From Query Param
    this.subRouteOne = this.activatedRoute.queryParams.subscribe((qParam) => {
      // Search Query
      this.searchQueryFromQueryParam(qParam);
      // console.log(qParam);

      // Filter Query
      this.filterQueryFromQueryParam(qParam);

      // Base data
      this.getAllCourses();
      this.getAllCategories();
    });
  }

  /**
   * QUERY BUILDER
   * searchQueryFromQueryParam()
   * filterQueryFromQueryParam()
   */
  private searchQueryFromQueryParam(qParam: any) {
    if (qParam && qParam['search']) {
      this.searchQuery = qParam['search'];
    } else {
      this.searchQuery = null;
    }
  }

  private filterQueryFromQueryParam(qParam: any) {
    if (qParam && qParam['category']) {
      this.filter = {
        'category.slug': qParam['category'],
      };
      this.activeCategoryFilter = qParam['category'];
      this.getSubCategoriesByCategorySlug(this.activeCategoryFilter);
    }
    if (qParam && qParam['subCategory']) {
      this.filter = {
        'subCategory.slug': qParam['subCategory'],
      };
      this.activeSubCategoryFilter = qParam['subCategory'];
    }
    if (qParam && qParam['type']) {
      if (qParam['type'] === 'lecture-sheet') {
        this.filter = {
          canSaleAttachment: true,
        };
      } else {
        this.filter = {
          type: qParam['type'],
        };
      }

      this.activeTypeFilter = qParam['type'];
    }
  }

  /**
   * HTTP REQUEST HANDLE
   * getAllCourses()
   * getAllCategories()
   * getSubCategoriesByCategorySlug()
   */

  // private getAllCourses(loadMore?: boolean) {
  //   this.isLoading = true;
  //
  //   const mSelect = {
  //     name: 1,
  //     slug: 1,
  //     status: 1,
  //     bannerImage: 1,
  //     isFeatured: 1,
  //     salePrice: 1,
  //     discountAmount: 1,
  //     discountType: 1,
  //     type: 1,
  //     isMultiplePrice: 1,
  //     prices: 1,
  //     canSaleAttachment: 1,
  //     attachmentSalePrice: 1,
  //     attachmentDiscountAmount: 1,
  //     attachmentDiscountType: 1,
  //     category: 1,
  //     subCategory: 1,
  //     childCategory: 1,
  //   };
  //
  //   const pagination: Pagination = {
  //     pageSize: this.productsPerPage,
  //     currentPage: this.currentPage,
  //   };
  //
  //   const filterData: FilterData = {
  //     select: mSelect,
  //     pagination: pagination,
  //     filter: { ...this.filter, ...{ status: 'publish' } },
  //     sort: { createdAt: -1 },
  //   };
  //
  //   this.subGetData1 = this.courseService
  //     .getAllCourses(filterData, this.searchQuery)
  //     .subscribe({
  //       next: (res) => {
  //         this.isLoading = false;
  //         this.isLoadMore = false;
  //         if (loadMore) {
  //           this.products = [...this.products, ...res.data];
  //         } else {
  //           this.products = res.data;
  //         }
  //         this.totalProducts = res.count;
  //       },
  //       error: (err) => {
  //         console.log(err);
  //         this.isLoading = false;
  //       },
  //     });
  // }


  private getAllCourses(loadMore?: boolean) {
    this.isLoading = true;

    const mSelect = {
      name: 1,
      slug: 1,
      status: 1,
      bannerImage: 1,
      isFeatured: 1,
      salePrice: 1,
      discountAmount: 1,
      discountType: 1,
      type: 1,
      isMultiplePrice: 1,
      prices: 1,
      canSaleAttachment: 1,
      attachmentSalePrice: 1,
      attachmentDiscountAmount: 1,
      attachmentDiscountType: 1,
      category: 1,
      subCategory: 1,
      childCategory: 1,
    };

    const pagination: Pagination = {
      pageSize: this.productsPerPage,
      currentPage: this.currentPage,
    };

    const filterData: FilterData = {
      select: mSelect,
      pagination: pagination,
      filter: { ...this.filter, status: 'publish' },
      sort: { createdAt: -1 },
    };

    this.subGetData1 = this.courseService
      .getAllCourse(filterData, this.searchQuery)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.isLoadMore = false;
          if (loadMore) {
            this.products = [...this.products, ...res.data];
          } else {
            this.products = res.data;
          }
          this.totalProducts = res.count;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }


  private getAllCategories() {
    let filterData: FilterData = {
      filter: {status: 'publish'},
      sort: { createdAt: -1 },
    };

    this.subGetData1 = this.categoryService
      .getAllCategorys()
      .subscribe({
        next: (res) => {
          this.categories = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getSubCategoriesByCategorySlug(categorySlug: string) {
    this.subCategoryLoader = true;

    this.subGetData2 = this.subCategoryService
      .getSubCategoriesByCategorySlug(categorySlug, 'name slug status courseCount')
      .subscribe({
        next: (res) => {
          this.subCategories = res.data.filter((d) => d.status === "publish");

          // this.subCategories = res.data;
          this.subCategoryLoader = false;
        },
        error: (err) => {
          console.log(err);
          this.subCategoryLoader = false;
        },
      });
  }

  /**
   * Selection Methods
   * onCategorySelected()
   * onSubCategorySelected()
   * onTypeSelected()
   */
  onCategorySelected(data: Category) {
    if (data.slug === this.activeCategoryFilter) {
      this.activeCategoryFilter = null;
      this.subCategories = [];
      this.filter = null;
      this.currentPage = 0;
      this.router.navigate([], { queryParams: null }).then();
    } else {
      this.currentPage = 0;
      this.activeCategoryFilter = data.slug;
      this.getSubCategoriesByCategorySlug(data.slug);
      this.router.navigate([], { queryParams: { category: data.slug } }).then();
    }
  }

  onSubCategorySelected(data: SubCategory) {
    if (data.slug === this.activeSubCategoryFilter) {
      this.currentPage = 0;
      this.activeSubCategoryFilter = null;
      delete this.filter['subCategory.slug'];
      this.router
        .navigate([], {
          queryParams: { subCategory: null },
          queryParamsHandling: 'merge',
        })
        .then();
    } else {
      this.currentPage = 0;
      this.activeSubCategoryFilter = data.slug;
      this.router
        .navigate([], {
          queryParams: { subCategory: data.slug },
          queryParamsHandling: 'merge',
        })
        .then();
    }
  }

  onTypeSelected(
    type: 'all' | 'video-course' | 'live-course' | 'lecture-sheet'
  ) {
    if (type === 'all') {
      this.currentPage = 0;
      this.activeTypeFilter = type;
      this.router
        .navigate([], {
          queryParams: { type: null },
          queryParamsHandling: 'merge',
        })
        .then();
    } else {
      this.currentPage = 0;
      this.activeTypeFilter = type;
      this.router
        .navigate([], {
          queryParams: { type: type },
          queryParamsHandling: 'merge',
        })
        .then();
    }
  }

  /**
   * LOAD MORE
   * onLoadMore()
   */
  onLoadMore() {
    if (this.totalProducts > this.products.length) {
      this.isLoadMore = true;
      this.currentPage += 1;
      this.getAllCourses(true);
    }
  }

  /**
   * ON Destroy
   */
  ngOnDestroy(): void {
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subGetData1) {
      this.subGetData1.unsubscribe();
    }

    if (this.subGetData2) {
      this.subGetData2.unsubscribe();
    }
  }

  protected readonly faAngleDown = faAngleDown;
}
