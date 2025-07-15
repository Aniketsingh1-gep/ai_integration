import { Pipe, PipeTransform } from '@angular/core';
import { CoreNumericService } from '@nexxe/core';
@Pipe({
    name: 'numeric',
})

export class NumericPipe implements PipeTransform {

    thousandSeparator: string = '';
    decimalSeparator: string = '';
    constructor(
        private numericService: CoreNumericService
        ) {}

    transform(numModel, config) {
        if (numModel || numModel === 0) {
            try {
                let _numModel;
                if(numModel== '-'){
                    return numModel;
                }
                let newNumber = this.removeThousandSeparators(numModel, this.thousandSeparator);
                if (newNumber == null || isNaN(newNumber)) {
                    _numModel = "0"
                }
                else {
                    _numModel = numModel.toString();
                }
                let localeConfig = this.numericService.getNumericLocaleConfig();
                while (_numModel.indexOf(localeConfig.thousandSeparator) > -1) {
                    _numModel = _numModel.replace(localeConfig.thousandSeparator, '');
                }

                if (_numModel.indexOf(localeConfig.decimalSeparator) > -1) {
                    _numModel = _numModel.replace(localeConfig.decimalSeparator, '.');
                }
                let parts = _numModel.split(".");
               
                if (parts.length > 1) {
                    
                    if (config.attributes.hasOwnProperty('maxPrecision')) {
                        if (parts[1].length > config.attributes.maxPrecision) {

                            parts[1] = parts[1].substring(0, config.attributes.maxPrecision);
                        }
                    }
                    return parts.join(localeConfig.decimalSeparator);
                }
                return parts[0];
            }
            catch (err) {
            }
            return numModel;
        }
    }
    private removeThousandSeparators(value, thousandSeparator) {
        if (thousandSeparator === '.') {
            return Number(String(value).replace(/\./g, ""));
        } else if (thousandSeparator === ',') {
            return Number(String(value).replace(/,/g, ""));
        } else {
            return Number(String(value).replace(new RegExp('[\'\\s]', 'g'), ""));
        }
    }
}


