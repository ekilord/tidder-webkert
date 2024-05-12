import {Component, Injectable, OnInit} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    NgStyle,
    MatToolbarRow
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.authStateChange.subscribe(user => {
      if (user) this.isLoggedIn = !!this.auth.user;
    });
  }

  logout(): void {
    this.auth.logout();
    location.reload();
  }
}
