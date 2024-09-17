import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IEmailDTO {
  creditCardNumber: string;
  email: string;
  dadorCarga: string;
  transportista: string;
  calificacion: string;
  fechaRetiro: string;
  fechaEntrega: string;
  formaPago: string;
  importe: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private apiURL = `http://localhost:5000/api/Email`;
  // Datos en memoria simulando una base de datos
  transports = this.generateTransport();
  constructor(
    private _httpService: HttpClient
  ){ }
  generateTransport(){
    let transport = [];
    const pickupDate = this.getRandomDateAfterToday();
    const deliveryDate = this.getRandomDateAfterToday();
    const validDeliveryDate = deliveryDate >= pickupDate ? deliveryDate : new Date(pickupDate.getTime() + (Math.random() * 30 + 1) * 24 * 60 * 60 * 1000); // Añade entre 1 y 30 días a la fecha de recogida
    for (let index = 0; index < 6; index++) {
      const element = {
        id: index,
        name: 'Transportista ' + (index + 1),
        rating: this.getRandomRating(),
        ratingArray: Array(5).fill(1).map((x, i) => i + 1),
        pickupDate: pickupDate,
        deliveryDate: validDeliveryDate,
        price: this.generateRandomPrice(),
        paymentMethods: this.getRandomPaymentMethods(),
        state: 'Created'
      }
      transport.push(element);
    }
    return transport;
  }

  getRandomDateAfterToday(): Date {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 365); // Genera un número de días aleatorio hasta 1 año
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + randomDays);
    return futureDate;
  }

  getRandomRating(): number {
    return Math.floor(Math.random() * 5) + 1;
  }
  

  generateRandomPrice(): number {
    return Math.floor(Math.random() * (100000 - 25000 + 1)) + 25000;
  }

  getRandomPaymentMethods(): string[] {
    const paymentMethods = ['master-card', 'american-express', 'visa', 'cash-on-delivery', 'cash-on-pickup'];
    const shuffled = paymentMethods.sort(() => 0.5 - Math.random());
    
    // Asegura que al menos 3 sean devueltos
    const numberOfMethods = Math.max(3, Math.floor(Math.random() * paymentMethods.length));
    
    return shuffled.slice(0, numberOfMethods);
}


  getAllTransports() {
    return this.transports;
  }

  getTransportById(id: number) {
    console.log({tranposrtId: id, transport: this.transports})
    return this.transports.find(transport => transport.id == id);
  }
  addTransport(newTransport: any) {
    const newId = this.transports.length ? Math.max(...this.transports.map(t => t.id)) + 1 : 1;
    newTransport.id = newId;
    newTransport.price = this.generateRandomPrice();
    this.transports.push(newTransport);
  }

  updateTransport(updatedTransport: any) {
    const index = this.transports.findIndex(transport => transport.id === updatedTransport.id);
    if (index !== -1) {
      this.transports[index] = { ...this.transports[index], ...updatedTransport };
    }
  }

  deleteTransport(id: number) {
    this.transports = this.transports.filter(transport => transport.id !== id);
  }

  getRandomName(): string {
    const names = ['Fabrizio Chavez', 'Ignacio Martinoli', 'Cecilia Massano', 'Azul Talavera', 'Julieta Amormino'];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  }
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private paymentMethodMap: { [key: string]: string } = {
    'creditCard': 'Tarjeta',
    'cash-on-delivery': 'Contado contra entrega',
    'cash-on-pickup': 'Contado al retirar'
  };

  sendEmail(transport: any, paymentMethod: string, cardNumber: string = ''): Observable<any> {
    const emailDTO: IEmailDTO = { 
      creditCardNumber: cardNumber,
      email: 'fabrizioins@gmail.com',
      dadorCarga: this.getRandomName(),
      transportista: transport.name,
      calificacion: transport.rating + ' estrellas',
      fechaRetiro: this.formatDate(transport.pickupDate),
      fechaEntrega: this.formatDate(transport.deliveryDate),
      formaPago: this.paymentMethodMap[paymentMethod],
      importe: transport.price.toLocaleString('es-AR', { minimumFractionDigits: 0 })
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._httpService.post<boolean>(`${this.apiURL}/SendEmail`, emailDTO, { headers });
  }
}
