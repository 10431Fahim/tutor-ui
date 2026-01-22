import {Component, Input} from '@angular/core';
import {Notice} from "../../../interfaces/common/notice.interface";

@Component({
  selector: 'app-notice-card-one',
  templateUrl: './notice-card-one.component.html',
  styleUrls: ['./notice-card-one.component.scss']
})
export class NoticeCardOneComponent {
  @Input() data: Notice;
}
