import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateService {
  private article = new BehaviorSubject<string>('');
  dragableValue = this.article.asObservable();

  getArticle(dragableArticle: string) {
    this.article.next(dragableArticle);
  }

  // decrement() {
  //   this._counter.next(this._counter.value - 1);
  // }
}