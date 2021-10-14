import { Component } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,ModalController } from '@ionic/angular';
import { ServerService } from '../service/server.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-offer',
  templateUrl: 'offer.page.html',
  styleUrls: ['offer.page.scss'],
})
export class OfferPage {

data:any;
text:any;
constructor(public loadingController: LoadingController,public server : ServerService,private route: ActivatedRoute,public nav : NavController,public toastController: ToastController,public modalController: ModalController) {

this.text = JSON.parse(localStorage.getItem('app_text'));

}

  ngOnInit()
  {
    this.loadData();
  }

 async loadData()
{
  const loading = await this.loadingController.create({
    spinner:'bubbles'
    });
    await loading.present();

    this.server.getOffer(localStorage.getItem('cart_no')).subscribe((response:any) => {

    this.data = response.data;

    loading.dismiss();

    });
  }

  async applyNow(cdata)
  {
    await this.modalController.dismiss({id:cdata});
  }

  async closeModal() {
    
    await this.modalController.dismiss({id:false});
  }

}
