import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-product-card-one-loader',
  templateUrl: './product-card-one-loader.component.html',
  styleUrls: ['./product-card-one-loader.component.scss']
})
export class ProductCardOneLoaderComponent implements OnInit {

  @Input() type: string = 'grid';
  constructor() { }

  ngOnInit(): void {
  }

}
