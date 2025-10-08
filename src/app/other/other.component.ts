import { Component } from '@angular/core';
import { StateService } from '../state.service';

@Component({
  selector: 'app-other',
  imports: [],
  templateUrl: './other.component.html',
  styleUrl: './other.component.css'
})
export class OtherComponent {
  article: string = ''

  constructor(private stateService: StateService){}
  ngOnInit(){
    this.stateService.dragableValue.subscribe(article => this.article = article);
  }
}
