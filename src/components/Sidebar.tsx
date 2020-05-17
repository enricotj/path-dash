import React from 'react';

// TODO: clean this up
require('./Sidebar.scss');

export const Sidebar = (): React.ReactElement => {
  return (
    <aside className='menu Sidebar'>
      <p className='menu-label'>
        Party
      </p>
      <ul className='menu-list'>
        <li><a>Dashboard</a></li>
        <li><a>NPCs</a></li>
        <li><a>Log</a></li>
        <li><a>Quests</a></li>
      </ul>
      <p className='menu-label'>
        Character
      </p>
      <ul className='menu-list'>
        <li><a className='is-active'>Stats</a></li>
        <li><a>Equipment</a></li>
        <li><a>Notes</a></li>
      </ul>
      <p className='menu-label'>
        Account
      </p>
      <ul className='menu-list'>
        <li><a>Profile</a></li>
        <li><a>Settings</a></li>
      </ul>
    </aside>
  )
};
