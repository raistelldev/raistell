import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLead } from '../src/lib/lead-validation.ts';

const company = { role: 'firma', company: 'Beispielbetrieb', contact: 'Testperson', email: 'test@example.com', seeking: ['Website und Verkaufsgespräche'], consent: 'on' };
const creator = { role: 'creator', name: 'Testperson', email: 'test@example.com', region: 'Bayern', profileUrl: 'https://example.com/portfolio', collaborationType: 'produktion', consent: 'on' };

test('company enquiry works without phone, region, industry or message', () => {
  const result = validateLead(company);
  assert.equal(result.ok, true);
  assert.equal(result.lead.name, 'Testperson');
  assert.deepEqual(result.lead.payload.seeking, company.seeking);
});
test('company needs a named contact, company and intended use', () => {
  for (const key of ['contact', 'company', 'seeking']) assert.equal(validateLead({ ...company, [key]: '' }).ok, false, key);
});
test('content-only creator needs neither followers nor platforms', () => {
  assert.equal(validateLead(creator).ok, true);
});
test('creator portfolio is retained in the saved payload', () => {
  assert.equal(validateLead(creator).lead.payload.profileUrl, creator.profileUrl);
});
test('publication and combined collaborations require a platform', () => {
  for (const collaborationType of ['veroeffentlichung', 'beides']) {
    assert.equal(validateLead({ ...creator, collaborationType }).ok, false);
    assert.equal(validateLead({ ...creator, collaborationType, platforms: ['YouTube'] }).ok, true);
  }
});
test('invalid, non-web and credential-bearing portfolio links are rejected', () => {
  for (const profileUrl of ['', 'example.com', 'javascript:alert(1)', 'ftp://example.com', 'https://user:password@example.com']) assert.equal(validateLead({ ...creator, profileUrl }).ok, false);
});
test('creator requires region and a supported collaboration type', () => {
  assert.equal(validateLead({ ...creator, region: '' }).ok, false);
  assert.equal(validateLead({ ...creator, collaborationType: 'anything' }).ok, false);
});
test('consent is required on the server for either role', () => {
  for (const base of [company, creator]) for (const consent of [undefined, false, 'false']) assert.equal(validateLead({ ...base, consent }).ok, false);
});
test('unknown object shapes and invalid email addresses fail safely', () => {
  for (const body of [null, [], 'text', 4, {}, { ...company, email: 'invalid' }]) assert.equal(validateLead(body).ok, false);
});
test('input is trimmed and repeated choices are deduplicated', () => {
  const result = validateLead({ ...company, contact: ' Testperson ', seeking: [' Website ', 'Website', null] });
  assert.equal(result.lead.name, 'Testperson');
  assert.deepEqual(result.lead.payload.seeking, ['Website']);
});
test('unrecognized fields are not persisted and long fields are rejected', () => {
  const result = validateLead({ ...company, unexpected: { data: 'ignored' } });
  assert.equal('unexpected' in result.lead.payload, false);
  assert.equal(validateLead({ ...company, message: 'x'.repeat(4001) }).ok, false);
});
