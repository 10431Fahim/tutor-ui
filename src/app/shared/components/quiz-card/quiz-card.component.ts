import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {QuizOption, QuizQuestion} from '../../../interfaces/common/quiz.interface';
import {GalleryComponent} from "../gallery/gallery.component";
import {UiService} from "../../../services/core/ui.service";
import {Subscription} from "rxjs";
import {FileUploadService} from "../../../services/gallery/file-upload.service";

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrls: ['./quiz-card.component.scss'],
})
export class QuizCardComponent {
  @ViewChild('galleryPop', { static: false }) galleryPop!: GalleryComponent;
  selectedOption: QuizOption;
  @Input({required: true}) data: QuizQuestion;
  @Input() showCorrectAnswer: boolean;
  @Output() onSelectOption = new EventEmitter();
  @Output() onSelectQuiz = new EventEmitter();
  //Files
  files: File[] = [];
  oldImages: string[] = [];
  fileNotPicked: boolean = false;

  //Subscriptions
  private subDataOne: Subscription;

  constructor(
    private fileUploadService: FileUploadService,
    private uiService: UiService,
  ) {

  }


  getResultOpt(data: QuizOption) {
    if(data.isSelect && !data.isCorrect) {
      return 'wrong'
    } if (data.isCorrect) {
      return 'correct'
    } else
      return '';
  }


  /**
   * IMAGE DRUG & DROP
   */
  onSelect(event: any[],data) {
    this.files = event;
    this.fileNotPicked = false;
    this.uploadImageServer(data);
  }

  onDeleteOldImage(event: any) {
    this.oldImages = event;
  }

  /***
   * FILE UPLOAD FUNCTIONALITY
   * uploadFile()
   */

  uploadImageServer(data: any) {
    this.subDataOne = this.fileUploadService.uploadMultiImageOriginal(this.files)
      .subscribe({
        next: res => {
          const images = res.map((d) => d.url);

          const finalData = {
            ...data,
            ...{
              images: images
            }
          };
          this.onClickOption(finalData);
        },
        error: err => {
          this.uiService.wrong('Failed! Upload Image Failed, Try again.');
          console.log(err);
        }
      })

  }

  onClickOption(data: any) {
    const isSame = this.selectedOption?.name === data?.name;
    this.selectedOption = !isSame ? data : null;
    this.onSelectOption.emit({
      name: this.data?.name,
      images: data?.images,
      answer: this.selectedOption?.name ? this.selectedOption?.name : '',
      isSelect:  !isSame
    })
  }
  /**
   * SHOW GALLERY
   */
  onShowPop(index: any) {
    if (index > -1) {
      this.galleryPop.onShowGallery(index);
    }
  }

}
