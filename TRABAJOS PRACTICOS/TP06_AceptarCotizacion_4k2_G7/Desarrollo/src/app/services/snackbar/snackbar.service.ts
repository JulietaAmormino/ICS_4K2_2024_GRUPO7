import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarConfig } from './snackbar.config';

export const enum SnackBarType {
  'error' = 'error',
  'warn' = 'warn',
  'success' = 'success',
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private defaultConfig: SnackbarConfig = new SnackbarConfig();
  private _snackBar = inject(MatSnackBar);
  constructor(private _service: MatSnackBar) { }

  public showErrorMessage(message: string, customConfig?: SnackbarConfig) {
    this.showMessage(message, SnackBarType.error, customConfig, 'error');
  }

  public showWarnMessage(message: string, customConfig?: SnackbarConfig) {
    this.showMessage(message, SnackBarType.warn, customConfig, 'warning');
  }

  public showSuccessMessage(message: string, customConfig?: SnackbarConfig) {
    this.showMessage(message, SnackBarType.success, customConfig, 'check_circle');
  }

  private showMessage(message: string, type: SnackBarType, customConfig?: SnackbarConfig, icon?: string) {
    this.resetPanelClass();
    this.defaultConfig.panelClass?.push(type);
    this._snackBar.open(`${message}`, 'Close', {...this.defaultConfig});
  }

  private resetPanelClass() {
    this.defaultConfig.panelClass = ['isw_snackbar'];
  }
}
