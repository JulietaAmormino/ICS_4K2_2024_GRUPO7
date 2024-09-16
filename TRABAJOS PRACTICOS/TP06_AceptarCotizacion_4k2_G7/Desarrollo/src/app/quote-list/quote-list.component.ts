import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransportService } from '../transport-service.service';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.css']
})
export class QuoteListComponent {
  public transports;

  constructor(
    private _transportService: TransportService,
    private _router: Router
  ) {
    this.transports = this._transportService.transports;
    console.log(this.transports)
  }

  ngOnInit(): void {}

  selectPaymentMethod(id: number) {
    this._router.navigate(['payment-methods'], { queryParams: { quoteId: id } })
  }
}
