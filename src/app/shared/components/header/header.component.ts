import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, Subscription, debounceTime, distinctUntilChanged, switchMap, map, filter } from 'rxjs';
import { Course } from '../../../interfaces/common/course.interface';
import { ShopInformation } from '../../../interfaces/common/shop-information.interface';
import { SubCategory } from '../../../interfaces/common/sub-category.interface';
import { ChildCategory } from '../../../interfaces/common/child-category.interface';
import { FilterData } from '../../../interfaces/core/filter-data.interface';
import { CourseService } from '../../../services/common/course.service';
import { ShopInformationService } from '../../../services/common/shop-information.service';
import { SubCategoryService } from '../../../services/common/sub-category.service';
import { ChildCategoryService } from '../../../services/common/child-category.service';
import { UserService } from '../../../services/common/user.service';
import { SlideMenuComponent } from './slide-menu/slide-menu.component';
import { CategoryService } from '../../../services/common/category.service';
import { RAW_SRC } from '../../../core/utils/app-data';
import {faAngleDown, faVideo, faVideoCamera} from '@fortawesome/free-solid-svg-icons';
import {Category} from '../../../interfaces/common/category.interface';
import { UserDataService } from 'src/app/services/common/user-data.service';
import {ReloadService} from "../../../services/core/reload.service";
import {CartSlideComponent} from "./cart-slide/cart-slide.component";
import {Cart} from "../../../interfaces/common/cart.interface";
import {CartService} from "../../../services/common/cart.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cart_slide') cart_slide: CartSlideComponent;
  // Font Awesome Icon
  faVideoCamera = faVideoCamera;
  faAngleDown = faAngleDown;
  faVideo = faVideo;
  carts: Cart[];
  //Store Data
  categories: Category[] = [];
  subCategory: SubCategory[] = [];
  childCategory: ChildCategory[] = [];
  shopInformation: ShopInformation;

  // Static Data
  readonly rawSrcset = RAW_SRC;

  // Slide Menu
  @ViewChild('slide') slideMenu!: SlideMenuComponent;

  //Search Form
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Scroll and Show Search Data
  isHeaderFixed = false;
  isShowSearch = window.innerWidth > 750;

  // Search Data
  searchProducts: Course[] = [];
  isLoading = false;
  overlay = false;
  isOpen = false;
  isFocused = false;
  searchQuery!: string;

  // Search Data
  txt = 'সার্চ করুন আপনার পছন্দের কোর্স...';
  char = 0;
  typeOutOnGoing: any;
  placeValue = '|';

  // Subscriptions
  private subGetData1!: Subscription;
  private subGetData2: Subscription;
  private subGetData3: Subscription;
  private subFormData!: Subscription;
  private subReloadOne!: Subscription;

  // Inject
  private readonly categoryService = inject(CategoryService);
  public readonly userService = inject(UserService);
  public readonly userDataService = inject(UserDataService);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly shopInfoService = inject(ShopInformationService);
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly childCategoryService = inject(ChildCategoryService);
  private readonly reloadService = inject(ReloadService);
  private readonly cartService = inject(CartService);


  ngOnInit(): void {
    // Base Data
    this.getShopInformation();
    this.getAllCategories();
    this.getAllSubCategory();
    this.getAllChildCategory();

    // CART FUNCTION
    this.reloadService.refreshCart$.subscribe((res) => {
      this.getCartsItems(res);
      // this.cd.markForCheck();
    });
    this.getCartsItems();
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm?.valueChanges;
    this.subFormData = formValue
      ?.pipe(
        map(t => t['searchTerm']),
        filter(() => this.searchForm.valid),
        debounceTime(200),
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
          const pagination: any = {
            pageSize: 12,
            currentPage: 0,
          };
          const mSelect = {
            name: 1,
            slug: 1,
            bannerImage: 1,
            status: 1,
            discountType: 1,
            discountAmount: 1,
            salePrice: 1,
            isMultiplePrice: 1,
            prices: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: {status: 'publish'},
            select: mSelect,
            sort: { name: 1 },
          };
          return this.courseService.getAllCourses(filterData, this.searchQuery);
        })
      ).subscribe({
        next: res => {
          this.isLoading = false;
          this.searchProducts = res.data.sort(
            (a, b) =>
              a.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) -
              b.name.toLowerCase().indexOf(this.searchQuery.toLowerCase())
          );
          if (this.searchProducts?.length > 0) {
            this.isOpen = true;
            this.overlay = true;
          }
        },
        error: err => {
          console.log(err);
        }
      });

    this.searchTypeIt();
  }

  /**
   * HTTP REQUEST HANDLE
   * getAllCategories()
   * getAllSubCategory()
   * getShopInformation()
   */
  // private getAllCategories() {
  //   let filterData: FilterData = {
  //     filter: {status: 'publish'},
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
  //     filter: {status: 'publish'},
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

  private getAllChildCategory() {
    this.childCategoryService.getAllChildCategorys().subscribe({
      next: (res) => {
        if (res.success) {
          this.childCategory = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private getShopInformation() {
    this.subGetData3 = this.shopInfoService.getShopInformation().subscribe({
      next: res => {
        if (res.success) {
          this.shopInformation = res.data;
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onCartSideToggling() {
    // this.slideMenu.slideMenu = true;
    this.cart_slide.cartSlideShowHide();
  }

  private getCartsItems(refresh?: boolean) {
    if (this.userService.getUserStatus()) {
      this.cartService.getCartByUser().subscribe((res) => {
        this.carts = res.data;
        this.cartService.updateCartList(this.carts);

      });
    } else {
      this.getCartItemFromLocalStorage();
    }
  }

  getCartItemFromLocalStorage() {
    this.carts = this.cartService.getCartItemFromLocalStorage()
  }


  /**
   * HEADER FUNCTIONALITY
   */
  searchTypeIt() {
    const time = 200;
    this.typeOutOnGoing = setInterval(() => {
      this.char++;
      let type = this.txt.slice(0, this.char);
      this.placeValue = type + '|';

      if (this.char == this.txt.length) {
        this.char = 0;
      }
    }, time);
  }

  slideMenuActive() {
    this.slideMenu.slideMenu = true;
  }

  /**
   * HANDLE SEARCH Area
   * onClickHeader()
   * onClickSearchArea()
   * handleFocus()
   * handleBlur()
   * setPanelState()
   * handleOpen()
   * handleOutsideClick()
   * handleCloseOnly()
   * handleCloseAndClear()
   * onSearchNavigate()
   * onSelectItem()
   */
  onClickHeader(): void {
    this.searchInput.nativeElement.value = '';
    this.handleCloseOnly();
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
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
    let target = this.searchInput.nativeElement as HTMLInputElement;
    target.placeholder = '';
    clearInterval(this.typeOutOnGoing);
  }

  handleBlur() {
    this.searchTypeIt();
    this.char = 0;
    setTimeout(() => {
      this.searchProducts = [];
    }, 400);
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

  handleOutsideClick(): void {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchProducts = [];
    this.isFocused = false;
  }

  onSearchNavigate() {
    let inputVal = (this.searchInput.nativeElement as HTMLInputElement).value;
    if (inputVal) {
      this.router.navigate(['/', 'product-list'], {
        queryParams: { searchQuery: inputVal },
        queryParamsHandling: '',
      });
      this.searchInput.nativeElement.value = '';
      this.isOpen = false;
      this.reloadService.needRefreshSearch$(true);
    }
  }

  onSelectItem(data: Course): void {
    this.searchInput.nativeElement.value = '';
    this.handleCloseAndClear();
    this.router.navigate(['/course-details', data?._id]);
  }

  //Header Sticky
  @HostListener('window:scroll')
  onScroll() {
    this.isHeaderFixed = window.scrollY > 300;
  }

  @HostListener('window:resize')
  onGetWidth() {
    // this.isShowSearch = window.innerWidth > 750;
  }

  onShowToggleSearch() {
    this.isShowSearch = !this.isShowSearch;
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
    if (this.subGetData3) {
      this.subGetData3.unsubscribe();
    }
    if (this.subFormData) {
      this.subFormData.unsubscribe();
    }
  }

  /**
   * Menu active-state helpers
   */
  isCategoryActive(categorySlug: string): boolean {
    const tree = this.router.parseUrl(this.router.url);
    const path = tree.root.children['primary']?.segments.map(s => s.path).join('/') || '';
    const query = tree.queryParams || {} as any;
    return path === 'courses' && query['category'] === categorySlug;
  }

  isSubCategoryActive(categorySlug: string, subCategorySlug: string): boolean {
    const tree = this.router.parseUrl(this.router.url);
    const path = tree.root.children['primary']?.segments.map(s => s.path).join('/') || '';
    const query = tree.queryParams || {} as any;
    return (
      path === 'courses' &&
      query['category'] === categorySlug &&
      query['subCategory'] === subCategorySlug
    );
  }

  // Close suggestions on any outside click (anywhere in the document)
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.handleOutsideClick();
  }
}
