import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() color: string = 'white';
  @Input() backgroundColor: string = 'gray';
  @Input() type: string = 'button';
  @Output() click = new EventEmitter();
  @Input() isDisabled = false;

  onClick() {
    this.click.emit();
  }
}
