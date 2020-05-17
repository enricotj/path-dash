import React from 'react';

export enum Ability {
  STR = 'STR',
  DEX = 'DEX',
  CON = 'CON',
  INT = 'INT',
  WIS = 'WIS',
  CHA = 'CHA'
}

interface IAbilityScoreProps {
  ability: Ability;
  score?: number;
};

export const AbilityScore = (props: IAbilityScoreProps): React.ReactElement => {

  const [ score, setScore ] = React.useState(props.score || 10);

  const onScoreChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(ev.target.value);
    if (!isNaN(val) && val >= 0) {
      console.log('test');
      setScore(val);
    }
  }

  return (
    <div className='columns is-vcentered' style={ { width: '300px' } }>
      <div className='column is-2'>
        <label className='label'> { props.ability } </label>
      </div>
      <div className='column'>
        <div className='control'>
          <input className='input' type='number' placeholder='10' value={ score } onChange={ onScoreChange } />
        </div>
      </div>

      <div className='column'>
        <label className='label'>{ Math.floor((score - 10) / 2).toString() }</label>
      </div>
    </div>
  );
};
