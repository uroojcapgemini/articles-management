import { Component } from '@angular/core';
import { StateService } from '../state.service';
import { NgIf } from '@angular/common';
import { SharedDirective } from '../shared.directive'
@Component({
  selector: 'app-other',
  imports: [NgIf, SharedDirective],
  templateUrl: './other.component.html',
  styleUrl: './other.component.css'
})
export class OtherComponent {
  article: string = ''
  articleDragged: boolean = false
  constructor(private stateService: StateService){}
  ngOnInit(){
    this.stateService.dragableValue.subscribe((article) => {
      this.article = article;
      this.articleDragged = true;
    });
  }
}
