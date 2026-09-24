import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureTasks } from './web-feature-tasks';

describe('WebFeatureTasks', () => {
  let component: WebFeatureTasks;
  let fixture: ComponentFixture<WebFeatureTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureTasks],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureTasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
