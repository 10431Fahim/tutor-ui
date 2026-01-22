import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-youtube-video-show',
  templateUrl: './video-player-dialog.component.html',
  styleUrls: ['./video-player-dialog.component.scss']
})
export class VideoPlayerDialogComponent implements OnInit {

  videoBaseLink: string = environment.videoBaseLink;

  constructor(
    public dialogRef: MatDialogRef<VideoPlayerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string }
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * ON CLOSE DIALOG
   * onClose()
   */
  onClose() {
    this.dialogRef.close()
  }

}
