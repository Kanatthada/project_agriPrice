import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { ProductdataProvider } from '../../providers/productdata/productdata';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  private selectItem: string;
  public data: any;

  longitude: number;
  latitude: number;
  
  arr_data: any;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public datas: ProductdataProvider, public geolocation: Geolocation) {
    console.log('Hello PopoverComponent Component');
    this.selectItem = this.navParams.get('selectItem');
    console.log(this.selectItem); 
  }


  sort() {
    console.log("sort = "+ this.selectItem);
    this.arr_data = this.navParams.get('arrData');
    //console.log("test"+this.arr_data);
    if (this.selectItem == "neardistance") {
      //this.data = this.sortLowToHigh(this.data, 'distance');
      this.data = this.arr_data.sort((locationA: any, locationB: any) => {
        return locationA.distance - locationB.distance;
      });
      console.log(this.data);
    }
    else if (this.selectItem == "fardistance") {
      //this.data = this.sortHightoLow(this.data, 'distance');
      this.data = this.arr_data.sort((locationA: any, locationB: any) => {
        return locationB.distance - locationA.distance;
      });
      console.log(this.data);
    }
    else if (this.selectItem == "date") {
      this.data = this.sortHightoLow(this.arr_data, 'lastUpdate');
      console.log(this.data);
    }
    else if (this.selectItem == "lowprice") {
      this.data = this.sortLowToHigh(this.arr_data, 'product_price');
      console.log("เรียงราคาจากต่ำไปสูง");
      console.log(this.data); 
    }
    else if (this.selectItem == "highprice") {
      this.data = this.sortHightoLow(this.arr_data, 'product_price');
      console.log("เรียงราคาจากต่ำไปสูง");
      console.log(this.data); 
    } else if(this.selectItem == null){
      this.data = this.arr_data;
    }
    this.viewCtrl.dismiss(this.data, this.selectItem);
   
  }

  sortLowToHigh(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; 
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  sortHightoLow(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; 
      var y = b[key];
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  }

  close() {
    this.viewCtrl.dismiss(this.data, this.selectItem);
  }
}
