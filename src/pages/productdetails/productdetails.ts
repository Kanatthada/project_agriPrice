import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, LoadingController, ViewController } from 'ionic-angular';
import { ProductdataProvider } from '../../providers/productdata/productdata';
import { PopoverComponent } from '../../components/popover/popover';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the ProductdetailsPage page.
 *
 *
 * 
 */

@Component({
  selector: 'page-productdetails',
  templateUrl: 'productdetails.html',
})
export class ProductdetailsPage {
  public arr_data: Data[];
  public arr_subtype: Item[];
  typeName: string;
  typeId: number;
  longitude: any;
  latitude: any;
  select: string = "date";

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public datas: ProductdataProvider, public popoverCtrl: PopoverController, public geolocation: Geolocation, private loadingCtrl: LoadingController) {
    this.typeId = this.navParams.get('id');
    this.typeName = this.navParams.get('name');
    this.datas.get_subtype(this.typeId).subscribe((response) => {
      console.log("get api data success");
      this.arr_subtype = response;
    });
   
    this.presentLoader();

  }

  presentLoader(){
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'รอสักครู่ กำลังโหลด...',
      duration: 300
    });

    loading.present();
  }

  //Show popover menu
  openPopover(event) {
    let popover = this.popoverCtrl.create(PopoverComponent, {arrData: this.arr_data, selectItem: this.select});
    popover.present({
      ev: event
    });

    popover.onDidDismiss((data, selectItem) => {
      console.log("data");
      console.log(data);
      if(data!=null){
        this.arr_data = data;
      }
      this.select = selectItem;
      return this.arr_data, this.select;
    });
  }

  ionViewDidLoad() { 
    console.log('ionViewDidLoad ProductdetailsPage');
    this.loadNearbyLocation();

  }

  loadNearbyLocation() {
    if (this.arr_data) {
      return Promise.resolve(this.arr_data);
    }
    return new Promise(resolve => {
      this.datas.get_lastUpdate().subscribe((data) => {
        this.geolocation.getCurrentPosition().then(result => {
          this.latitude = result.coords.latitude;
          this.longitude = result.coords.longitude;

          console.log(data);
          console.log(this.latitude + ", " + this.longitude);

          this.arr_data = this.applyHaversine(data, this.latitude, this.longitude);

          // this.arr_data.sort((locationA: any, locationB: any) => {
          //   return locationA.distance - locationB.distance;
          // });

          this.arr_data.sort(function (a, b) {
            var x = a.lastUpdate; 
            var y = b.lastUpdate;
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
          });

          resolve(this.arr_data);
        });
      });
    });
  }

  applyHaversine(locations, lati, lngi) {

    let usersLocation = {
      lat: lati,
      lng: lngi
    };
    console.log(usersLocation);

    locations.map((location) => {

      let placeLocation = {
        lat: location.coord_latitude,
        lng: location.coord_longitude
      };

      if (placeLocation.lat != null && placeLocation.lng != null) {
        location.distance = this.getDistanceBetweenPoints(
          usersLocation,
          placeLocation,
          'km'
        ).toFixed(2);
        //console.log(location.distance);
      } else {
        location.distance = 0;
      }
    });

    return locations;
  }

  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'km'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }

}

interface Data {
  subtype_id: number;
  subtype_name: string;
  location_name: string;
  province_name: string;
  product_price: number;
  unit_name: string;
  reference_name: string;
  lastUpdate: string;
}

interface Item {
  subtype_id: number;
  subtype_name: string;
  type_id: number;
}