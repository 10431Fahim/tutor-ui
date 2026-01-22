import { Pipe, PipeTransform } from '@angular/core';
import { SubCategory } from 'src/app/interfaces/common/sub-category.interface';
import { ChildCategory } from 'src/app/interfaces/common/child-category.interface';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: SubCategory[] | ChildCategory[], categoryId: string, type?: 'subCategory' | 'childCategory'): any[] {
    if (!value || !categoryId) {
      return null;
    }

    if (type === 'childCategory') {
      return (value as ChildCategory[]).filter((m) => m.subCategory?._id === categoryId);
    } else {
      return (value as SubCategory[]).filter((m) => m.category?._id === categoryId);
    }
  }

}
