import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTiktok,
  faYoutube,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
import { Subscription } from 'rxjs';
import { ShopInformation } from 'src/app/interfaces/common/shop-information.interface';
import { ShopInformationService } from 'src/app/services/common/shop-information.service';
import {RAW_SRC} from "../../../core/utils/app-data";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  //Font Awesome Icon
  faTiktok = faTiktok;
  faYoutube = faYoutube;
  faLinkedinIn = faLinkedinIn;
  faInstagram = faInstagram;
  faFacebookF = faFacebookF;

  // Store Data
  shopInformation: ShopInformation;

  // Static Data
  readonly rawSrcset = RAW_SRC;

  // Subscriptions
  private subGetData: Subscription;

  constructor(private shopInfoService: ShopInformationService) { }

  ngOnInit(): void {
    this.getShopInformation();
  }

  /**
   * HTTP REQUEST HANDLE
   * getShopInformation()
   */

  private getShopInformation() {
    this.subGetData = this.shopInfoService.getShopInformation().subscribe(
      (res) => {
        if (res.success) {
          this.shopInformation = res.data;
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }


  getSocialIcon(type: number) {
    switch (type) {
      case 0:
        return faFacebookF;
      case 1:
        return faYoutube;
      case 2:
        return faTwitter;
      case 3:
        return faInstagram;
      case 4:
        return faLinkedinIn;
      case 5:
        return faTiktok;
      default:
        return null;
    }
  }

  getSocialClass(type: number): string {
    switch (type) {
      case 0:
        return 'facebook';
      case 1:
        return 'youtube';
      case 2:
        return 'twitter';
      case 3:
        return 'instagram';
      case 4:
        return 'linkedin-in';
      case 5:
        return 'tiktok';
      default:
        return '';
    }
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
  }
}
