import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoPagoSelectorComponent } from './metodo-pago-selector';

describe('MetodoPagoSelectorComponent', () => {
  let component: MetodoPagoSelectorComponent;
  let fixture: ComponentFixture<MetodoPagoSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetodoPagoSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetodoPagoSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
