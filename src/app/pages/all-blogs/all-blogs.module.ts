import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllBlogsRoutingModule } from './all-blogs-routing.module';
import { AllBlogsComponent } from './all-blogs.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BlogDetailsLoaderModule } from 'src/app/shared/loader/blog-details-loader/blog-details-loader.module';
import { BlogCardOneModule } from 'src/app/shared/lazy-components/blog-card-one/blog-card-one.module';
import { BlogLoaderModule } from 'src/app/shared/loader/blog-loader/blog-loader.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {PipesModule} from "../../shared/pipes/pipes.module";


@NgModule({
  declarations: [AllBlogsComponent, BlogDetailsComponent],
    imports: [
        CommonModule,
        AllBlogsRoutingModule,
        BlogCardOneModule,
        BlogLoaderModule,
        NgxPaginationModule,
        BlogDetailsLoaderModule,
        FontAwesomeModule,
        PipesModule,
    ],
})
export class AllBlogsModule {}
