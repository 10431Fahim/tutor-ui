import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { CategoryService } from '../../../services/common/category.service';
import {Category} from '../../../interfaces/common/category.interface';

@Component({
  selector: 'app-featured-category',
  templateUrl: './featured-category.component.html',
  styleUrls: ['./featured-category.component.scss']
})
export class FeaturedCategoryComponent implements OnInit, OnDestroy {

  // Store Data
  categories: Category[] = [];

  // Subscriptions
  private subGetData1: Subscription;

  // Inject
  private readonly categoryService = inject(CategoryService);


  ngOnInit(): void {
    //Base Data
    this.getAllCategories();
  }

  /**
   * HTTP REQUEST HANDLE
   * getAllCategories()
   */
  // private getAllCategories() {
  //   let filterData: FilterData = {
  //     filter: {status: 'publish'},
  //     sort: { createdAt: 1 }
  //   }
  //
  //   this.subGetData1 = this.categoryService.getAllCategoriesWithCache(filterData)
  //     .subscribe({
  //       next: res => {
  //         this.categories = res.data;
  //       },
  //       error: err => {
  //         console.log(err)
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

  /**
   * On Destroy
   */
  ngOnDestroy() {
    if (this.subGetData1) {
      this.subGetData1.unsubscribe();
    }
  }

}
