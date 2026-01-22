import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'SOFTLAB_COURSE_TOKEN_' + environment.VERSION,
  loggInSession: 'SOFTLAB_COURSE_SESSION_' + environment.VERSION,
  loginTokenAdmin: 'SOFTLAB_COURSE_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'SOFTLAB_COURSE_ADMIN_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'SOFTLAB_COURSE_USER_0_' + environment.VERSION,
  encryptUserLogin: 'SOFTLAB_COURSE_USER_1_' + environment.VERSION,
  loginAdminRole: 'SOFTLAB_COURSE_ADMIN_ROLE_' + environment.VERSION,
  cartsProduct: 'SOFTLAB_COURSE_USER_CART_' + environment.VERSION,
  productFormData: 'SOFTLAB_COURSE_PRODUCT_FORM_' + environment.VERSION,
  userWishList: 'SOFTLAB_COURSE_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'SOFTLAB_COURSE_USER_CART_' + environment.VERSION,
  recommendedProduct: 'SOFTLAB_COURSE_RECOMMENDED_PRODUCT_' + environment.VERSION,
  userCoupon: 'SOFTLAB_COURSE_USER_COUPON_' + environment.VERSION,
  userCookieTerm: 'SOFTLAB_COURSE_COOKIE_TERM' + environment.VERSION,
  otpCheck: 'SOFTLAB_COURSE_COOKIE_TERM_' + environment.VERSION,
});
