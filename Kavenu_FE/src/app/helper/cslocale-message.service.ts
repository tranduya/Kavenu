import {Injectable} from '@angular/core';
import {MessageService} from '@progress/kendo-angular-l10n';

type tmsg = {
  [key: string]: string
}

const messages : tmsg = {
  'kendo.grid.filterContainsOperator': 'Obsahuje',
  'kendo.grid.filterEndsWithOperator': 'Končí',
  'kendo.grid.filterEqOperator': 'Rovná se',
  'kendo.grid.filterNotContainsOperator': 'Neobsahuje',
  'kendo.grid.filterNotEqOperator': 'Nerovná se',
  'kendo.grid.filterStartsWithOperator': 'Začíná',
  'kendo.grid.noRecords': 'Žádné výsledky',
  'kendo.grid.filterClearButton': 'Zrušit',
  'kendo.grid.filterAfterOrEqualOperator': 'Novější nebo se rovná',
  'kendo.grid.filterBeforeOrEqualOperator': 'Starší nebo se rovná',
  'kendo.grid.pagerItems': 'položek',
  'kendo.grid.pagerOf': 'z',
  'kendo.grid.pagerFirstPage': 'Přejít na první stránku',
  'kendo.grid.pagerLastPage': 'Přejít na poslední stránku',
  'kendo.grid.pagerNextPage': 'Přejít na další stránku',
  'kendo.grid.pagerPreviousPage': 'Přejít na předchozí stránku',
  'kendo.grid.pagerItemsPerPage': 'položek na stránku',
};

@Injectable()
export class CSLocaleMessageService extends MessageService {

  override get(key: string): string {
    return messages[key];
  }

}
