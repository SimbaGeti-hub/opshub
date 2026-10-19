import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureAuth } from './web-feature-auth';

describe('WebFeatureAuth', () => {
  let component: WebFeatureAuth;
  let fixture: ComponentFixture<WebFeatureAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureAuth],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
