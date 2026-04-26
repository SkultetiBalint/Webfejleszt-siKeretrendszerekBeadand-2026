import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  template: `
    <div class="loading" role="status" [attr.aria-label]="label">
      <span class="loading__dot"></span>
      <span class="loading__dot"></span>
      <span class="loading__dot"></span>
      <span class="loading__text">{{ label }}</span>
    </div>
  `,
  styles: [`
    .loading {
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: 1.5rem;
      justify-content: center;
      color: #666;
    }
    .loading__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      opacity: .4;
      animation: pulse 1.2s ease-in-out infinite;
    }
    .loading__dot:nth-child(2) { animation-delay: .15s; }
    .loading__dot:nth-child(3) { animation-delay: .3s; }
    .loading__text { margin-left: .5rem; }
    @keyframes pulse {
      0%, 60%, 100% { opacity: .25; transform: scale(.9); }
      30% { opacity: 1; transform: scale(1.15); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() label = 'Betöltés...';
}
