import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsLeadComponent } from './results-lead.component';

describe('ResultsLeadComponent', () => {
  let component: ResultsLeadComponent;
  let fixture: ComponentFixture<ResultsLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
