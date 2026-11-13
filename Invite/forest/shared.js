/* Shared by the invitation and its local editor. All event times are in India. */
window.Invite = (() => {
  function validDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  }
  function webUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
  }
  function photoUrl(value) {
    if (typeof value !== 'string') return '';
    return webUrl(value) || (/^assets\/[\w /().-]+\.(jpg|jpeg|jfif|png|webp|avif|gif|svg)$/i.test(value) && !value.includes('..') ? value : '');
  }
  function audioUrl(value) {
    if (typeof value !== 'string') return '';
    return webUrl(value) || (/^assets\/[\w /().-]+\.(mp3|wav|ogg|m4a|aac)$/i.test(value) && !value.includes('..') ? value : '');
  }
  function validate(data) {
    const fail = message => { throw new Error(message); };
    const bilingual = (value, label) => {
      if (!value || typeof value.en !== 'string' || typeof value.hi !== 'string') fail(`${label}: provide English (en) and Hindi (hi) text.`);
    };
    for (const key of ['bride', 'groom', 'city', 'invitation', 'blessing', 'blessingSource', 'story', 'scheduleNote', 'travel']) bilingual(data[key], key);
    if (!data.bride.en.trim() || !data.groom.en.trim() || !data.bride.hi.trim() || !data.groom.hi.trim()) fail('Both names are required in both languages.');
    for (const key of ['hero', 'story', 'closing']) if (!photoUrl(data.photos?.[key])) fail(`photos.${key}: use assets/filename.jpg (or PNG/WebP/etc.) or an HTTPS image URL.`);
    for (const key of ['venues', 'events', 'faqs']) if (!Array.isArray(data[key]) || !data[key].length || data[key].length > 30) fail(`${key}: provide 1–30 entries.`);
    for (const list of [data.venues, data.events]) {
      const ids = list.map(item => item.id);
      if (ids.some(id => typeof id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(id)) || new Set(ids).size !== ids.length) fail('Venue and event IDs must be unique lowercase words, optionally separated by hyphens.');
    }
    for (const venue of data.venues) {
      for (const key of ['name', 'address', 'purpose', 'note']) bilingual(venue[key], `venues.${venue.id}.${key}`);
      if (typeof venue.mapUrl !== 'string' || (venue.mapUrl && !webUrl(venue.mapUrl))) fail('Map links must be blank or HTTPS URLs.');
    }
    for (const event of data.events) {
      for (const key of ['title', 'description', 'attire']) bilingual(event[key], `events.${event.id}.${key}`);
      if (typeof event.enabled !== 'boolean' || typeof event.confirmed !== 'boolean') fail('enabled and confirmed must be true or false.');
      if (!data.venues.some(venue => venue.id === event.venue)) fail(`${event.id}: select an existing venue ID.`);
      if (typeof event.date !== 'string' || (event.date && !validDate(event.date))) fail(`${event.id}: date must be blank or a real YYYY-MM-DD date.`);
      for (const key of ['time', 'endTime']) if (typeof event[key] !== 'string' || (event[key] && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event[key]))) fail(`${event.id}: times must be blank or HH:MM (24-hour IST).`);
      if (event.endTime && (!event.time || event.endTime <= event.time)) fail(`${event.id}: end time must be after start time on the same day.`);
    }
    if (!data.events.some(event => event.id === 'ceremony')) fail('Keep an event with ID ceremony for the wedding date and countdown.');
    for (const faq of data.faqs) { bilingual(faq.question, 'FAQ question'); bilingual(faq.answer, 'FAQ answer'); }
    // Older drafts use their existing Mandapam venue; blank values hide these optional sections.
    if (data.stay === undefined) data.stay = { venue: data.venues.some(venue => venue.id === 'mandapam') ? 'mandapam' : '' };
    if (typeof data.stay?.venue !== 'string' || (data.stay.venue && !data.venues.some(venue => venue.id === data.stay.venue))) fail('stay.venue: use an existing venue ID, or leave blank.');
    if (data.giftNote === undefined) data.giftNote = { en: '', hi: '' };
    bilingual(data.giftNote, 'giftNote');
    // Older saved drafts predate the additional Bible quotations.
    if (data.bibleQuotes === undefined) data.bibleQuotes = structuredClone(window.INVITATION.bibleQuotes || []);
    if (!Array.isArray(data.bibleQuotes) || data.bibleQuotes.length > 30) fail('bibleQuotes: provide up to 30 quotations.');
    for (const quote of data.bibleQuotes) { bilingual(quote?.text, 'Bible quotation'); bilingual(quote?.reference, 'Bible reference'); }
    // Saved invitations from before the music control use the built-in melody.
    if (data.audio === undefined) data.audio = { music: '' };
    if (typeof data.audio.music !== 'string' || (data.audio.music && !audioUrl(data.audio.music))) fail('Audio: use a file in assets/ (MP3/WAV/OGG/M4A/AAC), an HTTPS URL, or leave blank.');
    bilingual(data.contact?.name, 'contact.name');
    if (typeof data.contact.phone !== 'string' || (data.contact.phone && !/^\+[1-9]\d{6,14}$/.test(data.contact.phone))) fail('Phone: leave blank or use international format, e.g. +919876543210.');
    if (!['off', 'netlify', 'link'].includes(data.rsvp?.mode)) fail('RSVP mode must be off, netlify or link.');
    if (typeof data.rsvp.formUrl !== 'string' || (data.rsvp.formUrl && !webUrl(data.rsvp.formUrl)) || (data.rsvp.mode === 'link' && !webUrl(data.rsvp.formUrl))) fail('External RSVP requires an HTTPS form URL.');
    if (typeof data.rsvp.deadline !== 'string' || (data.rsvp.deadline && !validDate(data.rsvp.deadline))) fail('RSVP deadline must be blank or YYYY-MM-DD.');
    return data;
  }
  function instant(event, end = false) {
    const time = end ? event.endTime : event.time;
    return validDate(event.date) && /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? new Date(`${event.date}T${time}:00+05:30`) : null;
  }
  function canCalendar(event) {
    return event.enabled && event.confirmed && instant(event) && instant(event, true) && instant(event, true) > instant(event);
  }
  function calendar(event, venue, language, couple) {
    if (!canCalendar(event)) throw new Error('A confirmed date, start and end time are needed.');
    const text = value => String(value).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
    const stamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    // Calendar lines are folded by UTF-8 bytes, so Hindi survives calendar imports.
    const fold = line => {
      let result = '', bytes = 0;
      for (const character of line) {
        const size = new TextEncoder().encode(character).length;
        if (bytes + size > 75) { result += '\r\n '; bytes = 1; }
        result += character; bytes += size;
      }
      return result;
    };
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kamishi and Anuragh//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${event.id}-${event.date}@kamishi-anuragh.invitation`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(instant(event))}`, `DTEND:${stamp(instant(event, true))}`, `SUMMARY:${text(`${event.title[language]} — ${couple}`)}`, `LOCATION:${text(`${venue.name[language]}, ${venue.address[language]}`)}`, `DESCRIPTION:${text(event.description[language])}`, 'END:VEVENT', 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
  }
  function download(name, text, type = 'text/plain;charset=utf-8') {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement('a'); link.href = url; link.download = name;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function stored(key) { try { return localStorage.getItem(key); } catch { return null; } }
  return { validDate, validate, webUrl, photoUrl, audioUrl, instant, canCalendar, calendar, download, stored };
})();
