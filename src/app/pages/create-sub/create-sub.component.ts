import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {DataService} from "../../services/data.service";
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatCard, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-create-sub',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatFormField,
    MatError,
    MatButton,
    MatInput,
    MatCard,
    MatCardTitle
  ],
  templateUrl: './create-sub.component.html',
  styleUrl: './create-sub.component.css'
})
export class CreateSubComponent {
  createSubFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    desc: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    })
  });

  constructor(private auth: AuthService, private data: DataService, private router: Router) {
  }

  async onCreatePressed(): Promise<void> {
    let exists = await this.data.checkSubExists(this.createSubFormGroup.get('name')?.value);

    if (exists) {
      this.createSubFormGroup.get('name')?.setErrors({ ...this.createSubFormGroup.get('name')?.errors, exists: true });
    } else if (this.createSubFormGroup.get('name')?.errors) {
      // @ts-ignore
      delete this.signUpFormGroup.get('name')?.errors['exists'];
    }

    this.createSubFormGroup.get('name')?.markAsDirty();
    this.createSubFormGroup.get('desc')?.markAsDirty();

    if (this.createSubFormGroup.get('name')?.invalid || this.createSubFormGroup.get('desc')?.invalid)
      return;

    await this.data.uploadSub({ name: this.createSubFormGroup.get('name')?.value,
      desc: this.createSubFormGroup.get('desc')?.value });

    await this.router.navigate(['/' + this.createSubFormGroup.get('name')?.value]);
  }
}
