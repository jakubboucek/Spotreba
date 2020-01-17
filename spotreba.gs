
var sheetID = SpreadsheetApp.getActiveSpreadsheet().getId();

var sheetName    = 'Spotřeba';
var settingsName = 'Settings';
var templateName = 'Template';

var tank_action_name = "Tankování";
var add_action_name = "AddNewCar";
var fill_action_name = "Zaznamenat";

function doGet(e) {

//  Find all sheets except settings and template and make string as array
    var sheetsNames = '';
    var sheets = SpreadsheetApp.openById(sheetID).getSheets();

    for (var i=0;i<sheets.length;i++) {
        _name = sheets[i].getName();
        if (_name!=settingsName&&_name!=templateName) {
            sheetsNames+='\''+_name+'\',';
        }
    }

//  Pass variables to html
    var webappURL = ScriptApp.getService().getUrl();
    var variables = ''
        +'<script>'
            +'var webappURL = "' + webappURL + '";'
            +'var sheetsNames = [' + sheetsNames + '];'
            +'var tank_action_name = "' + tank_action_name + '";'
            +'var add_action_name = "' + add_action_name + '";'
            +'var fill_action_name = "' + fill_action_name + '";'
        +'</script>';

//  Return html
    //notifyUser('webApp_loaded\nUser: '+Session.getActiveUser().getEmail(), 'Status');
    var htmlOutput = variables + HtmlService.createHtmlOutputFromFile('index').getContent();
    return HtmlService.createHtmlOutput(htmlOutput);
}

function submitData(val, hard) {
    var r = false;
    switch (val.action) {
        case fill_action_name: r=fillIn(val, hard);      break;
        case tank_action_name: r=tankCar(val, hard);     break;
        case add_action_name:  r=registerCar(val, hard); break;
    }
    return r;
}

function fillIn(val, hard) {

//  Check for correct object action
    if (val.action != fill_action_name) {
        notifyUser('Badly set parameter. (fill)', "Error");
        return false;
    }

//  Prepare variables
    var _msg =  'Vyplněna jízda\nAuto: ' + val.fill_name;
    var values = [[val.fill_date,val.fill_odkud,val.fill_pres,val.fill_kam,val.fill_type,val.fill_driver,val.fill_note,'=K12']];

//  Write to table
    var sh = openSheet(val.fill_name, false);
    if (!sh) return false;
    sh.getRange('B10:I10').setValues(values);

    if (!val.fill_kilometru) {
        sh.getRange('K10').setValue(Number(val.fill_konecny));
        var value = '=(K10-I10)';
        sh.getRange('J10').setValue(value);
    }
    else if (!val.fill_konecny) {
        sh.getRange('J10').setValue(Number(val.fill_kilometru));
        var value = '=(I10+J10)';
        sh.getRange('K10').setValue(value);
    } else {
        notifyUser("Kilometry a ujetá vzdálenost nesmějí být vyplněné součastně", 'Error');
        sh.getRange("A10:O10").setValue("");
        return false;
    }
    sh.insertRowBefore(10);

//  End call
    notifyUser(_msg, 'Success');
    return true;
}

function tankCar(val, hard) {

    if (val.action != tank_action_name) {
        notifyUser('Badly set parameter. (tank)', "Error");
        return false;
    }

    sh = openSheet(val.tank_name, false);
    var _msg =  'Natankováno\nAuto: ' + val.tank_name;
    var values = [[val.tank_date,'-','-','-',val.action,val.tank_driver,val.tank_note,'=K11', '=K10-I10', val.tank_km,  val.tank_km, val.tank_price, val.tank_l]];

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
    if (!sh) return false;

    var values = [[val.add_date,'-','-','-','Vytvořeno','-','-','-','-', val.add_km]];

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
    if(_type === 'Error') {
        console.error(_msg);
    } else if(_type === 'Warning') {
        console.warn(_msg);
    } else {
        console.info(_msg);
    }

//  Prepare data
    var sh = openSheet(settingsName, false);
    if (!sh.getRange('C6').getValue) {return; }

    var userID = sh.getRange('C3').getValue();
    var token  = sh.getRange('C4').getValue();

    if(userID === "" || token === "") {
        // Telegram credentials not defined - do not use it for report
        return;
    }

    var url = ''
        +'https://api.telegram.org/bot' +token
        +'/sendMessage?chat_id=' +userID
        +'&text=' +encodeURI(message);

//  Send Telegram notification
    var response = UrlFetchApp.fetch(url);
}

function reloadSettings(sh) {

//  Prepare variables
    if (!sh) {
        notifyUser('Nepovedlo se vytvořit sheet s Nastavením.', 'Error');
        return false;
    }

//  Settings items:
    var values = [
        [settingsName,     ''],
        ['Telegram',       ''],
        ['',   'User_ID'     ],
        ['',   'Token'       ],
        ['Notifycations',  ''],
        ['',   'Telegram'    ],
    ];

//  Vrite to sheet
    sh.getRange('A1:B6').setValues(values);
    notifyUser('Sheet '+sheetName+' byl vytvořen podle šablony.', 'Success');
}

function loadFromDefault(sh) {

//  Write default values if Template not found
    var values = [
        [templateName, 'Celkem km' , 'Celkem litrů', 'Spotřeba', '', '', ],
        ['', '=SUM(C3:C)', '=SUM(C3:C)', '=if(B2; if(C2; (C2/B2)*100; "Chybí litry"); "Chybí km")', '', '', ],
        ['', '', '', '', '', '', ],
        ['date', 'Kilometry', 'Litry', 'l/100', 'Ujeto', 'Celá?', ],
    ];
    sh.getRange('A1:F4').setValues(values);
}

function openSheet(_name, _create) {

//  Default values
    if (_create===undefined) var _create = false ;

//  Prepare variables
    var ss = SpreadsheetApp.openById(sheetID);
    var sh = ss.getSheetByName(_name);

//  Sheet found
    if (sh) {
        if (_create) {notifyUser('Sheet '+_name+' již existuje.', 'Error'); return false; }
        else {return sh; }
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
            notifyUser('Nemám pravomoci vytvořit sheet: ' + _name + '.', 'Error');
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

    notifyUser('Neočekávaná chyba ve funkci "openSheet".', "Warning");
    return sh;
}
