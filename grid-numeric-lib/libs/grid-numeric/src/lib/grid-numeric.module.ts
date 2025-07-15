import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InjectableAssetsCollection } from '@nexxe/plugin-injector';
import { GridNumericComponent } from './grid-numeric.component';
import {FormsModule} from '@angular/forms'
import { NumericPipe } from './numeric.pipe';
import { DecimaPrecisionDirective } from './numeric.directive';
import { GridCoreModule } from '@nexxe/grid-core';
import { CoreVendorsModule } from '@nexxe/core-vendors';
// Injectable Assets is a map of exposable assets [e.g. components, config, etc.], by a plugin.
// If a plugin is exposing a single component, the name could be empty to ease metadata composition.
// If a plugin is exposing multiple components, the default component could be empty but other components must specify a name.
// If a plugin is not exposing any assets, one could remove the assets collection entirely
const assets: InjectableAssetsCollection = [
  { type: 'component', name: '', asset: GridNumericComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GridCoreModule,
    CoreVendorsModule
  ],
  exports: [
    GridNumericComponent,
  ],
  declarations: [
    GridNumericComponent,
    NumericPipe,
    DecimaPrecisionDirective
  ],
  providers: [
    { provide: 'grid-numeric_assets', useValue: assets, multi: true },
  ],
  entryComponents: [
    GridNumericComponent
  ],
})
export class GridNumericModule {
  constructor() { }
}
