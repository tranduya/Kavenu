import { TestBed } from '@angular/core/testing';

import { StavService } from './stav.service';

describe('StavService', () => {
  let service: StavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
