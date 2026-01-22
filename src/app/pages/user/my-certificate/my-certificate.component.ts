import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { UserCertificateService } from 'src/app/services/common/user-certificate.service';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { UserService } from 'src/app/services/common/user.service';

@Component({
  selector: 'app-my-certificate',
  templateUrl: './my-certificate.component.html',
  styleUrls: ['./my-certificate.component.scss']
})
export class MyCertificateComponent implements OnInit {
  certificates: any[] = [];
  certificateCount = 0;
  loading = false;
  error: string | null = null;

  constructor(
    private userCertificateService: UserCertificateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Ensure user session is loaded from storage if available
    this.userService.autoUserLoggedIn();
    this.fetchCertificates();
  }

  fetchCertificates(): void {
    this.loading = true;
    this.error = null;

    const userId = this.userService.getUserId();
    if (!userId) {
      this.loading = false;
      this.error = 'Please log in to view your certificates';
      return;
    }

    // Select fields to reduce payload
    const mSelect = {
      image: 1,
      courseName: 1,
      priority: 1,
      createdAt: 1
    };

    const filterData: FilterData = {
      filter: { user: userId },
      pagination: null,
      select: mSelect,
      sort: { createdAt: -1 }
    } as any;

    this.userCertificateService
      .getAllUserCertificates(filterData)
      .subscribe({
        next: (res) => {
          if (res?.success) {
            this.certificates = res.data || [];
            this.certificateCount = res.count || 0;
          } else {
            this.certificates = [];
            this.certificateCount = 0;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load certificates';
          this.loading = false;
          console.error('getAllUserCertificates error', err);
        }
      });
  }

  async downloadImage(url: string, filename?: string) {
    try {
      const response = await fetch(url, { mode: 'cors' as RequestMode });
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename || 'certificate';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error('Download failed', e);
    }
  }
}
