import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  provideLucideIcons,
  LucideLayoutDashboard,
  LucideListChecks,
  LucideBoxes,
  LucideUsers,
  LucideBarChart3,
  LucideFileText,
  LucideSettings,
  LucideCircleHelp,
  LucidePanelLeftOpen,
  LucidePanelLeftClose,
  LucideSearch,
  LucideSunMoon,
  LucideBell,
} from '@lucide/angular';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideLucideIcons(
          LucideLayoutDashboard,
          LucideListChecks,
          LucideBoxes,
          LucideUsers,
          LucideBarChart3,
          LucideFileText,
          LucideSettings,
          LucideCircleHelp,
          LucidePanelLeftOpen,
          LucidePanelLeftClose,
          LucideSearch,
          LucideSunMoon,
          LucideBell,
        ),
      ],
    }).compileComponents();
  });

  it('should create the app shell', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the sidebar and top nav', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('ops-sidebar')).toBeTruthy();
    expect(compiled.querySelector('ops-top-nav')).toBeTruthy();
  });
});
