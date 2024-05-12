import {Component, OnInit} from '@angular/core';
import {User} from "../../models/User";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User = {} as User;

  constructor(private data: DataService, private auth: AuthService) {}

  async ngOnInit() {
    const userEmail = this.auth.user?.email;
    if (userEmail) this.user = await this.data.getUserFromEmail(userEmail);
  }
}
