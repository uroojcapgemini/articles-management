import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateService {
  private _counter = new BehaviorSubject<number>(0);
  public readonly counter$: Observable<number> = this._counter.asObservable();

  increment() {
    this._counter.next(this._counter.value + 1);
  }

  decrement() {
    this._counter.next(this._counter.value - 1);
  }
}