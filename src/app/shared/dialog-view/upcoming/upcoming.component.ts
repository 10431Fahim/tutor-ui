import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class UpcomingComponent {
  //Font Awesome icon
  faCheck = faCheck

  constructor(
    public dialogRef: MatDialogRef<UpcomingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
}
