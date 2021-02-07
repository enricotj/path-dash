import React from 'react';

import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { Size } from 'react-virtualized-auto-sizer';

import styles from './Notes.scss';

/*

TODO:
- Insert notes in stack functionality (similar to how you insert columns to a table in Word?)
- Clean up long function.
- Improve focus behavior (auto-focus back on previously focused note instead of command line, etc.)
- Add keyboard shortcut to go back to previously edited note
- Import from CSV
- Hook up Firebase
- Hook up Redux
- Note re-ordering via keyboard controls
- Archiving
  - Automatic archiving (for sessions)
  - Manual archiving

COMMAND LINE UPGRADES:
- Color coded tags
- 'bang' or 'slash' commands: !loot or !treasure or /loot, for example
- @mentions (with auto-complete and fuzzy match)
  - Modal to add new NPC if no mention found

*/

const LIST_PADDING = 5;

const outerListContainer = React.forwardRef((props: any, ref: any) => (
  <div ref={ref} tabIndex={-1} {...props}>
    { props.children }
  </div>
));

interface EditState {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

export const Notes = (): React.ReactElement => {
  const [ text, setText ] = React.useState('');
  const [ notes, setNotes ] = React.useState<string[]>([]);
  const [ editState, setEditState ] = React.useState<EditState>({ text: '', selectionStart: 0, selectionEnd: 0});
  const [ editIndex, setEditIndex ] = React.useState(-1);
  const [ focusIndex, setFocusIndex ] = React.useState(-1);
  const [ delIndex, setDelIndex ] = React.useState(-1);
  const textRef = React.useRef<HTMLInputElement>(null);
  const editTextRef = React.useRef<HTMLInputElement>(null);
  const delConfirmRef = React.useRef<HTMLButtonElement>(null);
  const focusRef = React.useRef<HTMLAnchorElement>(null);

  // BEGIN test data
  //
  React.useEffect(() => {
    let i: number = 0;
    let initNotes: string[] = [];
    for (i = 0; i < 1000; i++) { 
      initNotes.push(i.toString());
    }
    setNotes(initNotes);
  }, [false]);
  //
  // END test data

  // Save the text to the list of notes on 'Enter'.
  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent): void => {
      if (ev.key === 'Enter') {
        setNotes([ text, ...notes ]);
        setText('');
      }
    }, [text, notes]);
  
  // Ensure that the text field for the note entry properly updates.
  const onChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>): void => {
      setText(ev.target.value);
    }, []);

  const onFocus = React.useCallback(() => {
    setEditIndex(-1);
    setFocusIndex(-1);
  }, []);
  
  // Save current note edit and set new edit index.
  const editNote = React.useCallback(
    (newEditIndex) => {
      if (editIndex >= 0) {
        let newNotes = notes;
        newNotes[editIndex] = editState.text;
        setNotes(newNotes);
      }
      setEditIndex(newEditIndex);
    }, [notes, editIndex, editState]);
  
  // Whenever the notes change, make sure the cursor reverts back to original position on note edit.
  const onEditFocus = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    ev.target.selectionStart = editState.selectionStart;
    ev.target.selectionEnd = editState.selectionEnd;
  }, [editState.selectionStart, editState.selectionEnd]);

  // Save the note edit on 'Enter'.
  const onEditKeyDown = React.useCallback(
    (ev: React.KeyboardEvent): void => {
      if (ev.key === 'Enter' || ev.key === 'Tab') {
        editNote(-1);
      } else if (ev.key === 'Escape') {
        setEditIndex(-1);
      }
    }, [editNote]);
  
  // Ensure that the text field for the note we are currently editing properly updates.
  const onEdit = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>): void => {
      setEditState({
        text: ev.target.value,
        selectionStart: ev.target.selectionStart || 0,
        selectionEnd: ev.target.selectionEnd || 0
      });
    }, []);
  
  // When a note is clicked, start editing it.
  const onStartEdit = React.useCallback((note: string, index) => {
    editNote(index);
    setEditState({
      text: note,
      selectionStart: 0,
      selectionEnd: note.length
    });
  }, [editNote, setEditState]);

  // Delete the note at the given index of the array.
  const deleteNote = React.useCallback((delIndex) => {
    setDelIndex(-1);
    setNotes(notes.filter((value, index) => (index !== delIndex)));
  }, [notes]);

  // Ensure that notes can be edited and deleted using the keyboard.
  const onNoteKeyDown = React.useCallback((ev: React.KeyboardEvent, note, index) => {
    if (ev.key === 'Enter') {
      onStartEdit(note, index);
      ev.preventDefault();
    } else if (ev.key === 'Backspace' || ev.key === 'Delete' ) {
      setDelIndex(index);
      ev.preventDefault();
    } else if (ev.key === 'Escape') {
      setFocusIndex(-1);
    }
  }, [onStartEdit]);

  React.useEffect(() => {
    if ((editIndex >= 0) && editTextRef.current) {
      // When the user tries to edit a note, ensure that the editing text area of 
      // the modal dialog receives immediate focus.
      setFocusIndex(editIndex);
      editTextRef.current.focus();
    } else if ((editIndex < 0) && (focusIndex >= 0)  && focusRef.current) {
      console.log(focusRef.current);
      focusRef.current.focus();
    } else if ((focusIndex < 0) && textRef.current) {
      textRef.current.focus();
    }
  }, [editIndex, focusIndex, editTextRef.current, focusRef.current, textRef.current]);

  React.useEffect(() => {
    if ((delIndex >= 0) && delConfirmRef.current) {
      // When the user tries to delete a note, ensure that the 'delete' button of 
      // the modal confirmation dialog receives immediate focus.
      delConfirmRef.current.focus();
    } else if (textRef.current && (delIndex < 0)) {
      // If the user has closed the modal delete confirmation dialog, refocus on the text field.
      textRef.current.focus();
    }
  }, [delIndex, delConfirmRef.current, textRef.current]);

  // BEGIN Drag & Drop list reordering logic
  //
  const onDragStart = React.useCallback((ev: React.DragEvent<HTMLElement>, index) => {
    ev.dataTransfer.setData('index', index);
    ev.currentTarget.focus();
  }, [editNote]);

  const onDrop = React.useCallback((ev: React.DragEvent, dropIndex) => {
    ev.currentTarget.classList.remove('has-background-primary');
    const dragIndex = parseInt(ev.dataTransfer.getData('index'));
    if (dragIndex !== dropIndex) {

      // Resolve any values currently being edited before reordering.
      let newNotes = notes;
      if (editIndex >= 0) {
        newNotes[editIndex] = editState.text;
      }

      const dragValue = notes[dragIndex];
      // Insert the dragged value into the drop position.
      const finalDropIndex = (dropIndex > dragIndex) ? (dropIndex + 1) : dropIndex;
      newNotes = [ ...newNotes.slice(0, finalDropIndex), dragValue, ...newNotes.slice(finalDropIndex) ];

      // Remove the dragged value from its original position in the new array.
      // The original value's index will be +1 if dragIndex > dropIndex.
      const finalDragIndex = (dragIndex > dropIndex) ? (dragIndex + 1) : (dragIndex);
      setNotes([ ...newNotes.slice(0, finalDragIndex), ...newNotes.slice(finalDragIndex + 1) ]);

      setEditIndex(-1);

      const finalFocusIndex = (dropIndex > dragIndex) ? (finalDropIndex - 1) : finalDropIndex;
      setFocusIndex(finalFocusIndex);
    }
  }, [notes, editIndex, editState.text]);

  const onDragEnter = React.useCallback((ev: React.DragEvent) => {
    ev.preventDefault();
    ev.currentTarget.classList.add('has-background-primary');
  }, []);

  const onDragExit = React.useCallback((ev: React.DragEvent) => {
    ev.preventDefault();
    ev.currentTarget.classList.remove('has-background-primary');
  }, []);
  //
  // END Drag & Drop list reordering logic

  // Map the list of notes to their appropriate HTML elements.

  const NoteRow = ({ index, style }: ListChildComponentProps) => {
    const note = notes[index];
    const top = style.top ? style.top.toString() : '0';

    let noteElement = (index === editIndex) ?
      (<input
        className={ styles.noteEditor }
        ref={ editTextRef }
        autoFocus
        type='text'
        value={ editState.text }
        onFocus={ onEditFocus }
        onKeyDown={ onEditKeyDown }
        onChange={ onEdit }/>)
      :
      (<a
        className='list-item'
        draggable={ true }
        key={ index }
        tabIndex={ 0 }
        ref={ (index === focusIndex) ? focusRef : undefined }
        title={ notes[index] }
        onClick={ () => { onStartEdit(note, index); } }
        onKeyDown={ (ev) => { onNoteKeyDown(ev, note, index); } }
        onDragStart={ (ev) => { ev.stopPropagation(); onDragStart(ev, index); } }
        onDragEnter={ (ev) => onDragEnter(ev) }
        onDragExit={ (ev) => onDragExit(ev) }
        onDragOver={ (ev) => ev.preventDefault() }
        onDrop={ (ev) => { onDrop(ev, index); } }>
        <div className='columns is-mobile'>
          <div className={ styles.noteLabel }>
            { note ? note : (<>&nbsp;</>) }
          </div>
          <div className={ styles.noteDeleteContainer }>
            <button
              tabIndex={ -1 }
              className={ styles.noteDeleteBtn }
              onClick={ (ev) => { ev.stopPropagation(); setDelIndex(index); } }
            />
          </div>
        </div>
      </a>);

    return (
      <div
        style={{
          ...style,
          top: `${parseFloat(top) + LIST_PADDING}px`,
          paddingLeft: LIST_PADDING,
          paddingRight: LIST_PADDING }}
      >
        { noteElement }
      </div>);
  };

  return (
    <div className={ styles.notesContainer }>

      { /* Text box to enter new notes */ }
      <input
        ref={ textRef }
        className={ styles.notesInput }
        type='text'
        autoFocus
        value={ text }
        onKeyDown={ onKeyDown }
        onChange={ onChange }
        onFocus={ onFocus }
      />
      
      { /* List of notes in scrollable panel */ }
      <div className={ styles.noteListPanel } tabIndex={-1}>
        <AutoSizer>
          {(size: Size): React.ReactNode => {
            return (
              <List
                height={size.height}
                width={size.width}
                itemCount={notes.length}
                itemSize={45}
                overscanCount={ 3 }
                outerElementType={ outerListContainer }
              >
                { NoteRow }
              </List>);
          }}
        </AutoSizer>
          { /*noteItems*/ }
      </div>

      { /* Modal confirmation dialog for deleting notes. */ }
      <div className={ 'modal' + ((delIndex >= 0) ? ' is-active' : '') }>
        <div className='modal-background'/>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Delete this note?</p>
            <button className='delete' aria-label='close' onClick={ () => { setDelIndex(-1); } }/>
          </header>
          <section className='modal-card-body'>
            { (delIndex >= 0) && notes[delIndex] }
          </section>
          <footer className='modal-card-foot'>
            <button
              className='button is-danger'
              ref={delConfirmRef}
              onClick={() => deleteNote(delIndex) }
            >
              Delete
            </button>
            <button className='button' onClick={ () => { setDelIndex(-1); } }>Cancel</button>
          </footer>
        </div>
        <button className='modal-close is-large' aria-label='close'></button>
      </div>

    </div>
  );
};
