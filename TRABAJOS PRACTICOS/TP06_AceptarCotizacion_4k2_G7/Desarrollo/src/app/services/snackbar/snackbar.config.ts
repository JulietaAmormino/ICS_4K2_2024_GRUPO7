import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

export class SnackbarConfig {
    duration?: number = 100000;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    panelClass?: string[] = ['isw_snackbar'];
    verticalPosition: MatSnackBarVerticalPosition = 'top';
  }