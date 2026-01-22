import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllNoticeRoutingModule } from './all-notice-routing.module';
import { AllNoticeComponent } from './all-notice.component';
import { NoticeDetailsComponent } from './notice-details/notice-details.component';
import {BlogLoaderModule} from "../../shared/loader/blog-loader/blog-loader.module";
import {NgxPaginationModule} from "ngx-pagination";
import {BlogDetailsLoaderModule} from "../../shared/loader/blog-details-loader/blog-details-loader.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NoticeCardOneModule} from "../../shared/lazy-components/notice-card-one/notice-card-one.module";
import {PipesModule} from "../../shared/pipes/pipes.module";


@NgModule({
  declarations: [
    AllNoticeComponent,
    NoticeDetailsComponent
  ],
    imports: [
        CommonModule,
        AllNoticeRoutingModule,
        NoticeCardOneModule,
        BlogLoaderModule,
        NgxPaginationModule,
        BlogDetailsLoaderModule,
        FontAwesomeModule,
        PipesModule,
    ]
})
export class AllNoticeModule { }
