import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacistLoginComponent } from './pharmacist-login.component';

describe('PharmacyLoginComponent', () => {
  let component: PharmacistLoginComponent;
  let fixture: ComponentFixture<PharmacistLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacistLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacistLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
