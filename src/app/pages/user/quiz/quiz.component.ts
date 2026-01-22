import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Quiz } from '../../../interfaces/common/quiz.interface';
import { QuizService } from '../../../services/common/quiz.service';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit, OnDestroy {
  // Font Awesome Icon
  faPlay = faPlay;

  // Store Data
  id: string;
  quiz: Quiz;

  // Subscriptions
  private subGetData1: Subscription;
  private subRouteOne: Subscription;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly quizService = inject(QuizService);

  ngOnInit() {
    // GET ID FROM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getQuizById();
      }
    });
  }

  /**
   * HTTP REQUEST HANDLE
   * getQuizById()
   */
  private getQuizById() {
    const select =
      'name questionCount timeInSec passMark isNegativeMark negativeMark';
    this.subGetData1 = this.quizService.getQuizById(this.id, select).subscribe({
      next: (res) => {
        if (res.success) {
          this.quiz = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subGetData1) {
      this.subGetData1.unsubscribe();
    }
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
  }
}
