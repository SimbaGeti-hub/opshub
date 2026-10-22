import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
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
  LucideLogOut,
} from '@lucide/angular';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: OidcSecurityService,
          useValue: {
            userData$: of({ userData: { name: 'Test User' } }),
            logoff: () => of(null),
          },
        },
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
          LucideLogOut,
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
