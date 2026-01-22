import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-group-link',
  templateUrl: './group-link.component.html',
  styleUrls: ['./group-link.component.scss']
})
export class GroupLinkComponent {


  constructor(public dialogRef: MatDialogRef<GroupLinkComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }


  onClickClose() {
    // this.storageService.storeDataToSessionStorage('DIALOG', true);
    this.dialogRef.close(false);
  }
}
