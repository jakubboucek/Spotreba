
var sheetName    = 'Spotřeba';
var settingsName = 'Settings';
var templateName = 'Template';
var sheetID = SpreadsheetApp.getActiveSpreadsheet().getId();

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
        +'</script>';

//  Return html
    notifyUser('webApp_loaded\nUser: '+Session.getActiveUser().getEmail(), 'Status');
    var htmlOutput = variables + HtmlService.createHtmlOutputFromFile('index').getContent();
    return HtmlService.createHtmlOutput(htmlOutput);
}

function fillIn(val) {

//  Prepare variables
    var _msg =  'Vyplněna jízda\nAuto: ' + val.carname;
    var values = [[val.date,val.odkud,val.pres,val.kam,val.type,val.driver,val.note,'=K12']];

//  Write to table
    var sh = openSheet(val.carname, false);
    sh.insertRowBefore(11);
    sh.getRange('B11:I11').setValues(values);

    if (!val.kilometru) {
        sh.getRange('K11').setValue(Number(val.konecny));
        var value = '=(K11-I11)';
        sh.getRange('J11').setValue(value);
    }
    else if (!val.konecny) {
        sh.getRange('J11').setValue(Number(val.kilometru));
        var value = '=(I11+J11)';
        sh.getRange('K11').setValue(value);
    } else {
        notifyUser("Kilometry a ujetá vzdálenost nesmějí být vyplněné součastně", 'Error');
        return false;
    }

//  End call
    notifyUser(_msg, 'Success');
    return true;
}

function tankCar(val) {

    if (val.action != "tankovani") {
        notifyUser('Badly set parameter. (tank)', "Error");
        return false;
    }

    sh = openSheet(val.name, false);
    var _msg =  'Natankováno\nAuto: ' + val.name;
    var values = [[val.date,'-','-','-',val.type,val.driver,val.note,'=K12', '=K11-I11', val.km,  val.km, val.price, val.l]];

    sh.insertRowBefore(11);
    sh.getRange('B11:N11').setValues(values);

    notifyUser(_msg, 'Success');

//  End call
    return true;

}

function registerCar(val) {

    if (val.action != 'addNewCar') {
        notifyUser('Badly set parameter. (add)');
        return false;
    }

    var sh = openSheet(val.name, true);
    if (!sh) return false;

    sh.getRange('B1').setValue(val.owner);
    sh.getRange('B2').setValue(val.user);
    sh.getRange('K11').setValue(val.km);

//  End call
    return true;
}

function notifyUser(_msg, _type) {

//  Prepare variables
    var message = _type + ': ' + _msg;
    Logger.log('Message: ' + message);

//  Prepare data
    var sh = openSheet(settingsName, false);
    if (!sh.getRange('C6').getValue) {return; }

    var userID = sh.getRange('C3').getValue();
    var token  = sh.getRange('C4').getValue();

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
