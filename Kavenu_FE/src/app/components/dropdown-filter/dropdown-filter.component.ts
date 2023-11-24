import { Component, Input } from '@angular/core';
import { BaseFilterCellComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'dropdown-filter',
  templateUrl: './dropdown-filter.component.html',
  styleUrls: ['./dropdown-filter.component.css']
})
export class DropdownFilterComponent extends BaseFilterCellComponent {
   
  @Input() public override filter: CompositeFilterDescriptor = {filters: [], logic: "and"};

  @Input() public data: any[] = []
  @Input() public textField: string = ""
  @Input() public valueField: string = ""

   constructor(filterService: FilterService) {
    super(filterService);
    
   }

   public onChange(value: any): void {
    this.applyFilter(
        value === null ? // if value of the default item
            this.removeFilter(this.valueField) : // remove the filter
            this.updateFilter({ // otherwise add/modify the filter for the field with the value
                field: this.valueField,
                operator: "eq",
                value: value
            })
    ); // and update the root filter
}

    public get selectedValue(): unknown {
      const filter = this.filterByField(this.valueField);
      return filter ? filter.value : null;
    }

    public get defaultItem(): any {
      return {
          [this.textField]: "Nespecifikováno",
          [this.valueField]: null
      };
}

}
