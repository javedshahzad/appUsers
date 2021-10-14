import { Component } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,AlertController } from '@ionic/angular';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-lang',
  templateUrl: 'lang.page.html',
  styleUrls: ['lang.page.scss'],
})
export class LangPage {

data:any
subscription:any;
text:any;
lid:any = '0';

  constructor(public platform : Platform,public loadingController: LoadingController,public server : ServerService,private nav: NavController,public toastController: ToastController,public alertController: AlertController) {

  }

  ngOnInit()
  {
  	if(localStorage.getItem('lid') && localStorage.getItem('lid') != 'null' && localStorage.getItem('lid') != undefined)
  	{
  		this.lid = localStorage.getItem('lid');
  	}
  	else
  	{
  		this.lid = "0";
  	}
  }

  ionViewWillEnter()
  {
    this.loadData();
  }

  ionViewDidEnter()
  {

    this.subscription = this.platform.backButton.subscribe(()=>{
          
        this.presentAlertConfirm();

      });
  }

  ionViewWillLeave(){
      
      this.subscription.unsubscribe();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.text.exit_app,
      message: this.text.exit_app_desc,
      buttons: [
        {
          text: this.text.cancel_btn,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.text.exit_app_confirm,
          handler: () => {
          
            navigator['app'].exitApp();

          }
        }
      ]
    });

    await alert.present();
}

async loadData()
{
  const loading = await this.loadingController.create({
    message: '',
    spinner:'bubbles'
    });
    await loading.present();

    this.server.getLang(this.lid).subscribe((response:any) => {

    this.data = response.data;
    this.text = response.text;

    localStorage.setItem('setting', JSON.stringify(response.setting));
    
    
    loading.dismiss();

    });
  }

 set(id)
 {
 	this.lid = id;
 }

 async setLang()
 {
    const loading = await this.loadingController.create({
    spinner:'bubbles'
    });
    await loading.present();

    this.server.getLang(this.lid).subscribe((response:any) => {

    this.data = response.data;

    localStorage.setItem('app_text', JSON.stringify(response.text));

    localStorage.setItem('lang_data', JSON.stringify(response.data));
    localStorage.setItem('lid',this.lid);

   if(localStorage.getItem('current_lat') && localStorage.getItem('current_lat') != undefined)
   {
     window.location.href = "/home";
   }
   else
   {
     window.location.href = "/city";
   }

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
