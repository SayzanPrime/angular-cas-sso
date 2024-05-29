import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotProtectedComponent } from './not-protected.component';

describe('NotProtectedComponent', () => {
  let component: NotProtectedComponent;
  let fixture: ComponentFixture<NotProtectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotProtectedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotProtectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
