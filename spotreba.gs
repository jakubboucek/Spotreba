
var newLine = 5;

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

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getActiveSheet();

    _km = Number(_km);
    _l = Number(_l);

    sh.insertRowBefore(newLine);

    sh.getRange('A'+newLine).setValue(_date);
    sh.getRange('B'+newLine).setValue(_l);
    sh.getRange('C'+newLine).setValue(_km);
    sh.getRange('D'+newLine).setValue('=(B'+newLine+'/C'+newLine+')*100');
}
