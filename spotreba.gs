
var newLine = 5;
var sheetName = "Spotřeba";
var sheetID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {

    var webappURL = ScriptApp.getService().getUrl();
    var variable = '<script> var webappURL = "' + webappURL + '"; </script>';
    var data = variable + HtmlService.createHtmlOutputFromFile('index').getContent();

    return HtmlService.createHtmlOutput(data);
}

function fillIn(_date, _km, _l) {

    var sh = openSheet();

    sh.insertRowBefore(newLine);

    var values = [[_date, _km, _l, '=(C'+newLine+'/B'+newLine+')*100']];
    sh.getRange("A"+newLine+":D"+newLine).setValues(values);

}

function openSheet() {

    var ss = SpreadsheetApp.openById(sheetID);
    var sh = ss.getSheetByName(sheetName);

    if (sh) {
        if (sh.getRange("A1").getValue() == sheetName) {
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

    sh.getRange("A1").setValue(sheetName);
    return sh;
}
