const SHEET_NAME = "点菜结果";

function doPost(event) {
  const sheet = getOrCreateSheet();
  const data = JSON.parse(event.postData.contents);

  sheet.appendRow([
    data.submittedAt || new Date(),
    data.guestName || "",
    data.dietaryNotes || "",
    data.dishes || "",
    data.extraRequest || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["提交时间", "姓名", "忌口", "选择菜品", "其他想吃的"]);
  }

  return sheet;
}
