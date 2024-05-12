import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {map, Subscription} from "rxjs";
import {DataService} from "../../services/data.service";
import {NgForOf, NgStyle} from "@angular/common";
import {Post} from "../../models/Post";
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-sub',
  standalone: true,
  imports: [
    RouterOutlet,
    NgForOf,
    RouterLink,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatButton,
    NgStyle
  ],
  templateUrl: './sub.component.html',
  styleUrl: './sub.component.css'
})
export class SubComponent implements OnInit, OnDestroy{
  private subscription: Subscription = new Subscription();

  subName: string = '';

  posts: Post[] = [];

  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.subscription = this.route.paramMap
      .pipe(
        map(params => params.get('sub'))
      )
      .subscribe(async subName => {
        if (subName != null) {
          this.data.checkSubExists(subName).then(async exists => {
            if (exists) {
              this.subName = subName;

              this.data.getPosts(this.subName).subscribe(posts => {
                this.posts = posts;
              })
            } else await this.router.navigate(["/"]);
          })
        }
        else await this.router.navigate(["/"]);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
