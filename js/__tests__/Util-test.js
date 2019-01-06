// npm test Util-test.js
jest
  .dontMock('../source/components/Util')
  .dontMock('classnames')
  ;
//const Merge = require('../source/components/Util').default;
import {Merge, ConvertToCsv, ConvertToExcelCsv, ConvertFromExcelCsv} from '../source/components/Util';

describe('ConvertFromExcelCsv suite', () => {

  it('ExcelCsv Simple Convert Test', () => {

    var csv = 
      "\"name\",\"test\",\"quit\",\"val\"\r\n" +
      "\"2\",\"0\",\"None\",\"\"\r\n" +
      "\"1\",\"0\",\"\",\"One \"\"and\"\" Two\"\r\n" +
      "\"3\",\"\",\"\",\"\"\r\n";
    var expectJson = [
      { name: "2", test: "0", quit: 'None', val: "" },
      { name: "1", test: "0", quit: "" , val: 'One "and" Two'},
      { name: "3", test: "", quit: "", val: "" },
    ];
    var expectCsv = JSON.stringify(expectJson);

    var actualJson = ConvertFromExcelCsv(csv);
    var actualCsv = JSON.stringify(actualJson);

    expect(actualCsv).toBe(expectCsv);
  });

});


describe('ConvertToExcelCsv suite', () => {

  it('Excel Simple Test', () => {

    var json1 = [
      { name: "2", test: 0, quit: 'None' },
      { name: "1", test: 0, val: 'One "and" Two' },
      { name: "3" },
    ];
    var expectResult = 
      "\"name\",\"test\",\"quit\",\"val\"\r\n" +
      "\"2\",\"0\",\"None\",\"\"\r\n" +
      "\"1\",\"0\",\"\",\"One \"\"and\"\" Two\"\r\n" +
      "\"3\",\"\",\"\",\"\"\r\n";

    var actualResult = ConvertToExcelCsv(json1);

    expect(actualResult).toBe(expectResult);
  });

});


describe('ConvertToCsv suite', () => {

  it('Simple Test', () => {

    var json1 = [
      { name: "2", test: 0, quit: 'None' },
      { name: "1", test: 0, val: 'One and Two' },
      { name: "3" },
    ];
    var expectResult = "name,test,quit,val\r\n2,0,None,\r\n1,0,,One and Two\r\n3,,,\r\n";

    var actualResult = ConvertToCsv(json1);

    expect(actualResult).toBe(expectResult);
  });

  it('Simple Test - No header', () => {

    var json1 = [
      { name: "2", test: 0, quit: 'None' },
      { name: "1", test: 0, val: 'One and Two' },
      { name: "3" },
    ];
    var expectResult = "2,0,None,\r\n1,0,,One and Two\r\n3,,,\r\n";

    var actualResult = ConvertToCsv(json1, '', ',', '\r\n', false);

    expect(actualResult).toBe(expectResult);
  });
  

  it('With quote argument Test', () => {

    var json1 = [
      { name: "2", test: 0, quit: 'None' },
      { name: "1", test: 0, val: 'One and Two' },
      { name: "3" },
    ];
    var expectResult = "\"2\",\"0\",\"None\",\"\"\r\n\"1\",\"0\",\"\",\"One and Two\"\r\n\"3\",\"\",\"\",\"\"\r\n";

    var actualResult = ConvertToCsv(json1, '"', ',', '\r\n', false);

    expect(actualResult).toBe(expectResult);
  });

  it('With delimiter argument Test', () => {

    var json1 = [
      { name: "2", test: 0, quit: 'None' },
      { name: "1", test: 0, val: 'One and Two' },
      { name: "3" },
    ];
    var expectResult = "\"2\"|\"0\"|\"None\"|\"\"\r\n\"1\"|\"0\"|\"\"|\"One and Two\"\r\n\"3\"|\"\"|\"\"|\"\"\r\n";

    var actualResult = ConvertToCsv(json1, '"', '|', '\r\n', false);

    expect(actualResult).toBe(expectResult);
  });

  it('With NewLine argument Test', () => {

    var json1 = [
      { name: "2", test: 0, quit: 'None' },
      { name: "1", test: 0, val: 'One and Two' },
      { name: "3" },
    ];
    var expectResult = "\"2\"|\"0\"|\"None\"|\"\"\n\"1\"|\"0\"|\"\"|\"One and Two\"\n\"3\"|\"\"|\"\"|\"\"\n";

    var actualResult = ConvertToCsv(json1, '"', '|', '\n', false);

    expect(actualResult).toBe(expectResult);
  });

});


describe('Merge suite', () => {

  it('Combine Test 1', () => {

    var json1 = [
      { name: "2", test: 0, quit: 'None' },
      { name: "1", test: 0, val: 'One' },
      { name: "5", test: 0 },
      { name: "4", test: 0 },
      { name: "3" },
    ];
    var json2 = [
      { name: "3", test: 1 },
      { name: "1", test: 'quit', food: 'apple' },
      { name: "5", real: 1 },
      { name: "6", test: 1 },
    ];
    var expectMergeResult = [
      { name: "3", test: 1 },
      { name: "1", test: 'quit', food: 'apple', val: 'One' },
      { name: "5", real: 1, test: 0 },
      { name: "6", test: 1 },
      { name: "2", test: 0, quit: 'None' },
      { name: "4", test: 0 },
    ];

    var json3 = Merge(json1, json2);

    // eslint-disable-next-line no-console
    //console.log('json3=' + JSON.stringify(json3, null, 2)); // spacing level

    expect(JSON.stringify(json3)).toBe(JSON.stringify(expectMergeResult));
  });

  it('Combine Test 2', () => {

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
    var json3 = Merge(json1, json2);

    // eslint-disable-next-line no-console
    //console.log('json3=' + JSON.stringify(json3, null, 2)); // spacing level

    expect(JSON.stringify(json3)).toBe(JSON.stringify(expectMergeResult));
  });

});

