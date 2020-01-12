
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

    var sh = openSheet(sheetName);

    sh.insertRowBefore(newLine);

    var values = [[_date, _km, _l, '=(C'+newLine+'/B'+newLine+')*100']];
    sh.getRange("A"+newLine+":D"+newLine).setValues(values);

    sh = openSheet("Settings");

}

function openSheet(_name) {

    var ss = SpreadsheetApp.openById(sheetID);
    var sh = ss.getSheetByName(_name);

    if (sh) {
        if (sh.getRange("A1").getValue() == _name) {
            return sh;
        }
    } else {
        sh = ss.insertSheet(_name);
    }

    switch(_name) {

        case sheetName:
            var values = [
                [_name, 'Celkem km' , 'Celkem litrů', 'Spotřeba', ],
                ['', '=SUM(B3:B)', '=SUM(C3:C)', '=if(B2; if(C2; (C2/B2)*100; "Chybí litry"); "Chybí km")', ],
                ['', '', '', '', ],
                ['Datum'         , 'Kilometry' , 'Litry'       , 'l/100', ],
            ];
            sh.getRange("A1:D4").setValues(values);
        break;

        case "Settings":
            var values = [
                [_name, ""],
                ["Telegram", ""],
                ["", 'User_ID'],
                ["", 'Telegram_token'],
            ];
            sh.getRange("A1:B4").setValues(values);
        break;

    }

    return sh;
}
