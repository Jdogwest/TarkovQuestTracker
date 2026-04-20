import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const STORAGE_KEY = 'TQTQuests';

export interface QuestItem {
  name: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quests.html',
  styleUrl: './quests.scss',
})
export class QuestsPage {
  readonly quests = signal<QuestItem[]>([]);
  readonly searchQuery = signal('');

  readonly placeholder = `Квест1\nКвест2\nКвест3\nКвест4`;

  importText = '';
  showImport = false;

  readonly filteredQuests = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const list = this.quests();
    if (!q) {
      return list;
    }
    return list.filter((x) => x.name.toLowerCase().includes(q));
  });

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return;
      }
      const quests: QuestItem[] = [];
      for (const row of parsed) {
        if (
          row &&
          typeof row === 'object' &&
          'name' in row &&
          'isCompleted' in row &&
          typeof (row as QuestItem).name === 'string' &&
          typeof (row as QuestItem).isCompleted === 'boolean'
        ) {
          quests.push({
            name: (row as QuestItem).name,
            isCompleted: (row as QuestItem).isCompleted,
          });
        }
      }
      this.quests.set(quests);
    } catch {
      /* ignore corrupt storage */
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.quests()));
  }

  toggleImport(): void {
    this.showImport = !this.showImport;
  }

  importQuests(): void {
    const raw = this.importText;
    const names = raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (names.length === 0) {
      return;
    }
    this.quests.update((list) => {
      const existing = new Set(list.map((q) => q.name));
      const next = [...list];
      for (const name of names) {
        if (existing.has(name)) {
          continue;
        }
        existing.add(name);
        next.push({ name, isCompleted: false });
      }
      return next;
    });
    this.importText = '';
    this.persist();
  }

  toggleQuest(quest: QuestItem): void {
    this.quests.update((list) =>
      list.map((q) => (q.name === quest.name ? { ...q, isCompleted: !q.isCompleted } : q)),
    );
    this.persist();
  }

  updateSearch(value: string): void {
    this.searchQuery.set(value);
  }
}
