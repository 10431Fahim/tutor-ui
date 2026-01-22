import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubCategory } from 'src/app/interfaces/common/sub-category.interface';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { SubCategoryService } from 'src/app/services/common/sub-category.service';
import {RAW_SRC} from '../../../core/utils/app-data';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss'],
})
export class BatchComponent implements OnInit, OnDestroy {

  // Store Data
  subCategories: SubCategory[] = [];
  batchNo = 1;

  // Loader
  isLoading: boolean = true;

  // Subscriptions
  private subGetData: Subscription;

  // Inject
  private readonly subCategoryService = inject(SubCategoryService);


  ngOnInit() {
    // Base Data
    this.getAllSubCategories();
  }


  /**
   * HTTP REQUEST HANDLE
   * getAllSubCategories()
   */

  // private getAllSubCategories() {
  //   const mSelect = {
  //     slug: 1,
  //     image: 1,
  //     bannerImage: 1,
  //     category: 1,
  //   };
  //   let filterData: FilterData = {
  //     select: mSelect,
  //     filter: { 'category.slug': 'class-4-12' , status: 'publish'},
  //     sort: { priority: -1 },
  //   };
  //
  //   this.subGetData = this.subCategoryService
  //     .getAllSubCategory(filterData)
  //     .subscribe({
  //       next: (res) => {
  //         this.subCategories = res.data;
  //         // console.log('this.subCategories',this.subCategories)
  //         this.isLoading = false;
  //       },
  //       error: (err) => {
  //         console.log(err)
  //         this.isLoading = false;
  //       },
  //     });
  // }


  private getAllSubCategories() {
    this.subCategoryService.getAllSubCategorys().subscribe({
      next: (res) => {
        this.subCategories = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * TOGGLE BATCH
   * onToggleBatch()
   */
  onToggleBatch(step: number) {
    if (this.batchNo !== step) {
      this.batchNo = step;
    } else {
      this.batchNo = 0;
    }
  }


  /**
   * On Destroy
   */
  ngOnDestroy() {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
  }

  protected readonly rawSrcset = RAW_SRC;
}
