import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {isPlatformBrowser, NgClass, NgForOf, NgIf} from '@angular/common';
import {Component, ElementRef, inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Subscription, timer} from 'rxjs';
import {ProductCardLoaderComponent} from "../../../shared/loader/product-card-loader/product-card-loader.component";
import {CourseService} from "../../../services/common/course.service";
import {ProductCardOneModule} from "../../../shared/lazy-components/product-card-one/product-card-one.module";
import {SwiperModule} from 'swiper/angular';
import {TagService} from "../../../services/common/tag.service";
import SwiperCore, {Navigation} from 'swiper';

// Install Swiper modules
SwiperCore.use([Navigation]);

@Component({
  selector: 'app-tag-products',
  templateUrl: './tag-products.component.html',
  styleUrls: ['./tag-products.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    ProductCardLoaderComponent,
    NgIf,
    NgForOf,
    NgClass,
    ProductCardOneModule,
    SwiperModule,
  ]
})
export class TagProductsComponent implements OnInit, OnDestroy {

  // Decorator
  @Input() tag: any;
  @Input() index: number = 0;
  @Input() isEnableHomeRecentOrder!: any;

  // Store Data
  products: any[] = [];
  allProducts: any[] = []; // Store all products for client-side filtering
  subCategories: any[] = [];
  allTags: any[] = [];
  currentSubCategorySlug: string = '';
  visibleProducts = 10;
  skeletonItems = Array(6).fill(0);
  private observer!: IntersectionObserver;

  // Theme Views
  productCardViews: string;

  // Loading
  isLoading: boolean = true;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 6;

  // Inject
  private readonly platformId = inject(PLATFORM_ID);
  private courseService = inject(CourseService);
  private tagService = inject(TagService);
  private readonly el = inject(ElementRef);
  private readonly breakpointObserver = inject(BreakpointObserver);

  // Subscription
  private subscriptions: Subscription[] = [];


  ngOnInit() {
    this.loadAllTags();

    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for SSR - Load without intersection
      this.loadProducts();
    }

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.visibleProducts = 6; // Show 6 items on mobile
      } else {
        this.visibleProducts = 6; // Show 5 items on desktop
      }
    });
    console.log('tag',this.tag)
  }


  /**
   * Initial Landing Page Setting
   * getSettingData()
   * setupIntersectionObserver()
   * loadProducts()
   */


  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadProducts();
          this.observer.disconnect();
        }
      });
    });
    this.observer.observe(this.el.nativeElement);
  }

  loadProducts() {
    const delayTime = this.index * 200; // 200ms delay per tag index
    timer(delayTime).subscribe(() => { // Adds a 200ms delay before loading products
      this.getAllCourses();
    });
  }

  /**
   * HTTP REQUEST HANDLE
   * getAllProducts()
   */

  private getAllCourses(subCategorySlug?: string) {
    const filter: any = { status: 'publish', 'tag.name': this.tag?.name };

    // Load all products without subcategory filter on initial load
    // Increased limit to get more courses
    const subscription = this.courseService.getAllCoursesByUi(filter, 1, 50).subscribe({
      next: (res) => {
        // Store all products for client-side filtering
        this.allProducts = res.data;
        
        if (res.subCategories && res.subCategories.length > 0) {
          this.subCategories = res.subCategories;
        }
        
        // On initial load, show all products (no filtering)
        // Only filter if a subcategory slug is explicitly provided
        if (subCategorySlug) {
          this.filterProductsBySubCategory(subCategorySlug);
        } else {
          // Show all products initially
          this.products = [...this.allProducts];
        }
        
        console.log('All Products Count:', this.allProducts.length);
        console.log('Displayed Products Count:', this.products.length);
        console.log('Products:', this.products);
        console.log('SubCategories:', this.subCategories);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
    this.subscriptions.push(subscription);
  }

  /**
   * Filter products by subcategory slug (client-side filtering)
   */
  private filterProductsBySubCategory(subCategorySlug?: string) {
    if (!subCategorySlug) {
      // If no subcategory selected, show all products
      this.products = [...this.allProducts];
      return;
    }

    // Filter products where subCategory.slug matches the selected subcategory
    this.products = this.allProducts.filter(product => {
      return product?.subCategory?.slug === subCategorySlug;
    });
  }

  onSubCategoryClick(subCategory: any) {
    // Toggle: if clicking the same subcategory, deselect it and show all
    if (subCategory?.slug === this.currentSubCategorySlug) {
      this.currentSubCategorySlug = '';
      this.products = [...this.allProducts]; // Show all products
      return;
    }
    
    // Select the clicked subcategory
    this.currentSubCategorySlug = subCategory?.slug || '';
    
    // Filter products client-side (instant filtering without API call)
    if (this.allProducts.length > 0) {
      this.filterProductsBySubCategory(this.currentSubCategorySlug);
    } else {
      // If allProducts is empty, load from API
      this.isLoading = true;
      this.getAllCourses(subCategory?.slug);
    }
  }

  private loadAllTags() {
    const subscription = this.tagService.getAllTags().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.allTags = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscriptions.push(subscription);
  }

  trackByIndex(index: number): number {
    return index;
  }

  /**
   * Get Tag Class based on tag slug/name for different background colors
   */
  getTagClass(): string {
    if (!this.tag?.slug && !this.tag?.name) {
      return 'tag-default';
    }

    const tagSlug = (this.tag?.slug || this.tag?.name || '').toLowerCase();
    const tagName = (this.tag?.name || '').toLowerCase();

    // Check for specific tags and return corresponding class
    if (tagSlug.includes('freelancing') || tagName.includes('freelancing') || tagName.includes('ফ্রিল্যান্সিং')) {
      return 'tag-freelancing';
    }
    if (tagSlug.includes('language') || tagName.includes('language') || tagName.includes('ভাষা')) {
      return 'tag-language';
    }
    if (tagSlug.includes('design') || tagName.includes('design') || tagName.includes('ডিজাইন')) {
      return 'tag-design';
    }
    if (tagSlug.includes('it') || tagName.includes('it') || tagName.includes('আইটি')) {
      return 'tag-it';
    }
    if (tagSlug.includes('career') || tagName.includes('career') || tagName.includes('ক্যারিয়ার')) {
      return 'tag-career';
    }
    if (tagSlug.includes('kids') || tagName.includes('kids') || tagName.includes('কিডস')) {
      return 'tag-kids';
    }
    if (tagSlug.includes('bundle') || tagName.includes('bundle') || tagName.includes('বান্ডেল')) {
      return 'tag-bundle';
    }

    // Default class based on index for variety
    const tagIndex = this.index % 6;
    return `tag-variant-${tagIndex}`;
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions?.forEach(sub => sub?.unsubscribe());
  }

}
