import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { ToastController,NavController,Platform,LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})

export class SettingPage implements OnInit {
  
  data:any;
  name:any;
  phone:any;
  email:any;  
  whatsapp_no:any;
  text:any;  
  constructor(private route: ActivatedRoute,public server : ServerService,public toastController: ToastController,private nav: NavController,public loadingController: LoadingController){

   this.data        = JSON.parse(localStorage.getItem('user_data'));
   this.name        = this.data.name;
   this.phone       = this.data.phone;
   this.email       = this.data.email;
   this.whatsapp_no = this.data.whatsapp_no;
   this.text = JSON.parse(localStorage.getItem('app_text'));

  }

  ngOnInit()
  {
  
  }

  async signup(data)
  {
    const loading = await this.loadingController.create({
      message: '',
      spinner : 'bubbles'
    });
    await loading.present();

    this.server.updateInfo(data,localStorage.getItem('user_id')).subscribe((response:any) => {
  
    if(response.msg != "done")
    {
    	this.presentToast(response.error);
    }
    else
    {
    	this.presentToast(this.text.setting_success);
    	this.nav.navigateBack('account');
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
