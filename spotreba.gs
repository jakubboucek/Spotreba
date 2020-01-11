
var newLine = 5;
var sheetName = "Spotřeba";
var sheetID = "sheet ID here :) ";

function doGet(e) {

    if(e.parameters.submit) {

        var km = e.parameters.km;
        var l = e.parameters.l;
        var date = e.parameters.date;
        var control = e.parameters.control;

        fillIn(date, km, l);

        return ContentService.createTextOutput(control);
    }

    return HtmlService
        .createTemplateFromFile('index')
        .evaluate();
}

function fillIn(_date, _km, _l) {

    var sh = openSheet();

    _km = Number(_km);
    _l = Number(_l);

    sh.insertRowBefore(newLine);

    sh.getRange('A'+newLine).setValue(_date);
    sh.getRange('B'+newLine).setValue(_km);
    sh.getRange('C'+newLine).setValue(_l);
    sh.getRange('D'+newLine).setValue('=(C'+newLine+'/B'+newLine+')*100');
}

function openSheet() {

    var ss = SpreadsheetApp.openById(sheetID);
    var sh = ss.getSheetByName(sheetName);

    if (sh) {
        if (sh.getRange("A1").getValue() == "Spotřeba") {
            return sh;
        }
    } else {
        sh = ss.insertSheet(sheetName);
    }

    var values = [
        [''      , 'Celkem km' , 'Celkem litrů', 'Spotřeba', ],
        ['', '=SUM(B3:B)', '=SUM(C3:C)', '=if(B2; if(C2; (C2/B2)*100; "Chybí litry"); "Chybí km")', ],
        ['', '', '', '', ],
        ['Datum'         , 'Kilometry' , 'Litry'       , 'l/100', ],
    ];
    sh.getRange("A1:D4").setValues(values);

    sh.getRange("A1").setValue("Spotřeba");
    return sh;
}
