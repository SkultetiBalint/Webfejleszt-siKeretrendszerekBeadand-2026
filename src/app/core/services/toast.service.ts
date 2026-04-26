import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/**
 * Egyszerű toast service - signal-alapú, a ToastContainer komponens jeleníti meg.
 * Tudatos állapotkezelés példája: központi store, reaktív frissítéssel.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly _toasts = signal<Toast[]>([]);
  /** Olvasásra szánt signal a UI-nak */
  readonly toasts = this._toasts.asReadonly();

  success(message: string, durationMs = 3500) {
    this.push(message, 'success', durationMs);
  }

  error(message: string, durationMs = 5000) {
    this.push(message, 'error', durationMs);
  }

  info(message: string, durationMs = 3500) {
    this.push(message, 'info', durationMs);
  }

  dismiss(id: number) {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  private push(message: string, type: ToastType, durationMs: number) {
    const toast: Toast = { id: this.nextId++, message, type };
    this._toasts.update(list => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), durationMs);
  }
}
