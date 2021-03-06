import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {MeteorObservable} from 'meteor-rxjs';
import { PaginationService } from 'ng2-pagination';
import { Counts } from 'meteor/tmeasday:publish-counts';

import 'rxjs/add/operator/combineLatest';

import {Parties} from '../../../../both/collections/parties.collection';
import {Party} from '../../../../both/models/party.model';

import template from './parties-list.component.html';


interface Pagination {
  limit: number;
  skip: number;
}
 
interface Options extends Pagination {
  [key: string]: any
}

@Component({selector: 'parties-list', template})
export class PartiesListComponent implements OnDestroy,OnInit 
{
  parties : Observable < Party[] >;
  partiesSub : Subscription;
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  partiesSize: number = 0;
  autorunSub: Subscription;
  location: Subject<string> = new Subject<string>();

  constructor(
     private paginationService: PaginationService
  ) {
    //this.parties = Parties.find({}).zone();
  }

  ngOnInit() {

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder,
      this.location
    ).subscribe(([pageSize, curPage, nameOrder, location]) => {
        const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: { name: nameOrder as number }
      };
      this.paginationService.setCurrentPage(this.paginationService.defaultId.toString(), curPage as number);
         if (this.partiesSub) {
        this.partiesSub.unsubscribe();
      }
      this.partiesSub = MeteorObservable.subscribe('parties', options, location).subscribe(() => {
        this.parties = Parties.find({},{sort : {name : nameOrder}}).zone();

      });
    });
    this.paginationService.register({
      id : this.paginationService.defaultId.toString(),
      itemsPerPage : 10,
      currentPage : 1,
      totalItems: this.partiesSize
    });

    this.pageSize.next(10);
    this.curPage.next(1);
    this.nameOrder.next(1);
    this.location.next('');

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.partiesSize = Counts.get('numberOfParties');
      this.paginationService.setTotalItems(this.paginationService.defaultId.toString(), this.partiesSize);
    });
  }


  removeParty(party : Party) : void {
    Parties.remove(party._id);
  }

onPageChanged(page: number): void {
    this.curPage.next(page);
  }
  changeSortOrder(nameOrder: string): void {
    this.nameOrder.next(parseInt(nameOrder));
  }
 
  ngOnDestroy() {
    this.partiesSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
  }

  search(value : string) : void {
    this.curPage.next(1);
    this.location.next(value);
  }
}