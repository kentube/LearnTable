import FileSelector from './FileSelector'; // <- for the "add new item"
import Button from './Button'; // <- for the "add new item"
import Dialog from './Dialog'; // <- to pop the "add new item" form
import Excel from './Excel'; // <- the table of all items
import Form from './Form'; // <- the "add new item" form
//import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import Merge from './Util';
import {Merge, ConvertToExcelCsv, ConvertFromExcelCsv, Mobilecheck} from '../util/Util';
import * as Crypto from '../util/Crypto';

class Workpad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.initialData,
            addnew: false,
            deleteAll: false,
            width: window.innerWidth, 
        };
        this._preSearchData = null;
    }

    componentDidMount() {
        this._handleWindowSizeChange();
        window.addEventListener("resize", this._handleWindowSizeChange.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this._handleWindowSizeChange.bind(this));
    }
    _handleWindowSizeChange() { this.setState({ width: window.innerWidth }); }

    _uploadToServer(format, ev) {
        ev.preventDefault();

        let contents = format === 'json'
          ? JSON.stringify(this.state.data)
          : ConvertToExcelCsv(this.state.data);

        let blob = new Blob([contents], {type: 'text/' + format});
        // const data = new FormData();
        // data.append('file', contents);
        // data.append('filename', 'data.' + format);
    
        let url = window.location.href;
        // eslint-disable-next-line no-console
        console.log('url is ' + url);
        
        fetch(url + 'learntable.csv', {
          method: 'POST',
          body: blob,
        }).then(response => response.json() // if the response is a JSON object
        // eslint-disable-next-line no-console
        ).then(success => console.log(success) // Handle the success response object
        // eslint-disable-next-line no-console
        ).catch(error => console.log(error) // Handle the error response object
        );
    }
    _mergeFromServer(format, ev) {
        ev.preventDefault();

        let url = window.location.href;
        // eslint-disable-next-line no-console
        console.log('url is ' + url);

        let that = this;
        
        fetch(url + 'learntable.csv')
        .then(function(resp) {
            let text = resp.text();
            return text;
        })
        .then(function(fileText) {
            let d2 = format === 'json'
                ? JSON.parse(fileText)
                : ConvertFromExcelCsv(fileText);
            let d1 = that.state.data;
            if (d1 == null || Object.keys(d1).length === 0) {
                that.setState({data: d2});
            } else {
                let d3 = Merge(d1, d2);
                that.setState({data: d3});
            }
        });
    }
    _exportFile(format, ev) {
        let contents = format === 'json'
          ? JSON.stringify(this.state.data)
          : ConvertToExcelCsv(this.state.data);
        let blob = new Blob([contents], {type: 'text/' + format});

        let URL = window.URL || window.webkitURL;
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
    _deleteAllDialog() {
        this.setState({ deleteAll: true });
    }
    _deleteAll(action) {
        if (action === 'dismiss') {
            this.setState({ deleteAll: false });
            return;
        }
        let data = {};
        this.setState({
            deleteAll: false,
            data: data,
        });
        this._commitToStorage(data);
    }
    _onExcelDataChange(data) {
        this.setState({ data: data });
        this._commitToStorage(data);
    }
    _commitToStorage(data) {
        if (data == null || Object.keys(data).length === 0)
            localStorage.clear();
        else
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
        const urlProtocol = window.location.protocol;
        const isFileUrl = urlProtocol === "file:";
        const isMobile = Mobilecheck();
        const { width } = this.state;
        const isNarrowScreen = width <= 500;
        if (isMobile || isNarrowScreen) {
            return (
            <div className="Workpad">
                <div className="WorkpadToolbar">
                    <div className="WorkpadToolbarSearch">
                        <input
                            placeholder="Search..."
                            onChange={this._search.bind(this)}
                            onFocus={this._startSearching.bind(this)}
                            onBlur={this._doneSearching.bind(this)} />
                    </div>
                </div>
                <div className="WorkpadDatagrid">
                    <Excel
                        isNarrowScreen={isNarrowScreen}
                        isMobile={isMobile}
                        schema={this.props.schema}
                        initialData={this.state.data}
                        onDataChange={this._onExcelDataChange.bind(this)} />
                </div>
                <div className="WorkpadToolbar">
                    <div className="WorkpadToolbarImportExport">
                        <Button href="data.csv"
                            onClick={(e) => this._uploadToServer('csv', e) }
                            className="WorkpadToolbarExportButton">Save to Server</Button>
                    </div>
                    <div className="WorkpadToolbarImportExport">
                        <Button href="server.csv"
                            onClick={(e) => this._mergeFromServer('csv', e) }
                            className="WorkpadToolbarExportButton">Load from Server</Button>
                    </div>
                </div>
            </div>
            );
        } else {
            return (
            <div className="Workpad">
                <div className="WorkpadToolbar">
                    <div className="WorkpadToolbarAdd">
                        <Button
                            onClick={this._addNewDialog.bind(this)}
                            className="WorkpadToolbarAddButton">
                            + Add
                        </Button>
                        <Button
                            onClick={this._deleteAllDialog.bind(this)}
                            className="WorkpadToolbarDelButton">
                            - Delete all
                        </Button>
                    </div>                    
                    <div className="WorkpadToolbarSearch">
                        <input
                            placeholder="Search..."
                            onChange={this._search.bind(this)}
                            onFocus={this._startSearching.bind(this)}
                            onBlur={this._doneSearching.bind(this)} />
                    </div>
                </div>
                <div className="WorkpadDatagrid">
                    <Excel
                        isNarrowScreen={isNarrowScreen}
                        isMobile={isMobile}
                        schema={this.props.schema}
                        initialData={this.state.data}
                        onDataChange={this._onExcelDataChange.bind(this)} />
                </div>
                <div className="WorkpadToolbar">
                    <div className="WorkpadToolbarImportExport">
                        <Button href="data.json"
                            onClick={this._exportFile.bind(this, 'json')} 
                            className="WorkpadToolbarExportButton">Export Json</Button>
                        <Button href="data.csv"
                            onClick={(e) => this._exportFile('csv', e) }
                            className="WorkpadToolbarExportButton">Export Csv</Button>
                        {!isFileUrl
                            ? <Button href="data.csv"
                            onClick={(e) => this._uploadToServer('csv', e) }
                            className="WorkpadToolbarExportButton">Save to Server</Button>
                            : null}
                    </div>
                    <div className="WorkpadToolbarImportExport">
                        <FileSelector onAction0={(f)=>this._importFile(f, 'json')}>Import Json</FileSelector>
                        <FileSelector onAction0={(f)=>this._importFile(f, 'csv')}>Import Csv</FileSelector>
                        {!isFileUrl
                            ? <Button href="server.csv"
                                onClick={(e) => this._mergeFromServer('csv', e) }
                                className="WorkpadToolbarExportButton">Load from Server</Button>
                            : null}
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
                {this.state.deleteAll
                    ? <Dialog
                        modal={true}
                        header="Delete all items"
                        hasCancel={true}
                        confirmLabel="Delete ALL"
                        onAction={this._deleteAll.bind(this)}
                        >
                        Are you sure to delete All items?
                    </Dialog>
                    : null}
            </div>
            );
        }
    }
}

Workpad.propTypes = {
    schema: PropTypes.arrayOf(
        PropTypes.object
    ),
    initialData: PropTypes.arrayOf(
        PropTypes.object
    ),
};
export default Workpad;

