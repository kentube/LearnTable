'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './components/Logo';
import Workpad from './components/Workpad';
import schema from './schema';

let data = JSON.parse(localStorage.getItem('data'));
// default example data, read from the schema
if (!data || Object.keys(data).length === 0) {
  let row = {};
  schema.forEach(item => row[item.id] = item.sample);
  data = [row];
}

ReactDOM.render(
  <div>
    <div className="app-header">
      <Logo /> Welcome to my Table Editor
    </div>
    <Workpad schema={schema} initialData={data} />
  </div>,
  document.getElementById('pad')
);

