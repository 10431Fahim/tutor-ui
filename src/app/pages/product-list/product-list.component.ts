import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, EMPTY, pluck, Subscription, switchMap} from 'rxjs';
import {SubCategory} from 'src/app/interfaces/common/sub-category.interface';
import {SubCategoryService} from 'src/app/services/common/sub-category.service';
import {ReloadService} from 'src/app/services/core/reload.service';
import {Author} from '../../interfaces/common/author.interface';
import {Banner} from '../../interfaces/common/banner.interface';
import {Category} from '../../interfaces/common/category.interface';
import {Popup} from '../../interfaces/common/popup.interface';
import {AuthorService} from '../../services/common/author.service';
import {BannerService} from '../../services/common/banner.service';
import {CategoryService} from '../../services/common/category.service';
import {FilterData} from "../../interfaces/core/filter-data.interface";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {PRODUCT_TYPE} from "../../core/utils/app-data";
import {NgForm} from "@angular/forms";
import {Pagination} from "../../interfaces/core/pagination.interface";
import {Product} from "../../interfaces/common/product";
import {ProductService} from "../../services/common/product.service";
import {ProductTypeService} from "../../services/common/product-type.service";
import {ProductType} from "../../interfaces/common/product-type.interface";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;
  // Search Area
  searchQuery = null;
  searchProduct: Product[] = [];
  // Search Placeholder Animation
  timeOutOngoing: any;
  char = 0;
  txt = ['প্রোডাক্ট সার্চ করুন...'];
  indicator = 0;

  filterSlide = false;
  productType = PRODUCT_TYPE;
  //Store Data
  listBanners: Banner[];
  // smallBanners: Banner[];
  // SEARCH AREA
  searchProducts: Product[] = [];

  // SEARCH AREA
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isOfferDialog = false;
  popups: Popup[] = [];
  isBrowser: boolean;
  faBars = faBars;
  isBannerLoading: boolean = false;
  // Pagination
  currentPage = 1;
  totalProducts = 0;
  ProductsPerPage = 10;
  totalProductsStore = 0;
  filter: any = null;
  products: Product[] = [];
  holdPrevData: Product[] = [];
  categories: Category[];
  singleCategories: Category[];
  productTypes?: ProductType[] = [];
  slugCategory: Category;
  subCategories: SubCategory[] = [];
  authors: Author[];
  isLoadingAuthor: boolean = false;
  slug: string;
  categoryId: string;
  //Subscription
  private subBannerDataOne: Subscription;
  private subDataOne: Subscription;
  private subQparamOne: Subscription;
  private subAuthorData: Subscription;
  private subForm: Subscription;
  constructor(
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    private bannerService: BannerService,
    private categoryService: CategoryService,
    private authorService: AuthorService,
    private productService: ProductService,
    private productTypeService: ProductTypeService,
    private subCategoryService: SubCategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subQparamOne = this.activatedRoute.queryParamMap.subscribe((res) => {
      this.slug = res.get('categories');
      this.categoryId = res.get('categoryId');
      this.getSingleCategory();
      // this.getSubCategoriesByCategoryId(this.categoryId);
    });

    this.getAllCategory();
    this.getAllProductType();
    // this.getAllBanners();
    // this.getAllAuthors();
  }


  setSlugActive: string = '';
  onSetActive(slug: string) {
    if (slug) {
      this.setSlugActive = slug;
    }
  }

  onClearActive(event: any): void {
    this.router.navigate(['/shop']);

    this.setSlugActive = '';
  }

  /**
   * ON SEARCH CHANGE
   * onChangeInput()
   */
  onChangeInput(event: string) {
    const data = event ? event.trim() : null;
    if (data) {
      this.router.navigate([], {
        queryParams: { searchQuery: data },
        queryParamsHandling: 'merge',

      });
    } else {
      this.router.navigate([], {
        queryParams: { searchQuery: null },
        queryParamsHandling: 'merge',
      });
    }
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
  }

  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }

  handleOpen(): void {
    if (this.isOpen || (this.isOpen && !this.isLoading)) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  /**
   CATEGORY CONTROLL
   showCategorySlide()
   */
  showCategorySlide() {
    this.reloadService.needRefreshCategorySlide(true);
  }

  ngAfterViewInit(): void {
    this.searchAnim();
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue
      .pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchTerm'),
        debounceTime(150),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data.trim();
          if (this.searchQuery === '' || this.searchQuery === null) {
            this.overlay = false;
            this.searchProducts = [];
            this.searchQuery = null;
            return EMPTY;
          }
          this.isLoading = true;
          const pagination: Pagination = {
            pageSize: 12,
            currentPage: 0,
          };
          // Select
          const mSelect = {
            name: 1,
            slug: 1,
            images: 1,
            category: 1,
            subCategory: 1,
            discountType: 1,
            discountAmount: 1,
            brand: 1,
            costPrice: 1,
            salePrice: 1,
            hasVariations: 1,
            status: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: {status: 'publish'},
            select: mSelect,
            sort: { createdAt: -1 },
          };
          return this.productService.getAllProducts(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.searchProducts = res.data;

          if (this.searchProducts.length > 0) {
            this.isOpen = true;
            this.overlay = true;
          }
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );
  }


  /**
   * Search Animation
   * searchAnim()
   * typeIt()
   */
  private searchAnim() {
    const target = this.searchInput.nativeElement as HTMLInputElement;
    target.placeholder = '|';
    this.typeIt(target);
  }

  private typeIt(target: HTMLInputElement) {
    const humanize = Math.round(Math.random() * (300 - 30)) + 30;

    this.timeOutOngoing = setTimeout(() => {
      this.char++;
      let type = this.txt[this.indicator].substring(0, this.char);
      target.placeholder = type + '|';
      this.typeIt(target);
      if (this.char === this.txt[this.indicator]?.length) {
        target.placeholder = '|';
        this.char = 0;
        if (this.indicator < (this.txt.length - 1)) {
          this.indicator++;
        } else {
          this.indicator = 0;
        }
      }
    }, humanize);
  }

  getAllCategory() {
    let mSelect = {
      name: 1,
      slug: 1,
      status: 1,
      image: 1,
    };
    const filter: FilterData = {
      filter: {status: 'publish'},
      select: mSelect,
      pagination: null,
      sort: { serial: 1 },
    };
    this.isLoadingAuthor = true;

    this.subDataOne = this.categoryService
      .getAllCategory(filter, null)
      .subscribe(
        (res) => {
          if (res.success) {
            this.categories = res.data;
            this.slugCategory = this.categories.find(
              (f) => f.slug === this.slug
            );
            this.isLoadingAuthor = false;
          }
        },
        (err) => {
          if (err) {
            this.isLoadingAuthor = false;
            console.log(err);
          }
        }
      );
  }

  getAllSlug: string = '';
  sendSlug(data: string) {
    this.getAllSlug = data;
  }

  getSingleCategory() {
    let mSelect = {
      name: 1,
      nameEn: 1,
      slug: 1,
      image: 1,
    };
    const filter: FilterData = {
      filter: null,
      select: mSelect,
      pagination: null,
      sort: null,
    };
    this.subDataOne = this.categoryService
      .getAllCategory(filter, null)
      .subscribe(
        (res) => {
          if (res.success) {
            this.singleCategories = res.data;
            this.slugCategory = this.singleCategories.find(
              (f) => f.slug === this.slug
            );
          }
        },
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
  }

  /**
   * HTTP REQ HANDLE
   * getAllProductTypes()
   */

  private getAllProductType() {
    // Select
    const mSelect = {
      image: 1,
      name: 1,
      status: 1,
      priority: 1,
      createdAt: 1,
      description: 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: null,
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subDataOne = this.productTypeService.getAllProductTypes(filter, null).subscribe({
      next: (res) => {
        if (res.success) {
          this.productTypes = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * HTTP REQ HANDLE
   * getAllSubCategory()
   * deleteMultipleSubCategoryById()
   */

  // private getSubCategoriesByCategoryId(id: string) {
  //   const mSelect = 'name  slug image priority readOnly createdAt category';
  //   this.subDataOne = this.subCategoryService
  //     .getSubCategoriesByCategoryId(id, mSelect)
  //     .subscribe(
  //       (res) => {
  //         this.subCategories = res.data;
  //         // console.log('this.subCategories',this.subCategories)
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // }

  private getAllBanners() {
    let mSelect = {
      name: 1,
      slug: 1,
      image: 1,
      bannerType: 1,
      url: 1,
    };

    const filterData: FilterData = {
      filter: null,
      select: mSelect,
      sort: null,
      pagination: null,
    };

    this.isBannerLoading = true;
    this.subBannerDataOne = this.bannerService
      .getAllBanners(filterData, null)
      .subscribe(
        (res) => {
          if (res.success) {
            this.listBanners = res.data.filter(
              (d) => d.bannerType === 'productListBanner1'
            );
            // this.smallBanners = res.data.filter((d) => d.bannerType === "homePageTopSmallBanner");
            this.isBannerLoading = false;
            // console.log(this.listBanners);
          }
        },
        (err) => {
          this.isBannerLoading = false;
          console.log(err);
        }
      );
  }

  getAllAuthors() {
    let mSelect = {
      name: 1,
      slug: 1,
      image: 1,
      createdAt: 1,
      description: 1,
      birthDate: 1,
    };

    const filter: FilterData = {
      select: mSelect,
      filter: null,
      sort: { createdAt: -1 },
      pagination: null,
    };

    this.isLoadingAuthor = true;

    this.subAuthorData = this.authorService
      .getAllAuthors(filter, null)
      .subscribe(
        (res) => {
          if (res.success) {
            this.authors = res.data;
            this.isLoadingAuthor = false;
          }
        },
        (err) => {
          if (err) {
            console.log(err);
            this.isLoadingAuthor = false;
          }
        }
      );
  }

  /***
   * controllFilterSlide
   */
  filterSlideToggle() {
    this.filterSlide = !this.filterSlide;
  }

  /**
   * NG ON DESTROY
   */

  ngOnDestroy() {
    if (this.subBannerDataOne) {
      this.subBannerDataOne.unsubscribe();
    }
  }
}
