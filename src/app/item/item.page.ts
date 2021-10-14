import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { NavController,LoadingController,IonSlides,ToastController,ModalController } from '@ionic/angular';
import { OptionPage } from '../option/option.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
@ViewChild('content',{static : false}) private content: any;

data:any;
fakeData = [1,2,3,4,5,6,7];
text:any;
store_id:any;
cate_id:any;
cart_no:any;
setting:any;
cart:any = [];
count:any;
hasSearch = false;
q:any;

  constructor(private activatedRoute: ActivatedRoute,public server : ServerService,public loadingController: LoadingController,public nav : NavController,public modalController: ModalController, public toastController: ToastController,public geolocation: Geolocation) {

   this.store_id  = this.activatedRoute.snapshot.paramMap.get('id');
   this.cate_id   = 0;

   if(!localStorage.getItem('current_lat') || localStorage.getItem('current_lat') == undefined)
   {
      this.geolocation.getCurrentPosition().then((resp:any) => {
   
          localStorage.setItem("current_lat",resp.coords.latitude);
          localStorage.setItem("current_lng",resp.coords.longitude);

      }).catch((error) => {
        console.log('Error getting location', error);
      });
   }

  }

  ngOnInit()
  {
    this.loadData();

    if (localStorage.getItem('cart_no') == 'null' || localStorage.getItem('cart_no') == undefined) {
      
      this.cart_no = Math.floor(Math.random() * 2000000000) + 1;
      localStorage.setItem('cart_no', this.cart_no);
    }
    else {
      this.cart_no = localStorage.getItem('cart_no');
    }

    this.server.cartCount(this.cart_no).subscribe((response: any) => {

      this.count = response.data;
      this.cart = response.cart;


    });
  }

  showSearch()
  {
    this.hasSearch = this.hasSearch == true ? false : true;
    this.cate_id = 0;
  }

  async loadData()
  {
    this.server.item(this.store_id).subscribe((response:any) => {
  
    this.data    = response.data;
    this.text    = response.text;
    this.setting = response.setting;
    
    localStorage.setItem('app_text', JSON.stringify(response.text));
    localStorage.setItem('setting', JSON.stringify(response.setting));

    });
  }

  async showOption(item) {
    const modal = await this.modalController.create({
      component: OptionPage,
      animated: true,
      mode: 'ios',
      cssClass: 'my-custom-modal-css',
      backdropDismiss: false,
      componentProps: {
        'item': item,
        'currency': this.setting.currency
      }

    });

    modal.onDidDismiss().then(data => {

      if (data.data.id) {
        this.addToCart(data.data.id, data.data.price, data.data.type, data.data.addonData);
      }

    })

    return await modal.present();
  }

  addToCart(id, price, type = 0, addon = []) {
    this.presentToast(this.text.add_cart_msg);

    var allData = { cart_no: this.cart_no, id: id, price: price, qtype: type, type: 0, addon: addon };

    this.server.addToCart(allData).subscribe((response: any) => {

      this.count = response.data.count;
      this.cart = response.data.cart;

    });
  }

  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 2000
    });
    toast.present();
  }

  hasCart(id) {
    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].item_id == id) {
        return this.cart[i].qty;
      }
    }

    return false;
  }

  async updateCart(id, type = 0) {
    this.presentToast(this.text.remove_cart_msg);

    this.server.updateCart(id, type + "?cart_no=" + this.cart_no + "&lid=" + localStorage.getItem('lid')).subscribe((response: any) => {

      this.cart = response.data;
      this.count = response.count;

    });
  }

  info()
  {
    localStorage.setItem('store_data', JSON.stringify(this.data.store));

    this.nav.navigateForward('/info');
  }
}
