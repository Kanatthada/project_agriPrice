import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, Platform } from 'ionic-angular';
import { PopoverMapComponent } from '../../components/popover-map/popover-map';
import { Geolocation } from '@ionic-native/geolocation';
import { ProductdataProvider } from '../../providers/productdata/productdata';
import * as L from 'leaflet';

declare var google: any;

@Component({
  selector: 'page-location',
  templateUrl: 'location.html'
})

export class LocationPage {

  location: string = "pin";
  isAndroid: boolean = false;

  @ViewChild('map') mapContainer: ElementRef;
  map: any;

  select: string = "near";
  latitude: number;
  longitude: number;

  place: any[];
  public arr_data: Data[];
  dataTemp: any[] = [];
  address: string;

 

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public viewCtrl: ViewController, public geolocation: Geolocation, public datas: ProductdataProvider, public platform: Platform) {
    this.isAndroid = platform.is('android');


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
    this.getLatLng();
    this.arr_data = this.getNearest();
    console.log(this.arr_data);
    this.loadmap();
  }

  doRefresh(refresher){
    this.getLatLng();
    this.loadmap();
    refresher.complete();
  }

  // ionViewDidEnter() {
  //   this.loadmap();
  //   }

  getLatLng() {
    let options = { timeout: 10000, enableHighAccuracy: true, maximumAge: 3600 };
    this.geolocation.getCurrentPosition(options).then(result => {
      this.latitude = result.coords.latitude;
      this.longitude = result.coords.longitude;

      this.getCurrAddress(this.latitude, this.longitude);
    });
  }

  getCurrAddress(latitude, longitude) {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(latitude, longitude);
    let request = {
      latLng: latlng
    };
    geocoder.geocode(request, (data, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (data[0] != null) {
          this.address = data[0].formatted_address;
          console.log(data[0]);
          console.log("address is: " + this.address);
        } else {
          console.log("No address available");
        }
      }
    });
    return this.address;
  }

  //Show popover menu
  openPopover(event) {
    let allData = this.getSortLocation();
    let popover = this.popoverCtrl.create(PopoverMapComponent, { arrData: allData, selectItem: this.select });
    popover.present({
      ev: event
    });

    popover.onDidDismiss((data, selectItem) => {
      console.log("data");
      console.log(data);
      if (data != null) {
        this.arr_data = data;
        this.select = selectItem
      }
      this.dataTemp = this.arr_data;
      return this.arr_data, this.select;

    });

  }

  getNearest() {
    var arr = this.loadNearbyLocation();
    let data = [];
    arr.then(value => {
      console.log(value);
      for (let i in value) {
        if (value[i].distance <= 30) {
          data[i] = value[i];
        }
      }
      if (data.length == 0) {
        for (let i = 0; i < 5; i++) {
          data[i] = value[i];
        }
      }
    });
    return data;
  }

  getSortLocation() {
    var data = this.loadNearbyLocation();
    let arr: any = [];
    data.then(value => {
      console.log(value);
      for (let i in value) {
        arr[i] = value[i];
      }
    });
    //console.log(this.arr_data);
    return arr;
  }

  loadNearbyLocation() {
    if (this.place) {
      return Promise.resolve(this.place);
    }
    return new Promise(resolve => {
      this.datas.get_location().subscribe((data) => {
        this.geolocation.getCurrentPosition().then(result => {
          this.latitude = result.coords.latitude;
          this.longitude = result.coords.longitude;

          // console.log(data);
          console.log(this.latitude + ", " + this.longitude);

          this.place = this.applyHaversine(data, this.latitude, this.longitude);

          this.place.sort((locationA: any, locationB: any) => {
            return locationA.distance - locationB.distance;
          });

          resolve(this.place);
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

  loadmap() {
    // set up the map 
    this.map = new L.Map('map');
    // load a tile layer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      // maxZoom: 18
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a> | Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors');
    this.map.locate({
      setView: true,
      maxZoom: 8
    }).on('locationfound', (e) => {
      console.log(e)
      let markerGroup = L.featureGroup();
      let marker: any = L.marker([e.latitude, e.longitude]).on('click', () => {
        console.log(e.latitude + ", " + e.longitude);
        alert('Marker clicked');
      });
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
    }).on('locationerror', (err) => {
      alert(err.message);
    });
    this.loadPoints();
  }

  loadPoints() {
    let markerGroup = L.featureGroup();
    var myIcon: any;
    console.log(this.arr_data.length);
    for (let i = 0; i < this.arr_data.length; i++) {
      if (this.arr_data[i].category_name == "ตลาดข้าว") {
        myIcon = L.icon({
          iconUrl: 'assets/imgs/pin_rice.png',
          iconSize: [37, 37],
          iconAnchor: [9, 21],
          popupAnchor: [0, -14]
        });
      } else if (this.arr_data[i].category_name == "ตลาดดอกไม้") {
        myIcon = L.icon({
          iconUrl: 'assets/imgs/pin_flower.png',
          iconSize: [37, 37],
          iconAnchor: [9, 21],
          popupAnchor: [0, -14]
        });
      } else if (this.arr_data[i].category_name == "ตลาดปศุสัตว์") {
        myIcon = L.icon({
          iconUrl: 'assets/imgs/pin_livestock.png',
          iconSize: [37, 37],
          iconAnchor: [9, 21],
          popupAnchor: [0, -14]
        });
      } else if (this.arr_data[i].category_name == "ตลาดผลไม้") {
        myIcon = L.icon({
          iconUrl: 'assets/imgs/pin_fruit.png',
          iconSize: [37, 37],
          iconAnchor: [9, 21],
          popupAnchor: [0, -14]
        });
      } else if (this.arr_data[i].category_name == "ตลาดผัก") {
        myIcon = L.icon({
          iconUrl: 'assets/imgs/pin_vegetable.png',
          iconSize: [37, 37],
          iconAnchor: [9, 21],
          popupAnchor: [0, -14]
        });
      } else if (this.arr_data[i].category_name == "ตลาดพืชเศรษฐกิจ") {
        myIcon = L.icon({
          iconUrl: 'assets/imgs/pin_agri.png',
          iconSize: [37, 37],
          iconAnchor: [9, 21],
          popupAnchor: [0, -14]
        });
      } else if (this.arr_data[i].category_name == "ตลาดสัตว์น้ำ") {
        myIcon = L.icon({
          iconUrl: 'assets/imgs/pin_aquatic.png',
          iconSize: [37, 37],
          iconAnchor: [9, 21],
          popupAnchor: [0, -14]
        });
      } else {
        myIcon = L.icon({
          iconUrl: 'assets/imgs/icon_market.png',
          iconSize: [37, 37],
          iconAnchor: [9, 21],
          popupAnchor: [0, -14]
        });
      }
      var popup = this.arr_data[i].location_name;
      var marker = L.marker([this.arr_data[i].coord_latitude, this.arr_data[i].coord_longitude], { icon: myIcon }).bindPopup(popup);
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
    }

  }

  setItem(){
   this.arr_data = this.dataTemp;
  }

  searchItem(ev: any) {
    console.log(ev);
    // Reset items back to all of the items
    this.setItem(); 

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.arr_data = this.arr_data.filter(function(item:any) {
        return item.location_name.includes(val) || item.province_name.includes(val)
      });
      // this.arr_data = this.arr_data.filter((item) => {
      //   let filterLocation = item.location_name.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1;
      //   let filterProvince = item.province_name.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1;
      //   return filterLocation || filterProvince;
      // })
    }

  }

  startExternalMap(lat: any, lng: any) {
    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then((position) => {
        // ios
        if (this.platform.is('ios')) {
          window.open('maps://?saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + lat + ',' + lng, '_system');
        };
        // android
        if (this.platform.is('android')) {
          window.open('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + lat + ',' + lng, '_system');
        };
      });
    });
  }


}

interface Data{
  category_name: string;
  coord_id: number;
  coord_latitude: number;
  coord_longitude: number;
  distance: any;
  location_name: string;
  province_name: string;
  type_name: string;
}



