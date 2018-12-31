'use strict';

import Dialog from './components/Dialog';
import Actions from './components/Actions';
import Form from './components/Form';
import FormInput from './components/FormInput';
import Rating from './components/Rating';
import Suggest from './components/Suggest';
import Button from './components/Button';
import Logo from './components/Logo';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    <div style={{ padding: '20px' }}>
        <h1>Component discoverer</h1>

        <h2>Logo</h2>
        <div style={{ display: 'inline-block', background: 'purple' }}><Logo /></div>

        <h2>Buttons</h2>
        <div>Button with onClick: <Button onClick={() => alert('ouch')}>Click me</Button></div>
        <div>A link: <Button href="http://reactjs.com">Follow me</Button></div>
        <div>Custom class name: <Button className="custom">I do nothing</Button></div>

        <h2>Suggest</h2>
        <div><Suggest options={['eenie', 'meenie', 'miney', 'mo']} /></div>

        <h2>Rating</h2>
        <div>No initial value: <Rating /></div>
        <div>Initial value 4: <Rating defaultValue={4} /></div>
        <div>This one goes to 11: <Rating max={11} /></div>
        <div>Read-only: <Rating readonly={true} defaultValue={3} /></div>

        <h2>Form inputs</h2>
        <table><tbody>
            <tr><td>Vanilla input</td>   <td><FormInput /></td></tr>
            <tr><td>Prefilled</td>       <td><FormInput defaultValue="it's like a default" /></td></tr>
            <tr><td>Year</td>            <td><FormInput type="year" /></td></tr>
            <tr><td>Rating</td>          <td><FormInput type="rating" defaultValue={4} /></td></tr>
            <tr><td>Suggest</td>         <td><FormInput type="suggest" options={['red', 'green', 'blue']} defaultValue="green" /></td></tr>
            <tr><td>Vanilla textarea</td><td><FormInput type="text" /></td></tr>
        </tbody></table>

        <h2>Form</h2>
        <Form
            fields={[
                { label: 'Rating', type: 'rating', id: 'rateme' },
                { label: 'Greetings', id: 'freetext' },
            ]}
            initialData={{ rateme: 4, freetext: 'Hello' }} />

        <h2>Actions</h2>
        <div><Actions onAction={type => alert(type)} /></div>

        <Dialog header="Out-of-the-box example" onAction={type => alert(type)}>Hello, dialog!</Dialog>
        <Dialog header="No cancel, custom button" onAction={type => alert(type)}>
            hasCancel={false}
            confirmLabel="Whatever"
            Anything goes here, see:
            <Button>A button</Button>
        </Dialog>

        {/* more components go here... */}
    </div>,
    document.getElementById('pad')
);