import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {

  @Input() type: "combo" | "list" = "combo"
  @Input() data: string[] = []
  @Input() label: string = ""
  // TODO: Přidat default value
  @Input() defaultValue: string = ""

  @Output() valueChangeEvent = new EventEmitter<string>();

  selectValue(value: string) {
    this.valueChangeEvent.emit(value)
  }
} 