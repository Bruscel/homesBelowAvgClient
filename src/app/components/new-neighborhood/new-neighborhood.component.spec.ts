import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNeighborhoodComponent } from './new-neighborhood.component';

describe('NewNeighborhoodComponent', () => {
  let component: NewNeighborhoodComponent;
  let fixture: ComponentFixture<NewNeighborhoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewNeighborhoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewNeighborhoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
