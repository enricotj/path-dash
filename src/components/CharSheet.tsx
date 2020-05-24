import React from 'react';

import { AbilityScore, Ability } from './AbilityScore';

export const CharSheet = (): React.ReactElement => {

  // Render list of ability score controls.
  const abilities = Object.entries(Ability).map(([key, val]) => (<AbilityScore key={ key } ability={ val as Ability } />));

  return (
    <>
      <label className='label is-large'>Ability Scores</label>
      <div>
        { abilities }
      </div>
    </>
  );
};
