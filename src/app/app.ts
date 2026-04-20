import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { KeysPage } from './keys/keys';
import { QuestsPage } from './quests/quests';

export type AppTab = 'quests' | 'keys';

@Component({
  selector: 'app-root',
  imports: [CommonModule, QuestsPage, KeysPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('TarkovTracker');
  protected readonly activeTab = signal<AppTab>('quests');

  setTab(tab: AppTab): void {
    this.activeTab.set(tab);
  }
}
