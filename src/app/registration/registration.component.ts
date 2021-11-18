import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm:FormGroup;
  submitted = false;
  contact_type_id:string;
  wid:string;
  successMsg = '';
  errMsg = '';
  constructor(
    private formBuilder: FormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private fns : AngularFireFunctions,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contact_type_id = params.get("contact_type_id");
      this.wid = params.get("wid");
   })
    this.registrationForm = this.formBuilder.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      company: [null, []],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      work_phone: [null, []],
      mobile: [null, []],
      fax: [null, []],
      street: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state_region: [null, [Validators.required]],
      zip_postal: [null, [Validators.required]],
      country: [null, [Validators.required]],
      comments: [null, []],
    })
    
  }


  get fval() {
    return this.registrationForm.controls;
  }


  onFormSubmit():void {
    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }
    let form = this.registrationForm.value;

    if(window.location.host.includes('localhost')){
      this.fns.useFunctionsEmulator('http://localhost:5000');
    }
    const obj = {
      uid : localStorage.getItem('uid'),
      contact_type_id : this.contact_type_id,
      first_name : form.first_name,
      last_name : form.last_name,
      company : form.company,
      showroom : '',
      email : form.email,
      mobile_phone : form.mobile,
      main_phone : form.phone,
      work_phone : form.work_phone,
      fax : form.fax,
      contact_source_id : '',
      owner_contact_id :'',
      notes: form.comments,
      address : form.street+", "+form.city+", "+form.state_region+", "+form.zip_postal,
      address_google : '',
      website_id : this.wid,
      is_trade_account : 'Yes'      
    }
    this.ngxLoader.start();    
    const baseUrl = this.fns.httpsCallable('create_contact');
    baseUrl(obj).subscribe((result) => {
      this.ngxLoader.stop();
      if(result.outcome==="success"){
        // this.successMsg = 'data submitted succesfully!';
        window.location.href = result.redirect_to;
      }
      else {
        this.errMsg = result.message ? result.message : 'Something went wrong!';
      }
    },err=>{
      this.ngxLoader.stop();
      
      this.errMsg = err.details ? err.details : 'Something went wrong!';
    });
  }



}
