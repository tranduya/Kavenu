import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PozadavkyComponent } from './pozadavky.component';

describe('PozadavkyComponent', () => {
  let component: PozadavkyComponent;
  let fixture: ComponentFixture<PozadavkyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PozadavkyComponent]
    });
    fixture = TestBed.createComponent(PozadavkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
