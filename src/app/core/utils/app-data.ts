import {Select} from '../../interfaces/core/select.interface';
import {OrderStatus} from "../../enum/order.enum";

export const GENDERS: Select[] = [
  {value: 'male', viewValue: 'Male'},
  {value: 'female', viewValue: 'Female'},
  {value: 'other', viewValue: 'Other'}
];

export const CLASS_LEVELS: Select[] = [
  {value: 'Class-6', viewValue: 'Class-6'},
  {value: 'Class-7', viewValue: 'Class-7'},
  {value: 'Class-8', viewValue: 'Class-8'},
  {value: 'Class-9 (Science)', viewValue: 'Class-9 (Science)'},
  {value: 'Class-9 (Commerce)', viewValue: 'Class-9 (Commerce)'},
  {value: 'Class-9 (Arts)', viewValue: 'Class-9 (Arts)'},
  {value: 'Class-10 (Science)', viewValue: 'Class-10 (Science)'},
  {value: 'Class-10 (Commerce)', viewValue: 'Class-10 (Commerce)'},
  {value: 'Class-10 (Arts)', viewValue: 'Class-10 (Arts)'},
  {value: 'Class-11', viewValue: 'Class-11'},
  {value: 'Class-12', viewValue: 'Class-12'},
  {value: 'Honors', viewValue: 'Honors'},
  {value: 'Job-Holder', viewValue: 'Job-Holder'},
  {value: 'Other', viewValue: 'Other'},
];

export const RAW_SRC: string = '384w, 640w, 750w, 828w, 1080w, 1200w, 1920w, 2048w';
export const FILTER_TAGS:Select[] =[
  {value: 'Kids', viewValue: 'kids'},
  {value: 'Our Published', viewValue: 'our-published'},
  {value: 'New Published', viewValue: 'new-published'},
  {value: 'Coming Soon', viewValue: 'coming-soon'},
  {value: 'Best Selling', viewValue: 'best-selling'},
]

export const ORDER_STATUS: Select[] = [
  { value: OrderStatus.PENDING, viewValue: 'Pending'},
  { value: OrderStatus.CONFIRM, viewValue: 'Approved'},
  // { value: OrderStatus.PROCESSING, viewValue: 'Processing'},
  { value: OrderStatus.SHIPPING, viewValue: 'Shipped'},
  { value: OrderStatus.DELIVERED, viewValue: 'Delivered'},
  { value: OrderStatus.CANCEL, viewValue: 'Cancelled'},
  { value: OrderStatus.REFUND, viewValue: 'Refund'},
];

export const  PRODUCT_TYPE: Select[] = [
  { value: 'book', viewValue: 'Book'},
  { value: 'stationary', viewValue: 'Stationary'},
  { value: 't-shirt', viewValue: 'T-Shirt'},
];

export const PAYMENTMETHOD: any[] = [
  {
    id: '1',
    paymentMethodName: 'Cash on Delivery',
    image: 'https://www.rokomari.com/static/200/images/cod.png',
    paymentType: 'cash_on_delivery',
  },
  {
    id: '2',
    paymentMethodName: 'পেমেন্ট করুন',
    image: '/assets/images/brand/logo/bkash-logo-FBB258B90F-seeklogo.com.png',
    paymentType: 'online_payment',
  },
  // {
  //     "id": "3",
  //     "paymentMethodName": "Bkash",
  //     "image": "https://www.rokomari.com/static/200/images/bkash.png",
  //     "paymentType": "online_payment",
  // },
  // {
  //     "id": "4",
  //     "paymentMethodName": "Rocket",
  //     "image": "https://www.rokomari.com/static/200/images/rocket.png",
  //     "paymentType": "online_payment",
  // },
  // {
  //     "id": "5",
  //     "paymentMethodName": "Card",
  //     "image": "https://www.rokomari.com/static/200/images/svg/icons/rok-icon-ssl.svg",
  //     "paymentType": "online_payment",
  // }
];
