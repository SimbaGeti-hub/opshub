import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureAnalytics } from './web-feature-analytics';

describe('WebFeatureAnalytics', () => {
  let component: WebFeatureAnalytics;
  let fixture: ComponentFixture<WebFeatureAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureAnalytics],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
