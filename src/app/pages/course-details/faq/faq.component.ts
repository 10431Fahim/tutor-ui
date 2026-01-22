import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Faq} from "../../../interfaces/common/faq.interface";
import {Subscription} from "rxjs";
import {FaqService} from "../../../services/common/faq.service";
import {FilterData} from "../../../interfaces/core/filter-data.interface";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})

export class FaqComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  // Store Data
  faqs: Faq[];
  isLoadingFaq: boolean = true;

  // Pagination
  currentPage = 1;
  totalProducts: number;
  productsPerPage = 10;

  // Subscriptions
  private subGetData: Subscription;

  // Inject
  private readonly faqService = inject(FaqService);


  ngOnInit(): void {
    // Base Data
    this.getAllFaqs();
  }

  /**
   * HTTP REQUEST HANDLE
   * getAllFaqs()
   */
  getAllFaqs() {
    let mSelect = {
      name: 1,
      status: 1,
      answer: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      filter: {status: 'publish'},
      select: mSelect,
      pagination: null,
      sort: { createdAt: -1 }
    }

    this.isLoadingFaq = true;
    this.subGetData = this.faqService.getAllFaqs(filterData, null).subscribe({
        next: res => {
          if (res.success) {
            this.faqs = res.data;
            this.isLoadingFaq = false;
            this.totalProducts = res.count;
          }
        },
        error: err => {
          console.log(err);
        }
      }
    )
  }

  /**
   * ON PAGINATION CHANGE
   * onPageChanged()
   */
  onPageChanged(event: number) {
    this.currentPage = event;
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
  }
}
