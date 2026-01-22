import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {GalleryComponent} from "../gallery/gallery.component";
import {QuizOption, QuizQuestion} from "../../../interfaces/common/quiz.interface";

@Component({
  selector: 'app-quiz-card-two',
  templateUrl: './quiz-card-two.component.html',
  styleUrls: ['./quiz-card-two.component.scss']
})
export class QuizCardTwoComponent {
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

  onClickOption(data: QuizOption) {
    const isSame = this.selectedOption?.name === data?.name;
    this.selectedOption = !isSame ? data : null;
    this.onSelectOption.emit({
      name: this.data?.name,
      images: this.files,
      answer: this.selectedOption?.name,
      isSelect:  !isSame
    })
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
    console.log(data)
    this.files = event;
    this.fileNotPicked = false;
  }

  onDeleteOldImage(event: any) {
    this.oldImages = event;
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
