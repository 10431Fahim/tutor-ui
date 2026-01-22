import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiveClassRoutingModule } from './live-class-routing.module';
import { LiveClassComponent } from './live-class.component';

@NgModule({
  declarations: [LiveClassComponent],
  imports: [
    CommonModule,
    FormsModule,
    LiveClassRoutingModule,
  ],
})
export class LiveClassModule {}



