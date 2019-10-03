import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueModelingComponent } from './venue-modeling.component';

describe('VenueModelingComponent', () => {
  let component: VenueModelingComponent;
  let fixture: ComponentFixture<VenueModelingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueModelingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueModelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
