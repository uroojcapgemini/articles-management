import { Directive, HostListener, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appShared]'
})
export class SharedDirective {

  @HostBinding('style.color') backgroundColor: string | undefined;

  constructor(private elemref: ElementRef) { 
  }

  ngAfterViewInit(){
    this.elemref.nativeElement.style.color = "green";
  }


  // @HostListener('mouseover') mouseover(){
  //   this.backgroundColor = 'blue';
  // }
}
