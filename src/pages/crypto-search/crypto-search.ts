import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CryptoDataProvider } from '../../providers/crypto-data/crypto-data';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the CryptoSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crypto-search',
  templateUrl: 'crypto-search.html'
})
export class CryptoSearchPage {
  objectKeys = Object.keys;
  likedCoins = [];
  raw = [];
  allcoins:any;
  liked = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController,
    private data: CryptoDataProvider,
    private storage: Storage
  ) {}

  ionViewDidLoad() {
    let loader = this.loading.create({
      content: 'Refreshing..',
      spinner: 'bubbles'
    });

    loader.present().then(() => {
      this.storage.get('likedCoins').then(val => {
        this.likedCoins = val;
      });

      this.data.allCoins().subscribe(res => {
        console.log(res);
        this.raw = res['Data'];
        this.allcoins = res['Data'];

        loader.dismiss();

        this.storage.get('likedCoins').then(val => {
          this.liked = val;
        });
      });
    });
  }

  addCoin(coin) {
    this.likedCoins.push(coin);
    this.storage.set('likedCoins', this.likedCoins);
  }

  searchCoins(ev: any) {

    let val = ev.target.value;

    this.allcoins = this.raw;

    if (val && val.trim() != '') {

      const filtered = Object.keys(this.allcoins)
        .filter(key => val.toUpperCase().includes(key))
        .reduce((obj,key) => {
          obj[key] = this.allcoins[key];
          return obj;
        }, {});

      this.allcoins = filtered;

    }
  }

}
