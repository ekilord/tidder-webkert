import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {DataService} from "../../services/data.service";
import {AsyncPipe, NgForOf} from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {BehaviorSubject, Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    MatCard,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    RouterOutlet,
    AsyncPipe
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit, OnDestroy {
  topPosts: Post[] = [];
  private subscription!: Subscription;
  private uniquePostIds = new Set<string>();

  constructor(private data: DataService) {
  }

  ngOnInit() {
    this.subscription = this.data.getTopPostsFromAllSubs().subscribe(posts => {
      posts.forEach(post => {
        if (!this.uniquePostIds.has(post.id)) {
          this.topPosts.push(post);
          this.uniquePostIds.add(post.id);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
