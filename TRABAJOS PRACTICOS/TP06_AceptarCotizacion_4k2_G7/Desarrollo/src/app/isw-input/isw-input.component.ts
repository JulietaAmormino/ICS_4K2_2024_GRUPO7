import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputControl } from './input-control';

@Component({
  selector: 'isw-input',
  templateUrl: './isw-input.component.html',
  styleUrls: ['./isw-input.component.css']
})
export class ISWInputComponent implements OnInit {
  @Input() data: InputControl = new InputControl();
  @Input() control?: FormControl<any>;
  
  public hideTooltipDelay = new FormControl(60000);
  public isDisabled: boolean = false;
  
  
  ngOnInit(): void {
    if (this.data?.disabled) this.isDisabled = this.data.disabled;
  }

  public getValidationError() {
    const [errorKey, errorValue] = Object.entries(this.control?.errors || [null, null])?.[0];
    if (!errorKey) return null;
   
    switch (errorKey){
      case 'required':
        return `*Campo requerido.`
      case 'minlength':
        return `El minimo de caracteres requerido es ${errorValue.requiredLength}`
      case 'maxlength':
        return `El maximo de caracteres disponible es ${errorValue.requiredLength}`
      case 'email':
        return `Ingresa correctamente tu email.`
      case 'passwordStrength':
        return `Ingresa una contraseña segura.`
      case 'numberError':
        return `Revisar los valores.`
      case 'pattern':
        return this.getPatternErrorMessage(errorValue.requiredPattern)
      default:
        return errorValue?.message;
    }
  }

  private getPatternErrorMessage(pattern: string | undefined): string {
    console.log(pattern)
    if (!pattern) return 'NADA'
    if (pattern === "/^(0[1-9]|1[0-2])\\d{2}$/")
      return 'La fecha de expiración debe tener el formato MM/AAAA.'
    else if (pattern === "/^\\d{16}$/")
      return 'La tarjeta de crédito debe tener 16 caracteres.'
    else if (pattern === '/^\\d{3,4}$/')
      return 'El CVV debe tener 3 o 4 dígitos.'
    return ''
  }
}
