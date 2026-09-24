import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureDashboard } from './web-feature-dashboard';

describe('WebFeatureDashboard', () => {
  let component: WebFeatureDashboard;
  let fixture: ComponentFixture<WebFeatureDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
