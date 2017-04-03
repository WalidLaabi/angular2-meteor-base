import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Meteor } from 'meteor/meteor';
//injection test 
import { InjectUser } from 'angular2-meteor-accounts-ui';
 
import { Parties } from '../../../../both/collections/parties.collection';

import template from './parties-form.component.html';
 
@Component({
  selector: 'parties-form',
  template
})
//injectoin user dependences
@InjectUser('user')
export class PartiesFormComponent implements OnInit {
  addForm: FormGroup;
 
  constructor(
    private formBuilder: FormBuilder
  ) {}
  //appele user 
  user: Meteor.User;
  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [],
      location: ['', Validators.required],
      public : [false]
    });
    console.log(this.user);
  }

  addParty(): void {
    if (!Meteor.userId()) {
      alert('Please log in to add a party');
      return;
    }

    if (this.addForm.valid) {
      Parties.insert((<any>Object).assign({}, this.addForm.value, { owner: Meteor.userId() }));
 
      this.addForm.reset();
    }
  }
}