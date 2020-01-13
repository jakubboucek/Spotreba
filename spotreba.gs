
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

function fillIn(carType, date, km, litry) {

    km=Number(km); litry=Number(litry);

    var sh = openSheet(carType, false);

    if (km < sh.getRange("B5").getValue()) {
        notifyUser("Zadané km jsou menší než předchozí.", "Error")
        var asdf = crashAppQWERTZUIOP; // crash app
        return false;
    }

    var ujeto = "=(B5-B6)";
    var spotreba = "=(C5/E5)*100";
    var values = [[date, km, litry, spotreba, ujeto, ]];
    var _msg = "Auto: " +carType
        +"\nNatankováno dne: " +date
        +"\nKilometry: " +(km-sh.getRange("B5").getValue()) +" | Litry: " +litry
        +"\nSpotřeba: " +((litry/(km-sh.getRange("B5").getValue()))*100).toFixed(2) +" litrů/100km";

    sh.insertRowBefore(newLine);
    sh.getRange("A"+newLine+":E"+newLine).setValues(values);
    notifyUser(_msg);

    return true;
}

function registerCar(date, km, carType) {

    var sh = openSheet(carType, true);
    sh.insertRowBefore(newLine);

    var values = [[date, km, ]];
    sh.getRange("A"+newLine+":B"+newLine).setValues(values);

    var _msg = "Vytvořeno auto: " + carType + "\nS počátečním stavem: "+km+" km";
    notifyUser(_msg);

    return true;
}

function notifyUser(_msg, _type) {

    if (_type===undefined) var _type = "Ostatní";
    if (_msg ===undefined) var _msg = "Žádná zpráva";
    _msg = _type + ": " + _msg;

    var sh = openSheet(settingsName, false);
    if (!sh.getRange("C6").getValue) {return; }
    var userID = sh.getRange("C3").getValue();
    var token  = sh.getRange("C4").getValue();

    Logger.log("Message: " + _msg);
    var url = "https://api.telegram.org/bot" + token;
    url += "/sendMessage?chat_id=" +userID +"&text=" +encodeURI(_msg);

    var response = UrlFetchApp.fetch(url);
}

function reloadSettings() {

    var sh = openSheet("Settings", true);
    if (!sh) {
        notifyUser("Nepovedlo se vytvořit sheet s Nastavením.", "Error");
        return false;
    }

    var values = [
        [settingsName, ""],
        ["Telegram", ""],
        ["", 'User_ID'],
        ["", 'Telegram_token'],
        ["Notifycations", ''],
        ["", 'Telegram'],
    ];

    sh.getRange("A1:B6").setValues(values);

    notifyUser("Sheet s Nastavením byl vytvořen", "Info");
}

function loadFromDefault(sh) {

    var values = [
        [templateName, 'Celkem km' , 'Celkem litrů', 'Spotřeba', '', '', ],
        ['', '=SUM(B3:B)', '=SUM(C3:C)', '=if(B2; if(C2; (C2/B2)*100; "Chybí litry"); "Chybí km")', '', '', ],
        ['', '', '', '', '', '', ],
        ['date', 'Kilometry', 'Litry', 'l/100', 'Ujeto', 'Celá?', ],
    ];

    sh.getRange("A1:F4").setValues(values);
}

function openSheet(_name, _create) {

    if (_create===undefined) var _create = false;

    if (!_name) var name = "test";

    var ss = SpreadsheetApp.openById(sheetID);
    var sh = ss.getSheetByName(_name);

    if (sh) {
        if (_create) {notifyUser("Sheet "+_name+" již existuje.", "Error"); return false; }
        else {return sh; }
    }

    else if (_name == settingsName) { // pro nastavení
        sh = ss.insertSheet(_name); // podle šablony níže
        reloadSettings();
        notifyUser("Sheet "+sheetName+" byl vytvořen podle šablony.");
        return sh;
    }

    else { // nový sheet s názvem auta

        if (!_create) {
            notifyUser("Nemám pravomoci vytvořit sheet: " + _name + ".", "Error");
            return false; // není pravomoce vytvářet
        }

        sh = ss.getSheetByName(templateName);
        if (!sh) {
            sh = ss.insertSheet(templateName);
            loadFromDefault(sh);
        }

        sh = sh.copyTo(ss).setName(_name); return sh;
    }

    return sh;
}
