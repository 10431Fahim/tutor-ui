import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ExamCourseService } from '../../services/common/exam-course.service';
import { ExamScheduleService } from '../../services/common/exam-schedule.service';
import { ExamModuleSettingsService } from '../../services/common/exam-module-settings.service';
import { ExamCourse } from '../../interfaces/common/exam-course.interface';
import { ExamSchedule } from '../../interfaces/common/exam-schedule.interface';
import { ExamModuleSettings } from '../../interfaces/common/exam-module-settings.interface';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeVideoShowComponent } from '../../shared/dialog-view/youtube-video-show/youtube-video-show.component';

@Component({
  selector: 'app-exam-module',
  templateUrl: './exam-module.component.html',
  styleUrls: ['./exam-module.component.scss'],
  providers: [DatePipe]
})
export class ExamModuleComponent implements OnInit, OnDestroy {
  activeAccordionIndex: number | null = null;
  
  // Data
  settings: ExamModuleSettings = {};
  examCourses: ExamCourse[] = [];
  mcqExams: ExamSchedule[] = [];
  writtenExams: ExamSchedule[] = [];
  mcqSectionVideo: string = '';
  writtenSectionVideo: string = '';
  
  // Loading
  isLoadingSettings = true;
  isLoadingCourses = true;
  isLoadingSchedules = true;

  // Subscriptions
  private subDataZero: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  constructor(
    private examCourseService: ExamCourseService,
    private examScheduleService: ExamScheduleService,
    private examModuleSettingsService: ExamModuleSettingsService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadSettings();
    this.loadExamCourses();
    this.loadExamSchedules();
  }

  loadSettings(): void {
    this.isLoadingSettings = true;
    this.subDataZero = this.examModuleSettingsService.getSettings().subscribe({
      next: (res) => {
        if (res.success) {
          this.settings = res.data || {};
        }
        this.isLoadingSettings = false;
      },
      error: (err) => {
        console.error('Error loading settings:', err);
        this.isLoadingSettings = false;
      }
    });
  }

  getSafeHtml(html: string): SafeHtml {
    if (!html) return '';
    return this.sanitizer.sanitize(1, html) || '';
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    if (!url) return '';
    // If it's already an embed URL, use it directly
    if (url.includes('embed')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    // If it's a YouTube watch URL, convert to embed
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    }
    // If it's a YouTube short URL, convert to embed
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    }
    // For other video URLs, use directly
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  loadExamCourses(): void {
    this.isLoadingCourses = true;
    const filterData: FilterData = {
      filter: { status: 'active' },
      pagination: null,
      select: null,
      sort: { createdAt: -1 }
    };

    this.subDataOne = this.examCourseService.getAllActiveExamCourses().subscribe({
      next: (res) => {
        if (res.success) {
          this.examCourses = res.data || [];
        }
        this.isLoadingCourses = false;
      },
      error: (err) => {
        console.error('Error loading exam courses:', err);
        this.isLoadingCourses = false;
      }
    });
  }

  loadExamSchedules(): void {
    this.isLoadingSchedules = true;

    // Load MCQ Exams
    this.subDataTwo = this.examScheduleService.getExamSchedulesByType('mcq').subscribe({
      next: (res) => {
        if (res.success) {
          this.mcqExams = res.data || [];
          // Get first exam's video for the section
          if (this.mcqExams.length > 0 && this.mcqExams[0].video) {
            this.mcqSectionVideo = this.mcqExams[0].video;
          }
        }
        this.checkSchedulesLoaded();
      },
      error: (err) => {
        console.error('Error loading MCQ exams:', err);
        this.checkSchedulesLoaded();
      }
    });

    // Load Written Exams
    this.subDataThree = this.examScheduleService.getExamSchedulesByType('written').subscribe({
      next: (res) => {
        if (res.success) {
          this.writtenExams = res.data || [];
          // Get first exam's video for the section
          if (this.writtenExams.length > 0 && this.writtenExams[0].video) {
            this.writtenSectionVideo = this.writtenExams[0].video;
          }
        }
        this.checkSchedulesLoaded();
      },
      error: (err) => {
        console.error('Error loading written exams:', err);
        this.checkSchedulesLoaded();
      }
    });
  }

  private checkSchedulesLoaded(): void {
    if (this.subDataTwo?.closed && this.subDataThree?.closed) {
      this.isLoadingSchedules = false;
    }
  }

  toggleAccordion(index: number): void {
    if (this.activeAccordionIndex === index) {
      this.activeAccordionIndex = null;
    } else {
      this.activeAccordionIndex = index;
    }
  }

  isAccordionActive(index: number): boolean {
    return this.activeAccordionIndex === index;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return this.datePipe.transform(dateObj, 'dd MMM, hh:mm a') || '';
  }

  openUrl(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  openVideoPlayerDialog(videoUrl: string): void {
    if (videoUrl) {
      const dialogRef = this.dialog.open(YoutubeVideoShowComponent, {
        data: { url: videoUrl },
        panelClass: ['theme-dialog', 'no-padding-dialog'],
        width: '98%',
        maxWidth: '700px',
        height: 'auto',
        maxHeight: '100vh',
        autoFocus: false,
        disableClose: false,
      });
      dialogRef.afterClosed().subscribe(() => {
        // Handle dialog close if needed
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subDataZero) {
      this.subDataZero.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
  }
}
