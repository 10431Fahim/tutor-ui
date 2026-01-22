import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-free-mcq',
  templateUrl: './free-mcq.component.html',
  styleUrls: ['./free-mcq.component.scss']
})
export class FreeMcqComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirect to quiz page - free quizzes are handled in quiz component
    this.router.navigate(['/quiz']);
  }
}
