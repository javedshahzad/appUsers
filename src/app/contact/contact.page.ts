import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,IonSlides,AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  text:any;

  constructor(private activatedRoute: ActivatedRoute,public server : ServerService,public loadingController: LoadingController) {

  this.text = JSON.parse(localStorage.getItem('app_text'));

  }

  data:any;
  fakeData = [1,2,3,4,5,6,7];

  ngOnInit()
  {
  	this.loadData();
  }

  async loadData()
  {
    this.server.page().subscribe((response:any) => {
  
    this.data = response.data;

    });
  }
}
