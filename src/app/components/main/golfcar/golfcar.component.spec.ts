import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GolfcarComponent } from './golfcar.component';

describe('GolfcarComponent', () => {
  let component: GolfcarComponent;
  let fixture: ComponentFixture<GolfcarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GolfcarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GolfcarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
