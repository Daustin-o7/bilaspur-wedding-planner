'use strict';
(() => {
  const U = window.Invite;
  const COPY = {
    en: {
      keepsakeOverline: 'A LITTLE SOMETHING TO TREASURE', keepsakeTitle: 'A keepsake, for you', turnCard: 'Turn the card ↻', keepsakeHint: 'A photograph on one side. A blessing on the other.', programmeOverline: 'YOUR INVITATION, AT A GLANCE', programmeTitle: 'The celebration unfolds', programmeHint: 'Choose a moment to explore its details.', visitDetails: 'Plan your visit', copyAddress: 'Copy address', addressCopied: 'Address copied.', addressFallback: 'Select and copy the address below.', previousPhoto: 'Previous photograph', nextPhoto: 'Next photograph', dockHome: 'Invitation', dockPlan: 'Programme', dockTravel: 'Places',
      dressOverline: 'A LITTLE INSPIRATION', dressTitle: 'Dress Code', stayOverline: 'MAKE YOURSELF AT HOME', stayTitle: 'Accommodation', galleryOverline: 'MOMENTS TO KEEP', galleryTitle: 'Us, together', galleryHint: 'Swipe, use arrow keys, or let it drift slowly · Tap a photo to enlarge', giftOverline: 'WITH LOVE & GRATITUDE', giftTitle: 'Gifts & blessings', sealTop: 'ROOTED IN FAITH', sealBottom: 'JOINED IN LOVE',
      mainContact: 'Person 1 · Main contact', person: 'Person', fewerGuests: 'Remove one guest', moreGuests: 'Add one guest', dietary: 'Dietary needs or allergies (optional)', additionalEmail: 'Email address (optional)', children: 'Will any children be attending?', childrenYes: 'Yes', childrenNo: 'No',
      scriptureEyebrow: 'BIBLE QUOTATIONS', scriptureTitle: 'Love, guided by <em>His word.</em>',
      skip: 'Skip to invitation', collection: 'FOREST', preview: 'LOCAL DRAFT — only visible in this browser. Download settings.js and redeploy to publish.', wedding: 'THE WEDDING CELEBRATION', navigation: 'Invitation', navEvents: 'Celebrations', navTravel: 'Getting there', navRsvp: 'RSVP',
      aLetter: 'A LITTLE ENVELOPE. A LIFETIME OF LOVE.', coverTitle: 'You’re <em>invited.</em>', openInvitation: 'Open invitation', coverNote: 'An invitation from our hearts to yours.', welcomeTitle: 'Welcome, with love',
      grace: 'BY GOD’S GRACE & WITH OUR FAMILIES', gettingMarried: 'We’re getting married', and: 'and', explore: 'The celebrations ↓', joinUs: 'Celebrate with us', enlarge: 'Enlarge our photograph', forever: 'The beginning of our forever.', faithLove: 'ROOTED IN FAITH. JOINED IN LOVE.', counting: 'COUNTING THE MOMENTS', calendar: 'Add to calendar ↓',
      moments: 'MANY BEAUTIFUL MOMENTS. ONE LOVE STORY.', celebrateTitle: 'Let’s celebrate', filterLabel: 'Filter celebrations', allEvents: 'All celebrations', weddingDay: 'Wedding celebrations', familyEvents: 'Family festivities', timezone: 'All times are India Standard Time (IST).', nextChapter: 'OUR NEXT CHAPTER', storyTitle: 'A lifetime of us',
      place: 'A PLACE FOR EVERY MEMORY', travelTitle: 'The places we’ll <em>celebrate.</em>', mapsNote: 'Map searches are provided for orientation. Please confirm the exact entrance with the family.', help: 'A LITTLE HELP ALONG THE WAY', call: 'Call the family', contactPending: 'Contact details will be shared soon.',
      yourPresence: 'YOUR PRESENCE IS OUR JOY', rsvpTitle: 'A place for you.<br><em>A joy for us.</em>', rsvpIntro: 'We would love to share these moments with you. Let us know your plans so we can welcome you well.', rsvpSoon: 'A little more love to plan.', rsvpPending: 'RSVP will open once the final details are ready. Please check back here, or speak with the family about your plans.', contactFamily: 'Family contact →', saveSeat: 'Let’s save your seat.', externalNote: 'Our RSVP form opens in a new tab. Please complete and submit it there to send your response.', openForm: 'Open RSVP form ↗',
      guestName: 'Your full name', guestEmail: 'Email address', attending: 'Will you attend?', choose: 'Please choose', yes: 'Joyfully accepts', no: 'Regretfully declines', partySize: 'Number of guests, including you', whichEvents: 'Which celebrations will you join?', message: 'A note for the family (optional)', consent: 'I agree to share these details with the wedding hosts for RSVP coordination.', privacy: 'Your response goes to the hosts through Netlify Forms. Please avoid sharing sensitive personal information.', sendRsvp: 'Send my RSVP ↗',
      goodToKnow: 'THE LITTLE DETAILS', faqTitle: 'Before you<br><em>join us.</em>', loveBlessings: 'WITH YOUR LOVE & BLESSINGS', closing: 'All our love.<br><em>Always.</em>', share: 'Share this invitation ↗', footer: 'Made with faith, hope & a whole lot of love.', backTop: 'Back to top ↑', close: 'Close photo',
      dateSoon: 'Wedding date to be announced', dateTbc: 'Date to be confirmed', timeTbc: 'Time to be confirmed', planned: 'Being planned', confirmed: 'Confirmed', attire: 'Suggested attire', map: 'Find on map ↗', directions: 'Directions ↗', days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', today: 'Today, we begin our forever.', married: 'The beginning of our forever.', deadline: 'Kindly reply by',
      sending: 'Sending your RSVP…', sent: 'Thank you! Your RSVP was submitted to the wedding hosts.', failed: 'Your RSVP could not be sent. Your entries are still here — please try again, or contact the family.', previewRsvp: 'Preview only — nothing was sent. RSVP submission works after the hosts enable Netlify Forms and publish the site.', chooseEvent: 'Please choose at least one celebration you will attend.', shareCopied: 'Invitation link copied.', shareFallback: 'Copy the invitation link below.', shareLocal: 'Publish the invitation first, then share its public link.', photoAlt: 'Anuragh and Kamishi together', noEvents: 'More celebration details will be shared soon.', withLove: 'with love,'
    },
    hi: {
      keepsakeOverline: 'संजोने के लिए एक छोटी-सी याद', keepsakeTitle: 'आपके लिए, सप्रेम', turnCard: 'कार्ड पलटें ↻', keepsakeHint: 'एक ओर तस्वीर। दूसरी ओर आशीर्वाद।', programmeOverline: 'एक नज़र में आपका निमंत्रण', programmeTitle: 'खुशियों का सिलसिला', programmeHint: 'विवरण देखने के लिए कोई समारोह चुनें।', visitDetails: 'यात्रा का विवरण', copyAddress: 'पता कॉपी करें', addressCopied: 'पता कॉपी हो गया।', addressFallback: 'नीचे दिया पता चुनकर कॉपी करें।', previousPhoto: 'पिछली तस्वीर', nextPhoto: 'अगली तस्वीर', dockHome: 'निमंत्रण', dockPlan: 'कार्यक्रम', dockTravel: 'स्थल',
      dressOverline: 'परिधान के लिए कुछ सुझाव', dressTitle: 'परिधान', stayOverline: 'अपनों के बीच ठहरें', stayTitle: 'आवास', galleryOverline: 'संजोने के लिए कुछ पल', galleryTitle: 'हमारा साथ', galleryHint: 'स्वाइप करें, तीर कुंजियाँ दबाएँ या इसे धीरे-धीरे चलने दें · तस्वीर बड़ी करने के लिए छुएँ', giftOverline: 'प्रेम और आभार के साथ', giftTitle: 'उपहार और आशीर्वाद', sealTop: 'विश्वास की नींव', sealBottom: 'प्रेम का बंधन',
      mainContact: 'अतिथि 1 · मुख्य संपर्क', person: 'अतिथि', fewerGuests: 'एक अतिथि कम करें', moreGuests: 'एक अतिथि जोड़ें', dietary: 'भोजन संबंधी ज़रूरतें या एलर्जी (वैकल्पिक)', additionalEmail: 'ईमेल पता (वैकल्पिक)', children: 'क्या बच्चे भी आएँगे?', childrenYes: 'हाँ', childrenNo: 'नहीं',
      scriptureEyebrow: 'बाइबल के वचन', scriptureTitle: 'परमेश्वर के वचन से <em>प्रेरित प्रेम।</em>',
      skip: 'निमंत्रण पर जाएँ', collection: 'फ़ॉरेस्ट', preview: 'स्थानीय प्रारूप — केवल इस ब्राउज़र में दिखता है। प्रकाशित करने के लिए settings.js डाउनलोड करके साइट दोबारा अपलोड करें।', wedding: 'शुभ विवाह समारोह', navigation: 'निमंत्रण', navEvents: 'समारोह', navTravel: 'कैसे पहुँचें', navRsvp: 'उपस्थिति',
      aLetter: 'एक छोटा-सा लिफ़ाफ़ा। जीवन भर का प्रेम।', coverTitle: 'आप <em>आमंत्रित हैं।</em>', openInvitation: 'निमंत्रण खोलें', coverNote: 'हमारे दिल से आपके दिल तक, एक निमंत्रण।', welcomeTitle: 'सप्रेम स्वागत',
      grace: 'ईश्वर की कृपा और परिवारों के आशीर्वाद से', gettingMarried: 'हम विवाह करने जा रहे हैं', and: 'और', explore: 'समारोहों का विवरण ↓', joinUs: 'हमारे साथ खुशियाँ मनाएँ', enlarge: 'हमारी तस्वीर बड़ी करके देखें', forever: 'हमारे जीवन भर के साथ की शुरुआत।', faithLove: 'विश्वास की नींव। प्रेम का बंधन।', counting: 'शुभ घड़ी का इंतज़ार', calendar: 'कैलेंडर में जोड़ें ↓',
      moments: 'कई सुंदर पल। एक प्रेम कहानी।', celebrateTitle: 'यादगार <em>पल।</em>', filterLabel: 'समारोह चुनें', allEvents: 'सभी समारोह', weddingDay: 'विवाह समारोह', familyEvents: 'पारिवारिक उत्सव', timezone: 'सभी समय भारतीय मानक समय (IST) के अनुसार हैं।', nextChapter: 'हमारे जीवन का नया अध्याय', storyTitle: 'एक वचन।<br>एक प्रार्थना।<br><em>जीवन भर का साथ।</em>',
      place: 'हर याद के लिए एक खास जगह', travelTitle: 'हमारे समारोहों के <em>स्थल।</em>', mapsNote: 'नक्शे की खोज मार्गदर्शन के लिए है। सही प्रवेश द्वार की पुष्टि परिवार से करें।', help: 'सफर में थोड़ा सहयोग', call: 'परिवार को कॉल करें', contactPending: 'संपर्क विवरण जल्द साझा किए जाएँगे।',
      yourPresence: 'आपकी उपस्थिति हमारी खुशी है', rsvpTitle: 'आपका साथ।<br><em>हमारी खुशी।</em>', rsvpIntro: 'हम ये पल आपके साथ बाँटना चाहते हैं। अपनी योजना बताएँ, ताकि हम आपका अच्छे से स्वागत कर सकें।', rsvpSoon: 'खुशियों की तैयारी जारी है।', rsvpPending: 'अंतिम विवरण तैयार होने पर उपस्थिति की पुष्टि शुरू होगी। कृपया यहाँ फिर से देखें या अपनी योजना के बारे में परिवार से बात करें।', contactFamily: 'परिवार से संपर्क →', saveSeat: 'आपके स्वागत की तैयारी करें।', externalNote: 'उपस्थिति फ़ॉर्म नए टैब में खुलेगा। अपना उत्तर भेजने के लिए वहीं फ़ॉर्म भरकर जमा करें।', openForm: 'उपस्थिति फ़ॉर्म खोलें ↗',
      guestName: 'आपका पूरा नाम', guestEmail: 'ईमेल पता', attending: 'क्या आप आएँगे?', choose: 'कृपया चुनें', yes: 'सहर्ष उपस्थित होंगे', no: 'खेद है, उपस्थित नहीं हो सकेंगे', partySize: 'आपको मिलाकर अतिथियों की संख्या', whichEvents: 'आप किन समारोहों में आएँगे?', message: 'परिवार के लिए संदेश (वैकल्पिक)', consent: 'मैं उपस्थिति के समन्वय के लिए यह जानकारी विवाह आयोजकों से साझा करने के लिए सहमत हूँ।', privacy: 'आपका उत्तर Netlify Forms के माध्यम से आयोजकों तक जाएगा। कृपया संवेदनशील निजी जानकारी साझा न करें।', sendRsvp: 'अपनी उपस्थिति भेजें ↗',
      goodToKnow: 'कुछ ज़रूरी बातें', faqTitle: 'आने से <em>पहले।</em>', loveBlessings: 'आपके प्रेम और आशीर्वाद के साथ', closing: 'ढेर सारा प्यार।<br><em>हमेशा।</em>', share: 'यह निमंत्रण साझा करें ↗', footer: 'विश्वास, आशा और ढेर सारे प्रेम के साथ।', backTop: 'ऊपर जाएँ ↑', close: 'तस्वीर बंद करें',
      dateSoon: 'विवाह की तिथि जल्द घोषित होगी', dateTbc: 'तिथि की पुष्टि बाकी है', timeTbc: 'समय की पुष्टि बाकी है', planned: 'तैयारी जारी है', confirmed: 'पुष्टि हो गई है', attire: 'परिधान सुझाव', map: 'नक्शे पर खोजें ↗', directions: 'रास्ता देखें ↗', days: 'दिन', hours: 'घंटे', minutes: 'मिनट', seconds: 'सेकंड', today: 'आज से हमारा जीवन भर का साथ शुरू होता है।', married: 'हमारे जीवन भर के साथ की शुरुआत।', deadline: 'कृपया इस तिथि तक उत्तर दें:',
      sending: 'आपका उत्तर भेजा जा रहा है…', sent: 'धन्यवाद! आपका उत्तर विवाह आयोजकों को भेज दिया गया है।', failed: 'आपका उत्तर नहीं भेजा जा सका। आपकी जानकारी यहाँ सुरक्षित है — फिर प्रयास करें या परिवार से संपर्क करें।', previewRsvp: 'केवल पूर्वावलोकन — कुछ नहीं भेजा गया। आयोजकों द्वारा Netlify Forms चालू करके साइट प्रकाशित करने के बाद उत्तर भेजा जा सकेगा।', chooseEvent: 'कृपया कम से कम एक समारोह चुनें जिसमें आप आएँगे।', shareCopied: 'निमंत्रण का लिंक कॉपी हो गया।', shareFallback: 'नीचे दिया निमंत्रण लिंक कॉपी करें।', shareLocal: 'पहले निमंत्रण प्रकाशित करें, फिर उसका सार्वजनिक लिंक साझा करें।', photoAlt: 'अनुराग और कामिशी साथ में', noEvents: 'समारोहों का और विवरण जल्द साझा किया जाएगा।', withLove: 'सप्रेम,'
    }
  };
  if (document.body.classList.contains('forest-page')) {
    COPY.en.aLetter = 'A LITTLE CARD. A LIFETIME OF LOVE.';
    COPY.hi.aLetter = 'एक छोटा-सा कार्ड। जीवन भर का प्रेम।';
    COPY.en.coverNote = 'With faith, with family, with all our love.';
    COPY.en.celebrateTitle = 'A grand celebration';
    COPY.en.closing = 'With love,<br><em>forever & always.</em>';
  } else {
    COPY.en.collection = 'WINE';
    COPY.hi.collection = 'वाइन';
    COPY.en.coverTitle = 'A love story.<br><em>You’re part of it.</em>';
    COPY.en.welcomeTitle = 'The best days<br><em>are shared.</em>';
    COPY.en.celebrateTitle = 'The art of<br><em>celebrating.</em>';
    COPY.en.keepsakeTitle = 'One frame.<br><em>A thousand feelings.</em>';
    COPY.en.programmeTitle = 'Every little<br><em>moment.</em>';
    COPY.en.travelTitle = 'Beautiful places.<br><em>Shared memories.</em>';
  }
  const $ = selector => document.querySelector(selector);
  const params = new URLSearchParams(location.search);
  const preview = params.get('preview') === '1';
  let data = window.INVITATION, draftError = false;
  if (preview && U.stored('ka-invitation-draft')) {
    try { data = U.validate(JSON.parse(U.stored('ka-invitation-draft'))); }
    catch { draftError = true; }
  }
  try { U.validate(data); } catch (error) {
    const notice = document.createElement('p'); notice.className = 'no-script';
    notice.textContent = `Invitation settings need a correction / विवरण में सुधार आवश्यक है: ${error.message}`;
    document.body.append(notice); return;
  }
  let language = params.get('lang') === 'hi' ? 'hi' : params.get('lang') === 'en' ? 'en' : U.stored('ka-language') === 'hi' ? 'hi' : 'en';
  let filter = 'all', submitted = false, busy = false, statusKey = '', audio;
  const t = key => COPY[language][key];
  const local = value => value[language];
  const couple = () => `${local(data.bride)} & ${local(data.groom)}`;
  const ceremony = data.events.find(event => event.id === 'ceremony');
  const isLocal = () => location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.hostname.endsWith('.localhost');
  const dateLabel = date => new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(`${date}T12:00:00+05:30`));
  const timeLabel = time => new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(`2000-01-01T${time}:00+05:30`));
  function el(tag, className, text) {
    const node = document.createElement(tag); if (className) node.className = className;
    if (text !== undefined) node.textContent = text; return node;
  }
  function icon(id, className = 'line-icon') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', className); svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(svg.namespaceURI, 'use'); use.setAttribute('href', `#${id}`); svg.append(use); return svg;
  }
  function mapLink(venue) {
    const link = el('a', 'text-link', t(venue.mapUrl ? 'directions' : 'map'));
    link.href = U.webUrl(venue.mapUrl) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name.en}, ${venue.address.en}, Chhattisgarh, India`)}`;
    link.target = '_blank'; link.rel = 'noopener noreferrer'; return link;
  }
  function saveEvent(event) {
    const venue = data.venues.find(item => item.id === event.venue);
    U.download(`${event.id}.ics`, U.calendar(event, venue, language, couple()), 'text/calendar;charset=utf-8');
  }
  function renderEvents() {
    const grid = $('#event-grid'); grid.replaceChildren();
    const events = data.events.filter(event => event.enabled && (filter === 'all' || (['ceremony', 'reception'].includes(event.id) ? filter === 'wedding' : filter === 'family')));
    if (!events.length) grid.append(el('p', '', t('noEvents')));
    for (const event of events) {
      const wedding = ['ceremony', 'reception'].includes(event.id);
      const card = el('article', `event-card${wedding ? ' featured' : ''}`); card.id = `event-${event.id}`;
      const top = el('div', 'event-top');
      const icons = { engagement: 'rings', mehendi: 'flower', haldi: 'spark', sangeet: 'music', ceremony: 'church', reception: 'rings' };
      top.append(icon(icons[event.id] || 'flower', 'event-icon'), el('span', 'event-number', String(data.events.indexOf(event) + 1).padStart(2, '0')));
      card.append(top, el('span', `status-tag${event.confirmed ? ' confirmed' : ''}`, t(event.confirmed ? 'confirmed' : 'planned')), el('h3', '', local(event.title)), el('p', 'description', local(event.description)));
      const details = el('div', 'event-details');
      details.append(el('p', 'event-date', event.date ? dateLabel(event.date) : t('dateTbc')), el('p', 'event-time', event.time ? `${timeLabel(event.time)}${event.endTime ? ` – ${timeLabel(event.endTime)}` : ''}` : t('timeTbc')));
      const venue = data.venues.find(item => item.id === event.venue);
      details.append(el('p', 'event-venue', local(venue.name)));
      if (local(event.attire)) details.append(el('p', 'event-attire', `${t('attire')}: ${local(event.attire)}`));
      const actions = el('div', 'event-actions'); actions.append(mapLink(venue));
      if (U.canCalendar(event)) { const button = el('button', 'text-link', t('calendar')); button.type = 'button'; button.addEventListener('click', () => saveEvent(event)); actions.append(button); }
      details.append(actions); card.append(details); grid.append(card);
    }
    document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  }
  function renderVenues() {
    const opened = new Set([...document.querySelectorAll('.venue-card details[open]')].map(node => node.dataset.venue));
    const grid = $('#venue-grid'); grid.replaceChildren();
    for (const venue of data.venues) {
      const card = el('article', 'venue-card');
      const artwork = el('div', 'venue-art');
      artwork.append(icon(venue.id === 'church' ? 'church' : venue.id === 'mandapam' ? 'flower' : 'rings'));
      card.append(artwork, el('p', 'eyebrow', local(venue.purpose)), el('h3', '', local(venue.name)), mapLink(venue));
      const details = el('details', 'visit-details'); details.dataset.venue = venue.id; details.open = opened.has(venue.id);
      const copy = el('button', 'text-link', t('copyAddress')); copy.type = 'button';
      const status = el('p', 'copy-status'); status.setAttribute('role', 'status');
      const fallback = el('input', 'address-fallback'); fallback.readOnly = true; fallback.hidden = true; fallback.setAttribute('aria-label', t('copyAddress'));
      copy.addEventListener('click', async () => {
        const address = `${local(venue.name)}, ${local(venue.address)}`;
        try { await navigator.clipboard.writeText(address); status.textContent = t('addressCopied'); }
        catch { status.textContent = t('addressFallback'); fallback.value = address; fallback.hidden = false; fallback.focus(); fallback.select(); }
      });
      details.append(el('summary', '', t('visitDetails')), el('p', 'venue-address', local(venue.address)), el('p', 'venue-note', local(venue.note)), copy, status, fallback);
      card.append(details);
      grid.append(card);
    }
  }
  function renderProgramme() {
    const list = $('#programme-list'); list.replaceChildren();
    const events = data.events.filter(event => event.enabled);
    $('#programme').hidden = !events.length;
    for (const [index, event] of events.entries()) {
      const item = el('li'), link = el('a', 'programme-stop'); link.href = `#event-${event.id}`;
      const number = el('span', 'programme-number', String(index + 1).padStart(2, '0')); number.setAttribute('aria-hidden', 'true');
      const text = el('span');
      const when = [event.date ? dateLabel(event.date) : t('dateTbc'), event.time ? timeLabel(event.time) : t('timeTbc'), t(event.confirmed ? 'confirmed' : 'planned')].join(' · ');
      text.append(el('strong', '', local(event.title)), el('small', '', when));
      const arrow = el('span', 'programme-arrow', '↗'); arrow.setAttribute('aria-hidden', 'true');
      link.append(number, text, arrow);
      link.addEventListener('click', () => {
        filter = 'all'; renderEvents();
        const target = document.getElementById(`event-${event.id}`); target.tabIndex = -1; target.focus({ preventScroll: true });
      });
      item.append(link); list.append(item);
    }
  }
  function renderGuestGuide() {
    const attire = data.events.filter(event => event.enabled && local(event.attire).trim());
    $('#dress-code').hidden = !attire.length;
    $('#dress-list').replaceChildren();
    for (const event of attire) {
      const row = el('div'); row.append(el('dt', '', local(event.title)), el('dd', '', local(event.attire))); $('#dress-list').append(row);
    }
    const stay = data.venues.find(venue => venue.id === data.stay.venue);
    $('#stay').hidden = !stay;
    $('#stay-card').replaceChildren();
    if (stay) $('#stay-card').append(icon('pin'), el('p', 'eyebrow', local(stay.purpose)), el('h3', '', local(stay.name)), el('p', '', local(stay.address)), el('p', '', local(stay.note)), mapLink(stay));
    $('#gifts').hidden = !local(data.giftNote).trim();
    $('#gift-note').textContent = local(data.giftNote);
    document.querySelectorAll('[data-image]').forEach(image => { const url = U.photoUrl(data.photos[image.dataset.image]); if (url) image.src = url; image.alt = t('photoAlt'); });
  }
  function updateCount() {
    const start = U.instant(ceremony);
    const visible = ceremony.enabled && ceremony.confirmed && start;
    $('#countdown-section').hidden = !visible;
    $('#save-date').hidden = !U.canCalendar(ceremony);
    if (!visible) return;
    const remaining = Math.max(0, Math.floor((start - Date.now()) / 1000));
    const grid = $('#countdown'); grid.replaceChildren();
    if (!remaining) {
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      grid.append(el('p', '', t(today === ceremony.date ? 'today' : 'married'))); return;
    }
    for (const [key, number] of [['days', Math.floor(remaining / 86400)], ['hours', Math.floor(remaining / 3600) % 24], ['minutes', Math.floor(remaining / 60) % 60], ['seconds', remaining % 60]]) {
      const item = el('div'); item.append(el('strong', '', new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN', { minimumIntegerDigits: 2, useGrouping: false }).format(number)), el('span', '', t(key))); grid.append(item);
    }
  }
  function syncAttendance() {
    const attending = $('#rsvp-form').elements.attendance.value === 'yes';
    $('#attending-fields').hidden = !attending;
    $('#attending-fields').querySelectorAll('input').forEach(input => { input.disabled = !attending; });
    const size = $('#party-size'); size.required = attending;
    const entered = size.valueAsNumber;
    const count = Number.isInteger(entered) && entered >= 1 && entered <= 30 ? entered : 1;
    const guests = $('#additional-guests');
    while (guests.children.length < count - 1) {
      const block = el('fieldset', 'guest-block'); block.append(el('legend'));
      for (const [key, type, max] of [['guestName', 'text', 100], ['additionalEmail', 'email', 160], ['dietary', 'text', 250]]) {
        const label = el('label'), caption = el('span'), input = el('input');
        caption.dataset.i18n = key; input.dataset.guestField = key; input.type = type; input.maxLength = max; input.required = key === 'guestName';
        label.append(caption, input); block.append(label);
      }
      guests.append(block);
    }
    [...guests.children].forEach((block, index) => {
      block.hidden = index >= count - 1; block.disabled = !attending || block.hidden;
      block.querySelector('legend').textContent = `${t('person')} ${index + 2}`;
      block.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
      block.querySelectorAll('input').forEach(input => { input.disabled = block.disabled; });
    });
    $('#guest-minus').disabled = !attending || count <= 1;
    $('#guest-plus').disabled = !attending || count >= 30;
  }
  function render() {
    document.documentElement.lang = language;
    document.title = `${couple()} | ${language === 'hi' ? 'शुभ विवाह' : 'Wedding invitation'}`;
    document.querySelector('meta[name=description]').content = local(data.invitation);
    // These translations are bundled constants; edited wedding text uses textContent below.
    document.querySelectorAll('[data-i18n]').forEach(node => { node.innerHTML = t(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(node => node.setAttribute('aria-label', t(node.dataset.i18nAria)));
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    $('.brand').setAttribute('aria-label', couple());
    $('#preview-banner').hidden = !preview;
    if (draftError) $('#preview-banner').textContent = 'The saved draft is invalid. Showing published settings. / सहेजा गया प्रारूप अमान्य है। प्रकाशित विवरण दिखाए जा रहे हैं।';
    for (const [id, value] of Object.entries({ 'bride-name': data.bride, 'groom-name': data.groom, 'invitation-copy': data.invitation, 'wedding-city': data.city, 'blessing-text': data.blessing, 'blessing-source': data.blessingSource, 'schedule-note': data.scheduleNote, 'story-text': data.story, 'travel-copy': data.travel, 'contact-name': data.contact.name })) $(`#${id}`).textContent = local(value);
    $('#wedding-date').textContent = ceremony.date && ceremony.enabled ? `${dateLabel(ceremony.date)}${ceremony.confirmed ? '' : ` · ${t('planned')}`}` : t('dateSoon');
    $('#closing-date').textContent = $('#wedding-date').textContent;
    $('#story-names').textContent = couple(); $('#closing-names').textContent = couple();
    document.querySelectorAll('.keepsake-names').forEach(node => { node.textContent = couple(); });
    $('#keepsake-verse').textContent = local(data.blessing);
    $('#keepsake-source').textContent = local(data.blessingSource);
    $('#cover-names').textContent = couple();
    $('#letter-names').textContent = couple();
    $('#cover-image').src = U.photoUrl(data.photos.hero);
    $('#cover-language').textContent = language === 'en' ? 'हिंदी में पढ़ें' : 'Read in English';
    $('#cover-language').lang = language === 'en' ? 'hi' : 'en';
    for (const kind of ['hero', 'story', 'closing']) { $(`#${kind}-image`).src = U.photoUrl(data.photos[kind]); $(`#${kind}-image`).alt = t('photoAlt'); }
    $('#expanded-photo').alt = t('photoAlt');
    renderEvents(); renderVenues(); renderGuestGuide(); renderProgramme(); updateCount();
    $('#scripture-section').hidden = !data.bibleQuotes.length;
    $('#scripture-quotes').replaceChildren();
    for (const quote of data.bibleQuotes) {
      const card = el('figure', 'scripture-card');
      card.append(el('blockquote', '', local(quote.text)), el('figcaption', 'scripture-reference', local(quote.reference)));
      $('#scripture-quotes').append(card);
    }
    const openFaqs = [...$('#faq-list').children].map(item => item.open);
    $('#faq-list').replaceChildren();
    data.faqs.forEach((faq, index) => { const details = el('details'); details.open = !!openFaqs[index]; details.append(el('summary', '', local(faq.question)), el('p', '', local(faq.answer))); $('#faq-list').append(details); });
    const call = $('#call-family'); call.hidden = !data.contact.phone;
    if (data.contact.phone) call.href = `tel:${data.contact.phone}`;
    $('#contact-pending').hidden = !!data.contact.phone;
    $('#rsvp-off').hidden = data.rsvp.mode !== 'off';
    $('#rsvp-external').hidden = data.rsvp.mode !== 'link';
    $('#rsvp-form').hidden = data.rsvp.mode !== 'netlify' || submitted;
    if (data.rsvp.mode === 'link') $('#external-form').href = U.webUrl(data.rsvp.formUrl);
    $('#rsvp-deadline').textContent = data.rsvp.deadline && data.rsvp.mode !== 'off' ? `${t('deadline')} ${dateLabel(data.rsvp.deadline)}.` : '';
    $('#rsvp-form [name=language]').value = language;
    const selected = new Set([...$('#rsvp-event-options').querySelectorAll('input:checked')].map(input => input.value));
    $('#rsvp-event-options').replaceChildren();
    data.events.filter(event => event.enabled).forEach(event => {
      const label = el('label', 'check-label'); const input = el('input'); input.type = 'checkbox'; input.name = 'events'; input.value = event.id; input.checked = selected.has(event.id);
      label.append(input, el('span', '', local(event.title))); $('#rsvp-event-options').append(label);
    });
    syncAttendance();
    $('#rsvp-status').textContent = statusKey ? t(statusKey) : '';
    $('#rsvp-form button[type=submit]').disabled = busy;
    audio?.refresh();
  }
  function setLanguage(value) {
    language = value;
    try { localStorage.setItem('ka-language', language); } catch { /* Language still works when storage is unavailable. */ }
    render();
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  $('#cover-language').addEventListener('click', () => setLanguage(language === 'en' ? 'hi' : 'en'));
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; renderEvents(); }));
  $('#save-date').addEventListener('click', () => saveEvent(ceremony));
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    $('#expanded-photo').src = U.photoUrl(data.photos[button.dataset.photo]); $('#expanded-photo').alt = t('photoAlt'); $('#photo-dialog').showModal();
  }));
  $('.dialog-close').addEventListener('click', () => $('#photo-dialog').close());
  $('#photo-dialog').addEventListener('click', event => { if (event.target === $('#photo-dialog')) $('#photo-dialog').close(); });
  document.querySelectorAll('#rsvp-form [name=attendance]').forEach(input => input.addEventListener('change', syncAttendance));
  $('#party-size').addEventListener('input', syncAttendance);
  for (const [id, delta] of [['guest-minus', -1], ['guest-plus', 1]]) $(`#${id}`).addEventListener('click', () => {
    const size = $('#party-size');
    size.value = Math.max(1, Math.min(30, (Number(size.value) || 1) + delta)); syncAttendance();
  });
  $('#rsvp-form').addEventListener('submit', async event => {
    event.preventDefault(); if (busy || submitted) return;
    const form = event.currentTarget;
    const showStatus = key => { statusKey = key; $('#rsvp-status').textContent = t(key); };
    if (data.rsvp.mode !== 'netlify' || preview || isLocal()) { showStatus('previewRsvp'); return; }
    if (form.elements.attendance.value === 'yes' && !form.querySelector('[name=events]:checked')) { showStatus('chooseEvent'); form.querySelector('[name=events]')?.focus(); return; }
    const guests = [...$('#additional-guests').children].filter(block => !block.disabled).map(block => Object.fromEntries([...block.querySelectorAll('input')].map(input => [input.dataset.guestField, input.value.trim()])));
    form.elements['guest-details'].value = JSON.stringify(guests);
    const body = new URLSearchParams(new FormData(form));
    if (form.elements.attendance.value === 'no') body.set('party-size', '0');
    busy = true; form.querySelector('button[type=submit]').disabled = true; showStatus('sending');
    try {
      const response = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString(), signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`RSVP HTTP ${response.status}`);
      submitted = true; form.hidden = true; showStatus('sent');
    } catch { showStatus('failed'); }
    finally { busy = false; form.querySelector('button[type=submit]').disabled = false; }
  });
  $('#share').addEventListener('click', async () => {
    const status = $('#share-status');
    if (isLocal()) { status.textContent = t('shareLocal'); return; }
    const url = new URL(location.href); url.search = ''; url.hash = ''; url.searchParams.set('lang', language);
    if (navigator.share) {
      try { await navigator.share({ title: couple(), text: local(data.invitation), url: url.href }); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url.href); status.textContent = t('shareCopied'); }
    catch { status.textContent = t('shareFallback'); $('#share-url').hidden = false; $('#share-url').value = url.href; $('#share-url').focus(); $('#share-url').select(); }
  });
  render();
  audio = window.setupInvitationAudio(data, () => language);
  window.setupInvitationOpening(preview);
  window.setupInvitationExperience();
  setInterval(updateCount, 1000);
})();
