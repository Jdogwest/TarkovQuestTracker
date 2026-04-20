import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'quests' },
  {
    path: 'quests',
    loadComponent: () => import('./quests/quests').then((m) => m.QuestsPage),
  },
  {
    path: 'keys',
    loadComponent: () => import('./keys/keys').then((m) => m.KeysPage),
  },
  { path: '**', redirectTo: 'quests' },
];
