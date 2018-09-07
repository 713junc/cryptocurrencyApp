import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the CryptoDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CryptoDataProvider {
  result: any;

  constructor(public http: HttpClient) {}

  getCoins(coins) {
    let coinlist = '';
    coinlist = coins.join();

    return this.http
      .get(
        'https://min-api.cryptocompare.com/data/pricemulti?fsyms=' +
          coinlist +
          '&tsyms=USD'
      )
      .map(result => (this.result = result));
  }

  getCoin(coin) {
    return this.http
      .get(
        'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' +
          coin +
          '&tsyms=USD'
      )
      .map(result => (this.result = result));
  }

  getChart(coin) {
    return this.http
      .get(
        'https://min-api.cryptocompare.com/data/histoday?fsym=' +
          coin +
          '&tsym=USD&limit=60&aggregate=1'
      )
      .map(result => (this.result = result));
  }

  allCoins() {
    let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');

    return this.http
      .get('https://www.cryptocompare.com/api/data/coinlist/', {
        headers: headers
      })
      .map(result => (this.result = result));
  }
}
