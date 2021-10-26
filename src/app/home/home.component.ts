import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../guards/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isHome!: boolean;
  userName!: string;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.isHome = true;
    this.userName = sessionStorage.getItem('username')!;
  }

  onLogout() {
    sessionStorage.clear();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
