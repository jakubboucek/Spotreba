
var newLine = 5;
var sheetName = "Spotřeba";
var sheetID = "sheet ID here :) ";

function doGet(e) {

    if(e.parameters.submit) {

        var km = e.parameters.km;
        var l = e.parameters.l;
        var date = e.parameters.date;

        fillIn(date, km, l);

        return ContentService.createTextOutput("Done");
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

    if (sh) return sh;

    sh = ss.insertSheet(sheetName);

    sh.getRange("A1").setValue("Spotřeba");
    sh.getRange("B1").setValue("Celkem km");
    sh.getRange("C1").setValue("Celkem litrů");
    sh.getRange("D1").setValue("Spotřeba");

    sh.getRange("B2").setValue("=SUM(B3:B)");
    sh.getRange("C2").setValue("=SUM(C3:C)");
    sh.getRange("D2").setValue('=if(B2; if(C2; (C2/B2)*100; "Chybí km"); "Chybí litry")');

    sh.getRange("A3").setValue("Datum");
    sh.getRange("B3").setValue("Kilometry");
    sh.getRange("C3").setValue("Litry");
    sh.getRange("D3").setValue("l/100");

    return sh;
}
