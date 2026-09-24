import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebFeatureUsers } from './web-feature-users';

describe('WebFeatureUsers', () => {
  let component: WebFeatureUsers;
  let fixture: ComponentFixture<WebFeatureUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureUsers],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
