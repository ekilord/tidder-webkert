import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {DataService} from "../../services/data.service";
import {Sub} from "../../models/Sub";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatCard, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {Subscription} from "rxjs";
import {Auth} from "@angular/fire/auth";

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
    NgStyle,
    NgIf
  ],
  templateUrl: './sublist.component.html',
  styleUrl: './sublist.component.css'
})
export class SublistComponent implements OnInit, OnDestroy {
  subs: Sub[] = []
  isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private data: DataService, private auth: Auth) { }

  ngOnInit() {
    this.subscription = this.data.getSubs().subscribe(subs => {
      this.subs = subs;
    });
    if (this.auth.currentUser != null) {
      this.isLoggedIn = true;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
