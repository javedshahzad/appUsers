import { Component, ViewChild, ElementRef,OnInit,NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { ToastController,NavController,Platform,LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
declare var google;

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})

export class AddressPage implements OnInit {

@ViewChild('map',{static:false}) mapElement: ElementRef;
  
  map: any;
  address:string;
  text:any;
  type:any;
  landmark:any;

  autocomplete: { input: string; };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  placeid: any;

  constructor(

    public route: ActivatedRoute,
    public server : ServerService,
    public toastController: ToastController,
    public nav: NavController,
    public loadingController: LoadingController,
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public platform : Platform,
    public zone: NgZone,


    ){


    this.text = JSON.parse(localStorage.getItem('app_text'));
    this.type = this.route.snapshot.paramMap.get('id');

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];


  }

  ngOnInit()
  {
     
  }

  ionViewWillEnter()
  {
    this.platform.ready().then(() => {

      this.loadMap();

     });
  }

  async loadMap() {
    
    console.log("hey");

    this.geolocation.getCurrentPosition().then((resp) => {
      
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      
      this.map.addListener('tilesloaded', () => {
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });
 
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
 

  async getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
 
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";

        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
  
          if(value.length > 0)
          responseAddress.push(value);
 
        }

        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
      });
 
  }

  async saveAddress(data)
  {
    const loading = await this.loadingController.create({
    message: '',
    spinner:'bubbles'
    });
    await loading.present();

    var allData = {user_id : localStorage.getItem('user_id'),lat : this.map.center.lat(),lng : this.map.center.lng(),address : data.address,landmark : data.landmark}

    this.server.saveAddress(allData).subscribe((response:any) => {

    this.nav.navigateBack('/checkout');

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

  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
  
  //wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
    
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();

    this.placeid = item.place_id;

    this.geocodePlaceId(geocoder,this.map,infowindow);

    this.ClearAutocomplete();
  }
  
  geocodePlaceId(geocoder, map, infowindow) {
        geocoder.geocode(
          {
            placeId: this.placeid
          },
          (results, status) => {
            if (status === "OK") {
              if (results[0]) {
              
              this.map.setZoom(16);
              this.map.setCenter(results[0].geometry.location);

              } else {
                window.alert("No results found");
              }
            } else {
              window.alert("Geocoder failed due to: " + status);
            }
          }
        );
      }
  
  //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }


}
