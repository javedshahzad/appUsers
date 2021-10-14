import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  
  //put /api/ after your url e.g https://www.abc.com/api/
  url = "https://dema.qa/portal/api/";

  constructor(private http: HttpClient) { }
  FBconfigApp() {
    firebase.initializeApp(environment.firebaseConfig);
  }

  homepage(id)
  {
    return this.http.get(this.url+'homepage?lid='+localStorage.getItem('lid')+"&user_id="+localStorage.getItem('user_id')+"&city_id="+localStorage.getItem('city_id')+"&cate_id="+id+'&cart_no='+localStorage.getItem('cart_no')+"&lat="+localStorage.getItem("current_lat")+"&lng="+localStorage.getItem("current_lng"))
             .pipe(map(results => results));
  }

  item(id)
  {
    return this.http.get(this.url+'item?lid='+localStorage.getItem('lid')+"&user_id="+localStorage.getItem('user_id')+"&store_id="+id)
             .pipe(map(results => results));
  }
  
  city()
  {
  	return this.http.get(this.url+'city?lid='+localStorage.getItem('lid'))
  	    	   .pipe(map(results => results));
  }

  page()
  {
    return this.http.get(this.url+'page?lid='+localStorage.getItem('lid'))
             .pipe(map(results => results));
  }

  
  makeStripePayment(data)
  {
    return this.http.get(this.url+'makeStripePayment'+data+'&lid='+localStorage.getItem('lid'))
             .pipe(map(results => results));
  }

  my(id)
  {
    return this.http.get(this.url+'my?id='+id+'&lid='+localStorage.getItem('lid'))
             .pipe(map(results => results));
  }

  getLang(id)
  {
    return this.http.get(this.url+'getLang?lang_id='+id)
             .pipe(map(results => results));
  }

  addToCart(data)
  {
    return this.http.post(this.url+'addToCart?lang_id='+localStorage.getItem('lid'),data)
             .pipe(map(results => results));
  }

  cartCount(id)
  {
    return this.http.get(this.url+'cartCount?lid='+localStorage.getItem('lid')+"&cart_no="+id)
             .pipe(map(results => results));
  }

  updateCart(id,type)
  {
    return this.http.get(this.url+'updateCart/'+id+'/'+type)
             .pipe(map(results => results));
  }

  getCart(cartNo)
  {
    return this.http.get(this.url+'getCart/'+cartNo+'?lid='+localStorage.getItem('lid')+"&lat="+localStorage.getItem("current_lat")+"&lng="+localStorage.getItem("current_lng"))
             .pipe(map(results => results));
  }

  getOffer(cartNo)
  {
    return this.http.get(this.url+'getOffer/'+cartNo+'?lid='+localStorage.getItem('lid'))
             .pipe(map(results => results));
  }

  applyCoupen(id,cartNo)
  {
    return this.http.get(this.url+'applyCoupen/'+id+'/'+cartNo+"&lat="+localStorage.getItem("current_lat")+"&lng="+localStorage.getItem("current_lng"))
             .pipe(map(results => results));
  }

  removeOffer(id,cartNo)
  {
    return this.http.get(this.url+'removeOffer/'+id+'/'+cartNo+"&lat="+localStorage.getItem("current_lat")+"&lng="+localStorage.getItem("current_lng"))
             .pipe(map(results => results));
  }

  order(data)
  {
    return this.http.post(this.url+'order'+"?lat="+localStorage.getItem("current_lat")+"&lng="+localStorage.getItem("current_lng"),data)
    .pipe(map(results => results));
  }

  login(data)
  {
    return this.http.post(this.url+'login',data)
             .pipe(map(results => results));
  }

  signup(data)
  {
    return this.http.post(this.url+'signup',data)
             .pipe(map(results => results));
  }

  forgot(data)
  {
    return this.http.post(this.url+'forgot',data)
             .pipe(map(results => results));
  }

  verify(data)
  {
    return this.http.post(this.url+'verify',data)
             .pipe(map(results => results));
  }

  updatePassword(data)
  {
    return this.http.post(this.url+'updatePassword',data)
             .pipe(map(results => results));
  }

  userInfo(id)
  {
    return this.http.get(this.url+'userInfo?id='+id)
             .pipe(map(results => results));
  }

  saveAddress(data)
  {
    return this.http.post(this.url+'saveAddress',data)
             .pipe(map(results => results));
  }

  cancelOrder(id)
  {
    return this.http.get(this.url+'cancelOrder?id='+id+'&lid='+localStorage.getItem('lid'))
             .pipe(map(results => results));
  }

  rating(data)
  {
    return this.http.post(this.url+'rating',data)
             .pipe(map(results => results));
  }

  updateInfo(data,id)
  {
    return this.http.post(this.url+'updateInfo?id='+id,data)
             .pipe(map(results => results));
  }

  runningOrder()
  {
    return this.http.get(this.url+'runningOrder?id='+localStorage.getItem('user_id'))
             .pipe(map(results => results));
  }

  orderDetail(id)
  {
    return this.http.get(this.url+'orderDetail?lid='+localStorage.getItem('lid')+'&order_id='+id)
             .pipe(map(results => results));
  }
}