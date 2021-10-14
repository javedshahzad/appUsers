import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  BannerOption = {
    initialSlide: 0,
    slidesPerView: 1.3,
    loop: true,
    centeredSlides: false,
    autoplay:false,
    speed: 500,
    spaceBetween:7,

  }

  sl:any = [1,2,3,4,5];

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
