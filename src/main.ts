import { provideZonelessChangeDetection } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideHttpClient } from '@angular/common/http';
import { RecentMatchesComponent } from './app/recent-matches.component';
import { RankingTableComponent } from './app/ranking-table.component';
import { AllMatchesComponent } from './app/all-matches.component';

(async () => {
  const app = await createApplication({
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(),
    ]
  });
  
  const recentMatchesElement = createCustomElement(RecentMatchesComponent, {
    injector: app.injector,
  });

  const rankingTableElement = createCustomElement(RankingTableComponent, {
    injector: app.injector,
  });
  const allMatchesElement = createCustomElement(AllMatchesComponent, {
    injector: app.injector,
  });

  customElements.define('recent-matches-widget', recentMatchesElement);
  customElements.define('all-matches-widget', allMatchesElement);
  customElements.define('ranking-table-widget', rankingTableElement);
})();
