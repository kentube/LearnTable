import Button from './Button'; // <- for the "add new item"
import Dialog from './Dialog'; // <- to pop the "add new item" form
import Excel from './Excel'; // <- the table of all items
import Form from './Form'; // <- the "add new item" form
//import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Whinepad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.initialData,
            addnew: false,
        };
        this._preSearchData = null;
    }
    
    _convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }

    _download(format, ev) {
        //var format = 'json';
        var contents = format === 'json' 
          ? JSON.stringify(this.state.data)
          : this._convertToCSV(this.state.data);
        //   : this.state.data.reduce(function(result, row) {
        //       return result
        //         + row.reduce(function(rowresult, cell, idx) {
        //             return rowresult 
        //               + '"' 
        //               + cell.replace(/"/g, '""')
        //               + '"'
        //               + (idx < row.length - 1 ? ',' : '');
        //           }, '')
        //         + "\n";
        //     }, '');
        
        var URL = window.URL || window.webkitURL;
        // eslint-disable-next-line no-console
        // console.log('contents='+ contents);

        var blob = new Blob([contents], {type: 'text/' + format});
        ev.target.href = URL.createObjectURL(blob);
        ev.target.download = 'data.' + format;
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
                    <div className="WhinepadToolbarDownload">
                        <Button
                            onClick={this._download.bind(this, 'json')}
                            className="WhinepadToolbarDownloadButton">
                            Export
                        </Button>
                        <a onClick={this._download.bind(this, 'json')} href="data.json"> Export JSON</a>
                        <a onClick={this._download.bind(this, 'csv')} href="data.csv"> Export CSV</a>
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

