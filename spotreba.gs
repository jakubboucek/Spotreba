var sheetID = SpreadsheetApp.getActiveSpreadsheet().getId();

var sheetName = 'Spotřeba';
var settingsName = 'Settings';
var templateName = 'Template';

var settingsDrivers = "F2:F";
var settingsCities = "G2:G";

var tank_action_name = "Tankování";
var add_action_name = "AddNewCar";
var fill_action_name = "Zaznamenat";
var show_action_name = "ShowData";

function doGet(e) {

    if (!e) {e={}; e.parameters.action="test"; }

    var data = false;

    if (e.parameters.action == fill_action_name) {
        if (!e.parameter.fill_name)      {data = {"type": "fail", "message": "Google: Chybí název auta" }; }
        else if (!e.parameter.fill_konecny && !e.parameter.fill_kilometru) {data = {"type": "fail", "message": "Google: Chybí kilometry" }; }
        else if (e.parameter.fill_konecny && e.parameter.fill_kilometru)   {data = {"type": "fail", "message": "Google: Je vyplněný stav i ujeto zároveň" }; }
        else if (!e.parameter.fill_type) {data = {"type": "fail", "message": "Google: Chybí typ cesty" }; }
    }
    else if (e.parameters.action == tank_action_name) {
        if (!e.parameter.tank_name)    {data = {"type": "fail", "message": "Google: Chybí jméno auta" }; }
        else if (!e.parameter.tank_km) {data = {"type": "fail", "message": "Google: Chybí kilometry" }; }
        else if (!e.parameter.tank_l)  {data = {"type": "fail", "message": "Google: Chybí litry" }; }
    }
    else if (e.parameters.action == add_action_name) {
        if (!e.parameter.add_name)    {data = {"type": "fail", "message": "Google: Chybí jméno auta" }; }
        else if (!e.parameter.add_km) {data = {"type": "fail", "message": "Google: Chybí stav km" }; }
    }
    else if (e.parameters.action == show_action_name) {
        data = ShowData();
        data.parameters.action = show_action_name;
        return ContentService.createTextOutput(JSON.stringify(data));

    }

    if (!data && submitData(e.parameters)) {
        if (e.parameters.action == fill_action_name)      {data = {"type": "success", "message": "Google: Zaznamenáno" }; }
        else if (e.parameters.action == tank_action_name) {data = {"type": "success", "message": "Google: Natankováno" }; }
        else if (e.parameters.action == add_action_name)  {data = {"type": "success", "message": "Google: Zaregistrováno" }; }
    } else {
        if (!data) {data = {"type": "fail", "message": "Google: Něco se nepovedlo" }; }
        notifyUser(e, "Error");
    }

    return ContentService.createTextOutput(JSON.stringify(data));
}

function showData() {

    var carnames = [];
    var drivers  = [];
    var cities   = [];

    var values;
    var sh = openSheet(settingsName);
    var sheets = SpreadsheetApp.openById(sheetID).getSheets();
    if (!sh || !sheets) {return; }


    var carnames = sheets.map(function(sheet) {
        return sheet.getName();
    }).filter(function(name) {
        return [settingsName, templateName].indexOf(name) < 0;
    });

    values = sh.getRange(settingsDrivers).getValues();
    for each(var item in values) {
        if (item != '') drivers.push(item);
    }
    values = sh.getRange(settingsCities).getValues();
    for each(var item in values) {
        if (item != '') cities.push(item);
    }

    var data = {
        'carnames': carnames,
        'drivers' : drivers,
        'cities'  : cities
    };

    return data;
}

function submitData(val, hard) {

    var r = false;

    if (val.action == fill_action_name) {r = fillIn(val, hard); }
    else if (val.action == tank_action_name) {r = tankCar(val, hard); }
    else if (val.action == add_action_name) {r = registerCar(val, hard); }
    else {notifyUser("submitData switch reached end. Bad action!", "Warning"); }

    return r;
}

function fillIn(val, hard) {

    //  Check for correct object action
    if (val.action != fill_action_name) {
        notifyUser('Badly set parameter. (fill)', "Error");
        return false;
    }

    //  Prepare variables
    var _msg = 'Vyplněna jízda\nAuto: ' + val.fill_name;
    var values = [[val.fill_date, val.fill_odkud, val.fill_pres, val.fill_kam, val.fill_type, val.fill_driver, val.fill_note, '=K12']];

    //  Write to table
    var sh = openSheet(val.fill_name, false);
    if (!sh) {return false; }
    sh.getRange('B10:I10').setValues(values);

    if (val.fill_kilometru == "") val.fill_kilometru = false;
    if (val.fill_konecny == "") val.fill_konecny = false;

    if (!val.fill_kilometru) {
        sh.getRange('K10').setValue(Number(val.fill_konecny));
        sh.getRange('J10').setValue('=(K10-I10)');
    } else if (!val.fill_konecny) {
        sh.getRange('J10').setValue(Number(val.fill_kilometru));
        sh.getRange('K10').setValue('=(I10+J10)');
    } else {
        notifyUser("Kilometry a ujetá vzdálenost nesmějí být vyplněné součastně", 'Error');
        sh.getRange("A10:O10").setValue("");
        return false;
    }

    //  Confirm, End call
    sh.insertRowBefore(10);
    notifyUser(_msg, 'Success');
    return true;
}

function tankCar(val, hard) {

    if (val.action != tank_action_name) {
        notifyUser('Badly set parameter. (tank)', "Error");
        return false;
    }

    sh = openSheet(val.tank_name, false);
    if (!sh) {return false; }
    var _msg = 'Natankováno\nAuto: ' + val.tank_name;
    var values = [[val.tank_date, '-', '-', '-', val.action, val.tank_driver, val.tank_note, '=K11', '=K10-I10', val.tank_km, val.tank_km, val.tank_price, val.tank_l]];

    sh.getRange('B10:N10').setValues(values);
    sh.insertRowBefore(10);

    notifyUser(_msg, 'Success');

    //  End call
    return true;

}

function registerCar(val, hard) {

    if (val.action != add_action_name) {
        notifyUser('Badly set parameter. (add)', "Error");
        return false;
    }

    var sh = openSheet(val.add_name, true);
    if (!sh) {return false; }

    var values = [[val.add_date, '-', '-', '-', 'Vytvořeno', '-', '-', '-', '-', val.add_km]];

    sh.getRange('B1').setValue(val.add_owner);
    sh.getRange('B2').setValue(val.add_user);
    sh.getRange('B11:K11').setValues(values);

    //  End call
    return true;
}

function notifyUser(_msg, _type) {

    //  Prepare variables
    var message = _type + ': ' + _msg;
    Logger.log('Message: ' + message);

    // Log events to native Stackdriver logs
    if (_type === 'Error') {
        console.error(_msg);
    } else if (_type === 'Warning') {
        console.warn(_msg);
    } else {
        console.info(_msg);
    }

    notifyToTelegram(message);
}

function notifyToTelegram(message) {
    var properties = PropertiesService.getScriptProperties();
    var chatId = properties.getProperty('telegram.chatId');
    var token = properties.getProperty('telegram.token');

    if (chatId === null || token === null) {
        // Telegram credentials not defined - do not use it for report
        return;
    }

    var url = Utilities.formatString('https://api.telegram.org/bot%s/sendMessage', encodeURI(token));
    var options = {
        'method': 'post',
        'payload': {
            'chat_id': chatId,
            'text': message
        }
    };

    //  Send Telegram notification
    var response = UrlFetchApp.fetch(url, options);
}

function reloadSettings(sh) {

    //  Prepare variables
    if (!sh) {
        notifyUser('Nepovedlo se vytvořit sheet s Nastavením', 'Error');
        return false;
    }

    //  Settings items:
    var values = [
    [settingsName, ''],
    ['Telegram', ''],
    ['', 'User_ID'],
    ['', 'Token'],
    ['Notifycations', ''],
    ['', 'Telegram'],
  ];

    //  Vrite to sheet
    sh.getRange('A1:B6').setValues(values);
    notifyUser('Sheet ' + sheetName + ' byl vytvořen podle šablony', 'Success');
}

function loadFromDefault(sh) {

    //  Write default values if Template not found
    var values = [
        [templateName, 'Celkem km', 'Celkem litrů', 'Spotřeba', '', '', ],
        ['', '=SUM(C3:C)', '=SUM(C3:C)', '=if(B2; if(C2; (C2/B2)*100; "Chybí litry"); "Chybí km")', '', '', ],
        ['', '', '', '', '', '', ],
        ['date', 'Kilometry', 'Litry', 'l/100', 'Ujeto', 'Celá?', ],
    ];
    sh.getRange('A1:F4').setValues(values);
}

function openSheet(_name, _create) {

    //  Default values
    if (_create === undefined) var _create = false;

    //  Prepare variables
    var ss = SpreadsheetApp.openById(sheetID);
    var sh = ss.getSheetByName(_name);

    //  Sheet found
    if (sh) {
        if (_create) {
            notifyUser('Sheet ' + _name + ' již existuje', 'Error');
            return false;
        } else {
            return sh;
        }
    }

    // Sheet is settings
    else if (_name == settingsName) {
        sh = ss.insertSheet(_name);
        reloadSettings(sh);
        return sh;
    }

    //  Sheet is for new car
    else {

        //  Check for rights for creating new file
        if (!_create) {
            notifyUser('Nemám pravomoci vytvořit sheet: ' + _name, 'Error');
            return false;
        }

        //  Get template
        sh = ss.getSheetByName(templateName);
        if (!sh) { //  no template
            notifyUser("No template found", "Warning");
            return ss.insertSheet(_name);
        }

        //  Copy template as new sheet and return it
        sh = sh.copyTo(ss).setName(_name);

        notifyUser(('Vytvořeno auto: ' + _name), 'Success');
        return sh;

    }

    notifyUser('Neočekávaná chyba ve funkci "openSheet"', "Warning");
    return sh;
}
