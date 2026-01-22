import {Component, Inject, OnInit} from '@angular/core';
import {StorageService} from '../../../services/core/storage.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Popup} from '../../../interfaces/common/popup.interface';

@Component({
  selector: 'app-upcoming-dialog',
  templateUrl: './upcoming-dialog.component.html',
  styleUrls: ['./upcoming-dialog.component.scss']
})
export class UpcomingDialogComponent implements OnInit {

  popups: Popup[] = [];
  filter: any = null;

  constructor(
    private storageService: StorageService,
    private dialogRef: MatDialogRef<UpcomingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Popup[],
  ) {
  }

  ngOnInit(): void {

    if (this.data && this.data.length) {
      this.popups = this.data;
      // console.log("this.popups",this.popups)
    }

  }


  onClickClose() {
    this.storageService.storeDataToSessionStorage('DIALOG', true);
    this.dialogRef.close();
  }
}
