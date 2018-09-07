import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CryptoSearchPage } from './crypto-search';

@NgModule({
  declarations: [
    CryptoSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(CryptoSearchPage),
  ],
})
export class CryptoSearchPageModule {}
