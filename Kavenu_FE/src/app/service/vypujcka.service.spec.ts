import { TestBed } from '@angular/core/testing';

import { VypujckaService } from './vypujcka.service';

describe('VypujckaService', () => {
  let service: VypujckaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VypujckaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
