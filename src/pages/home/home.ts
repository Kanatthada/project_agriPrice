import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductdataProvider } from '../../providers/productdata/productdata';
import { ProducttypePage } from '../producttype/producttype';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public arr_data : Data[];
  currentDate;

  constructor(public navCtrl: NavController, public navParams: NavParams, public datas : ProductdataProvider) {
    this.datas.get_category().subscribe((response) => {
      //console.log("log :"+response);
      this.arr_data = response;
    });

   this.getCurrentDate();

  }

  getCurrentDate(){
    var dateObj = new Date();
    var getyear = dateObj.getFullYear()+543;
    var year = getyear.toString();
    var month = dateObj.getMonth().toString();
    var date = dateObj.getDate().toString();

    var monthArray = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน ', 'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    this.currentDate = date + " " + monthArray[month] + " " + year;
  }

  goProductTypePage(data){
    console.log(data)
    this.navCtrl.push(ProducttypePage, { id: data.category_id, name: data.category_name })
  }
}

interface Data{
  category_id: number;
  category_name: string;
  category_image: string;
  category_icon: string;
}

