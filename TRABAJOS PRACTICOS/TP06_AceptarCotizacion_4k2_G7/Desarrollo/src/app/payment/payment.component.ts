import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransportService } from '../transport-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  public applicationForm: FormGroup;
  public creditCardNumber: FormControl;
  public creditCardOwnerName: FormControl;
  public creditCardExpiryDate: FormControl;
  public creditCardCVV: FormControl;
  public creditCardType: FormControl;
  public dni: FormControl;
  public transport: any;

  constructor(
    private _transportService: TransportService,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackbarService,
    private _router: Router
  ){
    const quoteId = this._activatedRoute.snapshot.queryParams['quoteId'];
    const paymentMethod = this._activatedRoute.snapshot.queryParams['paymentMethod'];
    this.transport = this._transportService.getTransportById(quoteId);
    if (paymentMethod === 'cash-on-pickup' || paymentMethod === 'cash-on-delivery'){
      this._snackbarService.showSuccessMessage('Cotización confirmada.');
      this._router.navigate(['']);
      // this._transportService.sendEmail(this.transport, paymentMethod).subscribe((res) => {
      //   if (res){
      //     this._snackbarService.showSuccessMessage('Cotización confirmada.');
      //     this._router.navigate(['']);
      //   }
      // })
    }

    this.applicationForm = this._formBuilder.group({
      creditCardNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
      creditCardOwnerName: new FormControl('', [Validators.required]),
      creditCardExpiryDate: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\d{2}$/)]),
      creditCardCVV: new FormControl('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
      creditCardType: new FormControl(true, [Validators.required]),
      dni: new FormControl(0,  [Validators.required, Validators.minLength(7)])
    }) as FormGroup;
    this.creditCardNumber = this.applicationForm.controls['creditCardNumber'] as FormControl;
    this.creditCardOwnerName = this.applicationForm.controls['creditCardOwnerName'] as FormControl;
    this.creditCardExpiryDate = this.applicationForm.controls['creditCardExpiryDate'] as FormControl;
    this.creditCardCVV = this.applicationForm.controls['creditCardCVV'] as FormControl;
    this.creditCardType = this.applicationForm.controls['creditCardType'] as FormControl;
    this.dni = this.applicationForm.controls['dni'] as FormControl;
  }

  sendPayment() {
    if (!this.applicationForm.valid) return;

    // Obtener valores del formulario
    const cardNumber = this.creditCardNumber.value;
    const cardType = this.getCardType(cardNumber);
    const paymentType = this.creditCardCVV.value ? 'debit' : 'credit';

    if(!this.validateCreditCard(cardNumber, cardType, paymentType)){
      this._snackbarService.showErrorMessage('La tarjeta ingresada no es valida.')
      return;
    }
    if (!this.isAllowedCardType(cardType)){
      this._snackbarService.showErrorMessage('El tipo de tarjeta ingresada no esta dentro de los metodos aceptados.')
      return;
    }
    
  }

  public validateCreditCard(cardNumber: string, cardType: 'MasterCard' | 'Visa' | 'American Express' | 'Unknown', paymentType: 'debit' | 'credit'): boolean {
    if (cardType === 'Unknown') return false;

    cardNumber = cardNumber.replace(/\s|-/g, '');

    const patterns = {
      'MasterCard': /^5[1-5]\d{14}$/,
      'Visa': /^4\d{12}(\d{3})?$/,
      'American Express': /^3[47]\d{13}$/
    };

    const pattern = patterns[cardType];
    if (!pattern) {
      return false;
    }

    const isValidCardNumber = pattern.test(cardNumber);

    return isValidCardNumber;
  }

  public isAllowedCardType(cardType: 'MasterCard' | 'Visa' | 'American Express' | 'Unknown'){
    const allowedPaymentMethods = this.transport.paymentMethods.map((method: string) => method.replace('-', ' ').toLowerCase());
    const isAllowedCardType = allowedPaymentMethods.includes(cardType.toLowerCase().replace(' ', '-'));
    return isAllowedCardType;
  }

  private getCardType(cardNumber: string): 'MasterCard' | 'Visa' | 'American Express' | 'Unknown'{
    // Determinar el tipo de tarjeta basado en el número (esto es un ejemplo simplificado)
    if (/^5[1-5]/.test(cardNumber)) {
      return 'MasterCard';
    } else if (/^4/.test(cardNumber)) {
      return 'Visa';
    } else if (/^3[47]/.test(cardNumber)) {
      return 'American Express';
    } else {
      return 'Unknown';
    }
  }
}
