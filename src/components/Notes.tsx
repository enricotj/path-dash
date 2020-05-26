import React from 'react';

/*

TODO:
- Note re-ordering (drag & drop, keyboard control, etc.)
- Insert notes in stack functionality (similar to how you insert columns to a table in Word?)
- Add keyboard shortcut to go back to previously edited note
- Import from CSV
- List virtualization
- Hook up Firebase
- Hook up Redux
- Refactor out stylings

COMMAND LINE UPGRADES:
- Color coded tags
- 'bang' commands: !loot or !treasure, for example
- @mentions (with auto-complete and fuzzy match)
  - Modal to add new NPC if no mention found

*/

export const Notes = (): React.ReactElement => {
  const [ text, setText ] = React.useState('');
  const [ notes, setNotes ] = React.useState<string[]>([]);
  const [ editIndex, setEditIndex ] = React.useState(-1);
  const [ editText, setEditText ] = React.useState('');
  const [ delIndex, setDelIndex ] = React.useState(-1);
  const textRef = React.createRef<HTMLInputElement>();
  const delConfirmRef = React.createRef<HTMLButtonElement>();

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
  
  // Save in-line note edit.
  const editNote = React.useCallback(
    (newEditIndex, disableTextFocus?: boolean) => {
      if (editIndex >= 0) {
        let newNotes = notes;
        newNotes[editIndex] = editText;
        setNotes(newNotes);
      }
      if ((newEditIndex < 0) && textRef.current && !disableTextFocus) {
        textRef.current.focus();
      }
      setEditIndex(newEditIndex);
    }, [notes, editIndex, editText, textRef.current]);

  // Save the in-line note edit on 'Enter'.
  const onEditKeyDown = React.useCallback(
    (ev: React.KeyboardEvent): void => {
      if (ev.key === 'Enter') {
        editNote(-1);
      }
    }, [editNote]);
  
  // Ensure that the text field for the note we are currently editing properly updates.
  const onEdit = React.useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
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
    }
  }, [onStartEdit]);

  React.useEffect(() => {
    if ((delIndex >= 0) && delConfirmRef.current) {
      // When the user tries to delete a note, ensure that the 'delete' button of 
      // the modal confirmation dialog receives immediate focus.
      delConfirmRef.current.focus();
    } else if (textRef.current) {
      // If the user has closed the modal delete confirmation dialog, refocus on the text field.
      textRef.current.focus();
    }
  }, [delIndex, delConfirmRef.current, textRef.current]);

  // Map the list of notes to their appropriate HTML elements.
  const noteItems =
    notes.map((note, index) => {
      // If a note is being edited, render it as a text box.
      if (index === editIndex) {
        return (
          <textarea
            className='list-item textarea is-focused has-fixed-size'
            onFocus={ (ev: React.FocusEvent<HTMLTextAreaElement>) => { ev.target.select() } }
            autoFocus
            key={ index }
            value={ editText }
            onKeyDown={ onEditKeyDown }
            onChange={ onEdit }
            onBlur={ () => editNote(-1, true /* disableTextFocus */) } /> );
      }

      // Otherwise, the note should be rendered as a link with a 'delete' button.
     return (
      <a
        className='list-item'
        key={ index }
        tabIndex={ 0 }
        title={ note }
        onClick={ () => { onStartEdit(note, index); } }
        onKeyDown={ (ev) => { onNoteKeyDown(ev, note, index); } }>
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
    });

  return (
    <div style={ { width: '100%', height: '100%' } }>

      { /* Text box to enter new notes */ }
      <input ref={ textRef } className='input' type='text' autoFocus value={ text } onKeyDown={ onKeyDown } onChange={ onChange } />
      
      { /* List of notes */ }
      <div className='panel list is-hoverable' style={ { marginTop: '10px', height: '90%%', maxWidth: '100%' } }>
        { noteItems }
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
            <button className='button is-danger' ref={delConfirmRef} onClick={() => deleteNote(delIndex) }>Delete</button>
            <button className='button' onClick={ () => { setDelIndex(-1); } }>Cancel</button>
          </footer>
        </div>
        <button className='modal-close is-large' aria-label='close'></button>
      </div>
    </div>
  );
};
