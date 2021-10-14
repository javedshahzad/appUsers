import { Component } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,AlertController } from '@ionic/angular';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-done',
  templateUrl: 'done.page.html',
  styleUrls: ['done.page.scss'],
})
export class DonePage {

data:any
text:any;

  constructor(public platform : Platform,public loadingController: LoadingController,public server : ServerService,private nav: NavController,public toastController: ToastController,public alertController: AlertController) {

    this.text    = JSON.parse(localStorage.getItem('app_text'));

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

    this.server.runningOrder().subscribe((response:any) => {

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
}
