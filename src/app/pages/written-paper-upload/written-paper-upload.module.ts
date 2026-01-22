import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrittenPaperUploadComponent } from './written-paper-upload.component';
import { WrittenPaperUploadRoutingModule } from './written-paper-upload-routing.module';
import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WrittenPaperUploadComponent],
  imports: [CommonModule, WrittenPaperUploadRoutingModule, MaterialModule, ReactiveFormsModule],
})
export class WrittenPaperUploadModule {}
