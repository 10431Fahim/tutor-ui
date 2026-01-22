import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-free-written',
  templateUrl: './free-written.component.html',
  styleUrls: ['./free-written.component.scss']
})
export class FreeWrittenComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirect to quiz page with written exam mode filter
    this.router.navigate(['/quiz'], { 
      queryParams: { 
        examMode: 'written',
        isFree: 'true' 
      } 
    });
  }
}
