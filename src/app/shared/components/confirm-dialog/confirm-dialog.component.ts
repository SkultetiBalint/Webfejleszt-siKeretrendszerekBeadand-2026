import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  private readonly svc = inject(ConfirmService);
  readonly active = this.svc.active;

  confirm() { this.svc.resolve(true); }
  cancel()  { this.svc.resolve(false); }
}
