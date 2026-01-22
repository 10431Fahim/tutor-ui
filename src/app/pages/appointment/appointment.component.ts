import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppointmentSettingsService } from '../../services/common/appointment-settings.service';
import { AppointmentSettings } from '../../interfaces/common/appointment-settings.interface';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit, OnDestroy {
  settings: AppointmentSettings = {};
  isLoading = true;

  private subDataOne: Subscription;

  constructor(
    private appointmentSettingsService: AppointmentSettingsService
  ) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.subDataOne = this.appointmentSettingsService.getSettings().subscribe({
      next: (res) => {
        if (res.success) {
          this.settings = res.data || {};
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading appointment settings:', err);
        this.isLoading = false;
      }
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnDestroy(): void {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }
}
