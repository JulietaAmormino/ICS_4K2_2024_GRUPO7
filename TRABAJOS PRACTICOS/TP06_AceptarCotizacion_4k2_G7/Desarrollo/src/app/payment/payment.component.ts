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
  public quoteId: number;
  public paymentMethod: string;
  public applicationForm: FormGroup;
  public creditCardNumber: FormControl;
  public creditCardOwnerName: FormControl;
  public creditCardExpiryDate: FormControl;
  public creditCardCVV: FormControl;
  public creditCardType: FormControl;
  public dni: FormControl;
  public transport: any;
  public options: string[] = ['Crédito', 'Débito'];
  public labelPosition: any;
  public isLoading: boolean = false;

  constructor(
    private _transportService: TransportService,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackbarService,
    private _router: Router
  ){
    this.quoteId = this._activatedRoute.snapshot.queryParams['quoteId'];
    this.paymentMethod = this._activatedRoute.snapshot.queryParams['paymentMethod'];
    this.transport = this._transportService.getTransportById(this.quoteId);
    if (this.paymentMethod === 'cash-on-pickup' || this.paymentMethod === 'cash-on-delivery'){
      this.isLoading = true;
      this._transportService.sendEmail(this.transport, this.paymentMethod).subscribe((res) => {
        if (res){
          this.confirmTransportState();
          this._snackbarService.showSuccessMessage('Cotización confirmada.');
          this._router.navigate(['']);
          this.isLoading = false;
        }
      })
    }

    this.applicationForm = this._formBuilder.group({
      creditCardNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
      creditCardOwnerName: new FormControl('', [Validators.required]),
      creditCardExpiryDate: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\d{2}$/)]),
      creditCardCVV: new FormControl('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
      creditCardType: new FormControl('', [Validators.required]),
      dni: new FormControl('',  [Validators.required, Validators.minLength(7)])
    }) as FormGroup;
    this.creditCardNumber = this.applicationForm.controls['creditCardNumber'] as FormControl;
    this.creditCardOwnerName = this.applicationForm.controls['creditCardOwnerName'] as FormControl;
    this.creditCardExpiryDate = this.applicationForm.controls['creditCardExpiryDate'] as FormControl;
    this.creditCardCVV = this.applicationForm.controls['creditCardCVV'] as FormControl;
    this.creditCardType = this.applicationForm.controls['creditCardType'] as FormControl;
    this.creditCardType.setValue('true');
    this.dni = this.applicationForm.controls['dni'] as FormControl;
  }

  confirmTransportState(): void{
    this.transport.state = 'Confirmed';
    this._transportService.updateTransport(this.transport);
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

    if (!this.isValidExpireDate(this.creditCardExpiryDate.value)){
      this._snackbarService.showErrorMessage('La fecha de expiracion ingresada no es valida.')
      return;
    }

    this._transportService.sendEmail(this.transport, this.paymentMethod, cardNumber).subscribe((res) => {
        if (res){
          this.confirmTransportState();
          this._snackbarService.showSuccessMessage('Cotización confirmada.');
          this._router.navigate(['home']);
        }
        if (!res){
          this._snackbarService.showWarnMessage('Tarjeta con saldo insuficiente.')
          this._router.navigate(['home']);
        }
      })
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

  private isValidExpireDate(expiryDate: string): boolean {
    // Expiry date format is MMYY
    const regex = /^(0[1-9]|1[0-2])(\d{2})$/;
    if (!regex.test(expiryDate)) {
      return false;
    }

    const month = parseInt(expiryDate.substring(0, 2), 10);
    const year = parseInt(expiryDate.substring(2), 10) + 2000;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
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
