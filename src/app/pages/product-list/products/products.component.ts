import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Product} from 'src/app/interfaces/common/product';
import {ProductService} from 'src/app/services/common/product.service';
import {ReloadService} from 'src/app/services/core/reload.service';
import {Pagination} from "../../../interfaces/core/pagination.interface";
import {FilterData} from "../../../interfaces/core/filter-data.interface";


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  // @Input() products : any
  //Store Data
  products: Product[] = [];
  slug: string;
  tagsSlug: string;
  searchQuery: string;
  id: string;
  // Pagination
  currentPage = 1;
  totalProducts: number;
  productsPerPage = 15;
  categorySlug: string;
  productType: string;
  subCategorySlug: string;
  authorSlug: string;
  isLoadingProductList: boolean = true;
  // Store Data
  isLoading = false;
  isLoadMore = false;
  //Subscription
  private subQparamOne: Subscription;
  private subReloadOne: Subscription;
  private subDataOne: Subscription;
  private subRouteTwo: Subscription;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private reloadService: ReloadService,
  ) {

  }

  ngOnInit(): void {

    // GET DATA FROM PARAM
    this.subQparamOne = this.activatedRoute.queryParams.subscribe(qParam => {
      this.id = qParam['categoryId'];
      this.categorySlug = qParam['categories'];
      this.productType = qParam['productType'];
      this.subCategorySlug = qParam['subCategory'];
      this.authorSlug = qParam['author'];
      this.tagsSlug = qParam['tags'];
      this.searchQueryFromQueryParam(qParam);
      this.getAllProducts();

     // GET PAGE FROM QUERY PARAM
      this.subRouteTwo = this.activatedRoute.queryParams.subscribe(qParam => {

        // Search Query
        this.searchQueryFromQueryParam(qParam);

        // Fetch data
        this.getAllProducts();
      });
      // if (this.id && this.categorySlug) {
      //   this.getSingleCategoryById();
      // }
      // if (this.id && this.genericSlug) {
      //   this.getSingleGenericById();
      // }
      // if (this.id && this.brandSlug) {
      //   this.getSingleBrandById()
      // }
      // if (this.id && this.tagsSlug) {
      //   this.getSingleTagsById()
      // }

    });

  }

  /**
   * searchQueryFromQueryParam()
   */
  private searchQueryFromQueryParam(qParam: any) {
    if (qParam && qParam['searchQuery']) {
      this.searchQuery = qParam['searchQuery'];
    } else {
      this.searchQuery = null;
    }
  }

  /**
   * PRODUCT LIST HTTP REQUEST HANDLE
   * getAllProducts()
   */
  // getAllProducts(categorySlug?: string, searchQueary?: string) {
  //   const mSelect = {
  //     name: 1,
  //     images: 1,
  //     costPrice: 1,
  //     salePrice: 1,
  //     discountAmount: 1,
  //     discountType: 1,
  //     tags: 1,
  //     slug: 1,
  //     author: 1,
  //     category: 1,
  //   }
  //
  //   const filterData: FilterData = {
  //     filter: categorySlug !== null ? { "category.slug": categorySlug} : { status: 'publish' },
  //     select: mSelect,
  //     sort: { createdAt: -1 },
  //     pagination: null
  //   }
  //
  //   this.isLoadingProductList = true;
  //   this.subDataOne = this.productService.getAllProducts(filterData, searchQueary ? searchQueary : null).subscribe(
  //     (res) => {
  //       if (res.success) {
  //         this.isLoadingProductList = false;
  //         this.products = res.data;
  //         console.log('this.products',this.products)
  //         this.totalProducts = res.count;
  //       }
  //     },
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //         this.isLoadingProductList = false;
  //       }
  //     }
  //   )
  // }


  getAllProducts(loadMore?: boolean) {
    const pagination: Pagination = {
      pageSize: Number(this.productsPerPage),
      currentPage: Number(this.currentPage) - 1
    };
    const mSelect = {
      name: 1,
      nameEn: 1,
      images: 1,
      costPrice: 1,
      salePrice: 1,
      quantity: 1,
      discountAmount: 1,
      discountType: 1,
      tags: 1,
      slug: 1,
      author: 1,
      category: 1,
    }
    const filterData: FilterData = {
      filter: this.categorySlug !== null ? {
        "category.slug": this.categorySlug,
        "productType": this.productType,
        status: 'publish'
      } : {status: 'publish'},
      select: mSelect,
      sort: {createdAt: -1},
      pagination: pagination,
    }
    this.isLoading = !loadMore;
    this.subDataOne = this.productService.getAllProducts(filterData, this.searchQuery).subscribe(
      {
        next: res => {
          if (res) {
            this.isLoading = false;
            this.isLoadMore = false;
            if (loadMore) {
              this.products = [...this.products, ...res.data];
            } else {
              this.products = res.data;
            }
            this.totalProducts = res.count;
          }
        },
        error: err => {
          if (err) {
            console.log(err);
            this.isLoading = false;
          }
        }
      }
    )
  }


  onLoadMore() {
    if (this.totalProducts > this.products.length) {
      this.isLoadMore = true;
      this.currentPage += 1;
      this.getAllProducts(true);
    }
  }

  /**
   * ON PAGINATION CHANGE
   * onPageChanged()
   */
  onPageChanged(event: number) {
    this.currentPage = event;
  }


  /**
   * ON NG DESTROY
   */
  ngOnDestroy(): void {

    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subQparamOne) {
      this.subQparamOne.unsubscribe();
    }
    if (this.subReloadOne) {
      this.subReloadOne.unsubscribe();
    }

  }


}
