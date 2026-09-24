import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureNotifications } from './web-feature-notifications';

describe('WebFeatureNotifications', () => {
  let component: WebFeatureNotifications;
  let fixture: ComponentFixture<WebFeatureNotifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureNotifications],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureNotifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
