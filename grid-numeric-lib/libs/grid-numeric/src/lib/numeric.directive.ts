import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[numericPrecision]'
})
export class DecimaPrecisionDirective {
  @Input('input') input: any;
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete', 'Control', 'c', 'v', 'a', 'x'];
  constructor(private el: ElementRef) {
  }

  ngOnInit(){
    this.el.nativeElement.addEventListener('keydown', this.onKeyDown.bind(this));
    this.el.nativeElement.addEventListener('paste', this.onpaste.bind(this));
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('keydown', this.onKeyDown.bind(this));
    this.el.nativeElement.removeEventListener('paste', this.onpaste.bind(this));
  }

  onKeyDown(event: KeyboardEvent) {
    this.precisionCheck(event);
  }

  onpaste(event: ClipboardEvent) {
    this.precisionCheck(event);
  }

  precisionCheck(event) {
    let maxPrecision = this.input.attributes.maxPrecision;
    let str = `^-?\\d*\\.?\\d{0,${maxPrecision}}$`;
    let regex: RegExp = new RegExp(str);

    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position),
    event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
  }
}