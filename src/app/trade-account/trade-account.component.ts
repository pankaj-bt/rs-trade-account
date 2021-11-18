import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AngularFireFunctions } from '@angular/fire/functions';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-trade-account',
  templateUrl: './trade-account.component.html',
  styleUrls: ['./trade-account.component.scss'],
  providers : [AngularFireFunctions]
})
export class TradeAccountComponent implements OnInit {
  wid:string;
  showContent = true;
  constructor(
    private fns : AngularFireFunctions,
    private route: ActivatedRoute,
    private _router: Router,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    
    if(this._router.url.includes('trade-account')){
      this.route.queryParamMap.subscribe(queryParams => {
        this.wid = queryParams.get("wid");
     })
      this.getTradeAccountBaseUrl();
    }
    else {
      this.route.queryParamMap.subscribe(queryParams => {
        this.wid = this.route.snapshot.paramMap.get("wid"); //queryParams.get("wid");
        if(this.wid === "" || this.wid === null){
          this.showContent = false;
          // this.ngxLoader.start();
          // alert('Invalid request!'); return false;
        }
     })
  
    }
  }

  getTradeAccountBaseUrl(){
    this.ngxLoader.start();
    if(window.location.host.includes('localhost')){
      this.fns.useFunctionsEmulator('http://localhost:5000'); //functions.useFunctionsEmulator('http://localhost:5000')
    }
    
    const baseUrl = this.fns.httpsCallable('get_system_trade_account_base_url');
    baseUrl({}).subscribe((result) => {
      if(result.outcome==="success"){
        this.ngxLoader.start();
        const tradeAccountPage = this.fns.httpsCallable('get_trade_account_page');
        tradeAccountPage({wid: this.wid}).subscribe((result2) => {
          if(result2.outcome==="success"){
            this.ngxLoader.stop();
            window.location.href = `${result.data}${this.wid}`;  
          } else{
            this.ngxLoader.stop();
            this.showContent = false;
          }
        },err=>{
          this.ngxLoader.stop();
          this.showContent = false;
        });
      }
      else {
        this.ngxLoader.stop();
        this.showContent = false;
      }
    },err=>{
      this.ngxLoader.stop();
      this.showContent = false;
    });
  }

}
