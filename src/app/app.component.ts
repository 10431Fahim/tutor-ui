import {Component, inject, OnInit} from '@angular/core';
import {UserService} from './services/common/user.service';
import {registerLocaleData} from '@angular/common';
import localeBn from '@angular/common/locales/bn';
import {CsrfTokenService} from './services/core/csrf-token.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Inject
  private readonly userService = inject(UserService);
  private readonly csrf = inject(CsrfTokenService);

  async ngOnInit() {
    registerLocaleData(localeBn, 'bn');
    this.userService.autoUserLoggedIn();
    // try {
    //   await this.csrf.loadToken();
    //   console.log('✅ CSRF token loaded');
    // } catch (error) {
    //   console.error('❌ Failed to load CSRF token', error);
    // }
  }

}
