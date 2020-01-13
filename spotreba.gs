
var newLine = 5;
var sheetName = "Spotřeba";
var settingsName = "Settings";
var templateName = "Template";
var sheetID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {

    var webappURL = ScriptApp.getService().getUrl();
    var variable = '<script> var webappURL = "' + webappURL + '"; </script>';
    var data = variable + HtmlService.createHtmlOutputFromFile('index').getContent();

    return HtmlService.createHtmlOutput(data);
}

function fillIn(carType, datum, km, litry, isfull, isfirst) {

    km=Number(km); litry=Number(litry);

    var sh = openSheet(carType);

    if (isfirst) {
        sh.insertRowBefore(newLine);
        var values = [[datum, km, ]];
        sh.getRange("A"+newLine+":B"+newLine).setValues(values);
        return true;
    }
    if (km < sh.getRange("B5").getValue()) return false;

    var ujeto = "=(B5-B6)";
    var spotreba = "=(C5/E5)*100";
    var values = [[datum, km, litry, spotreba, ujeto, isfull, ]];
    var _msg = "Auto: " +carType
        +"\nNatankováno dne: " +datum
        +"\nKilometry: " +(km-sh.getRange("B5").getValue()) +" | Litry: " +litry
        +"\nSpotřeba: " +((litry/(km-sh.getRange("B5").getValue()))*100).toFixed(2) +" litrů/100km";

    sh.insertRowBefore(newLine);
    sh.getRange("A"+newLine+":F"+newLine).setValues(values);
    sendNotification(_msg);
}

function sendNotification(_msg) {

    var sh = openSheet(settingsName);
    if (!sh.getRange("C6").getValue) {return; }
    var userID = sh.getRange("C3").getValue();
    var token  = sh.getRange("C4").getValue();

    var url = "https://api.telegram.org/bot" + token;
    url += "/sendMessage?chat_id=" +userID +"&text=" +encodeURI(_msg);

    var response = UrlFetchApp.fetch(url);
}

function reloadSettings(sh) {

    if (!sh) {
        var ss = SpreadsheetApp.openById(sheetID);
        var sh = ss.getSheetByName(settingsName);
        if (!sh) {sh = ss.insertSheet(settingsName); }
    }

    var values = [
        [settingsName, ""],
        ["Telegram", ""],
        ["", 'User_ID'],
        ["", 'Telegram_token'],
        ["Notifications", ''],
        ["", 'Telegram'],
    ];

    sh.getRange("A1:B6").setValues(values);
}

function loadFromDefault(sh) {

    var values = [
        [templateName, 'Celkem km' , 'Celkem litrů', 'Spotřeba', '', '', ],
        ['', '=SUM(B3:B)', '=SUM(C3:C)', '=if(B2; if(C2; (C2/B2)*100; "Chybí litry"); "Chybí km")', '', '', ],
        ['', '', '', '', '', '', ],
        ['Datum', 'Kilometry', 'Litry', 'l/100', 'Ujeto', 'Celá?', ],
    ];

    sh.getRange("A1:F4").setValues(values);
}

function openSheet(_name) {

    if (!_name) var name = "test";

    var ss = SpreadsheetApp.openById(sheetID);
    var sh = ss.getSheetByName(_name);

    if (sh) {return sh; } // sheet již existuje

    else if (_name == settingsName) { // pro nastavení
        sh = ss.insertSheet(_name); // podle šablony níže
        reloadSettings();
        return sh;
    }

    else { // nový sheet s názvem auta

        sh = ss.getSheetByName(templateName);

        if (!sh) {
            sh = ss.insertSheet(templateName);
            loadFromDefault(sh);
        }

        sh = sh.copyTo(ss).setName(_name); return sh;
    }

    return sh;
}
