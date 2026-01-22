import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotificationComponent } from '../../shared/components/ui/snackbar-notification/snackbar-notification.component';


@Injectable({
  providedIn: 'root'
})
export class UiService {

  // Inject
  public readonly snackBar = inject(MatSnackBar);


  /**
   * SNACKBAR
   * success()
   * warn()
   * wrong()
   */
  success(msg: any) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification', 'success-snackbar']
    });
  }

  warn(msg: any) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification', 'warn-snackbar']
    });
  }

  warnTop(msg: any) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['notification', 'warn-snackbar']
    });
  }

  wrong(msg: any) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification', 'wrong-snackbar']
    });
  }


}
