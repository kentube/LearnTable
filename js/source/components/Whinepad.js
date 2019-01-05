import FileSelector from './FileSelector'; // <- for the "add new item"
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

    _exportFile(format, ev) {
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

    _exportFileA (format, e) {
        // https://reactjs.org/docs/handling-events.html
//        e.preventDefault();
        //alert("In _handleClick. format is " + format);

        var contents = format === 'json' 
            ? JSON.stringify(this.state.data)
            : this._convertToCSV(this.state.data);
        var blob = new Blob([contents], {type: 'text/' + format});
        window.location.href = window.URL.createObjectURL(blob);
        window.location.download = 'data.' + format;
    }

    _merge0(json1, json2) {
        var dd1 = JSON.parse(json1);
        var dd2 = JSON.parse(json2);

        if (Array.isArray(dd1) && Array.isArray(dd2))
        {
            dd2.map(x => 
            {
                var z = dd1.find(y => 
                    {
                        var yy = y.name.trim().toLowerCase();
                        var xx = x.name.trim().toLowerCase();
                        var zz = (yy == xx);
                        return zz;
                    }
                );
                Object.assign(x, z);
            }
            );

            dd1.map(x => Object.assign(x, dd2.find(y => y.name.trim().toLowerCase() == x.name.trim().toLowerCase())));
        }
        return dd1;
    }

    _merge(json1, json2) {
        var dd1 = JSON.parse(JSON.stringify(json1));
        var dd2 = JSON.parse(JSON.stringify(json2));

        if (Array.isArray(dd1) && Array.isArray(dd2)) {
            var dd1_not_in_dd2 = [];
            dd1.map(x => {
                var z = dd2.find(y => {
                    var yy = y.name.trim().toLowerCase();
                    var xx = x.name.trim().toLowerCase();
                    var zz = (yy == xx);
                    return zz;
                });
                //Object.assign(x, z);
                if (z)
                    Object.assign(x, z);
                else
                    dd1_not_in_dd2.push(x);
            });

            dd2.map(x => Object.assign(x, dd1.find(y => y.name.trim().toLowerCase() == x.name.trim().toLowerCase())));
            var dd4 = dd2.concat(dd1_not_in_dd2);
            return dd4;
        } else {
            return dd1;
        }
    }
    _mergeTest1()
    {
        var json1 = [
            {name:"2", test: 0, quit: 'None'},
            {name:"1", test: 0, val: 'One'},
            {name:"5", test: 0},
            {name:"4", test: 0},
            {name:"3" },
        ];        
        var json2 = [
            {name:"3", test: 1},
            {name:"1", test: 'quit', food: 'apple'},
            {name:"5", real: 1},
            {name:"6", test: 1},
        ];
        var expectMergeResult = [
            {name:"3", test: 1},
            {name:"1", test: 'quit', food: 'apple', val: 'One'},
            {name:"5", real: 1, test: 0},
            {name:"6", test: 1},
            {name:"2", test: 0, quit: 'None'},
            {name:"4", test: 0},
        ];
        var json3 = this._merge(json1, json2);
        // eslint-disable-next-line no-console
        console.log('json3='+ JSON.stringify(json3, null, 2)); // spacing level
        // eslint-disable-next-line no-console
        console.log('Test Result 1 =' + ((JSON.stringify(json3) === JSON.stringify(expectMergeResult))?'passed':'failed'));
    }
    _mergeTest2()
    {
        var json1 = [
            {
                "name": "$2.75 burger",
                "link": "",
                "year": "2018",
                "grape": "Merlot",
                "rating": 2,
                "comments": "Nice for the price",
            },
            {
                "name": "Living Room",
                "link": "https://www.google.com",
                "year": "2017",
                "grape": "Chancellor",
                "rating": 2,
                "comments": "Cool",
            },
        ];        
        var json2 = [
            {
                "name": " $2.75 Burger ",
                "year": "2019",
                "grape": "Merlot",
                "comments": "Nice for the price",
            },
            {
                "name": "55 Living Room",
                "link": "https://www.google.com",
                "year": "2017",
                "grape": "Chancellor",
                "rating": 5,
                "more": "MORE DATA",
                "comments": "Cool",
            },
        ];        
        var expectMergeResult = [
            {
                "name": " $2.75 Burger ",
                "year": "2019",
                "grape": "Merlot",
                "comments": "Nice for the price",
                "link": "",
                "rating": 2,
            },
            {
                "name": "55 Living Room",
                "link": "https://www.google.com",
                "year": "2017",
                "grape": "Chancellor",
                "rating": 5,
                "more": "MORE DATA",
                "comments": "Cool",
            },
            {
                "name": "Living Room",
                "link": "https://www.google.com",
                "year": "2017",
                "grape": "Chancellor",
                "rating": 2,
                "comments": "Cool",
            },
        ];
        var json3 = this._merge(json1, json2);
        // eslint-disable-next-line no-console
        console.log('json3='+ JSON.stringify(json3, null, 2)); // spacing level
        // eslint-disable-next-line no-console
        console.log('Test Result 2 =' + ((JSON.stringify(json3) === JSON.stringify(expectMergeResult))?'passed':'failed'));
    }
    _importFile(fileText) {
        //this._mergeTest1();
        //this._mergeTest2();
        var d1 = this.state.data;
        var d2 = JSON.parse(fileText);
        var d3 = this._merge(d1, d2);
        this.setState({data: d3});
    }

    _importFileA(fileText) {
        
        alert("Processing..." + fileText);
        // eslint-disable-next-line no-console
        console.log('fileText='+ fileText);

        var dd1 = JSON.parse("[{\"name\": \"55 Living Room\",\"link\": \"https://www.google.com\",\"year\": \"2017\",\"grape\": \"Chancellor\",\"rating\": 5,\"more\": \"MORE DATA\",\"comments\": \"Cool\"},{\"name\": \" $2.75 Burger \",\"year\": \"2019\",\"grape\": \"Merlot\",\"comments\": \"Nice for the price\"}]");
        var dd2 = JSON.parse("[ { \"name\": \"$2.75 burger\", \"link\": \"\", \"year\": \"2019\", \"grape\": \"Merlot\", \"rating\": 2, \"comments\": \"Nice for the price\" }, { \"name\": \"Living Room\", \"link\": \"https://www.google.com\", \"year\": \"2017\", \"grape\": \"Chancellor\", \"rating\": 2, \"comments\": \"Cool\" } ]");

        if (Array.isArray(dd1) && Array.isArray(dd2))
        {
            dd1.map(x => 
            {
                var z = dd2.find(y => 
                    {
                        var yy = y.name.trim().toLowerCase();
                        var xx = x.name.trim().toLowerCase();
                        var zz = (yy == xx);
                        return zz;
                    }
                );
                Object.assign(x, z);
            }
            );
            // eslint-disable-next-line no-console
            console.log('dd1='+ dd1);

            dd2.map(x => Object.assign(x, dd1.find(y => y.name.trim().toLowerCase() == x.name.trim().toLowerCase())));
            // eslint-disable-next-line no-console
            console.log('dd2='+ dd2);

        }
        
        var data1 = JSON.parse(fileText);
        var data2 = JSON.parse(this.state.data);

        if (Array.isArray(data1) && Array.isArray(data2))
        {
            data1.map(x => 
                Object.assign(x, 
                    data2.find(y => y.name.trim().toLowerCase() == x.name.trim().toLowerCase())
                )
            );
            // eslint-disable-next-line no-console
            console.log('data1='+ data1);

            data2.map(x => Object.assign(x, data1.find(y => y.name.trim().toLowerCase() == x.name.trim().toLowerCase())));
            // eslint-disable-next-line no-console
            console.log('data2='+ data2);
        }

        var json1 = [
            {id:2, test: 0, quit: 'None'},
            {id:1, test: 0, val: 'One'},
            {id:5, test: 0},
            {id:4, test: 0},
            {id:3 },
        ];
        
        var json2 = [
            {id:3, test: 1},
            {id:1, test: 'quit', food: 'apple'},
            {id:5, real: 1},
        ];
        
        if (Array.isArray(json1) && Array.isArray(json2))
        {
            var json3 = json1.map(x => Object.assign(x, json2.find(y => y.id == x.id)));
            // eslint-disable-next-line no-console
            console.log('json3='+ json3);
        }
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
                    <div className="WhinepadToolbarDownload">
                        <Button href="data.json"
                            onClick={this._exportFile.bind(this, 'json')} 
                            className="WhinepadToolbarDownloadButton">Export Json</Button>
                        <Button href="data.csv"
                            onClick={(e) => this._exportFile('csv', e) }
                            className="WhinepadToolbarDownloadButton">Export Csv</Button>
                        {/* <a onClick={this._exportFile.bind(this, 'json')} href="data.json"> Export JSON</a> */}
                        {/* <a onClick={this._exportFile.bind(this, 'csv')} href="data.csv"> Export CSV</a> */}
                    </div>
                    <div className="WhinepadToolbarImport">
                        <FileSelector onAction={(f)=>this._importFile(f)}>Import Json</FileSelector>
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

