import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureReports } from './web-feature-reports';

describe('WebFeatureReports', () => {
  let component: WebFeatureReports;
  let fixture: ComponentFixture<WebFeatureReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureReports],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
