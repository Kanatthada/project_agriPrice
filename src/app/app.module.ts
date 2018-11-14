import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { CalendarModule } from "ion2-calendar";

import { LocationPage } from '../pages/location/location';
import { SearchPage } from '../pages/search/search';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProducttypePage } from '../pages/producttype/producttype';
import { ProductdetailsPage } from '../pages/productdetails/productdetails';
import { HistoryPage } from '../pages/history/history';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { ProductdataProvider } from '../providers/productdata/productdata';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geocoder } from '@ionic-native/google-maps';

import { AccordionComponent } from '../components/accordion/accordion';
import { ThaiDatePipe } from '../pipes/thai-date/thai-date';
import { PopoverComponent } from '../components/popover/popover';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { PopoverMapComponent } from '../components/popover-map/popover-map';

@NgModule({
  declarations: [
    MyApp,
    LocationPage,
    SearchPage,
    HomePage,
    TabsPage,
    ProducttypePage,
    ProductdetailsPage,
    AccordionComponent,
    ThaiDatePipe,
    HistoryPage,
    PopoverComponent,
    PopoverMapComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      backButtonIcon: 'ios-arrow-back' ,
      backButtonText: 'ย้อนกลับ',
      pageTransition: 'ios-transition', // attention
      activator: 'ripple',
      mode: 'ios',
      tabsHideOnSubPages: true // attention
    }),
    HttpModule,
    CalendarModule,
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LocationPage,
    SearchPage,
    HomePage,
    TabsPage,
    ProducttypePage,
    ProductdetailsPage,
    HistoryPage,
    PopoverComponent,
    PopoverMapComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    GoogleMapsProvider,
    Geocoder,
    NativeGeocoder,
    LocationAccuracy,
    ProductdataProvider,
    LaunchNavigator
  ]
})
export class AppModule {}
