import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
 
import template from './app.component.html';

import {Parties} from '../../../both/collections/parties.collection';
import { Party } from '../../../both/models/party.model';
 
@Component({
  selector: 'app',
  template
})
export class AppComponent {
/*
  parties: Observable<Party[]>;
 
  constructor() {
    this.parties = [
      {'name': 'Dubstep-Free Zone',
        'description': 'Can we please just for an evening not listen to dubstep.',
        'location': 'Palo Alto'
      },
      {'name': 'All dubstep all the time',
        'description': 'Get it on!',
        'location': 'Palo Alto'
      },
      {'name': 'Savage lounging',
        'description': 'Leisure suit required. And only fiercest manners.',
        'location': 'San Francisco'
      }
    ];
    this.parties = Parties.find({}).zone();
  }

  removeParty(party: Party): void {
    Parties.remove(party._id);
  }
*/





}