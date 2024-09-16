import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ISWInputComponent } from './isw-input.component';

describe('IswInputComponent', () => {
  let component: ISWInputComponent;
  let fixture: ComponentFixture<ISWInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ISWInputComponent]
    });
    fixture = TestBed.createComponent(ISWInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
