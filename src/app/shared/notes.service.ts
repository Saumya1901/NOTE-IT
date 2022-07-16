import { Injectable } from '@angular/core';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes :Note[]=new Array<Note>();
  constructor() { }

  getAll(){
    return this.notes;
  }
  get(id: number){
    return this.notes[id];
  
  }

  getId(note:Note){
    return this.notes.indexOf(note);
  }
  add(note:Note){
    let newlength=this.notes.push(note);
    let index=newlength-1;
    return index;
  }
  update(id:number, title:string,body:string){
    console.log("id: " + id);    
    let note=this.notes[id];
    console.log(JSON.stringify(note));
    note.title =title;
    note.body=body;
  }
  delete(id:number){
    this.notes.splice(id,1);
  }

}
