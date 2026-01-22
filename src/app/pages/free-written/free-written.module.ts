import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreeWrittenComponent } from './free-written.component';
import { FreeWrittenRoutingModule } from './free-written-routing.module';

@NgModule({
  declarations: [FreeWrittenComponent],
  imports: [CommonModule, FreeWrittenRoutingModule],
})
export class FreeWrittenModule {}
