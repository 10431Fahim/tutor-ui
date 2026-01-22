import {Component, inject} from '@angular/core';
import {QuizService} from '../../../services/common/quiz.service';
import {Subscription} from 'rxjs';
import {FilterData} from '../../../interfaces/core/filter-data.interface';
import {UserService} from '../../../services/common/user.service';
import {Quiz} from '../../../interfaces/common/quiz.interface';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss']
})
export class QuizResultComponent {
  results: Quiz[] =[];

  // Subscriptions
  private subOrderData!: Subscription;
  // inject
  private readonly quizService = inject(QuizService);
  private readonly userService = inject(UserService);

  ngOnInit() {
    this.getAllQuizsResult();
  }

  getAllQuizsResult() {
    const mSelect = {
      quiz: 1,
      user: 1,
      isPass: 1,
      completeTimeInSec: 1,
      joinDate: 1,
      result: 1,
      createdAt: 1,
    }
    const filterData: FilterData = {
      select: mSelect,
      pagination: null,
      sort: { createdAt: -1 },
      filter: {'user._id':this.userService?.getUserId() }
    }

    this.subOrderData = this.quizService.getAllQuizsResult(filterData).subscribe(
      (res) => {
        if (res.success) {
          this.results = res.data;
          //
          // const uniqueIds = [...new Set(this.allOrders.orderedItems.map(obj => obj.category._id))];
          // console.log('uniqueIds', uniqueIds)
          // this.getRelatedProductsByMultiCategoryId(uniqueIds)
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }


}
