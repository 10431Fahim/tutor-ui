import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogCardOneComponent } from './blog-card-one.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    BlogCardOneComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    BlogCardOneComponent
  ]
})
export class BlogCardOneModule { }
