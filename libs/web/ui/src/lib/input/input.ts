import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search';

@Component({
  selector: 'ops-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1">
      @if (label()) {
        <label
          [for]="inputId()"
          class="text-sm font-medium text-[var(--color-text)]"
        >
          {{ label() }}
        </label>
      }
      <input
        [id]="inputId()"
        [type]="type()"
        [placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled()"
        [attr.aria-invalid]="!!errorMessage()"
        [attr.aria-describedby]="errorMessage() ? inputId() + '-error' : null"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="h-10 rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
        [class.border-[var(--color-border)]]="!errorMessage()"
        [class.border-[var(--color-danger)]]="!!errorMessage()"
      />
      @if (errorMessage()) {
        <span
          [id]="inputId() + '-error'"
          class="text-xs text-[var(--color-danger)]"
        >
          {{ errorMessage() }}
        </span>
      }
    </div>
  `,
})
export class Input implements ControlValueAccessor {
  label = input<string>('');
  type = input<InputType>('text');
  placeholder = input<string>('');
  errorMessage = input<string>('');
  inputId = input<string>(`ops-input-${Math.random().toString(36).slice(2)}`);

  value = signal<string>('');
  disabled = signal<boolean>(false);

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
