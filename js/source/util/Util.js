
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
                value = convert(value==null?'':value.toString());
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


var mobilecheck = function () {
    var check = false;
    // eslint-disable-next-line no-useless-escape
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

var mobileAndTabletcheck = function () {
    var check = false;
    // eslint-disable-next-line no-useless-escape
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

export {mobilecheck as Mobilecheck};
export {mobileAndTabletcheck as MobileAndTabletcheck};
export default Merge
