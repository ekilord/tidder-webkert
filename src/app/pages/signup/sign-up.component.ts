import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl, ValidatorFn
} from "@angular/forms";
import { Validators } from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {DataService} from "../../services/data.service";
import {NgIf} from "@angular/common";
import {MatCard, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatButton,
    MatError
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  signUpFormGroup: FormGroup = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true
    }),
    passwordsFormGroup: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
        nonNullable: true
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    })
  });

  constructor(private auth: AuthService, private data: DataService, private router: Router) {
    this.signUpFormGroup.get('password')?.statusChanges.subscribe(
      () => this.signUpFormGroup.get('confirmPassword')?.updateValueAndValidity()
    );
  }

  passwordMismatchValidator: ValidatorFn = (control) =>
    control.value === this.signUpFormGroup.get("passwordsFormGroup.password")?.value ? null : { passwordMismatch: { value: true } };


  ngOnInit() {
    this.signUpFormGroup.get("passwordsFormGroup.confirmPassword")?.addValidators(this.passwordMismatchValidator);
  }

  async onRegisterPressed(): Promise<void> {
    let exists = await this.data.checkUserData(this.signUpFormGroup.get('username')?.value,
      this.signUpFormGroup.get('email')?.value);

    if (exists.email) {
      this.signUpFormGroup.get('email')?.setErrors({ ...this.signUpFormGroup.get('email')?.errors, exists: true });
    } else if (this.signUpFormGroup.get('email')?.errors) {
      // @ts-ignore
      delete this.signUpFormGroup.get('email')?.errors['exists'];
    }

    if (exists.username) {
      this.signUpFormGroup.get('username')?.setErrors({ ...this.signUpFormGroup.get('username')?.errors, exists: true });
    } else if (this.signUpFormGroup.get('username')?.errors){
      // @ts-ignore
      delete this.signUpFormGroup.get('username')?.errors['exists'];
    }

    this.signUpFormGroup.get('username')?.markAsDirty();
    this.signUpFormGroup.get('email')?.markAsDirty();
    this.signUpFormGroup.get('passwordsFormGroup.password')?.markAsDirty();
    this.signUpFormGroup.get('passwordsFormGroup.confirmPassword')?.markAsDirty();

    if (this.signUpFormGroup.get('username')?.invalid || this.signUpFormGroup.get('email')?.invalid ||
      this.signUpFormGroup.get('passwordsFormGroup.password')?.invalid ||
      this.signUpFormGroup.get('passwordsFormGroup.confirmPassword')?.invalid)
      return;

    await this.auth.register(this.signUpFormGroup.get('email')?.value,
      this.signUpFormGroup.get('passwordsFormGroup.password')?.value);
    await this.data.uploadUserData({ username: this.signUpFormGroup.get('username')?.value,
                                              email: this.signUpFormGroup.get('email')?.value });

    await this.router.navigate(['/']);
  }

}
