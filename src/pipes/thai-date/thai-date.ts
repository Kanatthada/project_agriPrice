import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ThaiDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'thaiDate',
})
export class ThaiDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(date: string, format: string): string {
    //let ThaiDay = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
    let shortThaiMonth = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    let longThaiMonth = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    //let inputDate = date.split("-");
    
    let inputDate = new Date(date);
    let getDate = new Date(inputDate.setDate(inputDate.getDate()));
    var getyear = getDate.getFullYear() + 543;
    var y = getyear.toString();
    var m = getDate.getMonth().toString();
    var d = getDate.getDate().toString();
    
    //console.log(dateObj);
    // let outputDateFull = [
    //     'วัน'+ThaiDay[dateObj[0]],
    //     'ที่ '+dateObj[1],
    //     'เดือน '+longThaiMonth[dateObj[2]],
    //     'พ.ศ. '+(dateObj[3]+543)
    // ];
    let outputDateShort = [
      d,
      shortThaiMonth[m],
      y
    ];
    let outputDateMedium = [
      d,
      longThaiMonth[m],
      y
    ];
    let returnDate: string;
    returnDate = outputDateMedium.join(" ");
    // if(format=='full'){
    //     returnDate = outputDateFull.join(" ");
    // }     
    if (format == 'medium') {
      returnDate = outputDateMedium.join(" ");
    }
    if (format == 'short') {
      returnDate = outputDateShort.join(" ");
    }
    return returnDate;
  }
}
