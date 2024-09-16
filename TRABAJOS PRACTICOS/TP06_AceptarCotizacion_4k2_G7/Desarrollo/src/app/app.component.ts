import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TransportService } from './transport-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ISW_TP6';
  ngOnInit(): void {
      
  }
}
