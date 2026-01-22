import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { FILTER_TAGS } from 'src/app/core/utils/app-data';
import { Product } from 'src/app/interfaces/common/product';
import { Tag } from 'src/app/interfaces/common/tag.interface';
import { ProductService } from 'src/app/services/common/product.service';
import {Banner} from "../../interfaces/common/banner.interface";
import {BannerService} from "../../services/common/banner.service";
import {Meta, Title} from "@angular/platform-browser";
import {FilterData} from "../../interfaces/core/filter-data.interface";
import {CanonicalService} from "../../services/common/canonical.service";
import {CarouselCntrlService} from "../../services/common/carousel-cntrl.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  //Store Data
  product: Product;
  relatedProducts: Product[];
  relatedAuthorProducts: Product[];
  sameCategoryBestSellingProducts: Product[];
  id: string;
  //Store Data
  detailBanners: Banner[];
  isBannerLoading: boolean = false;
  ratingTotalData: any;
  ratingData: any;
  ratingCalculation: any;
  //Subscription
  private subDataOne: Subscription;
  private subParam: Subscription;
  private subBannerDataOne: Subscription;
  private subRelatedProduct: Subscription;

  constructor(
    public carousel: CarouselCntrlService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private title: Title,
    private meta: Meta,
    private router: Router,
    private bannerService: BannerService,
    private canonicalService: CanonicalService,
  ) {

  }

  ngOnInit(): void {

    this.subParam = this.activatedRoute.paramMap.subscribe(res => {
      this.id = res.get('id');
      if (this.id) {
        this.getProductById(this.id);
      }

    })

    // this.getAllBanners();
  }

  /**
   * HTTP REQUEST HANDLE
   * getProductById()
   * getAllRelatedProduct()
   * getAllSameCategoryBestSellingProduct()
   */
  private getProductById(id: string) {
    this.subDataOne = this.productService.getProductById(id).subscribe(
      (res) => {
        if (res.success) {
          this.product = res.data;
          this.ratingTotalData = this.product?.ratingTotal;
          this.ratingData = this.product?.ratingCount;
          this.ratingCalculation = (this.ratingData / this.ratingTotalData);
          // console.log('this.product555',this.product)
          if (this.product) {
            this.getAllRelatedProduct(this.product);
            this.getAllSameCategoryBestSellingProduct(this.product);
            // this.getAllRelatedAuthorProduct(this.product);
          }
          this.updateMetaData();
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }
  private getAllRelatedProduct(product: Product) {
    const mSelect = {
      name: 1,
      images: 1,
      status: 1,
      author: 1,
      salePrice: 1,
      quantity: 1,
      discountAmount: 1,
      discountType: 1,
      costPrice: 1,
      edition: 1,
    }

    const filterData: FilterData = {
      filter: {
        "category._id": product?.category?._id, status: 'publish'
      },
      sort: { createdAt: -1 },
      pagination: {pageSize:10,currentPage:0},
      select: mSelect
    }

    this.subRelatedProduct = this.productService.getAllProducts(filterData).subscribe(
      (res) => {
        if (res.success) {
          this.relatedProducts = res.data;
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }

  private getAllRelatedAuthorProduct(product: Product) {
    const mSelect = {
      name: 1,
      images: 1,
      author: 1,
      salePrice: 1,
      quantity: 1,
      discountAmount: 1,
      discountType: 1,
      costPrice: 1,
      edition: 1,
    }

    const filterData: FilterData = {
      filter: {
        "author._id": product?.author[0]?._id,
      },
      sort: { createdAt: -1 },
      pagination: {pageSize:10,currentPage:0},
      select: mSelect
    }

    this.subRelatedProduct = this.productService.getAllProducts(filterData).subscribe(
      (res) => {
        if (res.success) {
          this.relatedAuthorProducts = res.data;
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }

  private getAllSameCategoryBestSellingProduct(product: Product) {
    const mSelect = {
      name: 1,
      images: 1,
      status: 1,
      author: 1,
      salePrice: 1,
      tags: 1,
      quantity: 1,
      discountAmount: 1,
      discountType: 1,
      costPrice: 1,
    }

    const filterData: FilterData = {
      filter: {
        "category._id": product?.category?._id, status: 'publish'
      },
      sort: { createdAt: -1 },
      pagination: {pageSize:10,currentPage:0},
      select: mSelect
    }

    this.subRelatedProduct = this.productService.getAllProducts(filterData).subscribe(
      (res) => {
        if (res.success) {
          this.sameCategoryBestSellingProducts = res.data.filter((p: Product) => (p.tags?.find((t: Tag) => t.slug === FILTER_TAGS[4].viewValue)));
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }

  private getAllBanners() {
    let mSelect = {
      name: 1,
      slug: 1,
      image: 1,
      bannerType: 1,
      url:1,
    }

    const filterData: FilterData = {
      filter: null,
      select: mSelect,
      sort: null,
      pagination: null
    }

    this.isBannerLoading = true;
    this.subBannerDataOne = this.bannerService.getAllBanners(filterData, null).subscribe(
      (res) => {
        if (res.success) {
          this.detailBanners = res.data.filter((d) => d.bannerType === "productDetailsBanner1");
          // this.smallBanners = res.data.filter((d) => d.bannerType === "homePageTopSmallBanner");
          this.isBannerLoading = false;
          // console.log(this.detailBanners);
        }
      },
      (err) => {
        this.isBannerLoading = false;
        console.log(err);
      }
    )
  }

  /**
   * SEO DATA UPDATE
   * updateMetaData()
   */

  private updateMetaData() {
    // Title
    this.title.setTitle(this.product?.seoTitle ? this.product?.seoTitle : this.product?.name);

    // Meta
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'theme-color', content: '#119744' });
    this.meta.updateTag({ name: 'copyright', content: 'Tutorcenter' });
    this.meta.updateTag({ name: 'author', content: 'Tutorcenter' });
    this.meta.updateTag({ name: 'description', content: this.product?.seoDescription ? this.product?.seoDescription : this.product?.shortDescription });
    this.meta.updateTag({ name: 'keywords', content: this.product?.seoKeywords });

    // Open Graph(og:)
    this.meta.updateTag({ property: 'og:title', content: this.product?.seoTitle ? this.product?.seoTitle : this.product?.name });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: `https://tutorcenter.online${this.router.url}` }); this.meta.updateTag({ property: 'og:image', content: this.product?.images[0] ? this.product?.images[0] : this.product?.images[0] });
    // this.meta.updateTag({property: 'og:image:type', content: 'image/jpeg'});
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:description', content: this.product?.seoDescription ? this.product?.seoDescription : this.product?.shortDescription });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Tutorcenter' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: this.product?.seoTitle ? this.product?.seoTitle : this.product?.name });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@Tutorcenter' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@Tutorcenter' });
    this.meta.updateTag({ name: 'twitter:description', content: this.product?.seoDescription ? this.product?.seoDescription : this.product?.shortDescription });

    // Microsoft
    this.meta.updateTag({ name: 'msapplication-TileImage', content: this.product?.images[0] ? this.product?.images[0]  : this.product?.images[0] });

    // Canonical
    this.canonicalService.setCanonicalURL();

  }
  /**
   * ON NG DESTROY
   */
  ngOnDestroy(): void {
    if (this.subParam) {
      this.subParam.unsubscribe();
    }
    if (this.subBannerDataOne) {
      this.subBannerDataOne.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subRelatedProduct) {
      this.subRelatedProduct.unsubscribe();
    }
  }

}

