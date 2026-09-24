import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureAudit } from './web-feature-audit';

describe('WebFeatureAudit', () => {
  let component: WebFeatureAudit;
  let fixture: ComponentFixture<WebFeatureAudit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureAudit],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureAudit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
