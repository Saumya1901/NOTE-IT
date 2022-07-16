import { Component, OnInit, ViewChild , ElementRef} from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';
import { trigger, transition, style, animate, query, stagger} from '@angular/animations';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // ENTRY ANIMATION
      transition('void => *', [
        // Initial state
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          // we have to 'expand' out the padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }),
        // we first want to animate the spacing (which includes height and margin)
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingLeft: '*',
          paddingRight: '*',
        })),
        animate(68)
      ]),

      transition('* => void', [
        // first scale up
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        // then scale down back to normal size while beginning to fade out
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        // scale down and fade out completely
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
        })),
        // then animate the spacing (which includes height, margin and padding)
        animate('150ms ease-out', style({
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
          'margin-bottom': '0',
        }))
      ])
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})

export class NotesListComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  filteredNotes:Note[]=new Array<Note>();

  @ViewChild('filterInput') filterInputElRef:ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
   this.notes = this.notesService.getAll();
 //  this.filteredNotes=this.notesService.getAll();
 this.filter('');

  }
  deleteNote(note :Note){
    let id=this.notesService.getId(note);
    this.notesService.delete(id);
    this.filter(this.filterInputElRef.nativeElement.value);
  }
generateNoteURL(note:Note){
  let id=this.notesService.getId(note);
  
  
  return id;
}
  filter(query:string){
    let val = query.toLowerCase();
    val=val.trim();
    console.log(val);
    query=val;
    let allResults:Note[] = new Array<Note>();

    //spilt up the search string in individual words
    let terms:string[]=query.split(' ');

    //remove duplicate search terms
    terms=this.removeDuplicates(terms);

    //complie all relevant results in allResults array
    terms.forEach(term =>{
      let results:Note[]=this.relevantNotes(term);
      //append results to all results array
      allResults=[...allResults, ...results]
    });

    //all results include dpulicate notes cause one note can be resul;t of many search term
    let uniqueResults=this.removeDuplicates(allResults);
    this.filteredNotes=uniqueResults;

    this.sortByRelevancy(allResults);



  }

  removeDuplicates(arr:Array<any>): Array<any> {
    let uniqueResults:Set<any>=new Set<any>();
    arr.forEach(e=>uniqueResults.add(e));
    return Array.from(uniqueResults);


  }
  relevantNotes(query:any):Array<Note>{
    let val = query.toLowerCase();
    val=val.trim();
    console.log(val);
    query=val;
    let relevantNotes=this.notes.filter(note =>{
      //true wen match
      if(note.title && note.title.toLowerCase().includes(query)){
        return true;

      }
      else if(note.body && note.body.toLowerCase().includes(query)){
        return true;

      }
      else{
        return false;
      }

    })
    return relevantNotes;
  }
  sortByRelevancy(searchResult :Note[]){
    //sorting the search result

    let noteCountObj: {[key: string | number]: any} = {}; //format -key:value =>Noteid:number (note object id:count)
    searchResult.forEach(note=>{
      let noteId=this.notesService.getId(note);
      if(noteCountObj[noteId]){
        noteCountObj[noteId] += 1;

      }
      else{
        noteCountObj[noteId]=1;
      }
    })
    this.filteredNotes=this.filteredNotes.sort((a:Note,b:Note) =>{
      let aId=this.notesService.getId(a);
      let bId=this.notesService.getId(b);
      let aCount=noteCountObj[aId];
      let bcount=noteCountObj[bId];
      return bcount-aCount;
    });
  }

  
}
