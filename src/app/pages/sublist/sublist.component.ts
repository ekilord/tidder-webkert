import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {DataService} from "../../services/data.service";
import {Sub} from "../../models/Sub";
import {NgForOf, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatCard, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sublist',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatButton,
    NgStyle
  ],
  templateUrl: './sublist.component.html',
  styleUrl: './sublist.component.css'
})
export class SublistComponent implements OnInit, OnDestroy {
  subs: Sub[] = []
  private subscription: Subscription = new Subscription();

  constructor(private data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.getSubs().subscribe(subs => {
      this.subs = subs;
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
