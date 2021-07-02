import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistermComponent } from './registerm.component';

describe('RegistermComponent', () => {
  let component: RegistermComponent;
  let fixture: ComponentFixture<RegistermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistermComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
