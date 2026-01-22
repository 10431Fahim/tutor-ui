import {Pipe, PipeTransform} from '@angular/core';

import {DiscountTypeEnum} from '../../enum/discount.enum';
import {Course, Price} from 'src/app/interfaces/common/course.interface';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(
    product?: Course,
    type?: 'salePrice' | 'discountAmount' | 'discountPercentage' | 'regularPrice',
    selectedPrice?: Price
  ): number {

    if (product) {
      switch (type) {
        case 'salePrice': {
          if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
            const disPrice = (product?.discountAmount / 100) * product?.salePrice;
            if (selectedPrice) {
              const disPrice2 = (selectedPrice?.discountAmount / 100) * selectedPrice?.salePrice;
              return Math.floor(selectedPrice?.salePrice - disPrice2);
            }
            return Math.floor(product?.salePrice - disPrice);
          } else if (product.discountType === DiscountTypeEnum.CASH) {
            if (selectedPrice) {
              return Math.floor(selectedPrice?.salePrice - selectedPrice.discountAmount);
            }
            return Math.floor(product?.salePrice - product.discountAmount);
          } else {
            if (selectedPrice) {
              return Math.floor(selectedPrice?.salePrice);
            }
            return Math.floor(product?.salePrice);
          }
        }
        case 'discountAmount': {
          if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
            if (selectedPrice) {
              return ((selectedPrice?.discountAmount / 100) * selectedPrice?.salePrice);
            }
            return (product?.discountAmount / 100) * product?.salePrice;
          } else if (product.discountType === DiscountTypeEnum.CASH) {
            if (selectedPrice) {
              return selectedPrice?.discountAmount;
            }
            return product?.discountAmount;
          } else {
            return 0;
          }
        }
        case 'discountPercentage': {
          if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
            if (selectedPrice) {
              return selectedPrice?.discountAmount;
            }
            return product?.discountAmount;
          } else if (product.discountType === DiscountTypeEnum.CASH) {
            if (selectedPrice) {
              return Math.round((selectedPrice?.discountAmount / selectedPrice?.salePrice) * 100);
            }
            return Math.round((product?.discountAmount / product?.salePrice) * 100);
          } else {
            return 0;
          }
        }
        case 'regularPrice': {
          if (selectedPrice) {
            return Math.floor(selectedPrice?.salePrice);
          }
          return Math.floor(product?.salePrice);
        }
        default: {
          return product?.salePrice;
        }
      }
    } else {
      return 0;
    }

  }

}
