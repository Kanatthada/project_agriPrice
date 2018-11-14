import { Component } from '@angular/core';
//import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { ProductdataProvider } from '../../providers/productdata/productdata';
import { ProductdetailsPage } from '../productdetails/productdetails';
/**
 * Generated class for the ProducttypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-producttype',
  templateUrl: 'producttype.html',
})
export class ProducttypePage {
  public arr_data : Data[];
  categoryName: string;
  categoryId: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public datas: ProductdataProvider) {
    this.categoryId = this.navParams.get('id');
    this.categoryName = this.navParams.get('name');
    
    console.log(this.categoryId);

    this.datas.get_type(this.categoryId).subscribe((response) => {
      console.log("log :"+response);
      this.arr_data = response;
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProducttypePage');
  }

  goProductDetailsPage(data){
    console.log(data)
    this.navCtrl.push(ProductdetailsPage, { id: data.type_id, name: data.type_name })
  }
}

interface Data{
  type_id: number;
  type_name: string;
  category_id: number;
  type_image: string;
}
