
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
            _name=Utilities.base64Encode(_name);
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

function fillIn(carType, date, km, litry) {

//  Check if km is bigger than last km
    km = Number(km); litry = Number(litry);
    var sh = openSheet(carType, false);

    if (km <= sh.getRange('B5').getValue()) {
        notifyUser('Zadané km jsou menší nebo stejné než předchozí.', 'Error')
        return false;
    }

//  Prepare variables
    var ujeto = '=(B5-B6)';
    var spotreba = '=(C5/E5)*100';
    var spocitane_sp = ((litry/(km-sh.getRange('B5').getValue()))*100).toFixed(2);
    var spocitane_km = (km-sh.getRange('B5').getValue());
    var values = [[date, km, litry, spotreba, ujeto]];

    var _msg =  'Auto: ' + carType
        +'\nTankováno: ' + date
        +'\nKilometry: ' + spocitane_km +' km / Litry: ' +litry +' l'
        +'\nSpotřeba : ' + spocitane_sp +' litrů/100km';

//  Write to table
    sh.insertRowBefore(5);
    sh.getRange('A5:E5').setValues(values);

    notifyUser(_msg, 'Success');

//  End call
    return true;
}

function registerCar(date, km, carType) {

    var sh = openSheet(carType, true);
    if (!sh) return false;

    var values = [[date, km]];
    var _msg = 'Vytvořeno auto: ' + carType + '\nS počátečním stavem: '+km+' km';

    sh.insertRowBefore(5);
    sh.getRange('A5:B5').setValues(values);

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
