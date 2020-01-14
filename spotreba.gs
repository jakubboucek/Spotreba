
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
            _name=encodeURI(_name);
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
    var htmlOutput = variables + HtmlService.createHtmlOutputFromFile('index').getContent();
    return HtmlService.createHtmlOutput(htmlOutput);
}

function fillIn(cartype,datum,trasa_odkud,trasa_pres,trasa_kam,trasa_typ,trasa_sofer,trasa_poznamka,km_konecny) {

//  Prepare variables
    var ujeto = '=(K11-I11)';
    var _msg =  'Auto: ' + cartype;
    var values = [[datum,trasa_odkud,trasa_pres,trasa_kam,trasa_typ,trasa_sofer,trasa_poznamka,'=K12',ujeto,km_konecny]];

//  Write to table
    var sh = openSheet(cartype, false);
    sh.insertRowBefore(11);
    sh.getRange('B11:K11').setValues(values);
    notifyUser(_msg, 'Success');

//  End call
    return true;
}

function registerCar(carname, ownername, username, km_pocatecni) {

    var sh = openSheet(carname, true);
    if (!sh) return false;

    sh.getRange('B1').setValue(ownername);
    sh.getRange('B2').setValue(username);
    sh.getRange('K11').setValue(km_pocatecni);

    var _msg = 'Vytvořeno auto: ' + carname;
    notifyUser(_msg, 'Success');

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
        //  Create Template from defaults
            sh = ss.insertSheet(templateName);
            loadFromDefault(sh);
        }

    //  Copy template as new sheet and return it
        sh = sh.copyTo(ss).setName(_name); return sh;
    }

    notifyUser('Neočekávaná chyba ve funkci "openSheet".', "Warning");
    return sh;
}
