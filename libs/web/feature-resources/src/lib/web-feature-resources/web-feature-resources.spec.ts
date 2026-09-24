import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureResources } from './web-feature-resources';

describe('WebFeatureResources', () => {
  let component: WebFeatureResources;
  let fixture: ComponentFixture<WebFeatureResources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureResources],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureResources);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
