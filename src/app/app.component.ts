import { Component, OnInit } from '@angular/core';

import { Platform,NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages:any;

  userData:any;
  setting:any;
  lang_data:any;
  dir = 'ltr';
  text:any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private nav: NavController,
    private service : ServerService
  ) {

    if(localStorage.getItem('setting') && localStorage.getItem('setting') != undefined)
    {
      this.setting = JSON.parse(localStorage.getItem('setting'));
    }

    this.initializeApp();

    if(localStorage.getItem('lang_data') && localStorage.getItem('lang_data') != 'null')
    {
      if(localStorage.getItem('current_lat') && localStorage.getItem('current_lat') != 'null')
      {
        this.nav.navigateRoot('/home');
      }
      else
      {
        this.nav.navigateRoot('/city');
      }
    }
    else
    {
      this.nav.navigateRoot('/lang');
    }

    /*
    ********************************************
    **Setup language
    ********************************************
    */
    if(localStorage.getItem('lang_data') && localStorage.getItem('lang_data') != undefined)
    {
      this.lang_data = JSON.parse(localStorage.getItem('lang_data'));

      this.dir       = this.lang_data.type == '1' ? 'rtl' : 'ltr';
    }

    if(localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined)
    {
        this.text = JSON.parse(localStorage.getItem('app_text'));

         this.appPages = [
        {
          title: this.text.menu_home,
          url: '/home',
          icon: 'home'
        },
       
        {
          title: this.text.running_order,
          url: '/done',
          icon: 'stats-chart'
        },

        {
          title: this.text.menu_lang,
          url: '/lang',
          icon: 'flag'
        },

        {
          title: this.text.menu_location,
          url: '/city',
          icon: 'location'
        },

        {
          title: this.text.menu_about,
          url: '/about',
          icon: 'information-circle'
        },
        
        {
          title: this.text.menu_faq,
          url: '/faq',
          icon: 'create'
        },
  
        {
          title: this.text.menu_contact,
          url: '/contact',
          icon: 'mail'
        },
        
      ];
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      //this.splashScreen.hide();

      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#f4f5f8');
      this.statusBar.styleDefault();

      if(this.setting)
      {
       this.sub();
      }

    });
  }

  ngOnInit() {

    this.service.FBconfigApp();
    
    if(localStorage.getItem('user_data') && localStorage.getItem('user_data') != undefined && localStorage.getItem('user_data') != 'null')
    {
      this.userData = JSON.parse(localStorage.getItem('user_data'));
    }

    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
  
  sub()
  {
    this.oneSignal.startInit(this.setting.push_app_id, this.setting.push_google);

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
     // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });


    if(localStorage.getItem('user_id') && localStorage.getItem('user_id') != undefined)
    {
          this.oneSignal.sendTags({user_id: localStorage.getItem('user_id')});
    }

    this.oneSignal.endInit();
  }
}
