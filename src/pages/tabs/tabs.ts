import { Component } from '@angular/core';

import { LocationPage } from '../location/location';
import { SearchPage } from '../search/search';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = LocationPage;
  tab3Root = SearchPage;
  //tab4Root = LocationPage;

  constructor() {

  }
}
