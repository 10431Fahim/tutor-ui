import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreeMcqComponent } from './free-mcq.component';
import { FreeMcqRoutingModule } from './free-mcq-routing.module';

@NgModule({
  declarations: [FreeMcqComponent],
  imports: [CommonModule, FreeMcqRoutingModule],
})
export class FreeMcqModule {}
