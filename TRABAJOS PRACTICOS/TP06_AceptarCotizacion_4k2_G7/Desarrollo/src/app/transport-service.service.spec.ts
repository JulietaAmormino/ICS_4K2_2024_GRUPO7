import { TestBed } from '@angular/core/testing';
import { TransportService } from './transport-service.service';

describe('TransportServiceService', () => {
  type NewType = TransportService;

  let service: NewType;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
