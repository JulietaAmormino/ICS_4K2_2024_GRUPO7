import { Component, OnInit } from '@angular/core';
import { TransportService } from '../transport-service.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  public transport: any; 
  public quoteId: number;

  get hasCreditCard() {
    return this.transport.paymentMethods.includes('master-card') 
    || this.transport.paymentMethods.includes('visa') 
    || this.transport.paymentMethods.includes('american-express')
  }

  constructor(
    private _transportService: TransportService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ){
    this.quoteId = this._activatedRoute.snapshot.queryParams['quoteId'];
    this.transport = this._transportService.getTransportById(this.quoteId);
  }
  


  ngOnInit(): void {
  }

  pay(paymentMethod: string, id: number): void{
    this._router.navigate(['payment'], { queryParams: { paymentMethod: paymentMethod, quoteId: id } })
  }

}
