import React from 'react';

import { AbilityScore, Ability } from './AbilityScore';

export const CharSheet = (): React.ReactElement => {

  // Render list of ability score controls.
  const abilities = Object.entries(Ability).map(([key, val]) => (<AbilityScore key={ key } ability={ val as Ability } />));

  return (
    <>
      <label className='label is-large'>Name</label>
      <input className='input' type='text' placeholder='' />

      <label className='label is-large'>Race</label>
      <input className='input' type='text' placeholder='' />
      <label className='label is-large'>Class</label>
      <input className='input' type='text' placeholder='' />
      <label className='label is-large'>Level</label>
      <input className='input' type='number' placeholder='1' />

      <label className='label is-large'>Size</label>
      

      <div className="dropdown">
        <div className="dropdown-trigger">
          <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
            <span>Dropdown button</span>
            <span className="icon is-small" />
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <a className="dropdown-item">
              Dropdown item
            </a>
            <a className="dropdown-item">
              Other dropdown item
            </a>
            <a className="dropdown-item is-active">
              Active dropdown item
            </a>
            <a className="dropdown-item">
              Other dropdown item
            </a>
          </div>
        </div>
      </div>
      <input className='input' type='text' placeholder='' />

      <label className='label is-large'>Alignment</label>
      <input className='input' type='text' placeholder='' />

      <label className='label is-large'>Ability Scores</label>
      { abilities }
    </>
  );
};
