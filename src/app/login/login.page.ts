import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { ToastController,NavController,Platform,LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  
  email:any;
  password:any;
  text:any;
  
  constructor(private route: ActivatedRoute,public server : ServerService,public toastController: ToastController,private nav: NavController,public loadingController: LoadingController){

  this.text = JSON.parse(localStorage.getItem('app_text'));

  }

  ngOnInit()
  {
  
  }

  async login(data)
  {
    if(!this.email || !this.password)
    {
      return this.presentToast(this.text.login_validation);
    }

    const loading = await this.loadingController.create({
      message: '',
      spinner : 'bubbles'
      
    });
    await loading.present();

    this.server.login(data).subscribe((response:any) => {
  
    if(response.msg != "done")
    {
    	this.presentToast(this.text.login_error);
    }
    else
    {
    	localStorage.setItem('user_id',response.user.id);

      localStorage.setItem('user_data', JSON.stringify(response.user));
    	
      if(localStorage.getItem('cart_no') && localStorage.getItem('cart_no') != undefined)
      {
        this.nav.navigateBack('/cart');
      }
      else
      {
        window.location.href = "/account";
      }
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

  goBack()
  {
    if(localStorage.getItem('cart_no'))
    {
      this.nav.navigateBack('/cart');
    }
    else
    {
      this.nav.navigateRoot('/home');
    }
  }
}
