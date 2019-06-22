import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacistHomeComponent } from './pharmacist-home.component';

describe('PharmacyComponent', () => {
  let component: PharmacistHomeComponent;
  let fixture: ComponentFixture<PharmacistHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacistHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacistHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
