import {Component, inject, Input, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTiktok,
  faTwitter,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone:true,
  imports: [
    RouterLink,
    NgStyle,
    NgIf,
    FontAwesomeModule,
    NgForOf,
    NgClass
  ]
})
export class FooterComponent {
  @Input() shopInfo: any;
  @Input() singleLandingPage: any;
  @Input() websiteInfo: any;
  domain: string = '';
  // Store Data
  protected readonly rawSrcset: string = '384w, 640w';
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.domain = window.location.host;
    }
  }

  /**
   * HTTP REQUEST
   * getSocialLink()
   */

  getSocialLink(type: string): string {
    switch (type) {
      case 'facebook':
        return this.shopInfo?.socialLinks.find(f => f.type === 0)?.value ?? null;

      case 'youtube':
        return this.shopInfo?.socialLinks.find(f => f.type === 1)?.value ?? null;

      case 'twitter':
        return this.shopInfo?.socialLinks.find(f => f.type === 2)?.value ?? null;

      case 'instagram':
        return this.shopInfo?.socialLinks.find(f => f.type === 3)?.value ?? null;

      case 'linkedin':
        return this.shopInfo?.socialLinks.find(f => f.type === 4)?.value ?? null;


      case 'tiktok':
        return this.shopInfo?.socialLinks.find(f => f.type === 5)?.value ?? null;


      default:
        return null;
    }
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
}
