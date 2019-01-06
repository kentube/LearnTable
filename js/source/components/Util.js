
function csvToArray(text) {
    // https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
    // https://www.papaparse.com/
    //RFC 4180
    // let test = '"one","two With escaped ""g""",    "three, with, commas",four with no quotes,five for fun';
    //   ConvertFromExcelCsv(test).join(' | ')
    let ret = [''], i = 0, p = '', s = true;
    for (let l in text) {
        l = text[l];
        if ('"' === l) {
            s = !s;
            if ('"' === p) {
                ret[i] += '"';
                l = '-';
            } else if ('' === p)
                l = '-';
        } else if (s && ',' === l)
            l = ret[++i] = '';
        else
            ret[i] += l;
        p = l;
    }
    return ret;
}

export function ConvertFromExcelCsv(csv) {
    var lines = csv.split("\r\n");
    var result = [];
    var headers = csvToArray(lines[0]);

    for (var i = 1; i < lines.length; i++) {

        var row = lines[i];
        if (row.trim() === '') { continue; }

        var obj = {};
        var cells = csvToArray(row);
        for (var j = 0; j < headers.length; j++)
        {
            if (j < cells.length)
            {
                var key = headers[j];
                obj[key] = cells[j];
            }
        }
        result.push(obj);
    }
    return result;
}

export function ConvertToExcelCsv(objArray) {
    return ConvertToCsv(objArray, '"', ',', '\r\n', true,
        cell => { return cell.replace(/"/g, "\"\""); }
    );
}

export function ConvertToCsv(objArray, quote = '', delimit = ',', newLine = '\r\n', header = true, convert = null) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    if (array.length == 0)
        return '';
    var str = '';
    var columnNames = [];
    var columnNameDict = {};

        for (var hRowIdx = 0; hRowIdx < array.length; hRowIdx++) {
            var names = [];
            for (var name in array[hRowIdx]) {
                names.push(name);
                columnNameDict[name] = 1;
            }
            if (columnNames.length < names.length) {
                columnNames = names;
            }
        }

    if (header) {
        var headerLine = '';
        //for (var colNameIdx = 0; colNameIdx < columnNames.length; colNameIdx++) {
        for (var colName1 in columnNameDict) {
            if (headerLine != '') headerLine += delimit;
            //headerLine += quote + columnNames[colNameIdx] + quote;
            headerLine += quote + colName1 + quote;
        }
        str += headerLine + newLine;
        // eslint-disable-next-line no-console
        //console.log(str);
    }

    for (var i = 0; i < array.length; i++) {
        var line = '';
        //for (var index in array[i]) {
        for (var index in columnNameDict) {
            if (line != '') line += delimit;
            var value = typeof (array[i][index]) !== 'undefined' ? array[i][index] : '';
            if (convert != null)
                value = convert(value.toString());
            line += quote + value + quote;
        }
        str += line + newLine;
    }
    return str;
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

}

export function Merge(json1, json2) {

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

export default Merge
