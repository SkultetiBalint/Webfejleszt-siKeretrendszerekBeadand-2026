import { Injectable, signal } from '@angular/core';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

interface InternalRequest extends ConfirmRequest {
  resolve: (result: boolean) => void;
}

/**
 * Confirm dialog service. A komponens (ConfirmDialogComponent) figyeli az
 * `active` signalt és ha van értéke, megjelenít egy modális dialógust.
 *
 * Promise-alapú API-t ad: `await confirm.ask({ title, message })`.
 */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly _active = signal<InternalRequest | null>(null);
  readonly active = this._active.asReadonly();

  ask(request: ConfirmRequest): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this._active.set({ ...request, resolve });
    });
  }

  resolve(result: boolean) {
    const current = this._active();
    if (!current) return;
    current.resolve(result);
    this._active.set(null);
  }
}
