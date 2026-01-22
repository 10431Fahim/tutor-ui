import {Component, HostListener, Input} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-social-chat',
  templateUrl: './social-chat.component.html',
  styleUrls: ['./social-chat.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ]
})
export class SocialChatComponent {

  @Input() shopInfo:any;

  ngOnChanges() {
    console.log("th is.shop info", this.shopInfo);
  }

  // Store Data
  toggleStyle: boolean = false;

  getSocialLink(type: string): any {
    switch (type) {
      case 'messenger':
        return this.shopInfo?.landingLinks?.find(f => f.type === 2) ?? null;
      case 'whatsapp':
        return this.shopInfo?.landingLinks?.find(f => f.type === 1) ?? null;
      case 'phone':
        return this.shopInfo?.landingLinks?.find(f => f.type === 0) ?? null;
      default:
        return null;
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Check if the clicked target is not part of the header
    if (!(event.target as HTMLElement).closest('.icon-bar')) {
      this.toggleStyle = false;
    }
  }

  toggle(event?: MouseEvent) {
    event?.stopPropagation();
    console.log("toggled---")
    this.toggleStyle = !this.toggleStyle;
  }
}
