import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {map, Subscription} from "rxjs";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCard, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatCard,
    MatCardTitle,
    MatButton
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  subName: string | null = '';

  createPostFormGroup: FormGroup = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    desc: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    })
  });

  constructor(private auth: AuthService, private data: DataService, private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.route.paramMap
      .pipe(
        map(params => params.get('sub'))
      )
      .subscribe(async subName => {
        if (subName != null && await this.data.checkSubExists(subName)) {
          this.subName = subName;
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onCreatePressed(): Promise<void> {
    console.log(this.subName);
    this.createPostFormGroup.get('title')?.markAsDirty();
    this.createPostFormGroup.get('desc')?.markAsDirty();

    if (this.createPostFormGroup.get('name')?.invalid || this.createPostFormGroup.get('desc')?.invalid)
      return;

    const user = this.auth.user != null ? await this.data.getUserFromEmail(this.auth.user?.email) : null;

    if (user != null ) {
      if (this.subName != null) {
        await this.data.uploadPost({
          title: this.createPostFormGroup.get('title')?.value,
          author: user.username,
          desc: this.createPostFormGroup.get('desc')?.value,
          id: Math.floor(Date.now() / 1000).toString() + "_" + user.username,
          parent: this.subName
        }, this.subName);
        await this.router.navigate(['/' + this.subName]);
      }
      else {
        alert("An error occured while getting the sub!");
      }
    }
    else {
      alert("An error occured while getting the user!");
    }
  }
}
