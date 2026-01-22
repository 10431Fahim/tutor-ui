import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, EMPTY, filter, map, Subscription, switchMap,} from 'rxjs';
import {Banner} from 'src/app/interfaces/common/banner.interface';
import {Carousel} from 'src/app/interfaces/common/carousel.interface';
import {Course} from 'src/app/interfaces/common/course.interface';
import {FilterData} from 'src/app/interfaces/core/filter-data.interface';
import {BannerService} from 'src/app/services/common/banner.service';
import {CourseService} from 'src/app/services/common/course.service';
import {CategoryService} from '../../../services/common/category.service';
import {CarouselService} from '../../../services/common/carousel.service';
import {RAW_SRC} from '../../../core/utils/app-data';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import {Category} from '../../../interfaces/common/category.interface';
import {ReloadService} from "../../../services/core/reload.service";

declare var particlesJS: any;

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit, AfterViewInit, OnDestroy {
  // Font Awesome Icon
  faAngleDown = faAngleDown;

  // Store Data
  categories: Category[] = [];
  banners: Banner[] = [];
  carousels: Carousel[] = [];
  activeBannerIndex = 0;
  selectedCategory: Category = null;
  // Placeholder Animation
  timeOutOngoing: any;
  // Static Data
  readonly rawSrcset = RAW_SRC;

  // Search Input & Data
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;
  searchProducts: Course[] = [];
  isLoading = false;
  private overlay = false;
  isOpen = false;
  private isFocused = false;
  private searchQuery: string;

  // Subscriptions
  private subGetData1: Subscription;
  private subGetData2: Subscription;
  private subGetData3: Subscription;
  private subForm: Subscription;

  // Inject
  private readonly categoryService = inject(CategoryService);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly bannerService = inject(BannerService);
  private readonly carouselService = inject(CarouselService);
  private readonly reloadService = inject(ReloadService);

  ngOnInit() {
    // Particles Load (guarded)
    this.loadParticles();

    // Base Data
    this.getAllCategories();
    this.getBanner();
    this.getCarousels();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.getCarousels();
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm?.valueChanges;
    this.subForm = formValue
      ?.pipe(
        map((t) => t['searchTerm']),
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
          const pagination: any = {
            pageSize: 12,
            currentPage: 0,
          };
          const mSelect = {
            name: 1,
            slug: 1,
            bannerImage: 1,
            image: 1,
            status: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.selectedCategory
              ? { 'category.slug': this.selectedCategory.slug, status: 'publish' }
              : {status: 'publish'},
            select: mSelect,
            sort: { name: 1 },
          };
          return this.courseService.getAllCourses(filterData, this.searchQuery);
        })
      )
      .subscribe({
        next: (res) => {
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
        error: (err) => {
          console.log(err);
        },
      });
  }

  /**
   * HTTP REQUEST HANDLE
   * getAllCategories()
   * getBanner()
   * getCarousels()
   */
  // private getAllCategories() {
  //   const mSelect = {
  //     name: 1,
  //     slug: 1,
  //   };
  //   let filterData: FilterData = {
  //     select: mSelect,
  //     filter: {status: 'publish'},
  //     sort: { createdAt: -1 },
  //   };
  //
  //   this.subGetData1 = this.categoryService
  //     .getAllCategoriesWithCache(filterData)
  //     .subscribe({
  //       next: (res) => {
  //         this.categories = res.data;
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       },
  //     });
  // }

  // private getBanner() {
  //   let filterData: FilterData = {
  //     select: { name: 1, image: 1 , title:1 , title2:1 , url:1},
  //     filter: { type: 'home_banner',status: 'publish' },
  //     pagination: null,
  //     sort: { createdAt: -1 },
  //   };
  //
  //   this.subGetData2 = this.bannerService
  //     .getAllBannersWithCache(filterData)
  //     .subscribe({
  //       next: (res) => {
  //         this.banners = res.data;
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       },
  //     });
  // }

  private getCarousels() {
    const mSelect = {
      image: 1,
      name: 1,
      description: 1,
      url: 1,
      type: 1,
      priority: 1,
    };

    let filterData: FilterData = {
      select: mSelect,
      filter: { type: 'home_carousel',status: 'publish'},
      pagination: null,
      sort: { priority: -1 },
    };

    this.isLoading = true;
    this.subGetData3 = this.carouselService
      .getAllCarouselsWithCache(filterData)
      .subscribe({
        next: (res) => {
          if (res.success) {
            // console.log('data', res.data);
            this.carousels = res.data;
            this.isLoading = false;
            this.loadParticles();
          }
        },
        error: (err) => {
          console.log(err);
          if (err) {
            this.isLoading = false;
            this.loadParticles();
          }
        },
      });
  }

  private loadParticles(): void {
    try {
      const w = window as any;
      if (w && w.particlesJS && typeof w.particlesJS.load === 'function') {
        w.particlesJS.load('particles-js', 'assets/data.json', null);
      }
    } catch (e) {
      console.warn('particlesJS not available yet:', e);
    }
  }

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


  private getBanner() {
    this.bannerService.getAllBanner().subscribe({
      next: (res) => {
        this.banners = res.data;
      },
      error: (err) => {
        console.log(err)
      },
    });
  }

  // private getCarousels() {
  //   this.carouselService.getAllCarousel().subscribe({
  //     next: (res) => {
  //       this.carousels = res.data;
  //       console.log("this.carousel", this.carousels)
  //       this.isLoading = false;
  //       particlesJS.load('particles-js', '../assets/data.json', null);
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //       particlesJS.load('particles-js', '../assets/data.json', null);
  //     },
  //   });
  // }

  /**
   * HANDLE CAROUSEL SLIDE CHANGE
   * Sync left text with current banner/carousel
   */
  onCarouselSlideChange(swiper: any): void {
    if (!swiper) {
      this.activeBannerIndex = 0;
      return;
    }

    const idx =
      typeof swiper.realIndex === 'number'
        ? swiper.realIndex
        : (typeof swiper.activeIndex === 'number' ? swiper.activeIndex : 0);

    this.activeBannerIndex = idx;
  }

  /**
   * HANDLE SEARCH Area
   * handleFocus()
   * handleBlur()
   * setPanelState()
   * handleOpen()
   * handleCloseAndClear()
   * onSearchNavigate()
   * onSelectItem()
   */

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
    clearInterval(this.timeOutOngoing);
  }

  handleBlur() {
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

  private handleOpen(): void {
    if (this.isOpen || (this.isOpen && !this.isLoading)) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  onClickHeader(): void {
    // this.searchInput.nativeElement.value = '';
    this.handleCloseOnly();
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

  private handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchProducts = [];
    this.isFocused = false;
  }

  handleOutsideClick(): void {
    // this.searchInput.nativeElement.value = '';
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  onSearchNavigate() {
    let inputVal = (this.searchInput.nativeElement as HTMLInputElement).value;
    if (inputVal) {
      this.router
        .navigate(['/', 'courses'], {
          queryParams: { search: inputVal , category: this.selectedCategory.slug},
          queryParamsHandling: '',
        })
        .then();
      this.searchInput.nativeElement.value = '';
      this.isOpen = false;
      this.reloadService.needRefreshSearch$(true);
    }
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

  onSelectItem(data: Course): void {
    this.searchInput.nativeElement.value = '';
    this.handleCloseAndClear();
    this.router.navigate(['/course-details', data?._id]).then();
  }

  /**
   * SELECTION FUNCTIONALITY
   * onSelectCategory()
   */

  onSelectCategory(data: Category) {
    this.selectedCategory = data;
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
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
  }
}
