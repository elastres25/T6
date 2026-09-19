/**
 * The Bible Hunt — Google Sheet receiver
 * ---------------------------------------------------------------
 * Paste this into the Apps Script editor attached to your Google Sheet
 * (Extensions ▸ Apps Script), then deploy it as a Web App.
 * Full step-by-step instructions are in README.md.
 *
 * It receives one submission per student (sent when they finish all 5
 * stations) and appends a row to a tab called "Responses". The header
 * row is created automatically the first time data arrives.
 */

/* OPTIONAL: paste your Sheet's ID between the quotes to make this work even
   if the script isn't bound to the Sheet. The ID is the long code in the
   Sheet URL:  https://docs.google.com/spreadsheets/d/THIS_PART/edit
   Leave "" if you pasted the script via the Sheet's Extensions ▸ Apps Script. */
var SHEET_ID = "";

function getSpreadsheet_() {
  if (SHEET_ID) return SpreadsheetApp.openById(SHEET_ID);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No bound Sheet. Set SHEET_ID at the top of this script.');
  return ss;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // avoid two students writing the same row
  try {
    var ss = getSpreadsheet_();
    var sheet = ss.getSheetByName('Responses') || ss.insertSheet('Responses');

    var data = JSON.parse(e.postData.contents);
    var stations = data.stations || [];

    // Build header row once.
    if (sheet.getLastRow() === 0) {
      var headers = ['Timestamp', 'Teacher', 'Block', 'Name', 'Total time', 'Total seconds'];
      stations.forEach(function (st, i) {
        var n = 'S' + (i + 1) + ' ' + st.figure;
        headers.push(n + ' — Justification');
        headers.push(n + ' — ACTS answer');
        headers.push(n + ' — Gate attempts');
        headers.push(n + ' — ACTS attempts');
      });
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
    }

    // Build data row in the same order as the headers.
    var row = [new Date(), data.teacher, data.block, data.name, data.totalTimeText, data.totalTimeSeconds];
    stations.forEach(function (st) {
      row.push(st.justification);
      row.push(st.actsAnswer);
      row.push(st.gateAttempts);
      row.push(st.actsAttempts);
    });
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Open the Web App URL in a browser to confirm it is live AND can reach the Sheet.
function doGet() {
  var msg;
  try {
    var ss = getSpreadsheet_();
    msg = 'OK — receiver is running and connected to: "' + ss.getName() + '".';
  } catch (err) {
    msg = 'Receiver is running, but it cannot reach a Sheet: ' + String(err);
  }
  return ContentService.createTextOutput(msg);
}
