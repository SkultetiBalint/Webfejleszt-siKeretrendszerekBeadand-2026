import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty">
      <div class="empty__icon" aria-hidden="true">{{ icon }}</div>
      <h3 class="empty__title">{{ title }}</h3>
      <p class="empty__msg" *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .empty {
      text-align: center;
      padding: 2.5rem 1rem;
      color: #666;
      border: 1px dashed #d1d5db;
      border-radius: 12px;
      background: #fafafa;
    }
    .empty__icon { font-size: 2.5rem; margin-bottom: .5rem; }
    .empty__title { margin: 0 0 .25rem; font-size: 1.1rem; color: #333; }
    .empty__msg { margin: 0; font-size: .95rem; }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = '✨';
  @Input() title: string = 'Nincs megjeleníthető elem';
  @Input() message: string = '';
}
