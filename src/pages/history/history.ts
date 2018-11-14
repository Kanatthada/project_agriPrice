import { Component, ViewChild, ElementRef } from '@angular/core';
//import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ProductdataProvider } from '../../providers/productdata/productdata';
import chartJs from 'chart.js';
import * as moment from 'moment';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  @ViewChild('lineCanvas') lineCanvas: ElementRef;

  lineChart: any;

  public arr_data: Data[];
  public type: any = [];
  public subtype: any = [];
  subtypeId: string;
  typeId: number;
  fromDate: string;
  toDate: string;
  randomColor: any;

  history: string = "graph";
  isAndroid: boolean = false;

  sortedByDate: any = [];
  dataNull: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public datas: ProductdataProvider, public platform: Platform) {
    this.isAndroid = platform.is('android');
    // this.arr_data = this.navParams.get('value');
    // console.log(this.arr_data);
    this.typeId = this.navParams.get('type');
    this.subtypeId = this.navParams.get('id');
    this.fromDate = this.navParams.get('from');
    this.toDate = this.navParams.get('to');
    console.log(this.subtypeId + " " + this.fromDate + " " + this.toDate);

    this.datas.get_history(this.subtypeId, this.fromDate, this.toDate).subscribe((response) => {
      if (response.length != 0) {
        this.type = response[0].type_name;
        this.subtype = response[0].subtype_name;
        this.arr_data = response;
        console.log(this.arr_data);

        this.getLineChart(response);

        this.sortedByDate = this.sortArr(response, 'date');
      } else if (response.length == 0) { 
        this.datas.get_subtype(this.typeId).subscribe((response) => {
          this.type = response[0].subtype_name;
          this.subtype = response[0].subtype_name;
          this.dataNull = "ไม่พบข้อมูล" + response[0].subtype_name + " ในช่วงวันที่ต้องการค้นหา";
        });
     }
    });

    this.dateDifference();


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }


  /*ngAfterViewInit() {
    let response = [];
    setTimeout(() => {
      this.lineChart = this.getLineChart(response);
    }, 150)
    
  }*/

  dateDifference() {
    var date1 = moment(this.fromDate, 'YYYY-MM-DD');
    var date2 = moment(this.toDate, 'YYYY-MM-DD');
    var days = date2.diff(date1, 'days');
    console.log("difference " + days + " days");
    return days;
  }

  changeFormatDate(date) {
    var getyear = date.getFullYear() + 543;
    var y = getyear.toString();
    var m = date.getMonth().toString();
    var d = date.getDate().toString();

    //var monthArray = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน ', 'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    var arrShortMonth = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    date = d + " " + arrShortMonth[m] + " " + y;
    return date;
  }

  randomColorGenerator() {
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
  };

  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }

  getLineChart(response) {
    console.log(response);
    let location = [];
    let price = [];
    //let date = [];
    let buffer = [];
    let ln = "";
    let days = [];
    let d: Date;
    let next_date: any;
    let rangeDate: number;
    let changeDate: Date;
    let p: any;

    //  let test = new Date('2018-10-03');
    //   test = this.changeFormatDate(test);
    //   console.log("test = "+ test);

    rangeDate = this.dateDifference();
    d = new Date(this.fromDate);

    for (let i = 0; i <= rangeDate; i++) {
      if (i == 0) {
        next_date = new Date(d.setDate(d.getDate()));
        next_date = this.changeFormatDate(next_date);
      } else {
        next_date = new Date(d.setDate(d.getDate() + 1));
        next_date = this.changeFormatDate(next_date);
      }
      days.push(next_date);
    }
    console.log(days);


    for (let item in response) {
      if (ln != response[item].location_name) {
        // console.log(buffer.length)

        if (buffer.length != 0) {
          price.push(buffer);
          buffer = [];
        }

        ln = response[item].location_name;
        location.push(ln);

        changeDate = new Date(response[item].date);
        changeDate = this.changeFormatDate(changeDate);
        for (let i in days) {
          console.log(changeDate);
          if (days[i] == changeDate) {
            p = response[item].product_price;
          } else if (days[i] != changeDate) {
            p = null;
          }
          buffer.push(p);
        }

      }


      //ใช้ๆ buffer.push(response[item].product_price);


      //price[count].push(response[item].product_price)
      //location.push(ln);
      //location[item] = response[item].location_name;
      //price[item] = parseFloat(response[item].product_price);

      //date[item] = response[item].date;

    }
    price.push(buffer);
    buffer = [];
    console.log(buffer);
    console.log(price)

    for (let i in location) {
      this.randomColor = this.randomColorGenerator();
      let data = {
        label: location[i],
        lineTension: 0.1,
        backgroundColor: this.randomColor,
        borderColor: this.randomColor,
        pointBackgroundColor: 'black',
        radius: 4,
        fill: false,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1.5,
        pointHitRadius: 10,
        data: price[i],
        scanGaps: true
      }
      buffer.push(data)
    }

    const data = {
      labels: days,
      datasets: buffer
    }

    const options = {

      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'ราคา'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'วันที่อัปเดต'
          }
        }]
      }

    }


    return this.getChart(this.lineCanvas.nativeElement, 'line', data, options);

  }

  sortArr(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

}

interface Data {
  type_name: string;
  subtype_name: string;
  location_name: string;
  province_name: string;
  product_price: number;
  date: string;
}
