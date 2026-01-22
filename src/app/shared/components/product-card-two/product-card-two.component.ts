import {Component, Input, OnInit} from '@angular/core';
import { Product } from 'src/app/interfaces/common/product';
// import {YoutubeVideo} from "../../../interfaces/common/youtube-video.interface";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
@Component({
  selector: 'app-product-card-two',
  templateUrl: './product-card-two.component.html',
  styleUrls: ['./product-card-two.component.scss']
})
export class ProductCardTwoComponent implements OnInit{
  @Input() data?: Product;
  // seoPage: SeoPage;
  language: string;
  private subDataFive: Subscription;

  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';
  constructor(
    // public translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(qPram => {
      this.language = qPram.get('language');
    })
  }
}
