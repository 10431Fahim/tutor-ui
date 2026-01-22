import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-batch-card-loader',
  templateUrl: './batch-card-loader.component.html',
  styleUrls: ['./batch-card-loader.component.scss']
})
export class BatchCardLoaderComponent implements OnInit {

  @Input() type: string = 'grid';
  constructor() { }

  ngOnInit(): void {
  }

}
