import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { AppRoutingModule } from './app-routing.module';
import { QuoteListComponent } from './quote-list/quote-list.component';
import { ISWInputComponent } from './isw-input/isw-input.component';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { PaymentComponent } from './payment/payment.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
@NgModule({
  declarations: [
    AppComponent,
    PaymentMethodsComponent,
    QuoteListComponent,
    ISWInputComponent,
    PaymentComponent,
    HomeComponent,
    SnackbarComponent
  ],
  imports: [
    MatCardModule,
    AppRoutingModule,
    CommonModule,
    MatButtonModule,
    NgxMaskDirective,
    MatIconModule,
    MatToolbarModule,
    NgxMaskPipe,
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    RouterModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatDialogModule,
  ],
  providers: [
    provideNgxMask(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
