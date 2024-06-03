import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.scss']
})
export class ProtectedComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  testVar: string = "";

  ngOnInit(): void {
    this.apiService.fetchNotProtectedData().pipe(take(1)).subscribe(resp => {
      this.testVar = resp.message;
    });
  }
}
