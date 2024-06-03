import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.scss']
})
export class ProtectedComponent implements OnInit {

  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router, private apiService: ApiService) { }

  currentPath: string = window.location.origin + window.location.pathname;
  testVar: string = "";

  ngOnInit(): void {
    this.authService.isAuthenticated(this.currentPath);
  }
}
