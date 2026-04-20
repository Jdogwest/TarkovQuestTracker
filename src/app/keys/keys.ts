import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const STORAGE_KEY = 'TQTKeys';

export interface KeyItem {
  name: string;
  price: number;
}

@Component({
  selector: 'app-keys',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './keys.html',
  styleUrl: './keys.scss',
})
export class KeysPage {
  readonly keys = signal<KeyItem[]>([]);
  readonly searchQuery = signal('');

  newName = '';
  newPrice: number | null = null;

  readonly filteredKeys = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const list = this.keys();
    if (!q) {
      return list;
    }
    return list.filter((k) => k.name.toLowerCase().includes(q));
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
      const keys: KeyItem[] = [];
      for (const row of parsed) {
        if (
          row &&
          typeof row === 'object' &&
          'name' in row &&
          'price' in row &&
          typeof (row as KeyItem).name === 'string' &&
          typeof (row as KeyItem).price === 'number'
        ) {
          keys.push({ name: (row as KeyItem).name, price: (row as KeyItem).price });
        }
      }
      this.keys.set(keys);
    } catch {
      /* ignore corrupt storage */
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.keys()));
  }

  addKey(): void {
    const name = this.newName.trim();
    const price = this.newPrice;
    const n = price === null || price === undefined ? NaN : Number(price);
    if (!name || !Number.isFinite(n)) {
      return;
    }
    this.keys.update((list) => [...list, { name, price: n }]);
    this.newName = '';
    this.newPrice = null;
    this.persist();
  }

  removeKey(item: KeyItem): void {
    this.keys.update((list) => {
      const idx = list.findIndex((k) => k.name === item.name && k.price === item.price);
      if (idx === -1) {
        return list;
      }
      return list.filter((_, i) => i !== idx);
    });
    this.persist();
  }

  updateSearch(value: string): void {
    this.searchQuery.set(value);
  }
}
