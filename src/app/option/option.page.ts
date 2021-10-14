import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {

  item:any;
  currency:any;
  itemID:any;
  itemPrice:any;
  addonData:any = [];
  text:any;
  notes:any;
  req = false;
  constructor(public navParams: NavParams,public modalController: ModalController) {

  this.item   = navParams.get('item');
  this.currency = navParams.get('currency');
  this.text = JSON.parse(localStorage.getItem('app_text'));

  }

  ngOnInit() {
  }

  hasReq()
  {
    var array = [];
    var error = [];

    for(var i =0;i<this.item.addon.length;i++)
    {
      if(this.item.addon[i].req == 1)
      {
        for(var it = 0;it<this.item.addon[i].item.length;it++)
        {
          if(!this.addonData.includes(this.item.addon[i].item[it].id))
          {
            array.push(1);
          }
        } 
      }

      if(array.length == this.item.addon[i].item.length)
      {
        error.push(1);
      }

      array = [];
    }

    if(error.length > 0)
    {
      return false;
    }
    else
    {
      return true;
    }    
  }

  async addToCart()
  {
    await this.modalController.dismiss({id:this.item.id,price:this.itemPrice,type:this.itemID,addonData : this.addonData,notes:this.notes});
  }

  async closeModal() {
    
    await this.modalController.dismiss({data:true});
  }

  selectItem(type,price)
  {
    this.itemID     = type;
    this.itemPrice  = price;

    console.log(this.itemID);
  }

  addonSelect(id,type,ids = [])
  {
    if(type == 1)
    {
      for(var i =0;i<ids.length;i++)
      {
        if(this.addonData.includes(ids[i].id))
        {
          var ind = this.addonData.indexOf(ids[i].id);

          this.addonData.splice(ind,1);
        }
      }
    }

    if(this.addonData.includes(id))
    {
      var ind = this.addonData.indexOf(id);

      this.addonData.splice(ind,1);
    }
    else
    {
      this.addonData.push(id);
    }

    console.log(this.addonData);
  }
}
