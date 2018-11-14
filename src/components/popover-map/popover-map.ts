import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, App } from 'ionic-angular';
import { ProductdataProvider } from '../../providers/productdata/productdata';

/**
 * Generated class for the PopoverMapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover-map',
  templateUrl: 'popover-map.html'
})
export class PopoverMapComponent {

  selectItem: string;
  arr_data: Data[];
  data: any[] = [];

  constructor(public viewCtrl: ViewController, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public datas: ProductdataProvider,
    public appCtrl: App) {

      console.log('Hello PopoverMapComponent Component');
      this.selectItem = this.navParams.get('selectItem');
      console.log(this.selectItem);

  }

  

  showData() {
    console.log("show = " + this.selectItem);
    this.arr_data = this.navParams.get('arrData');
    if (this.selectItem == "near") {
      for (let i in this.arr_data) {
        if (this.arr_data[i].distance <= 30) {
          this.data[i] = this.arr_data[i];
        }
      }
      if (this.data.length == 0) {
        for (let i = 0; i < 5; i++) {
          this.data[i] = this.arr_data[i];
        }
      } 
    }
    else if (this.selectItem == "all") {
      this.data = this.arr_data;
    }
    else if (this.selectItem == "rice") {
      const val = 'ตลาดข้าว';

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.data = this.arr_data.filter((item) => {
          let filterCategory = item.category_name.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1;
         return filterCategory;  
        })
        console.log(this.data)
      }   
    }
    else if (this.selectItem == "flower") {
      const val = 'ตลาดดอกไม้';

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.data = this.arr_data.filter((item) => {
          let filterCategory = item.category_name.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1;
         return filterCategory;  
        })
        console.log(this.data)
      }   
    }
    else if (this.selectItem == "livestock") {
      const val = 'ตลาดปศุสัตว์';

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.data = this.arr_data.filter((item) => {
          let filterCategory = item.category_name.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1;
         return filterCategory;  
        })
        console.log(this.data)
      }   
    }
    else if (this.selectItem == "fruit") {
      const val = 'ตลาดผลไม้';

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.data = this.arr_data.filter((item) => {
          let filterCategory = item.category_name.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1;
         return filterCategory;  
        })
        console.log(this.data)
      }   
    }
    else if (this.selectItem == "vegetable") {
      const val = 'ตลาดผัก';

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.data = this.arr_data.filter((item) => {
          let filterCategory = item.category_name.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1;
         return filterCategory;  
        })
        console.log(this.data)
      }   
    }
    else if (this.selectItem == "agri") {
      const val = 'ตลาดพืชเศรษฐกิจ';

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.data = this.arr_data.filter((item) => {
          let filterCategory = item.category_name.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1;
         return filterCategory;  
        })
        console.log(this.data)
      }   
    }
    else if (this.selectItem == "aquatic") {
      const val = 'ตลาดสัตว์น้ำ';

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.data = this.arr_data.filter((item) => {
          let filterCategory = item.category_name.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1;
         return filterCategory;  
        })
        console.log(this.data)
      }   
    }

    this.viewCtrl.dismiss(this.data, this.selectItem);
  }

  close() {
    this.data = this.arr_data;
    this.viewCtrl.dismiss(this.data, this.selectItem);
  }

}

interface Data{
  category_name: string;
  coord_id: number;
  coord_latitude: number;
  coord_longtitude: number;
  distance: any;
  location_name: string;
  province_name: string;
  type_name: string;
}
