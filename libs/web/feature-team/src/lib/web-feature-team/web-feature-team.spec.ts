import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureTeam } from './web-feature-team';

describe('WebFeatureTeam', () => {
  let component: WebFeatureTeam;
  let fixture: ComponentFixture<WebFeatureTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureTeam],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureTeam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
