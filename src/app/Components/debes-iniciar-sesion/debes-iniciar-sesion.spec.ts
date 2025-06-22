import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebesIniciarSesion } from './debes-iniciar-sesion';

describe('DebesIniciarSesion', () => {
  let component: DebesIniciarSesion;
  let fixture: ComponentFixture<DebesIniciarSesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebesIniciarSesion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebesIniciarSesion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
