import { Component } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,AlertController } from '@ionic/angular';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage {

data:any
text:any;
trend:any;
store:any;
q:any;

  constructor(public platform : Platform,public loadingController: LoadingController,public server : ServerService,private nav: NavController,public toastController: ToastController,public alertController: AlertController) {

   this.text  = JSON.parse(localStorage.getItem('app_text'));
   this.trend = JSON.parse(localStorage.getItem('trend_data'));
   this.store = JSON.parse(localStorage.getItem('all_data'));

  }

  ngOnInit()
  {
  	
  }

  ionViewWillEnter()
  {
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
}
