'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './components/Logo';
import Whinepad from './components/Whinepad';
import schema from './schema';

let data = JSON.parse(localStorage.getItem('data'));
// default example data, read from the schema
if (!data) {
  data = {};
  schema.forEach(item => data[item.id] = item.sample);
  data = [data];
}

ReactDOM.render(
  <div>
    <div className="app-header">
      <Logo /> Welcome to my Table Editor
    </div>
    <Whinepad schema={schema} initialData={data} />
  </div>,
  document.getElementById('pad')
);

