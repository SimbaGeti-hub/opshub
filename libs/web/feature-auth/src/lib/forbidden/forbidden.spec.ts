import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLucideIcons, LucideShieldAlert } from '@lucide/angular';
import { Forbidden } from './forbidden';

describe('Forbidden', () => {
  it('explains the situation and links back to the dashboard', async () => {
    TestBed.configureTestingModule({
      imports: [Forbidden],
      providers: [provideRouter([]), provideLucideIcons(LucideShieldAlert)],
    });

    const fixture = TestBed.createComponent(Forbidden);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('You do not have access');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/dashboard');
  });
});
