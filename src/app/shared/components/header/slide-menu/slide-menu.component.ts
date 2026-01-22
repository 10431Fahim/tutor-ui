import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { faAlignLeft, faAngleDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs/internal/Subscription';
import { Category } from 'src/app/interfaces/common/category.interface';
import { SubCategory } from 'src/app/interfaces/common/sub-category.interface';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { CategoryService } from 'src/app/services/common/category.service';
import { CourseService } from 'src/app/services/common/course.service';
import { ShopInformationService } from 'src/app/services/common/shop-information.service';
import { SubCategoryService } from 'src/app/services/common/sub-category.service';
import { UserService } from 'src/app/services/common/user.service';

@Component({
  selector: 'app-slide-menu',
  templateUrl: './slide-menu.component.html',
  styleUrls: ['./slide-menu.component.scss'],
})
export class SlideMenuComponent implements OnInit {
  //Font Awesome icon
  faAlignLeft = faAlignLeft;
  faAngleDown = faAngleDown;
  faXmark = faXmark;

  //Store Data
  categories: Category[] = [];
  subCategory: SubCategory[] = [];
  isLoading = false;
  // Store Data
  slideMenu = false;
  isSubMenu = 0;

  // Subscriptions
  private subGetData1!: Subscription;
  private subGetData2: Subscription;

  // Inject
  private readonly categoryService = inject(CategoryService);
  public readonly userService = inject(UserService);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly shopInfoService = inject(ShopInformationService);
  private readonly subCategoryService = inject(SubCategoryService);

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllSubCategory();
  }



  /**
   * HTTP REQUEST HANDLE
   * getAllCategories()
   * getAllSubCategory()
   * getShopInformation()
   */
  // private getAllCategories() {
  //   let filterData: FilterData = {
  //     filter: null,
  //     sort: { createdAt: 1 },
  //   };
  //
  //   this.subGetData1 = this.categoryService
  //     .getAllCategoriesWithCache(filterData).subscribe({
  //       next: res => {
  //         this.categories = res.data;
  //       },
  //       error: err => {
  //         console.log(err);
  //       }
  //     })
  // }

  private getAllCategories() {
    this.categoryService.getAllCategorys().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: (err) => {
        console.log(err)
      },
    });
  }


  // public getAllSubCategory() {
  //   const mSelect = {
  //     name: 1,
  //     slug: 1,
  //     category: 1,
  //   };
  //
  //   const filterData: FilterData = {
  //     filter: null,
  //     select: mSelect,
  //     sort: { priority: -1 },
  //     pagination: null,
  //   };
  //   this.subGetData2 = this.subCategoryService
  //     .getAllSubCategory(filterData).subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.subCategory = res.data;
  //         }
  //       },
  //       error: err => {
  //         console.log(err);
  //       }
  //     });
  //
  //   return this.subCategory;
  // }

  private getAllSubCategory() {
    this.subCategoryService.getAllSubCategorysData().subscribe({
      next: (res) => {
        this.subCategory = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
    return this.subCategory;
  }

  /**
   * onHideSlideMenu()
   * onShowSubMenu()
   */

  onHideSlideMenu() {
    this.slideMenu = false;
  }


  onShowSubMenu(index: number) {
    if (this.isSubMenu === index) {
      this.isSubMenu = 0;
    } else {
      this.isSubMenu = index;
    }
  }


  /**
   * On Destroy
   */
  ngOnDestroy() {
    if (this.subGetData1) {
      this.subGetData1.unsubscribe();
    }
    if (this.subGetData2) {
      this.subGetData2.unsubscribe();
    }
  }



}
