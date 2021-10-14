import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { ToastController,NavController,Platform,LoadingController } from '@ionic/angular';
import { Stripe } from '@ionic-native/stripe/ngx';
declare var RazorpayCheckout: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})

export class CheckoutPage implements OnInit {
  
@ViewChild('content',{static : false}) private content: any;

  data:any;
  a_date:any;
  a_time:any;
  time:any;
  name:any;
  phone:any;
  comment:any;
  landmark:any;

  /*Stripe Config & Payment*/
  stripe_id:any;
  stripeView = false;
  card_no:any;
  exp_month:any;
  exp_year:any;
  cvv:any;
  payment:any;
  payment_id:any;
  text:any;
  revisit = false;
  discount:any = 0;
  setting:any;
  r = false;
  otype:any;
  odate:any;
  todayDate:any;
  order_date:any;
  order_time:any;
  address:any = [];
  address_id:any;
  user:any;
  hasEcash = false;
  ecash:any = 0;
  wallet:any = 0;

  constructor(private route: ActivatedRoute,public server : ServerService,public toastController: ToastController,private nav: NavController,public loadingController: LoadingController,private stripe: Stripe){

   this.data    = JSON.parse(localStorage.getItem('checkout_data'));
   this.setting = JSON.parse(localStorage.getItem('setting'));
   this.text    = JSON.parse(localStorage.getItem('app_text'));
   this.getDate();
  }

  getTotal()
  {
    if(this.otype == 2)
    {
      return this.data.total - this.data.d_charges;
    }
    else
    {
      return this.data.total;
    }
  }

  useEcash()
  {
    this.hasEcash = this.hasEcash == true ? false : true;

    if(this.hasEcash == true)
    {
      if(this.wallet > this.getTotal())
      {
        this.ecash  = this.getTotal();
        this.wallet = this.wallet - this.ecash;
      }
      else
      {
        this.ecash  = this.wallet;
        this.wallet = 0; 
      }
    }
    else
    {
      this.wallet = this.user.wallet;
      this.ecash  = 0;
    }
  }

  totalPayable()
  {
    return this.getTotal() - this.ecash;
  }

  getDate()
  {
    var today:any = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    this.todayDate = today;

    console.log(this.todayDate);
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

    this.server.userInfo(localStorage.getItem('user_id')).subscribe((response:any) => {

    this.address = response.address;
    this.user    = response.data;
    this.wallet  = this.user.wallet;

    loading.dismiss();

    });
  }

  setAddress(a)
  {
    this.address_id = a.id;
  }

  async book()
  {
    const loading = await this.loadingController.create({
      spinner : 'bubbles',
      duration:3000
      
    });
    await loading.present();

    var allData = {
      
      payment     : this.payment,
      cart_no     : localStorage.getItem('cart_no'),
      payment_id  : this.payment_id,
      otype       : this.otype,
      odate       : this.odate,
      order_date  : this.order_date,
      order_time  : this.order_time,
      user_id     : localStorage.getItem('user_id'),
      address     : this.address_id,
      ecash       : this.ecash,
      comment     : this.comment
    }
    
    this.server.order(allData).subscribe((response:any) => {
  	
    localStorage.setItem('order_data', JSON.stringify(response.data));
      
    this.nav.navigateRoot('/detail/'+response.data.data.id);

    loading.dismiss();

    });
  }

  setPayment(id)
  {
     this.payment = id;

    setTimeout(() => {
      this.content.scrollToBottom(300);
      }, 100);

    if(id == 2)
    {
      this.stripeView = true;
    }
    else
    {
      this.stripeView = false;
    }
  }

  makeOrder()
  {
    if(this.payment == 2)
    {
      this.payWithStripe();
    }
    else if(this.payment == 3)
    {
      this.payWithRazor();
    }
    else
    {
      this.book();
    }
  }

  payWithStripe()
  {    
    var cNo = this.card_no;

    if(cNo && cNo.length == 16 && this.exp_month.length == 2 && this.exp_year.length == 4 && this.cvv.length == 3)
    {
        this.stripe.setPublishableKey(this.setting.stripe_key);

        let card = {
         number: cNo,
         expMonth: this.exp_month,
         expYear: this.exp_year,
         cvc: this.cvv
        }

        var cardNo        = false;
        var cvvCorrect    = false;

        //validate card no
        this.stripe.validateCardNumber(cNo)
          .then(res => {
            
          
          this.stripe.createCardToken(card)
            .then(token => {
              
              if(token.id)
              {
                this.makePayment(token.id,cNo);
              }
              else
              {
                this.presentToast(this.text.card_no_validation);
              }

            })
            .catch(error => {

            this.presentToast(this.text.stripe_config);

            });


          })
          .catch(error => {

          this.presentToast(this.text.card_no_validation);

          });
    }
    else
    {
      this.presentToast(this.text.stripe_validation);
    }
  }

  async makePayment(token,cNo)
  {
    const loading = await this.loadingController.create({
      spinner: 'bubbles'
    });
    await loading.present();

    this.server.makeStripePayment("?token="+token+"&amount="+this.getTotal()+"&user_id="+this.phone).subscribe((response:any) => {

    if(response.data == "done")
    {
        this.payment_id = response.id;

        if(this.payment_id)
        {
          this.book();
        }
    }
    else
    {
      this.presentToast(response.error);
    }

    loading.dismiss();

    });
  }


  payWithRazor() {
    var options = {
      description: 'Pay Now',
      image: 'https://cdn.iconscout.com/icon/free/png-512/bhim-3-69845.png',
      currency: this.setting.currency_code,
      key: this.setting.razor_key,
      amount: this.getTotal() * 100,
      name: 'Whatsapp Order App',
      prefill: {
        email: this.name+"@google.com",
        contact: this.phone,
        name: this.name
      },
      theme: {
        color: '#2196f3'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };

    var successCallback = (success)=> {
      
      this.payment_id = success;

      if(this.payment_id)
      {
        this.book();
      }

    };

    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
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

  
  allSet()
  {
    if(this.otype && this.odate)
    {
      if(this.totalPayable() > 0 && !this.payment)
      {
        return false;
      }

      if(this.otype == 1 && this.odate == 1 && this.address_id)
      {
        return true
      }
      else if(this.otype == 2 && this.odate == 1)
      {
        return true;
      }
      else if(this.otype == 2 && this.odate == 2 && this.order_time && this.order_date)
      {
        return true;
      }
      else if(this.otype == 1 && this.odate == 2 && this.address_id && this.order_date && this.order_time)
      {
        return true;
      }
    }
    else
    {
      return false;
    }
  }

}
