import { TestBed } from '@angular/core/testing';

import { CalService } from './cal.service';

describe('CalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalService = TestBed.get(CalService);
    expect(service).toBeTruthy();
  });
});
