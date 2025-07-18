/**
 * GridNumericComponent
 * -------------------
 * A reusable numeric input component for grid cells, supporting locale-aware decimal separators, min/max value constraints,
 * precision control, and integration with ag-Grid. It provides validation, formatting, and event hooks for grid editing workflows.
 *
 * Usage:
 *   <grid-numeric-component></grid-numeric-component>
 *
 * Key Features:
 * - Locale-aware decimal separator
 * - Min/Max value and precision enforcement
 * - Handles keyboard and paste events for numeric input
 * - Integrates with ag-Grid editing lifecycle
 * - Emits onChange and onBlur events for parent grid
 *
 * @example
 * // In ag-Grid column definition:
 * {
 *   field: 'amount',
 *   cellEditorFramework: GridNumericComponent,
 *   cellEditorParams: {
 *     config: { minValue: 0, maxValue: 100, maxPrecision: 2 }
 *   }
 * }
 */
import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ViewContainerRef, TemplateRef, Renderer2, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { INumeric } from './grid-numeric-interface';
import { CoreNumericService } from '@nexxe/core';
import { CellService, ICellProperties } from '@nexxe/grid-core';
import { Subscription } from 'rxjs';
import { coreVendors } from '@nexxe/core-vendors';
@Component({
  selector: 'grid-numeric-component',
  templateUrl: './grid-numeric.component.html',
  styleUrls: ['./grid-numeric.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GridNumericComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Reference to the numeric input element */
  @ViewChild('input', { static: true }) input: ElementRef;
  /** ag-Grid params object */
  public params: any;
  /** Numeric configuration object */
  public config: INumeric;
  /** Local value for ngModel binding */
  public localData: any;
  /** Locale-specific decimal separator */
  public decimalSeparator = '';
  /** Maximum allowed decimal precision */
  public maxPrecision;
  /** Value in standard (non-locale) format */
  public valueInStandardFormat: any;
  /** Tracks if a keydown event is in progress */
  private isKeyDownEvent: boolean = false;
  /** Grid identifier */
  gridId: string;
  /** Cell identifier */
  cellId: string;
  /** Subscription for cell property changes */
  subscription: Subscription = new Subscription();
  /** Initial value for change detection */
  initialValue: number;

  constructor(private renderer: Renderer2,
    private numericService: CoreNumericService,
    private cellService: CellService,
    private cdRef: ChangeDetectorRef
  ) { }

  /**
   * Angular lifecycle: OnInit
   */
  ngOnInit() { }

  /**
   * ag-Grid init method. Sets up config, locale, and cell properties.
   * @param params ag-Grid cell editor params
   */
  agInit(params): void {
    this.params = params;
    this.initialValue = this.params.value;
    this.config = coreVendors.lodash.cloneDeep(this.params.config);
    this.gridId = this.params.gridId;
    this.cellId = `${this.params.data.rowId}-${this.params.colDef.columnId}`;
    // this.getNumericConfig();
    this.setSeparatorByLocale();
    this.localData = this.validateDecimalSeparator(this.params.value); // Fixed typo
    if (this.config.defaultValue != undefined && this.config.defaultValue === "") {
      this.config.defaultValue = ""
    } else {
      this.config.defaultValue = this.config.defaultValue ? this.config.defaultValue : 0;
    }
    this.applyCellProps(this.cellService.get(this.gridId, this.cellId))
    this.setMaxPrecision();
  };

  /**
   * Subscribes to cell property changes for dynamic updates.
   */
  subscribe() {
    this.subscription.add(this.cellService.subscribe(this.gridId, this.cellId, this.applyCellProps.bind(this)));
  }

  /**
   * Applies cell properties (e.g., min/max/precision) from grid service.
   * @param cellProps Cell property object
   */
  applyCellProps(cellProps: ICellProperties) {
    if(cellProps && cellProps.numeric){
      this.config.attributes = Object.assign(this.config.attributes, cellProps.numeric);
      this.cdRef.detectChanges();
    }
  }

  /**
   * Sets the maximum decimal precision allowed for this cell.
   */
  setMaxPrecision() {
    let cellProperties = this.cellService.get(this.params.gridId, this.cellId);
    this.maxPrecision = (cellProperties && cellProperties.maxPrecision != undefined) ? cellProperties.maxPrecision : Number(this.config.attributes.maxPrecision);
  }

  /**
   * Sets the decimal separator based on the current locale.
   */
  setSeparatorByLocale() {
    let localeConfig = this.numericService.getNumericLocaleConfig();
    this.decimalSeparator = localeConfig.decimalSeparator;
  }

  /**
   * Converts the decimal separator in the value to the locale-specific separator.
   * @param value The value to convert.
   */
  validateDecimalSeparator(value: any) {
    if (value == undefined) return;
    return String(value).replace('.', this.decimalSeparator);
  }

  /**
   * Returns the parsed value, converting to string '0' if value is 0 for ag-grid compatibility.
   */
  getValue(): any {
    let value: number = this.parseValue();
    return (value === 0) ? "0" : value;
  };

  /**
   * Angular lifecycle: AfterViewInit. Focuses the input after view is initialized.
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.input.nativeElement.focus();
    });
  }

  /**
   * Programmatically sets focus to the numeric input.
   */
  setFocus() {
    this.renderer.selectRootElement('#myInputNumeric').focus();
  }

  /**
   * Handles focus out event, blurs input and stops grid editing.
   */
  focusOut() {
    this.renderer.selectRootElement('#myInputNumeric').blur();
    this.params.api.stopEditing();
  }

  /**
   * Handles ngModel changes, validates value and triggers onChange event if present.
   * @param event New value from input
   */
  ngModelChange(event) {
    const lastValue = this.localData;
    this.localData = event;
    let value: number = this.parseValue();

    if (!this.isKeyDownEvent && value != null && ((value > Number(this.config.attributes.maxValue)) || (value < Number(this.config.attributes.minValue)))) {
      setTimeout(() => {
        this.localData = lastValue;
        value = this.parseValue();
        this.cdRef && this.cdRef.detectChanges();
      });
      return;
    }

    this.params.value = value;
    (this.config.events && this.config.events.onChange) &&
      this.params.gridService[this.config.events.onChange](this.params, value);
  }

  /**
   * Parses the localData to a number, handling decimal separator and NaN cases.
   */
  parseValue() {
    if (this.localData === undefined) return this.localData;
    if (this.localData === "" || this.localData == null) return null;
    if (this.localData == "0") return 0;

    let parsedvalue: any = this.localData;
    parsedvalue = String(this.localData).replace(this.decimalSeparator, ".");
    parsedvalue = parsedvalue % 1 === 0 ? parseInt(parsedvalue) : parseFloat(parsedvalue);
    parsedvalue = isNaN(parsedvalue) ? null : parsedvalue;

    return parsedvalue;
  }


  doSomething() { 
    console.log("Doing Something")
  }

  doSomething2() { 
    console.log("Doing Something 2")
  }

  /**
   * Restricts key input to valid numeric values, including locale decimal separator and minus sign.
   * Handles max/min value and precision enforcement.
   * @param keydownEvent Keyboard event
   */
  restrictkey(keydownEvent: any) {
    if (keydownEvent.keyCode == null) {
      this.isKeyDownEvent = false;
      return;
    } else {
      this.isKeyDownEvent = true;
    }

    if (keydownEvent.keyCode == 13) {
      this.params.stopEditing();
      return;
    }

    const numericValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let currValue = keydownEvent.currentTarget['value'];
    let ctrlKey = keydownEvent.ctrlKey ? keydownEvent.ctrlKey : ((keydownEvent['keyCode'] === 17) ? true : false);

    if (
      keydownEvent['keyCode'] === 8 || keydownEvent['keyCode'] === 9 || keydownEvent['keyCode'] === 46 ||
      keydownEvent['keyCode'] === 37 || keydownEvent['keyCode'] === 39 ||
      (ctrlKey && [67, 86, 88, 65].includes(keydownEvent['keyCode']))
    ) {
      // Allow backspace, tab, delete, arrows, ctrl+c/v/x/a
    } else if (keydownEvent['key'] === '-') {
      if (
        this.config.attributes.restrictMinus ||
        currValue < 0 ||
        currValue.indexOf("-") != -1 ||
        currValue == "-"
      ) {
        keydownEvent.preventDefault();
      }
    } else if (keydownEvent['key'] == this.decimalSeparator) {
      if (parseInt(currValue) < Number(this.config.attributes.minValue)) {
        keydownEvent.preventDefault();
      }
      if (
        currValue.indexOf(this.decimalSeparator) != -1 ||
        currValue == '-' ||
        this.maxPrecision == 0
      ) {
        keydownEvent.preventDefault();
      }
    } else if (
      !(keydownEvent['keyCode'] >= 48 && keydownEvent['keyCode'] <= 57) &&
      !(keydownEvent['keyCode'] >= 96 && keydownEvent['keyCode'] <= 105)
    ) {
      if (keydownEvent.code == "Enter") {
        this.params.api.stopEditing();
      } else {
        keydownEvent.preventDefault();
      }
    } else if (!numericValues.includes(keydownEvent['key'])) {
      keydownEvent.preventDefault();
    }

    let newValue = this.extractNumber(
      this.insert(currValue, keydownEvent.target.selectionStart, 0, keydownEvent['key'])
    );
    // Preventing if number is less or greater than config mentioned values
    if (
      ![8, 46].includes(keydownEvent.keyCode) &&
      (Number(this.config.attributes.maxValue) || Number(this.config.attributes.minValue))
    ) {
      if (
        (newValue > Number(this.config.attributes.maxValue)) ||
        (newValue < Number(this.config.attributes.minValue))
      ) {
        keydownEvent.preventDefault();
      }
    }
    // Prevent typing if precision is already reached
    let newValueParts = newValue.toString().split(this.decimalSeparator);
    let parts = currValue.split(this.decimalSeparator);
    if (parts[0].startsWith("0") && parts[0].length > 1) {
      parts[0] = parts[0].replace(/^0+/, '');
    }
    if (
      newValueParts[0] == parts[0] &&
      parts.length > 1 &&
      parts[1].length >= this.maxPrecision &&
      (!([8, 9, 37, 39, 46, 65, 67, 86, 99].includes(keydownEvent['keyCode'])) ||
        (keydownEvent['keyCode'] == 99 && keydownEvent['code'] == 'Numpad3'))
    ) {
      keydownEvent.preventDefault();
    }
  }

  /**
   * Utility to insert a substring into a string at a given position.
   */
  insert(string, start, delCount, newSubStr) {
    return string.slice(0, start) + newSubStr + string.slice(start + Math.abs(delCount));
  }

  /**
   * Utility to extract a number from a string, converting locale decimal separator to '.'
   */
  extractNumber(_numModel) {
    if (_numModel.indexOf(this.decimalSeparator) > -1) {
      _numModel = _numModel.split(this.decimalSeparator).join('.');
    }
    return parseInt(_numModel);
  }

  /**
   * Handles paste event, validates pasted content for numeric and precision constraints.
   * @param event Clipboard event
   */
  onPaste(event: ClipboardEvent) {
    let validContent: string;
    let clipboardData = event.clipboardData;
    if (!clipboardData) {
      event.preventDefault();
      return;
    }
    let pastedText = clipboardData.getData('text');
    if (/[\n]/.test(pastedText)) {
      pastedText = pastedText.replace(/(\r\n|\n|\r)/gm, '');
    }
    let separator = this.decimalSeparator == "." ? "\\." : this.decimalSeparator;
    let regex = new RegExp(`^-?\\d*${separator}?\\d{0,${this.maxPrecision}}$`);
    validContent = (this.localData || '').toString().concat(pastedText);
    if (
      isNaN(Number(pastedText)) ||
      (this.config.attributes.restrictMinus == true && parseInt(validContent) < 0) ||
      parseInt(validContent) < Number(this.config.attributes.minValue) ||
      parseInt(validContent) > Number(this.config.attributes.maxValue) ||
      !regex.test(validContent)
    ) {
      event.preventDefault();
    }
  }

  /**
   * Checks if the cell is marked as mandatory in the column definition.
   */
  checkIsMandatory() {
    return this.params.colDef.isMandatory;
  }

  /**
   * ag-Grid refresh method (not used).
   */
  refresh(): boolean {
    return false;
  }

  /**
   * Angular lifecycle: OnDestroy. Updates value and triggers onBlur event if value changed.
   */
  ngOnDestroy(): void {
    let num = this.parseValue();
    if (this.initialValue !== num) {
      this.params.value = num;
      this.params.column && this.params.node.setDataValue(this.params.column, (num === 0 ? "0" : num));
      (this.config.events && this.config.events.onBlur) && this.params.gridService[this.config.events.onBlur](this.params, num);
    }
    this.subscription && this.subscription.unsubscribe();
  }
}
