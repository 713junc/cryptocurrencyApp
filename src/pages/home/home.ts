import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CryptoDataProvider } from '../../providers/crypto-data/crypto-data';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import { CryptoSearchPage } from '../crypto-search/crypto-search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  detailToggle = [];
  objectKeys = Object.keys;
  coins: Object;
  details: Object;
  likedCoins = [];
  chart = [];

  constructor(
    public navCtrl: NavController,
    private CryptoData: CryptoDataProvider,
    private storage: Storage,
    public loading: LoadingController
  ) {
    this.storage.remove('likedCoins');
  }

  ionViewDidLoad() {}

  //lifecycle hook that i want to add a call to refresh coins
  ionViewWillEnter() {
    this.refreshCoins();
  }

  refreshCoins() {
    let loader = this.loading.create({
      content: 'Refreshing..',
      spinner: 'bubbles'
    });

    loader.present().then(() => {
      this.storage.get('likedCoins').then(val => {
        // If the value is not set, then:
        if (!val) {
          this.likedCoins.push('BTC', 'ETH', 'IOT');
          this.storage.set('likedCoins', this.likedCoins);

          this.CryptoData.getCoins(this.likedCoins).subscribe(res => {
            this.coins = res;
            loader.dismiss();
          });
        }
        // It's set
        else {
          this.likedCoins = val;

          this.CryptoData.getCoins(this.likedCoins).subscribe(res => {
            this.coins = res;
            loader.dismiss();
          });
        }
      });
    });
  }

  coinDetails(coin, index) {
    if (this.detailToggle[index]) {
      this.detailToggle[index] = false;
    } else {
      this.detailToggle.fill(false);

      this.CryptoData.getCoin(coin).subscribe(res => {
        this.details = res['DISPLAY'][coin]['USD'];

        this.detailToggle[index] = true;

        this.CryptoData.getChart(coin).subscribe(res => {
          let coinHistory = res['Data'].map(a => a.close);

          setTimeout(() => {
            this.chart[index] = new Chart('canvas' + index, {
              type: 'line',
              data: {
                labels: coinHistory,
                datasets: [
                  {
                    data: coinHistory,
                    borderColor: '#3cba9f',
                    fill: false
                  }
                ]
              },

              options: {
                tooltips: {
                  callbacks: {
                    label: function(tooltipItems, data) {
                      return '$' + tooltipItems.yLabel.toString();
                    }
                  }
                },

                responsive: true,

                legend: {
                  display: false
                },

                scales: {
                  xAxes: [
                    {
                      display: false
                    }
                  ],
                  yAxes: [
                    {
                      display: false
                    }
                  ]
                }
              }
            });
          }, 250);
        });
      });
    }
  }

  swiped(index) {
    this.detailToggle[index] = false;
  }

  removeCoin(coin) {
    this.detailToggle.fill(false);

    this.likedCoins = this.likedCoins.filter(function(item) {
      return item != coin;
    });

    this.storage.set('likedCoins', this.likedCoins);

    setTimeout(() => {
      this.refreshCoins();
    }, 300);
  }

  showSearch() {
    this.navCtrl.push(CryptoSearchPage);
  }
}
