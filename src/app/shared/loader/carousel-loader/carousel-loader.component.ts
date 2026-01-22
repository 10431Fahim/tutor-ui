import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-carousel-loader',
  templateUrl: './carousel-loader.component.html',
  styleUrls: ['./carousel-loader.component.scss']
})
export class CarouselLoaderComponent implements OnInit {

  @Input() type: string;

  constructor() { }

  ngOnInit(): void {
  }

}
