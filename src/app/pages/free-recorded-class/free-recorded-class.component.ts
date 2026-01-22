import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-free-recorded-class',
  templateUrl: './free-recorded-class.component.html',
  styleUrls: ['./free-recorded-class.component.scss']
})
export class FreeRecordedClassComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirect to courses page with free filter
    this.router.navigate(['/courses'], { 
      queryParams: { 
        type: 'recorded-class',
        isFree: 'true' 
      } 
    });
  }
}
