# Formspree Setup — Stockist Enquiry Form

Formspree handles form submission and emails responses to `contact@justgoodgrips.com` — no backend required.

## Steps

1. Go to [formspree.io](https://formspree.io) and sign up (free tier is fine)
2. Click **New Form**, give it a name (e.g. "Stockist Enquiry"), and set the destination email to `contact@justgoodgrips.com`
3. Formspree will give you a form endpoint URL like: `https://formspree.io/f/abcd1234`
4. Open `stockist.html` and find this line (~line 130):

   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```

   Replace `YOUR_FORM_ID` with the ID from step 3:

   ```html
   action="https://formspree.io/f/abcd1234"
   ```

5. Save and deploy. Test by submitting the form — you should receive an email at `contact@justgoodgrips.com` within a minute.

## How it works

- Form is submitted via AJAX (no page redirect)
- On success, the form is hidden and an inline success message is shown
- If Formspree hasn't been set up yet (i.e. `YOUR_FORM_ID` is still in the action), submission falls through to an alert prompting the user to email directly
- The hidden field `_subject` sets the email subject line to: `New Stockist Enquiry — Just Good Grips`

## Free tier limits

| Feature | Free |
|---------|------|
| Submissions/month | 50 |
| Forms | 1 |
| Email notifications | ✅ |
| Spam filtering | ✅ |
| File uploads | ❌ |

50 submissions/month is more than enough for a stockist enquiry form. Upgrade only if needed.

## Formspree dashboard

Once set up, all submissions are also visible in the Formspree dashboard at [formspree.io/forms](https://formspree.io/forms) — useful as a backup if any emails are missed.
