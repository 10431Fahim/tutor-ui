import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Popup } from 'src/app/interfaces/common/popup.interface';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { PopupService } from 'src/app/services/common/popup.service';
import { StorageService } from 'src/app/services/core/storage.service';
import { UpcomingDialogComponent } from 'src/app/shared/dialog-view/upcoming-dialog/upcoming-dialog.component';
import {TagService} from "../../services/common/tag.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {

  //Store Variables
  isBrowser:boolean;
  popups: Popup[] = [];
  tags: any[] = [];
  // Subscriptions
  private subDataOne: Subscription;

  constructor(
    private dialog: MatDialog,
    private storageService: StorageService,
    private popupService: PopupService,
    private tagService: TagService,
    private router: Router,
    @Inject(PLATFORM_ID) public platformId:any
  ) {
     this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnInit(): void {
    // Base Data
    this.getAllPopup();
    this.getAllTags();
  }


  private openDialogData() {
    const dialogData = this.storageService.getDataFromSessionStorage('DIALOG');
    if (!dialogData && this.isBrowser) {
      setTimeout(() => {
        this.openDialog();
      }, 2000)
    }
  }

  openDialog() {
    this.dialog.open(UpcomingDialogComponent, {
      data:  this.popups,
      maxWidth: '1030px',
      width: '100%',
      maxHeight: '450px',
      height: '100%',
      panelClass: ['theme-dialog', 'offer-popup-dialog'],
    })
  }

  /**
   * HTTP REQ HANDLE
   * getAllPopup()
   */

  private getAllPopup() {
    // Select
    const mSelect = {
      image: 1,
      name: 1,
      url:1,
      urlLink:1,
      enableVideo:1,
      enableImage:1,
      createdAt: 1,
      description: 1,
    };

    const filter: FilterData = {
      filter: {status: 'publish'},
      pagination: null,
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.popupService.getAllPopups(filter, null).subscribe({
      next: (res) => {
        if (res.success) {
          this.popups = res.data;
          // console.log("this.popups",this.popups)
          if(this.popups.length){
            this.openDialogData();
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }




  /**
   * HTTP Req Handle
   * getAllTags()
   * getPopup()
   */
  getAllTags() {
    this.tagService.getAllTags().subscribe({
      next: (res) => {
        this.tags = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /**
   * NG ON DESTROY
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }
}
