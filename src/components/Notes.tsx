import React from 'react';

import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { Size } from 'react-virtualized-auto-sizer';
import AutoSizer from 'react-virtualized-auto-sizer';

/*

TODO:
- Refactor out stylings
- Insert notes in stack functionality (similar to how you insert columns to a table in Word?)
- Clean up long function.
- Improve focus behavior (auto-focus back on previously focused note instead of command line, etc.)
- Add keyboard shortcut to go back to previously edited note
- Import from CSV
- Hook up Firebase
- Hook up Redux
- Note re-ordering via keyboard controls

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

export const Notes = (): React.ReactElement => {
  const [ text, setText ] = React.useState('');
  const [ notes, setNotes ] = React.useState<string[]>([]);
  const [ editIndex, setEditIndex ] = React.useState(-1);
  const [ editText, setEditText ] = React.useState('');
  const [ delIndex, setDelIndex ] = React.useState(-1);
  const textRef = React.useRef<HTMLInputElement>(null);
  const editTextRef = React.useRef<HTMLInputElement>(null);
  const delConfirmRef = React.useRef<HTMLButtonElement>(null);

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
  
  // Save current note edit and set new edit index.
  const editNote = React.useCallback(
    (newEditIndex) => {
      if (editIndex >= 0) {
        let newNotes = notes;
        newNotes[editIndex] = editText;
        setNotes(newNotes);
      }
      setEditIndex(newEditIndex);
    }, [notes, editIndex, editText]);

  // Save the note edit on 'Enter'.
  const onEditKeyDown = React.useCallback(
    (ev: React.KeyboardEvent): void => {
      if (ev.key === 'Enter') {
        editNote(-1);
      } else if (ev.key === 'Escape') {
        setEditIndex(-1);
      }
    }, [editNote]);
  
  // Ensure that the text field for the note we are currently editing properly updates.
  const onEdit = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>): void => {
      setEditText(ev.target.value);
    }, []);
  
  // When a note is clicked, start editing it.
  const onStartEdit = React.useCallback((note, index) => {
    editNote(index);
    setEditText(note);
  }, [editNote, setEditText]);

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
    }
  }, [onStartEdit]);

  // Save the edited note onBlur, except if another note is about to be clicked.
  const onEditBlur = React.useCallback(() => {
    editNote(-1);
  }, [editNote]);

  React.useEffect(() => {
    if ((editIndex >= 0) && editTextRef.current) {
      // When the user tries to edit a note, ensure that the editing text area of 
      // the modal dialog receives immediate focus.
      editTextRef.current.focus();
    } else if ((delIndex >= 0) && delConfirmRef.current) {
      // When the user tries to delete a note, ensure that the 'delete' button of 
      // the modal confirmation dialog receives immediate focus.
      delConfirmRef.current.focus();
    } else if (textRef.current) {
      // If the user has closed the modal delete confirmation dialog, refocus on the text field.
      textRef.current.focus();
    }
  }, [editIndex, editTextRef, delIndex, delConfirmRef.current, textRef.current]);

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
      const dragValue = notes[dragIndex];
      // Insert the dragged value into the drop position.
      const finalDropIndex = (dropIndex > dragIndex) ? (dropIndex + 1) : dropIndex;
      const newNotes = [ ...notes.slice(0, finalDropIndex), dragValue, ...notes.slice(finalDropIndex) ];

      // Remove the dragged value from its original position in the new array.
      // The original value's index will be +1 if dragIndex > dropIndex.
      const finalDragIndex = (dragIndex > dropIndex) ? (dragIndex + 1) : (dragIndex);
      setNotes([ ...newNotes.slice(0, finalDragIndex), ...newNotes.slice(finalDragIndex + 1) ]);
    }
  }, [notes]);

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
        className='list-item input is-focused'
        ref={ editTextRef }
        autoFocus
        type='text'
        value={ editText }
        onKeyDown={ onEditKeyDown }
        onChange={ onEdit }
        onBlur={ () => onEditBlur }/>)
      :
      (<a
        className='list-item'
        draggable={ true }
        key={ index }
        tabIndex={ 0 }
        title={ notes[index] }
        onClick={ () => { onStartEdit(note, index); } }
        onKeyDown={ (ev) => { onNoteKeyDown(ev, note, index); } }
        onDragStart={ (ev) => { ev.stopPropagation(); onDragStart(ev, index); } }
        onDragEnter={ (ev) => onDragEnter(ev) }
        onDragExit={ (ev) => onDragExit(ev) }
        onDragOver={ (ev) => ev.preventDefault() }
        onDrop={ (ev) => { onDrop(ev, index); } }>
        <div className='columns is-mobile'>
          <div className='column' style={ { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' } }>
            { note ? note : (<>&nbsp;</>) }
          </div>
          <div className='is-flex' style={ { width: '55px', alignItems:'center', justifyContent:'center' } }>
            <button
              tabIndex={ -1 }
              className='button delete is-danger'
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
    <div className='is-flex' style={ { flexFlow:'column', width:'100%', flexGrow:1 } }>

      { /* Text box to enter new notes */ }
      <input
        style={{ height:'40px' }}
        ref={ textRef }
        className='input'
        type='text'
        autoFocus
        value={ text }
        onKeyDown={ onKeyDown }
        onChange={ onChange }
      />
      
      { /* List of notes in scrollable panel */ }
      <div
        className='panel list is-hoverable'
        tabIndex={-1}
        style={ { overflow:'hidden', marginTop:'10px', marginBottom:'0px', maxWidth:'100%', flexGrow:1 } }
      >
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
