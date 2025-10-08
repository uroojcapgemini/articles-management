import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { StateService } from './state.service';
import { OtherComponent } from "./other/other.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgFor, ReactiveFormsModule, NgIf, CommonModule, OtherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  list: any[]= [];
  items=[{
    title:'Angular', 
    tag:'React',
    author: 'Vue',
    publishedDate: 'September 1, 2025 11:13:00',
    description: 'Angular applications can leverage RxJS for state management, providing a reactive and efficient way to handle data flow and updates across components.'
  },
  {
    title:'React', 
    tag:'React',
    author: 'Vue',
    publishedDate: 'July 13, 2025 11:13:00',
    description: 'Instantiate the BehaviorSubject with an initial value: A BehaviorSubject requires an initial value upon creation.'
  },
  {
    title:'MongoDB', 
    tag:'React',
    author: 'Vue',
    publishedDate: '2025-09-03',
    description: 'Instantiate the BehaviorSubject with an initial value: A BehaviorSubject requires an initial value upon creation.'
  }
];
  draggedIndex: number | null = null;
  dragOverIndex: number | null = null;

  myForm: FormGroup;
  searchControl = new FormControl();
  searchResults: any[] = [];
  drableArticle: string = '';

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, public stateService: StateService) {
    this.myForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      tag: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
      publishedDate: [''],
      description: ['', [Validators.required]],
    });
     if (typeof window !== 'undefined' && window.localStorage) {

        if(localStorage.getItem('title')!='null'){
        this.myForm.get('title')?.setValue(localStorage.getItem('title'));}
        if(localStorage.getItem('tag')!='null'){
        this.myForm.get('tag')?.setValue(localStorage.getItem('tag'));}
        if(localStorage.getItem('author')!='null'){
        this.myForm.get('author')?.setValue(localStorage.getItem('author'));}
        if(localStorage.getItem('description')!='null'){
        this.myForm.get('description')?.setValue(localStorage.getItem('description'));}
        if(localStorage.getItem('publishedDate')!='null'){
        this.myForm.get('publishedDate')?.setValue(localStorage.getItem('publishedDate'));}
       
        this.myForm.get('title')?.valueChanges.subscribe(newValue => {
              localStorage.setItem('title', newValue);
        });
        this.myForm.get('tag')?.valueChanges.subscribe(newValue => {
              localStorage.setItem('tag', newValue);
        });
        this.myForm.get('author')?.valueChanges.subscribe(newValue => {
              localStorage.setItem('author', newValue);
        });
        this.myForm.get('description')?.valueChanges.subscribe(newValue => {
              localStorage.setItem('description', newValue);
        });
        this.myForm.get('publishedDate')?.valueChanges.subscribe(newValue => {
              localStorage.setItem('publishedDate', newValue);
        });
        if(localStorage.getItem('items')){
          this.list = JSON.parse(localStorage.getItem('items') || '{}');
        }else{
          this.list = this.items
        }
    }
          
  }

  ngOnInit() {
    
    this.stateService.dragableValue.subscribe(article => this.drableArticle = article)
    this.searchControl.valueChanges.pipe(
      debounceTime(100),
    ).subscribe(
        (searchTerm: string) => {
          console.log(searchTerm)
          if (searchTerm) {
            const foundTitle = this.items.filter(title =>title.title.toLowerCase().includes(searchTerm.toLowerCase()));
            console.log(foundTitle)
            if (foundTitle) {
              this.list =  foundTitle;
            } else {
              this.list = [];
            }
            return this.list;
            // return this.http.get<any[]>(`/api/search?q=${searchTerm}`);
          } else {
            this.list = this.items;
            console.log(this.list)
            return this.list;
          }
      });

  }

  get f() {
    return this.myForm.controls;
  }
 
  onSubmit() {
    if (this.myForm.valid) {
      alert('Form submitted successfully!');
      this.list.push(this.myForm.value)

      localStorage.removeItem('title')
      localStorage.removeItem('tag')
      localStorage.removeItem('author')
      localStorage.removeItem('description')
      localStorage.removeItem('publishedDate')
      localStorage.setItem('items', JSON.stringify(this.items))
      this.myForm.reset();
    } else {
      this.myForm.markAllAsTouched(); // show errors
    }
  }
  onDragStart(index: number, ev: DragEvent){
    this.drableArticle = this.list[index].title
    console.log(this.drableArticle)
    this.stateService.getArticle(this.drableArticle);
    this.draggedIndex = index;
    ev.dataTransfer?.setData('text/plain', String(index));
    ev.dataTransfer?.setDragImage(this.makeGhost(ev), 10, 10);

    if(ev.dataTransfer)
      ev.dataTransfer.effectAllowed = 'move';
  }

  onDragOver(index: number, ev: DragEvent){
    ev.preventDefault();
    this.dragOverIndex = index;
    if(ev.dataTransfer)
      ev.dataTransfer.dropEffect = 'move';
  }

  onDragLeave(index: number){
    if(this.dragOverIndex===index)
      this.dragOverIndex = null;
  }

  onDrop(index: number, ev: DragEvent){
    ev.preventDefault();
    let from = this.draggedIndex;
    const dtIndex = ev.dataTransfer?.getData('text/plain');
    if(from==null && dtIndex!=null && dtIndex!==''){
      from=parseInt(dtIndex, 10);
    }
    if(from!=null && from !==index){
      this.moveItem(from , index);
    }

    this.clearDragState();
  }

  onDragEnd(){
    this.clearDragState();
  }

  private moveItem(from: number, to: number){
    const updated = [...this.list];
    const [moved] = updated.splice(from, 1);
    const insertAt =from < to ? to - 1: to;
    updated.splice(insertAt, 0, moved);
    this.list = updated;
  }

  private clearDragState(){
    this.dragOverIndex = null;
    this.draggedIndex = null;
  }

  private makeGhost(ev: DragEvent){
    const canvas=document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas;
  }

  trackByIndex(i: number){ return i;}

  updateInternalState() {
    // Manually trigger change detection if internal state changes need to be reflected
    this.cdr.detectChanges(); 
  }

  resetApplication(){
    console.log('dddddddddddddddd')
    this.list = this.items;
    this.myForm.reset();
    localStorage.removeItem('title')
    localStorage.removeItem('tag')
    localStorage.removeItem('author')
    localStorage.removeItem('description')
    localStorage.removeItem('publishedDate')
    localStorage.removeItem('items')
  }

  previewArticle(){
     const myDialog: any = document?.getElementById('myDialog');
    const openDialogBtn: any = document.getElementById('openDialog');
    const closeDialogBtn: any = document.getElementById('closeDialog');

    openDialogBtn?.addEventListener('click', () => {
      myDialog.showModal(); // For a modal dialog (blocks interaction with the rest of the page)
      // Or: myDialog.show(); // For a non-modal dialog
    });

    closeDialogBtn?.addEventListener('click', () => {
      myDialog.close();
    });
  }
}
