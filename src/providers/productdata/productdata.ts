import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProductdataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductdataProvider {

  host = "http://192.168.43.6:8080";
  constructor(public http: Http) {
    console.log('Hello ProductdataProvider Provider');
  }

 
  get_category(){
    let url = this.host + "/getCategory";
    return this.http.get(url).map((res)=>res.json()); 
  }

  get_type(categoryId){
    let url = this.host + "/getType/categoryId="+categoryId;
    return this.http.get(url).map((res)=>res.json()); 
  }
  
  get_allType(){
    let url = this.host + "/getType";
    return this.http.get(url).map((res)=>res.json()); 
  }

  // get_subtype(){
  //   let url = "http://localhost:8080/getSubtype";
  //   return this.http.get(url).map((res)=>res.json()); 
  // }

  get_subtype(typeId){
    let url = this.host + "/getSubtype/typeId="+typeId;
    return this.http.get(url).map((res)=>res.json()); 
  }

  get_lastUpdate(){
    let url = this.host + "/getLastUpdate";
    return this.http.get(url).map((res)=>res.json()); 
  }
 
  get_history(id, fromDate, toDate){
    let url = this.host + "/getHistory/id="+id+"&fromDate="+fromDate+"&toDate="+toDate;
    return this.http.get(url).map((res)=>res.json()); 
  }

  get_location(){
    let url = this.host + "/getLocation";
    return this.http.get(url).map((res)=>res.json()); 
  }

}
