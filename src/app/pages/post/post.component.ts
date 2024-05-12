import {Component, OnInit} from '@angular/core';
import {map} from "rxjs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DataService} from "../../services/data.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Post} from "../../models/Post"
import {Comment} from "../../models/Comment";
import {AuthService} from "../../services/auth.service";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    RouterLink,
    MatFormField,
    MatInput,
    MatButton,
    MatError,
    MatCard,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    NgClass
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  isLoggedIn: boolean = false;
  commentsClass = {
    basicComments: true
  };
  titleClass = {
    postTitle: true
  };

  subName: string | null = '';
  postId: string | null = '';
  post: Post = {} as Post;

  comments: Comment[] = [];

  createCommentFormGroup: FormGroup = new FormGroup({
    text: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    })
  });

  constructor(private route: ActivatedRoute, private data: DataService,
              private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.auth.authStateChange.subscribe(user => {
      if (user) this.isLoggedIn = !!this.auth.user;
    });

    this.route.paramMap
      .pipe(
        map(params => ({
            subName: params.get('sub'),
            postId: params.get('post')
          }))
      )
      .subscribe(async ({ subName, postId }) => {
        await this.data.checkPostExists(subName, postId).then(async post => {
          if (post != null) {
            this.post = post;
            this.subName = subName;
            this.postId = postId;

            if (this.subName != null && this.postId != null) {
              this.data.getComments(this.subName, this.postId).subscribe(comments => {
                this.comments = comments;
              })
            }
          } else await this.router.navigate(["/"]);
        });
      });
  }

  async onCreatePressed(): Promise<void> {
    this.createCommentFormGroup.get('text')?.markAsDirty();

    if (this.createCommentFormGroup.get('text')?.invalid)
      return;

    const user = this.auth.user != null ? await this.data.getUserFromEmail(this.auth.user?.email) : null;

    if (user != null ) {
      if (this.subName != null && this.postId != null) {
        await this.data.uploadComment(this.subName, this.postId, {
          id: Math.floor(Date.now() / 1000).toString() + "_" + user.username,
          text: this.createCommentFormGroup.get('text')?.value,
          author: user.username
        });
        location.reload();
      }
      else {
        alert("An error occured while getting the post!");
      }
    }
    else {
      alert("An error occured while getting the user!");
    }
  }
}
