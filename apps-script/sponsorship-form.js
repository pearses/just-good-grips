// Just Good Grips — Sponsorship Enquiry Form Handler
// Deploy as a Google Apps Script Web App:
//   Execute as: Me
//   Who has access: Anyone
//
// After deploying, paste the /exec URL into sponsorship/index.html as APPS_SCRIPT_URL.

var NOTIFY_EMAIL = 'scottptraining@gmail.com';

function doPost(e) {
  var p = e.parameter;

  var subject = 'Sponsorship Enquiry — ' + (p.name || 'Unknown');

  var body = [
    'New sponsorship enquiry from ' + (p.name || '—'),
    '',
    'Email:               ' + (p.email || '—'),
    'Club / School:       ' + (p.club || '—'),
    'Winter division:     ' + (p.division || '—'),
    'Tournament exp:      ' + (p.tournament_experience || 'Not provided'),
    'Favourite surface:   ' + (p.surface || 'Not provided'),
    'Current coach:       ' + (p.coach || 'Not provided'),
  ].join('\n');

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
