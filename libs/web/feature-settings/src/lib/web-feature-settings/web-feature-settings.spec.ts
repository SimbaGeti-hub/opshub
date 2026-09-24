import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureSettings } from './web-feature-settings';

describe('WebFeatureSettings', () => {
  let component: WebFeatureSettings;
  let fixture: ComponentFixture<WebFeatureSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
