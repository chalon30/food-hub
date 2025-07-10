import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoExito } from './pago-exito';

describe('PagoExito', () => {
  let component: PagoExito;
  let fixture: ComponentFixture<PagoExito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoExito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoExito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
