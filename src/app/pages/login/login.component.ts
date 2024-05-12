import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    MatFormField,
    MatInput,
    MatButton,
    MatCard,
    MatCardTitle
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    })
  });

  errorMessage: string = '';
  constructor(private auth: AuthService, private router: Router) { }

  async onLoginPressed(): Promise<void> {
    this.loginFormGroup.get('email')?.markAsDirty();
    this.loginFormGroup.get('password')?.markAsDirty();

    if (this.loginFormGroup.get('email')?.invalid || this.loginFormGroup.get('password')?.invalid)
      return;

    try {
      await this.auth.login(this.loginFormGroup.get('email')?.value, this.loginFormGroup.get('password')?.value).then(async task => {
        await this.router.navigate(['/']);
      })

    } catch (error) {
      this.errorMessage = 'Invalid e-mail or password!';
    }
  }

}
