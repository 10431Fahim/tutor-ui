import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { UiService } from '../core/ui.service';
import { DATABASE_KEY } from '../../core/utils/global-variable';
import { StorageService } from '../core/storage.service';
import { User, UserAuthResponse } from '../../interfaces/common/user.interface';
import { UtilsService } from '../core/utils.service';
import { environment } from '../../../environments/environment';
import {CartService} from "./cart.service";

const API_URL = environment.apiBaseLink + '/api/user/';
const API_URL_USER = environment.apiBaseLink + '/api/user/';
@Injectable({
  providedIn: 'root',
})
export class UserService {

  private token: string;
  private isUser = false;
  private userId: string = null;
  private userStatusListener = new Subject<boolean>();

  // Hold The Count Time
  private tokenTimer: any;

  // Inject
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly uiService = inject(UiService);
  private readonly utilsService = inject(UtilsService);
  private readonly storageService = inject(StorageService);
  private readonly cartService = inject(CartService);


  /**
   * MAIN API METHODS
   * userSignupOrLogin()
   * autoUserLoggedIn()
   * getLoggedInUserData()
   */
  userSignupOrLogin(data: any, navigateFrom?: string) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<UserAuthResponse>
        (API_URL + 'signup-or-login', data)
        .subscribe({
          next: res => {
            if (res.success) {
              this.token = res.token;
              if (res.data) {
                this.userId = res.data._id;

              }
              // When Token
              if (this.token) {
                this.isUser = true;
                this.userStatusListener.next(true);
                const expiredInDays = Number(res.tokenExpiredInDays.replace('d', ''));
                this.setSessionTimer(expiredInDays * 86400000);
                const now = new Date();
                const expirationDate = this.utilsService.getNextDateString(new Date(now.getTime() - 3600 * 1000), expiredInDays);
                // Store to Local
                this.saveUserData(res.token, expirationDate, this.userId);
                // Snack bar..
                this.uiService.success(res.message);
                console.log('qParam6',navigateFrom)
                // Navigate..
                this.router.navigate(navigateFrom ? [navigateFrom] : [environment.userBaseUrl]).then();
                resolve(res);
              }
            } else {
              this.uiService.wrong(res.message);
              this.userStatusListener.next(false);
              reject()
            }
          },
          error: err => {
            this.userStatusListener.next(false);
            reject(err);
          }
        })
    })

  }

  checkUserForRegistration(username: string) {
    return this.httpClient.post<{ data: { hasUser: boolean }, message: string, success: boolean }>(API_URL_USER + 'check-user-for-registration', {username});
  }

  resetUserPassword(data: string) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL_USER + 'reset-user-password', data);
  }



  userSignupAndLogin(data: User, navigateFrom?: any) {

    return new Promise((resolve, reject) => {
      this.httpClient.post<UserAuthResponse>
      (API_URL_USER + 'signup-and-login-password', data).subscribe(async res => {
        if (res.success) {
          this.token = res.token;
          // When Role & Permissions
          if (res.data) {
            this.userId = res.data._id;
          }
          // When Token
          if (res.token) {
            this.isUser = true;
            this.userStatusListener.next(true);
            // For Token Expired Time..
            const expiredInDays = Number(res.tokenExpiredInDays.replace('d', ''));
            this.setSessionTimer(expiredInDays * 86400000);
            const now = new Date();
            const expirationDate = this.utilsService.getNextDateString(new Date(now.getTime() - 3600 * 1000), expiredInDays);
            // Store to Local
            this.saveUserData(res.token, expirationDate, this.userId);
            // Cart Sync
            // await this.syncLocalCartItems();
            // Snack bar..
            this.uiService.success(res.message);
            // Navigate..


            if (navigateFrom) {
              this.router.navigate([navigateFrom]);
            } else {
              this.router.navigate([environment.userBaseUrl]);
            }
            resolve(res);
          }
        } else {
          this.uiService.wrong(res.message);
          this.userStatusListener.next(false);
        }

      }, error => {
        console.log(error)
        this.userStatusListener.next(false);
        reject(error);
      });
    })


  }


  userLogin(data: { username: string, password: string }, navigateFrom?: string) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<UserAuthResponse>
      (API_URL_USER + 'login', data).subscribe(async res => {
        if (res.success) {
          this.token = res.token;
          // When Role & Permissions
          if (res.data) {
            this.userId = res.data._id;
          }
          // When Token
          if (res.token) {
            this.isUser = true;
            this.userStatusListener.next(true);
            // For Token Expired Time..
            const expiredInDays = Number(res.tokenExpiredInDays.replace('d', ''));
            this.setSessionTimer(expiredInDays * 86400000);
            const now = new Date();
            const expirationDate = this.utilsService.getNextDateString(new Date(now.getTime() - 3600 * 1000), expiredInDays);
            // Store to Local
            this.saveUserData(res.token, expirationDate, this.userId);

            // Cart Sync
            await this.syncLocalCartItems();
            // Snack bar..
            this.uiService.success(res.message);


            // Navigate..
            if (navigateFrom) {
              this.router.navigate([navigateFrom]);
            } else {
              this.router.navigate([environment.userBaseUrl]);
            }
            resolve(res);
          }
        } else {
          this.uiService.wrong(res.message);
          this.userStatusListener.next(false);
          resolve(res);
        }

      }, error => {
        console.log(error)
        this.userStatusListener.next(false);
        reject(error);
      });
    })
  }

  autoUserLoggedIn() {
    const authInformation = this.getUserData();
    if (!authInformation) {
      this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);
      return;
    }
    const now = new Date();
    const expDate = new Date(authInformation.expiredDate);
    const expiresIn = expDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userStatusListener.next(true);
      this.isUser = true;
      this.userId = authInformation.userId;
      this.setSessionTimer(expiresIn);
    }
  }

  getLoggedInUserData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: User }>(API_URL + 'logged-in-user-data', { params });
  }

  /**
   * CART UPDATE LOCAL TO MAIN DATABASE
   * syncLocalCartItems()
   */

  private async syncLocalCartItems(): Promise<any> {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length) {
      return new Promise((resolve, reject) => {
        this.cartService.addToCartMultiple(items)
          .subscribe(res => {
            this.cartService.deleteAllCartFromLocal(true);
            resolve(res);
          }, error => {
            reject(error);
          })
      });
    }
  }

  /**
   * USER AUTH METHODS
   * getUserStatus()
   * getUserToken()
   * getUserId()
   * getUserStatusListener()
   * userLogOut()
   */
  getUserStatus() {
    return this.isUser;
  }

  getUserToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }

  userLogOut() {
    this.token = null;
    this.isUser = false;
    this.userStatusListener.next(false);
    this.clearUserData();
    clearTimeout(this.tokenTimer);
    this.router.navigate([environment.userLoginUrl]);
  }


  /**
   * Save User Info Encrypt to Local
   * saveUserData()
   * clearUserData()
   * getUserData()
   * setSessionTimer()
   */
  protected saveUserData(token: string, expiredDate: Date, userId: string) {
    const data = {
      token,
      expiredDate,
      userId,
    };
    this.storageService.addDataToEncryptLocal(data, DATABASE_KEY.encryptUserLogin);
  }

  protected clearUserData() {
    this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);
  }

  protected getUserData() {
    return this.storageService.getDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);
  }

  private setSessionTimer(durationInMs: number) {
    this.tokenTimer = setTimeout(() => {
      this.userLogOut();
    }, durationInMs);
  }


  checkFollwedAuthor(id: string) {
    let data = {
      author: id
    }
    return this.httpClient.post<{ success: boolean, data: boolean, message: string }>(API_URL_USER + 'check-followed-author', data);
  }

  getAllFollwedAuthor() {
    return this.httpClient.get<{success:boolean,message:string,data:any[]}>(API_URL_USER + 'get-followed-author-list');
  }

  followUnfollowAuthorByUser(data: { type: string, author: string }) {
    return this.httpClient.post<{ success: boolean, message: boolean, data: any }>(API_URL_USER + 'author-follow-unfollow', data);
  }

}
