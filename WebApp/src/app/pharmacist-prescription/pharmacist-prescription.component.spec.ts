import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacistPrescriptionComponent } from './pharmacist-prescription.component';

describe('PharmacistPrescriptionComponent', () => {
  let component: PharmacistPrescriptionComponent;
  let fixture: ComponentFixture<PharmacistPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacistPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacistPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
