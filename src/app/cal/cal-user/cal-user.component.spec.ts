import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalUserComponent } from './cal-user.component';

describe('CalUserComponent', () => {
  let component: CalUserComponent;
  let fixture: ComponentFixture<CalUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
