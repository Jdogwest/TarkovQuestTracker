import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  /** Доля выполнения, 0–100 */
  readonly percent = input.required<number>();

  readonly clampedPercent = computed(() => {
    const v = this.percent();
    if (!Number.isFinite(v)) {
      return 0;
    }
    return Math.min(100, Math.max(0, v));
  });
}
