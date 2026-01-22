import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OmrService } from '../../../services/common/omr.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-omr-scan',
  templateUrl: './omr-scan.component.html',
  styleUrls: ['./omr-scan.component.scss'],
})
export class OmrScanComponent implements OnInit {
  // Data
  examId: string | null = null;
  courseId: string | null = null;
  selectedFile: File | null = null;
  uploading = false;
  scanJobId: string | null = null;
  scanStatus: any = null;

  // Inject
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly omrService = inject(OmrService);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId');
    this.courseId = this.route.snapshot.queryParamMap.get('courseId');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        this.snackBar.open('Please select a valid image (JPG/PNG) or PDF file', 'Close', {
          duration: 3000,
        });
        return;
      }
      this.selectedFile = file;
    }
  }

  uploadScan(): void {
    if (!this.selectedFile || !this.examId) {
      this.snackBar.open('Please select a file and ensure exam ID is available', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.uploading = true;
    this.omrService.scanOmr(this.examId, this.selectedFile, this.courseId || undefined).subscribe({
      next: (res) => {
        if (res.success) {
          this.scanJobId = res.data.jobId;
          this.snackBar.open('OMR scan uploaded successfully. Processing...', 'Close', {
            duration: 3000,
          });
          // Start polling for status
          this.checkScanStatus();
        }
        this.uploading = false;
      },
      error: (err) => {
        this.snackBar.open('Upload failed: ' + (err.error?.message || err.message), 'Close', {
          duration: 5000,
        });
        this.uploading = false;
      },
    });
  }

  checkScanStatus(): void {
    if (!this.scanJobId) return;

    this.omrService.getScanJobStatus(this.scanJobId).subscribe({
      next: (res) => {
        if (res.success) {
          this.scanStatus = res.data;
          // If still processing, check again after 3 seconds
          if (res.data.status === 'processing' || res.data.status === 'pending') {
            setTimeout(() => this.checkScanStatus(), 3000);
          } else if (res.data.status === 'completed') {
            this.snackBar.open('OMR scan processed successfully!', 'Close', {
              duration: 5000,
            });
            // Navigate to result page if resultId exists
            if (res.data.resultId) {
              this.router.navigate(['/quiz-result', res.data.resultId]);
            }
          } else if (res.data.status === 'failed') {
            this.snackBar.open('OMR scan failed: ' + (res.data.error || 'Unknown error'), 'Close', {
              duration: 5000,
            });
          }
        }
      },
      error: (err) => {
        console.error('Status check error:', err);
      },
    });
  }
}
