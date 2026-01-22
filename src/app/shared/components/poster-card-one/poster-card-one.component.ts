import {Component, Input} from '@angular/core';
import {Banner} from "../../../interfaces/common/banner.interface";

@Component({
  selector: 'app-poster-card-one',
  templateUrl: './poster-card-one.component.html',
  styleUrls: ['./poster-card-one.component.scss']
})
export class PosterCardOneComponent {
  @Input() data: Banner;
}
