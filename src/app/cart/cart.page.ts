import { Component } from '@angular/core';
import { NavController,ModalController,LoadingController,IonSlides,ToastController,AlertController } from '@ionic/angular';
import { ServerService } from '../service/server.service';
import { OfferPage } from '../offer/offer.page';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
})
export class CartPage {

data:any
text:any;

  constructor(public modalController: ModalController,public loadingController: LoadingController,public server : ServerService,private nav: NavController,public toastController: ToastController,public alertController: AlertController) {

   this.text = JSON.parse(localStorage.getItem('app_text'));
  	
  }

  ngOnInit()
  {
  	
  }

  ionViewWillEnter()
  {
    this.loadData();
  }

 
async loadData()
{
  const loading = await this.loadingController.create({
    message: '',
    spinner:'bubbles'
    });
    await loading.present();

    this.server.getCart(localStorage.getItem('cart_no')).subscribe((response:any) => {

    this.data = response.data;

    console.log(this.data);

    if(this.data.open == false)
    {
      this.presentToast(this.text.store_close);
      this.nav.navigateRoot('/home');
    }

    loading.dismiss();

    });
  }

 async updateCart(id,type)
  {
    const loading = await this.loadingController.create({

    spinner : 'bubbles'

    });
    await loading.present();

    this.server.updateCart(id,type+"?lid="+localStorage.getItem('lid')+"&lat="+localStorage.getItem('current_lat')+"&lng="+localStorage.getItem('current_lng')).subscribe((response:any) => {
    
    this.data = response.data;
    
    loading.dismiss();

    });
  }

  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'top',
      mode:'ios',
      color:'dark'
    });
    toast.present();
  }

  async coupen() {
    const modal = await this.modalController.create({
      component: OfferPage,
      animated:true,
      mode:'ios',
      cssClass: 'my-custom-modal-css',
      backdropDismiss:false,
      

    });

   modal.onDidDismiss().then(data=>{
    
   console.log(data.data.id);

    if(data.data.id)
    {
      this.applyCoupen(data.data.id);
    }

    })

    return await modal.present();
  }

async applyCoupen(id)
{
  const loading = await this.loadingController.create({
      spinner : 'bubbles'
    });
    await loading.present();

    this.server.applyCoupen(id,localStorage.getItem('cart_no')+"?lid="+localStorage.getItem('lid')).subscribe((response:any) => {
    
    if(response.msg == "done")
    {
      this.data = response.data;
    }
    else
    {
      this.presentToast(response.msg);
    }
    
    loading.dismiss();

    });
}

async removeOffer(id)
{
  const loading = await this.loadingController.create({
      spinner : 'bubbles'
    });
    await loading.present();

    this.server.removeOffer(id,localStorage.getItem('cart_no')+"?lid="+localStorage.getItem('lid')).subscribe((response:any) => {
    
    this.data = response.data;
    
    loading.dismiss();

    });
}

checkout()
{
  if(localStorage.getItem('user_id') && localStorage.getItem('user_id') != "null")
  {
    localStorage.setItem('checkout_data', JSON.stringify(this.data));

    this.nav.navigateForward('/checkout');
  }
  else
  {
    this.nav.navigateForward('/login');
    this.presentToast("Please login for continue");
  }
}

}
