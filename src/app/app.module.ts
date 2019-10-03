import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VenueModelingComponent } from './venue-modeling/venue-modeling.component';
import { HeatMapsComponent } from './heat-maps/heat-maps.component';

@NgModule({
  declarations: [
    AppComponent,
    VenueModelingComponent,
    HeatMapsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
