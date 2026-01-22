import { CommonModule, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { AccountComponent } from './account.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { MatSelectModule } from '@angular/material/select';
import { ImageCropComponent } from './image-crop/image-crop.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {WishListComponent} from "./wish-list/wish-list.component";
import {PipesModule} from "../../../shared/pipes/pipes.module";

@NgModule({
  declarations: [
    AccountComponent,
    AccountSidebarComponent,
    UserAccountComponent,
    ImageCropComponent,
    WishListComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatSlideToggleModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgIf,
    PipesModule,
    MatSelectModule,
    ImageCropperModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AccountModule {}
