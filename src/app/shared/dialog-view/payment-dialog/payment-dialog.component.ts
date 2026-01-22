import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { grantTotal: number; bkashNumber: string }
  ) {
    this.form = this.fb.group({
      senderNumber: ['', [Validators.required, Validators.pattern('^01[0-9]{9}$')]], // 11 digit
      trxId: ['', Validators.required],
    });
  }

  copyNumber() {
    navigator.clipboard.writeText(this.data.bkashNumber);

    this.uiService.warnTop('Bkash number copied!');
  }

  submit() {
    if (this.form.valid) {
      const payload = {
        grantTotal: this.data.grantTotal,
        bkashNumber: this.data.bkashNumber,
        ...this.form.value,
      };
      this.dialogRef.close(payload); // send data to parent
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
