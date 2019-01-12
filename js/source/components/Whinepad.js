import FileSelector from './FileSelector'; // <- for the "add new item"
import Button from './Button'; // <- for the "add new item"
import Dialog from './Dialog'; // <- to pop the "add new item" form
import Excel from './Excel'; // <- the table of all items
import Form from './Form'; // <- the "add new item" form
//import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import Merge from './Util';
import {Merge, ConvertToExcelCsv, ConvertFromExcelCsv} from '../util/Util';
import * as Crypto from '../util/Crypto';

class Whinepad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.initialData,
            addnew: false,
        };
        this._preSearchData = null;
    }
    
    _exportFile(format, ev) {
        //var format = 'json';
        var contents = format === 'json'
          ? JSON.stringify(this.state.data)
          : ConvertToExcelCsv(this.state.data);

        var URL = window.URL || window.webkitURL;
        // eslint-disable-next-line no-console
        // console.log('contents='+ contents);

        var blob = new Blob([contents], {type: 'text/' + format});
        ev.target.href = URL.createObjectURL(blob);
        ev.target.download = 'data.' + format;
    }

    _importFile(fileText, format) {
        var d1 = this.state.data;
        var d2 = format === 'json'
            ? JSON.parse(fileText)
            : ConvertFromExcelCsv(fileText);
        var d3 = Merge(d1, d2);
        this.setState({data: d3});
    }

    _addNewDialog() {
        this.setState({ addnew: true });
    }
    _addNew(action) {
        if (action === 'dismiss') {
            this.setState({ addnew: false });
            return;
        }
        let data = Array.from(this.state.data);
        data.unshift(this.refs.form.getData());
        this.setState({
            addnew: false,
            data: data,
        });
        this._commitToStorage(data);
    }
    _onExcelDataChange(data) {
        this.setState({ data: data });
        this._commitToStorage(data);
    }
    _commitToStorage(data) {
        localStorage.setItem('data', JSON.stringify(data));
    }
    _startSearching() {
        this._preSearchData = this.state.data;
    }
    _doneSearching() {
        this.setState({
            data: this._preSearchData,
        });
    }
    _search(e) {

        // let password = "this is 1st THE P8zzMord!"
        // let plaintext = e.target.value;
        // Crypto.Encrypt(password, plaintext).then(function(ee){
        //     // eslint-disable-next-line no-console
        //     console.log(ee);
        //   });        

        const needle = e.target.value.toLowerCase();
        if (!needle) {
            this.setState({ data: this._preSearchData });
            return;
        }
        const fields = this.props.schema.map(item => item.id);
        const searchdata = this._preSearchData.filter(row => {
            for (let f = 0; f < fields.length; f++) {
                if (row[fields[f]] != null 
                    && row[fields[f]].toString().toLowerCase().indexOf(needle) > -1) 
                {
                    return true;
                }
            }
            return false;
        });
        this.setState({ data: searchdata });
    }
    render() {
        return (
            <div className="Whinepad">
                <div className="WhinepadToolbar">
                    <div className="WhinepadToolbarAdd">
                        <Button
                            onClick={this._addNewDialog.bind(this)}
                            className="WhinepadToolbarAddButton">
                            + add
                        </Button>
                    </div>                    
                    <div className="WhinepadToolbarSearch">
                        <input
                            placeholder="Search..."
                            onChange={this._search.bind(this)}
                            onFocus={this._startSearching.bind(this)}
                            onBlur={this._doneSearching.bind(this)} />
                    </div>
                </div>
                <div className="WhinepadDatagrid">
                    <Excel
                        schema={this.props.schema}
                        initialData={this.state.data}
                        onDataChange={this._onExcelDataChange.bind(this)} />
                </div>
                <div className="WhinepadToolbar">
                    <div className="WhinepadToolbarImportExport">
                        <Button href="data.json"
                            onClick={this._exportFile.bind(this, 'json')} 
                            className="WhinepadToolbarExportButton">Export Json</Button>
                        <Button href="data.csv"
                            onClick={(e) => this._exportFile('csv', e) }
                            className="WhinepadToolbarExportButton">Export Csv</Button>
                        {/* <a onClick={this._exportFile.bind(this, 'json')} href="data.json"> Export JSON</a> */}
                        {/* <a onClick={this._exportFile.bind(this, 'csv')} href="data.csv"> Export CSV</a> */}
                    </div>
                    <div className="WhinepadToolbarImportExport">
                        <FileSelector onAction0={(f)=>this._importFile(f, 'json')}>Import Json</FileSelector>
                        <FileSelector onAction0={(f)=>this._importFile(f, 'csv')}>Import Csv</FileSelector>
                    </div>
                </div>
                {this.state.addnew
                    ? <Dialog
                        modal={true}
                        header="Add new item"
                        confirmLabel="Add"
                        onAction={this._addNew.bind(this)}
                    >
                        <Form
                            ref="form"
                            fields={this.props.schema} />
                    </Dialog>
                    : null}
            </div>
        );
    }
}

Whinepad.propTypes = {
    schema: PropTypes.arrayOf(
        PropTypes.object
    ),
    initialData: PropTypes.arrayOf(
        PropTypes.object
    ),
};
export default Whinepad;

