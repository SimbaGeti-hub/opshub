import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebShell } from './web-shell';

describe('WebShell', () => {
  let component: WebShell;
  let fixture: ComponentFixture<WebShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebShell],
    }).compileComponents();

    fixture = TestBed.createComponent(WebShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
