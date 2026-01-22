import {Component, Inject, OnChanges, OnInit, PLATFORM_ID, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit,OnChanges{
  pdfSrc:string = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  constructor(
    public dialogRef: MatDialogRef<PdfViewerComponent>,
    @Inject(PLATFORM_ID) public platformId:any,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){

  }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {

  }


  onClose() {
    this.dialogRef.close();
  }
}
