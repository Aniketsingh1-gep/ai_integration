import { INumericProps } from '@nexxe/grid-core';

export interface INumeric {
    attributes: INumericProps;
    defaultValue?: any;
    events?: {
        onChange?: any,
        onBlur?: any
    }
}