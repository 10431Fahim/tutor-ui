import {Component, OnDestroy, OnInit, inject, NgZone} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize, Subscription} from 'rxjs';
import { Quiz } from '../../../../interfaces/common/quiz.interface';
import { QuizService } from '../../../../services/common/quiz.service';
import {CourseService} from '../../../../services/common/course.service';
import {Course} from '../../../../interfaces/common/course.interface';
import { UserDataService } from 'src/app/services/common/user-data.service';
import { User } from 'src/app/interfaces/common/user.interface';
import { UserService } from 'src/app/services/common/user.service';
import {UtilsService} from '../../../../services/core/utils.service';
import {UiService} from "../../../../services/core/ui.service";

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss'],
})
export class QuizDetailsComponent implements OnInit, OnDestroy {

  // Store Data
  id: string;
  quiz: Quiz;
  quizAnswer: any[] = [];
  quizAnswer1: any[] = [];
  progress: number = 0;
  isFinish: boolean = false;
  timeInSec?: number;
  holdTimeInSec?: number;
  timerId: ReturnType<typeof setInterval> | null = null;
  result: any = null;
  courseId: string;
  course: Course;
  user: User;
  private subRouteTwo: Subscription;

  // ConvertTime Data
  convertMin?: number = 0;
  convertSec?: number = 0;
  parentage?: number = 100;
  private hasSubmitted = false;


  // Subscriptions
  private subGetData: Subscription;
  private subAddData1: Subscription;
  private subGetData2: Subscription;
  private subRouteOne: Subscription;
  private subGetData4!: Subscription;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly userDataService = inject(UserDataService);
  private readonly userService = inject(UserService);
  private readonly utilsService = inject(UtilsService);
  private readonly uiService = inject(UiService);

  constructor(
    // ...
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    // GET ID FROM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getQuizById();
      }
    });

    this.subRouteTwo = this.activatedRoute.queryParamMap.subscribe(qParam => {
      this.courseId = qParam.get('course');
      if(this.courseId) {
        this.getCourseById()
      }
    })

    if(this.userService.getUserStatus()) {
      this.getLoggedUserData();
    }
  }


  /**
   * HTTP REQ HANDLE
   * getQuizById()
   * timeSet()
   */
  // private getQuizById() {
  //   const select =
  //     'name questionCount timeInSec quizType passMark isNegativeMark negativeMark questions';
  //   this.subGetData = this.quizService.getQuizById(this.id, select).subscribe({
  //     next: (res) => {
  //       // if (res.success) {
  //       //   this.quiz = res?.data;
  //       //   this.timeInSec = Number(this.quiz?.timeInSec);
  //       //
  //       //   this.convertMin = this.timeInSec / 60;
  //       //
  //       //   this.holdTimeInSec = Number(this.quiz?.timeInSec);
  //       //
  //       //   this.timerId = setInterval(() => {
  //       //     this.timeInSec = this.timeInSec - 1;
  //       //     this.timeSet(this.timeInSec);
  //       //   }, 1000);
  //       // }
  //       if (res.success) {
  //         this.quiz = res?.data;
  //
  //         this.timeInSec = Number(this.quiz?.timeInSec) || 0;
  //         this.holdTimeInSec = this.timeInSec;
  //         this.convertMin = Math.floor(this.timeInSec / 60);
  //         this.convertSec = this.timeInSec % 60;
  //
  //         // ensure previous timer cleared
  //         this.stopTimer();
  //         this.timerId = setInterval(() => {
  //           this.timeInSec = this.timeInSec - 1;
  //           this.timeSet(this.timeInSec);
  //         }, 1000);
  //       }
  //     },
  //     error: err => {
  //       console.log(err);
  //     },
  //   });
  // }

  private getQuizById() {
    const select =
      'name questionCount timeInSec quizType passMark isNegativeMark negativeMark questions';

    this.subGetData = this.quizService.getQuizById(this.id, select).subscribe({
      next: (res) => {
        if (!res?.success) return;
        this.quiz = res.data;

        this.timeInSec = Number(this.quiz?.timeInSec) || 0;
        this.holdTimeInSec = this.timeInSec;

        // প্রথমেই UI আপডেট দেখিয়ে দিন
        this.updateClockUi(this.timeInSec);

        // তারপর টাইমার চালু করুন
        this.startTimer();
      },
      error: (err) => console.log(err),
    });
  }


  private getCourseById() {
    this.subGetData2 = this.courseService.getCourseById(this.courseId).subscribe({
      next: (res) => {
        this.course = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private getLoggedUserData() {
    const select = 'name phone email';
    this.subGetData4 = this.userDataService
      .getLoggedInUserData(select)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.user = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }



  /**
   * QUIZ LOGIC
   * onSelectOption()
   * onFinish()
   * onReQuiz()
   */
  onSelectOption(event: any) {
    const fIndex = this.quizAnswer.findIndex((f) => f.name === event.name);

    if (fIndex === -1) {
      this.quizAnswer.push(event);
    } else {
      if (event.isSelect) {
        this.quizAnswer[fIndex] = event;
      } else {
        this.quizAnswer.splice(fIndex, 1);
      }
    }

    this.progress = Math.floor(
      (this.quizAnswer.length / this.quiz?.questionCount) * 100
    );
  }



  onFinish() {
    let correct: number = 0;
    let inCorrect: number = 0;

    if(this.quiz?.quizType !== 'manual'){
      this.quiz?.questions.forEach((ques) => {
        const fAns = this.quizAnswer.find((f) => f.name === ques?.name);
        const fOption = ques.options.find((f) => f.name === fAns?.answer);

        if (fOption?.isCorrect) {
          correct += 1;
        } else {
          inCorrect += 1;
        }
      });
      const obtainMark = Math.floor((correct / this.quiz?.questionCount) * 100);

      clearInterval(this.timerId);
      let getFinishTime = Math.floor(this.holdTimeInSec / 60);
      let getFinishTimeMin = getFinishTime - this.convertMin;
      let getFinishTimeSec = 60 - this.convertSec;
      let totalFinishTime =
        '0' +
        (getFinishTimeMin === 0 ? getFinishTime : getFinishTimeMin - 1) +
        ':' +
        (getFinishTimeSec > 10 ? getFinishTimeSec : '0' + getFinishTimeSec);

      const isPass = obtainMark >= this.quiz?.passMark;

      //
      let resultQuestionAns: any[] = [];
      this.quiz?.questions.forEach(ques => {

        const fQuizAns = this.quizAnswer.find(f => f.name === ques.name);
        const mOptions = ques.options.map(m => {
          return {
            ...m,
            ...{
              isSelect: fQuizAns?.answer === m?.name
            }
          }
        })

        resultQuestionAns.push({
          ...ques,
          ...{
            options: mOptions
          }
        })
      });

      this.result = {
        passMark: this.quiz?.passMark,
        obtainMark: obtainMark,
        isPass: isPass,
        totalFinishTime: totalFinishTime,
        correct: correct,
        inCorrect: inCorrect,
        questions: resultQuestionAns
      }

      this.isFinish = true;

      this.onEligibleForEnroll()
    }else{
      this.onEligibleForEnrollManual();
    }
  }


  onEligibleForEnroll() {

    const data: any = {
      quiz: {
        _id: this.quiz?._id,
        name: this.quiz?.name,
        questionCount: this.quiz?.questionCount,
        passMark: this.quiz?.passMark,
        timeInSec: this.quiz?.timeInSec,
        isNegativeMark: this.quiz?.isNegativeMark,
        negativeMark: this.quiz?.negativeMark,
      },
      user: {
        _id: this.user?._id,
        name: this.user?.name,
        username: this.user?.username,
        phoneNo: this.user?.phone,
        email: this.user?.email,
      },
      result:this.result,
      quizType: 'automatic',
      mark: this.result.mark,
      isPass: this.result.isPass,
      completeTimeInSec: this.result.totalFinishTime,
      joinDate: new Date(),
      createDateString: this.utilsService.getDateString(new Date()),
      createTime: this.utilsService.getCurrentTime(),
      course: this.course?._id,
    }

    this.addQuizResult(data);

  }


  onEligibleForEnrollManual() {
    const data: any = {
      quiz: {
        _id: this.quiz?._id,
        name: this.quiz?.name,
        questionCount: this.quiz?.questionCount,
        passMark: this.quiz?.passMark,
        timeInSec: this.quiz?.timeInSec,
        isNegativeMark: this.quiz?.isNegativeMark,
        negativeMark: this.quiz?.negativeMark,
      },
      user: {
        _id: this.user?._id,
        name: this.user?.name,
        username: this.user?.username,
        phoneNo: this.user?.phone,
        email: this.user?.email,
      },
      result: this.quizAnswer,
      quizType: 'manual',
      mark: this.result?.mark,
      isPass: this.result?.isPass,
      completeTimeInSec: this.result?.totalFinishTime,
      joinDate: new Date(),
      createDateString: this.utilsService?.getDateString(new Date()),
      createTime: this.utilsService?.getCurrentTime(),
      course: this.course?._id,
    }

    this.addQuizResult(data);

  }


  private addQuizResult(data: any, fromTimer = false) {
    // ডাবল সাবমিট প্রতিরোধ
    if (this.hasSubmitted && !fromTimer) return;
    this.hasSubmitted = true;

    this.subAddData1 = this.quizService.addQuizResult(data)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (res) => {
          this.stopTimer();
          // navigate সবসময় NgZone-এ
          this.ngZone.run(() => {
            this.uiService.success('Quiz Completed');
            // this.router.navigate(['/quiz-result']);
            this.isFinish = true;
          });
        },
        error: (err) => {
          console.log(err);
          // ফেইল হলেও ফলাফল পেজে নিন (আপনার ইচ্ছা)
          this.ngZone.run(() => this.router.navigate(['/quiz-result']));
        },
      });
  }



  onReQuiz() {
    this.isFinish = false;
    this.hasSubmitted = false;
    this.timeInSec = 0;
    this.convertMin = 0;
    this.convertSec = 0;
    this.holdTimeInSec = 0;
    this.parentage = 100;
    this.quizAnswer = [];
    this.quiz = null;
    this.getQuizById();
  }


  // --- helper ---
  private stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;

    }
  }



  // timer helpers
  private startTimer() {
    this.stopTimer();
    this.timerId = setInterval(() => {
      this.timeInSec--;
      if (this.timeInSec <= 0) {
        this.onTimeUp(); // time up হলে একবারই সাবমিট
      } else {
        this.updateClockUi(this.timeInSec);
      }
    }, 1000);
  }



  private updateClockUi(time: number) {
    this.parentage = Math.floor((time / this.holdTimeInSec) * 100);
    this.convertMin = Math.floor(time / 60);
    this.convertSec = time % 60;
  }

// time up handler
  private onTimeUp() {
    if (this.hasSubmitted) return;
    this.hasSubmitted = true;
    this.stopTimer();

    // UI reset
    this.parentage = 0;
    this.convertMin = 0;
    this.convertSec = 0;

    this.onFinish();
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {

    this.stopTimer();
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subRouteTwo) {
      this.subRouteTwo.unsubscribe();
    }

    if (this.subAddData1) {
      this.subAddData1.unsubscribe();
    }

  }

}
