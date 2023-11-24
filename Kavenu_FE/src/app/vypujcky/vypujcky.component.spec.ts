import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VypujckyComponent } from './vypujcky.component';

describe('VypujckyComponent', () => {
  let component: VypujckyComponent;
  let fixture: ComponentFixture<VypujckyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VypujckyComponent]
    });
    fixture = TestBed.createComponent(VypujckyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
