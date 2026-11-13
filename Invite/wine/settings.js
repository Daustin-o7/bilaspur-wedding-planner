// Edit here, or open editor.html and download a replacement settings.js.
window.INVITATION = {
  bride: { en: "Kamishi Shutul Austin", hi: "कामिशी शुतुल ऑस्टिन" },
  groom: { en: "Anuragh Kashyap", hi: "अनुराग कश्यप" },
  city: { en: "Bilaspur, Chhattisgarh", hi: "बिलासपुर, छत्तीसगढ़" },
  invitation: {
    en: "Together with our families, we invite you to celebrate our Holy Matrimony. Join us for a beautiful beginning, surrounded by faith, love and the people we hold dear.",
    hi: "अपने परिवारों के साथ, हम आपको अपने पवित्र विवाह के आनंद में शामिल होने के लिए आमंत्रित करते हैं। विश्वास, प्रेम और अपनों के आशीर्वाद के साथ हमारे नए जीवन की शुरुआत का हिस्सा बनें।"
  },
  blessing: {
    en: "And now these three remain: faith, hope and love. But the greatest of these is love.",
    hi: "पर अब विश्वास, आशा, प्रेम ये तीनों स्थायी हैं, पर इन में सब से बड़ा प्रेम है।"
  },
  blessingSource: { en: "1 Corinthians 13:13", hi: "1 कुरिन्थियों 13:13" },
  bibleQuotes: [
    {
      text: { en: "Let all that you do be done in love.", hi: "जो कुछ करते हो प्रेम से करो।" },
      reference: { en: "1 Corinthians 16:14", hi: "1 कुरिन्थियों 16:14" }
    },
    {
      text: { en: "Two are better than one, because they have a good reward for their labor.", hi: "एक से दो अच्छे हैं, क्योंकि उनके परिश्रम का अच्छा फल मिलता है।" },
      reference: { en: "Ecclesiastes 4:9", hi: "सभोपदेशक 4:9" }
    },
    {
      text: { en: "What therefore God has joined together, let no man separate.", hi: "इसलिये जिसे परमेश्वर ने जोड़ा है उसे मनुष्य अलग न करे।" },
      reference: { en: "Mark 10:9", hi: "मरकुस 10:9" }
    }
  ],
  story: {
    en: "Two hearts. One promise. A lifetime to grow together. We are grateful for the love that brought us here, and for every person who will be part of our next chapter.",
    hi: "दो दिल। एक वचन। साथ बढ़ने के लिए पूरा जीवन। हमें यहाँ तक लाने वाले प्रेम और हमारे जीवन के नए अध्याय में शामिल होने वाले हर अपने के लिए हम आभारी हैं।"
  },
  photos: { hero: "assets/hero-portrait.jpg", story: "assets/story-portrait.jpg", closing: "assets/closing-portrait.jpg", hands: "assets/gallery-hands.jpg" },
  audio: { music: "" },
  scheduleNote: {
    en: "Our celebrations are being planned. Dates, timings and final venue details will be shared here once confirmed.",
    hi: "हमारे समारोहों की तैयारी जारी है। तिथियाँ, समय और अंतिम स्थल विवरण की पुष्टि होने पर यहाँ साझा किए जाएँगे।"
  },
  venues: [
    {
      id: "mandapam",
      name: { en: "Mandapam Marriage Resort", hi: "मंडपम मैरिज रिसॉर्ट" },
      address: { en: "Beside NEXA Showroom, Tifra, Bilaspur", hi: "नेक्सा शोरूम के पास, तिफरा, बिलासपुर" },
      purpose: { en: "Family celebrations & guest stay", hi: "पारिवारिक समारोह और अतिथि आवास" },
      note: { en: "Planned venue. Room arrangements and check-in details will be shared by the family.", hi: "प्रस्तावित स्थल। कमरों की व्यवस्था और चेक-इन विवरण परिवार द्वारा साझा किए जाएँगे।" },
      mapUrl: ""
    },
    {
      id: "church",
      name: { en: "CNI Church, Civil Lines", hi: "सीएनआई चर्च, सिविल लाइन्स" },
      address: { en: "Beside Civil Lines Thana, Bilaspur", hi: "सिविल लाइन्स थाने के पास, बिलासपुर" },
      purpose: { en: "Holy Matrimony", hi: "पवित्र विवाह" },
      note: { en: "Planned church ceremony. The service time and order will be confirmed with the church.", hi: "प्रस्तावित चर्च समारोह। आराधना का समय और क्रम चर्च से पुष्टि के बाद साझा किया जाएगा।" },
      mapUrl: ""
    },
    {
      id: "cpi",
      name: { en: "Hotel Central Point International", hi: "होटल सेंट्रल पॉइंट इंटरनेशनल" },
      address: { en: "Raipur Road, Bilaspur (CPI)", hi: "रायपुर रोड, बिलासपुर (सीपीआई)" },
      purpose: { en: "Wedding reception", hi: "विवाह स्वागत समारोह" },
      note: { en: "Planned reception venue. The banquet hall and arrival time will be shared once confirmed.", hi: "प्रस्तावित स्वागत समारोह स्थल। बैंक्वेट हॉल और आगमन का समय पुष्टि के बाद साझा किया जाएगा।" },
      mapUrl: ""
    }
  ],
  events: [
    {
      id: "engagement", enabled: true, confirmed: false, venue: "mandapam", date: "", time: "", endTime: "",
      title: { en: "Engagement & blessings", hi: "सगाई और आशीर्वाद" },
      description: { en: "A joyful gathering of our families, with prayers and blessings for the journey ahead.", hi: "आने वाले जीवन के लिए प्रार्थनाओं और आशीर्वाद के साथ हमारे परिवारों का आनंदमय मिलन।" },
      attire: { en: "Festive Indian wear", hi: "पारंपरिक उत्सवी परिधान" }
    },
    {
      id: "mehendi", enabled: true, confirmed: false, venue: "mandapam", date: "", time: "", endTime: "",
      title: { en: "Mehendi", hi: "मेहंदी" },
      description: { en: "Henna, happy conversations and a little green — an intimate family celebration.", hi: "मेहंदी, हँसी-मज़ाक और हरे रंग के साथ परिवार के बीच एक प्यारा उत्सव।" },
      attire: { en: "A touch of green", hi: "हरे रंग की एक झलक" }
    },
    {
      id: "haldi", enabled: true, confirmed: false, venue: "mandapam", date: "", time: "", endTime: "",
      title: { en: "Haldi", hi: "हल्दी" },
      description: { en: "A little sunshine, a little colour and a whole lot of laughter with our loved ones.", hi: "थोड़ी धूप, थोड़े रंग और अपनों के साथ ढेर सारी हँसी व खुशियाँ।" },
      attire: { en: "Shades of yellow", hi: "पीले रंग के परिधान" }
    },
    {
      id: "sangeet", enabled: true, confirmed: false, venue: "mandapam", date: "", time: "", endTime: "",
      title: { en: "Sangeet night", hi: "संगीत संध्या" },
      description: { en: "An evening of music, family performances and memories made on the dance floor.", hi: "संगीत, पारिवारिक प्रस्तुतियों और नृत्य के साथ यादगार शाम।" },
      attire: { en: "Your festive best", hi: "अपने पसंदीदा उत्सवी परिधान" }
    },
    {
      id: "ceremony", enabled: true, confirmed: false, venue: "church", date: "", time: "", endTime: "",
      title: { en: "Holy Matrimony", hi: "पवित्र विवाह" },
      description: { en: "Join us in prayer as we exchange our vows and begin our married life in the presence of God and our loved ones.", hi: "ईश्वर और अपनों की उपस्थिति में विवाह के वचन लेते समय प्रार्थना में हमारा साथ दें और हमारे वैवाहिक जीवन की शुरुआत के साक्षी बनें।" },
      attire: { en: "Elegant, church-appropriate attire", hi: "चर्च के अनुरूप शालीन परिधान" }
    },
    {
      id: "reception", enabled: true, confirmed: false, venue: "cpi", date: "", time: "", endTime: "",
      title: { en: "The reception", hi: "स्वागत समारोह" },
      description: { en: "Stay for the celebration — warm wishes, family photographs and a wedding feast shared together.", hi: "शुभकामनाओं, पारिवारिक तस्वीरों और साथ मिलकर विवाह भोज का आनंद लेने के लिए हमारे साथ रहें।" },
      attire: { en: "Elegant evening wear", hi: "शालीन शाम के परिधान" }
    }
  ],
  travel: {
    en: "Travelling to Bilaspur? Please share your arrival plans with the family before booking a room or transfer. Guest stay is being planned at Mandapam; availability and transport arrangements are still to be confirmed.",
    hi: "बिलासपुर आ रहे हैं? कमरा या वाहन बुक करने से पहले अपने आगमन की जानकारी परिवार से साझा करें। मंडपम में अतिथि आवास की योजना है; उपलब्धता और परिवहन व्यवस्था की पुष्टि अभी बाकी है।"
  },
  stay: { venue: "mandapam" },
  giftNote: {
    en: "Your presence, prayers and blessings mean the world to us. We look forward to making beautiful memories with you.",
    hi: "आपकी उपस्थिति, प्रार्थनाएँ और आशीर्वाद हमारे लिए अनमोल हैं। आपके साथ सुंदर यादें बनाने का हमें इंतज़ार है।"
  },
  contact: { name: { en: "Family coordinator", hi: "परिवार समन्वयक" }, phone: "" },
  // Free RSVP: choose "link" and paste your Google Form's responder URL. See README.md.
  rsvp: { mode: "off", formUrl: "", deadline: "" },
  faqs: [
    {
      question: { en: "When will the final schedule be available?", hi: "अंतिम कार्यक्रम कब उपलब्ध होगा?" },
      answer: { en: "We will update this invitation as soon as dates, church timings and venue arrangements are confirmed. Please check back before making travel bookings.", hi: "तिथियों, चर्च के समय और स्थल व्यवस्था की पुष्टि होते ही यह निमंत्रण अपडेट किया जाएगा। यात्रा बुक करने से पहले कृपया फिर से देखें।" }
    },
    {
      question: { en: "What should I wear?", hi: "मुझे क्या पहनना चाहिए?" },
      answer: { en: "Wear something comfortable and celebratory. Modest formal or Indian attire is welcome for the church service. The colours listed with family functions are suggestions, not requirements.", hi: "आरामदायक और उत्सवी परिधान पहनें। चर्च के लिए शालीन औपचारिक या भारतीय परिधान उपयुक्त हैं। पारिवारिक समारोहों के साथ दिए रंग केवल सुझाव हैं, अनिवार्य नहीं।" }
    },
    {
      question: { en: "How do I arrange stay or transport?", hi: "आवास या परिवहन की व्यवस्था कैसे करूँ?" },
      answer: { en: "Please coordinate with the family. Rooms, pickup points and transfers between Mandapam, the church and CPI will be shared after confirmation.", hi: "कृपया परिवार से समन्वय करें। कमरों, पिकअप स्थानों और मंडपम, चर्च व सीपीआई के बीच परिवहन का विवरण पुष्टि के बाद साझा किया जाएगा।" }
    },
    {
      question: { en: "Are the pre-wedding functions part of the church service?", hi: "क्या विवाह-पूर्व कार्यक्रम चर्च की आराधना का हिस्सा हैं?" },
      answer: { en: "Engagement, Mehendi, Haldi and Sangeet are family celebrations in our working plan. Holy Matrimony is a separate CNI church service; its order will be agreed with the pastor.", hi: "सगाई, मेहंदी, हल्दी और संगीत हमारी कार्ययोजना के पारिवारिक समारोह हैं। पवित्र विवाह एक अलग सीएनआई चर्च आराधना है, जिसका क्रम पादरी से तय किया जाएगा।" }
    }
  ]
};
