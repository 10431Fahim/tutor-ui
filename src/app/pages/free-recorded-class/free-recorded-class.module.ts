import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FreeRecordedClassComponent } from './free-recorded-class.component';
import { FreeRecordedClassRoutingModule } from './free-recorded-class-routing.module';

@NgModule({
  declarations: [FreeRecordedClassComponent],
  imports: [CommonModule, FreeRecordedClassRoutingModule],
})
export class FreeRecordedClassModule {}
