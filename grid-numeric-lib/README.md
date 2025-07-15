# GridNumericLib

This project was generated with [@nexxe/schematics](https://github.com/GEP-GitHub/nexxe.ng) version 0.0.0-alpha.5.

## General info
This is a common Grid-numeric plugin which should be used in only Grid.

### Metadata
"nexxe.grid-numeric": {
    "importAs": "@nexxe/grid-numeric",
    "versions": {
      "0.0.0-next.2": {
        "id": "nexxe.grid-numeric@0.0.0-next.2",
        "path": "assets/plugins/packages/components/grid-numeric/0.0.0-next.2/",
        "assetsKey": "grid-numeric_assets",
        "deps": {
          "nexxe.plugin-injector": {
            "version": "0.0.1-alpha.6",
            "order": "0"
          },
          "nexxe.core-types": {
            "version": "0.0.1-alpha.43",
            "order": "1"
          },
          "nexxe.core": {
            "version": "0.0.1-alpha.38",
            "order": "2"
          },
          "nexxe.core-vendors": {
            "version": "0.0.7",
            "order": "3"
          }
        }
      }
    }
  }

  ## Config Interface

```javascript 

export interface INumeric {
    attributes: INumericAttributes;
    defaultValue?: any;
    events?: {
        onChange?: any,
        onBlur?: any
    }
}
export interface INumericAttributes {
    maxPrecision: number ;
    minPrecision: number ;
    minValue: number ;
    maxValue?: number ;
    restrictMinus: boolean ;   
}

```
## Sample config
```javascript 

"config":{
"defaultValue":"-",
"attributes": {
        "maxPrecision": 2 ,
        "minPrecision": 2 ,
        "minValue": 0,
        "maxValue": 999,
        "restrictMinus": true 
        },
"events": {
        "onChange": "onReferSelect",
        "onBlur": "onReferSelect"
    }                                                               
}

```

## Version
## `Version: 3.0.24`
>* Ticket: GBFORM-4505
>* the field is not deleted if there is a minimum value
>* Author: <raul.aruncutean@gep.com>

## `Version: 3.0.23`
>* Ticket: GBFORM-4373
>* add check for maxValue
>* Author: <raul.aruncutean@gep.com>

## `Version: 3.0.22`
>* Ticket: GBFORM-4426
>* Tab keycode added into condition
>* Author: <levente.barabas@gep.com>

## `Version: 3.0.21`
>* Ticket: CADP-2256
>* Fixed runtime column undefined issue
>* Author: <ayden.xiao@gep.com>

## `Version: 3.0.20`
>* Ticket: GBFORM-4339
>* style grid numeric based on new ux requirements (fix bordering)
>* Author: <ionut.chioran@gep.com>

## `Version: 3.0.19`
>* Ticket: GBFORM-4128
>* added value checking in ngOnDestroy
>* Author: <raul.aruncutean@gep.com>

## `Version: 3.0.18`
>* Ticket: GBFORM-4019
>* Fix undefined localData converting to string
>* Author: <levente.barabas@gep.com>

## `Version: 3.0.17`
>* Ticket: GBFORM-2986
>* Fixed key restriction irrespective of the language of the user/keyboard
>* Author: <irina.marginean@gep.com>

## `Version: 3.0.16`
>* GBFORM-2453
>* `Issue` : if the user enters a number for example "01.2233" that starts with 0, the decimal precision is not applied
>* `Resolution` : newValueParts[0] == parts[0] the problem is that newValueParts[0] is "1" and parts[0] is "01" and they will never be equal the solution is to remove "0"
>* `Author`: <raul.aruncutean@gep.com>

## `Version: 3.0.15`
>* GBFORM-2453
>* `Issue` : if the user pastes the contents of a cell in excel, the string will contain it \r\n
>* `Resolution` : remove from the end of the string
>* `Author`: <raul.aruncutean@gep.com>

## `Version: 3.0.14`
>* GBFORM-1897
>* `Issue` : If user removed value from input it returning empty string("").
>* `Resolution` : When user removed value it should return NULL and datamodel also contains NULL value.
>* `Author`: <sushant.ghorpade@gep.com>

## `Version: 3.0.13`
>* CLI-433585
>* `Issue` : If maxprecision is already reached in the number and user tries to update the number before decimal, then it does not update.
>* `Resolution` : Modififed the restrictKey method to compare the newvalue and previous value of the left side of the number i.e. before decimal.
>* `Author`: <sanket.sawla@gep.com>


## `Version: 3.0.12`
>* GBFORM-1433
>* `Issue` : If decimal seprator is other than (.) then grid numeric changing data model value also.
>* `Resolution` : When decimal seprator is (,) or other, Then we are not changing data model value.
>* `Example` : 1] If value is (1,12) then datamodel should remains (1.12) standard parsed value.
>* `Author`: <sushant.ghorpade@gep.com>


## `Version: 3.0.11`
>* CLI-415320
>* `Issue` : Paste event is not working for editors with config "restrictMinus" as true
>* `Resolution` : Check if final parsed value is less than 0 before restricting

## `Version: 3.0.10`
>* GBFORM-1397, CLI-411151
>* `Issue` : When decimal seprator is (,) then it parsing value wrongly like for ex. value = "1,12" it will parsed as number 1 .   
>* `Resolution` :
>* 1. Created common function for parsing string into number. 
>* 2. When decimal seprator is (,) we are not parsing value its returns original value (in string format).
>* `Note` : If decimal seprator is (,) then team needs to parse and handle operations on their end(Replacing (,) with (.) and use for mathematical operations).  

## `Version: 3.0.9`
>* GBFORM-1338, GBFORM-1351
>* `Issue` : When cell is empty its showing "NaN" 
>* `Resolution` : Added "isNaN()" check in ngOnDestroy() and ngModelChange().

## `Version: 3.0.8`
>* GBFORM-1209
>* Added Mandatory check for grid-numeric.
## version Author
>* <cristina.mierla@gep.com>

## `Version: 3.0.7`
>* GBFORM-1142,CLI-395646
>* Moved "params.setDataValue()" from ngModelChange() to ngonDestroy() to call cellValueChanged function on focus out for grid validation. 

## `Version: 3.0.3`
>* GBFORM-1036
>* Capability to add numeric precision for a specific Cell

## 0.0.0-next.10
>* GBFORM-438
>* sync from v3.x for maxPrecision check
## 0.0.0-next.9
>* GBUIPL-4063
>* valueInStandardFormat gets initialized inside agOnInit.
## 0.0.0-next.8
>* GBUIPL-3863
>* decimal separator formatting when typing based on the user culture.
## version Author
>* <sonia.pojoga@gep.com>

## 0.0.0-next.7
>* CLI-331457
>* added stopEditing() for keydown Enter key.

## version Author
>* <Aakash.Padhy@gep.com>

## 0.0.0-next.3
>* GBUIPL-3433
>* implementation to show empty defaultValue (in previous version if defalutvalue was empty then it was shown as '0').

## version Author
>* <rajshekhar.humbe@gep.com>

## 0.0.0-next.2
>* NP-2453
>* Added new property in interface for defaultValue.

## version Author
>* <sushant.ghorpade@gep.com>

## 0.0.0-next.1
>* New numeric attribute plugin for grid.
>* This Numeric plugin only handles numeric values (0-9).
>* This plugin allowed to enter minus ( - ) sign before the number or decimal point between the number. 

## version Author
>* <sushant.ghorpade@gep.com>
