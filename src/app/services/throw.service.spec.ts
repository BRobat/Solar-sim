import { TestBed } from '@angular/core/testing';

import { ThrowService } from './throw.service';

describe('ThrowService', () => {
  let service: ThrowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThrowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
