import {Component, OnInit} from '@angular/core';
import {User} from "../../models/User";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatFormField,
    MatButton,
    MatError,
    MatInput,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User = {} as User;

  errorMessage: string = '';

  changeFormGroup: FormGroup = new FormGroup({
    newUsername: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true
    })
  });

  constructor(private data: DataService, private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    const userEmail = this.auth.user?.email;
    if (userEmail) this.user = await this.data.getUserFromEmail(userEmail);
  }

  async onChangePressed(): Promise<void> {
    this.changeFormGroup.get('newUsername')?.markAsDirty();

    if (this.changeFormGroup.get('newUsername')?.invalid)
      return;

    await this.data.changeUsername(this.user.username, this.changeFormGroup.get('newUsername')?.value).then(async task => {
      if (task) {
        location.reload();
      }
    }).catch(error => {
      console.log(error);
      this.errorMessage = error.message;
    });
  }

  async onDeletePressed(): Promise<void> {
    await this.data.deleteUser(this.user.username).then(async task => {
      if (task) {
        this.auth.user?.delete().then(async () => {
          location.reload();
          await this.router.navigate(['/']);
        })
      }
    })
  }
}
