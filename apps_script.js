function doPost(e) {
  var jobName = e.parameter.jobName;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Jobs List");
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === jobName) {
      sheet.getRange(i + 1, 2).setValue(true); // Marked Complete
      sheet.getRange(i + 1, 3).setValue(100.00); // Percent Complete
      return ContentService.createTextOutput("Job marked complete.");
    }
  }

  return ContentService.createTextOutput("Job not found.");
}
