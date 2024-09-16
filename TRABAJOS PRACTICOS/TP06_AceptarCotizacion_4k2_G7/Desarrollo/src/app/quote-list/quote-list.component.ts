import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransportService } from '../transport-service.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.css']
})
export class QuoteListComponent {
  public transports;

  constructor(
    private _transportService: TransportService,
    private _router: Router,
    private _snackbarService: SnackbarService
  ) {
    this.transports = this._transportService.transports;
    console.log(this.transports)
  }

  ngOnInit(): void {}

  selectPaymentMethod(id: number) {
    const transport = this._transportService.getTransportById(id);
    if (transport?.state === 'Confirmed'){
      this._snackbarService.showErrorMessage('No se puede confirmar mas de 1 vez la misma cotización.');
      return;
    }
    this._router.navigate(['payment-methods'], { queryParams: { quoteId: id } })
  }
}
