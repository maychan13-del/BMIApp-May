/* All scenarios fictional · Hong Kong student life · class-safe */
const GAME_CONTENT = {
  level1: {
    kicker: "Level 1 · 🗂️",
    title: "Mis, Dis or Mal?",
    desc: "Sort each card into Misinformation (false, no harm meant), Disinformation (false on purpose), or Malinformation (true, used to harm).",
    timer: 18,
    cards: [
      {
        text: "Auntie Mei forwards a WhatsApp: “Drink boiled bitter melon water every morning — 100% cures flu!! Share to 10 friends or bad luck for a week 😱” She truly believes it.",
        answer: "mis",
        explain: "False health claim, but Auntie means well — classic misinformation, not a planned attack.",
        hint: "Check the intent: is someone trying to trick you, or just worried and sharing?",
      },
      {
        text: "A fake “HKO” graphic in a Telegram group claims Typhoon Signal No. 8 will hoist at 6am tomorrow. The poster later admits they made it “for the memes” so people would skip school.",
        answer: "dis",
        explain: "Deliberately false weather notice to make people act — that’s disinformation.",
        hint: "Someone invented a typhoon notice. Was it an accident… or a plan?",
      },
      {
        text: "Someone screenshots a classmate’s private group chat (real messages) and posts it on IG Stories to embarrass them after an argument.",
        answer: "mal",
        explain: "The chat is real, but sharing it to hurt someone is malinformation.",
        hint: "Is the content true? Then ask: why is it being shared?",
      },
      {
        text: "A well-meaning Form 4 student posts “MTR Island Line closed all day because of mysterious gas!!” after mishearing a station announcement about a short delay.",
        answer: "mis",
        explain: "Wrong info from a misunderstanding, not a plot — misinformation.",
        hint: "Mishearing ≠ mastermind. Intent matters.",
      },
      {
        text: "A polished email “from Octopus Card Support” asks students to “verify” their card and password via a shady link. The scammer knows it’s fake.",
        answer: "dis",
        explain: "Phishing with a fake brand is intentional deception — disinformation (and a scam).",
        hint: "Official services rarely ask for passwords by email. Who benefits?",
      },
      {
        text: "A real photo of a student sleeping in the library is posted with the caption “Scholarship recipient too lazy to study — cancel their award!!” to stir up hate.",
        answer: "mal",
        explain: "True image, weaponised with a harmful frame — malinformation.",
        hint: "Photo can be real and still used to attack someone.",
      },
    ],
  },

  level2: {
    kicker: "Level 2 · 🎭",
    title: "Name That Trick",
    desc: "Spot the manipulation tactic. Timer is snappier — keep that combo flying!",
    timer: 12,
    tactics: [
      "Emotional bait",
      "Fake expert",
      "Out-of-context photo",
      "Cherry-picked stats",
      "Impersonation",
      "Clickbait",
      "False dilemma",
    ],
    rounds: [
      {
        text: "“If you LOVE HK students, SHARE this NOW 😭💔 Teachers don’t want you to see this secret exam leak!!!”",
        answer: "Emotional bait",
        explain: "Guilt + urgency + tears = emotional bait to make you share before thinking.",
        hint: "Lots of crying emojis and “SHARE NOW” — what’s being hijacked?",
      },
      {
        text: "Headline: “Dr. Wealthy Chan, Harvard brain coach, says this HK snack raises IQ by 40%.” No university listing exists for that name.",
        answer: "Fake expert",
        explain: "A made-up authority is a fake-expert play to borrow trust.",
        hint: "Fancy title + big claim. Can you verify the person?",
      },
      {
        text: "An old photo of a packed MTR platform from a concert night is reused with “BREAKING: citywide transport collapse today.”",
        answer: "Out-of-context photo",
        explain: "Real photo, wrong story — out-of-context imagery.",
        hint: "Images travel. When and where was this taken?",
      },
      {
        text: "“9 out of 10 CUHK canteen goers prefer Brand X bubble tea!” (Survey: 10 friends in one WhatsApp group.)",
        answer: "Cherry-picked stats",
        explain: "Tiny, biased sample dressed up as a big fact = cherry-picked stats.",
        hint: "Who was asked, and how many?",
      },
      {
        text: "A lookalike “@HKU_Official_News” account (extra underscore) DMs: “You’ve won a $5000 book voucher — reply with student ID.”",
        answer: "Impersonation",
        explain: "Pretending to be a trusted school brand is impersonation.",
        hint: "Check the handle carefully. Extra letters = red flag.",
      },
      {
        text: "“You won’t BELIEVE what this PolyU hall warden did at 3am… (number 4 will shock you!!!)” — article is ads and nothing.",
        answer: "Clickbait",
        explain: "Curiosity gap + shock tease with no substance = clickbait.",
        hint: "The headline promises shock; the page delivers… ads.",
      },
    ],
  },

  level3: {
    kicker: "Level 3 · 📱",
    title: "Feed Detective",
    desc: "Share 🔁 only what’s solid. Flag 🚩 the shady stuff. You’ve got 3 Investigate tokens — use them wisely. Shared fakes pump the Viral Meter.",
    timer: 14,
    investigateTokens: 3,
    posts: [
      {
        who: "Campus Mum Tips",
        handle: "@campusmum_tips",
        avatar: "CM",
        time: "2h · Trending in HK",
        caption:
          "URGENT: All CityU exams cancelled tomorrow because of “poisonous air” near campus. Repost to warn everyone!! 🚨",
        shouldFlag: true,
        infect: 4200,
        explainWrongShare:
          "You shared a fake panic post — it jumps to thousands of phones. Always check official channels first.",
        explainRightFlag:
          "Nice catch. Emergency claims need an official source — this one has none.",
        investigate:
          "Source: personal page, not CityU. No HKO / school notice. Image reverse-search: stock smoke photo from overseas.",
      },
      {
        who: "Hall Life HK",
        handle: "@halllife_hk",
        avatar: "HL",
        time: "Yesterday",
        caption:
          "Friendly reminder: typhoon signal updates only from the Hong Kong Observatory app/site. Hall WhatsApp rumours ≠ official. Stay safe! 🌀",
        shouldFlag: false,
        infect: 0,
        explainWrongShare: null,
        explainRightFlag: "This one is solid advice — flagging good posts wastes trust.",
        explainRightShare: "Good share — it points people to the real source (HKO).",
        explainWrongFlag: "This post helps, it doesn’t harm. No need to flag.",
        investigate:
          "Account regularly cites HKO. Link in bio matches known student society page. Tone is calm, not panic-selling.",
      },
      {
        who: "Scholar$hip Fast Track",
        handle: "@scholar_fast_hk",
        avatar: "$$",
        time: "38m",
        caption:
          "Congrats! You’re pre-selected for a $20,000 “Young Talent” scholarship. Pay $80 “admin fee” via FPS to unlock. Limited to HK students only 🎓💰",
        shouldFlag: true,
        infect: 6800,
        explainWrongShare: "Scholarship fee scam shared — more classmates get baited. Painful.",
        explainRightFlag: "Real scholarships don’t ask for FPS admin fees. Flagged correctly!",
        investigate:
          "Domain registered last week. No Education Bureau / school listing. Reviews elsewhere call it a fee scam.",
      },
      {
        who: "Library Quiet Club",
        handle: "@lib_quiet_club",
        avatar: "LQ",
        time: "4h",
        caption:
          "Main Library Level 3 is noisy tonight because of a society event until 9pm. Levels 4–5 are quieter for revision. 📚",
        shouldFlag: false,
        infect: 0,
        explainRightShare: "Practical campus tip with no wild claim — fine to share.",
        explainWrongFlag: "Everyday hall/library tips aren’t disinfo. Save the flag.",
        investigate:
          "Cross-check: society calendar lists the event. Multiple friends confirm Level 3 noise. No payment asks.",
      },
      {
        who: "HealthGlow Daily",
        handle: "@healthglow_daily",
        avatar: "HG",
        time: "12m · Sponsored look",
        caption:
          "Doctors HATE this Mong Kok herb mix!! Clears acne in 2 days guaranteed. DM to buy. Before/after pics (blurry, same lighting every time).",
        shouldFlag: true,
        infect: 5100,
        explainWrongShare: "Miracle-cure spam spreads fast — Viral Meter climbs.",
        explainRightFlag: "Guaranteed cures + “doctors hate this” = classic junk. Good flag.",
        investigate:
          "Seller has no clinic licence listed. “Before/after” images appear on overseas scam pages too.",
      },
      {
        who: "SU Notice Board",
        handle: "@su_notice_board",
        avatar: "SU",
        time: "1d",
        caption:
          "Orientation week helpers needed Sat 10am at the covered plaza. Sign-up form is on the official SU site (link in bio). Free lunch + service hours. 🙌",
        shouldFlag: false,
        infect: 0,
        explainRightShare: "Clear event details + points to official SU site. Safe share.",
        explainWrongFlag: "Looks like a normal student union call — not a rumour.",
        investigate:
          "Handle matches SU branding used all semester. Form domain = university subdomain. No fee.",
      },
      {
        who: "Octopus Care Centre",
        handle: "@octopus_care_hk",
        avatar: "OC",
        time: "55m",
        caption:
          "Security upgrade: reply with your Octopus number + bank SMS code to keep riding MTR at student fare. Ignore = card locked tonight.",
        shouldFlag: true,
        infect: 9000,
        explainWrongShare: "Phishing blast amplified — thousands “infected.” Ouch.",
        explainRightFlag: "Banks/cards never ask for SMS codes on social. Excellent flag!",
        investigate:
          "Handle isn’t the official Octopus account. Urgency + SMS code request = phishing pattern.",
      },
      {
        who: "Fact Friends HK",
        handle: "@factfriends_hk",
        avatar: "FF",
        time: "3h",
        caption:
          "Reminder: that “free AirPods from campus Wi‑Fi survey” link going around is phishing. Don’t login. Report it. ✅",
        shouldFlag: false,
        infect: 0,
        explainRightShare: "You’re helping others avoid a scam — share away!",
        explainWrongFlag: "This is a warning against phishing, not phishing itself.",
        investigate:
          "Post quotes IT office advisory. Multiple independent students confirm the fake survey link.",
      },
    ],
  },

  boss: {
    kicker: "Boss Round · 🤖",
    title: "Real or AI?",
    desc: "Quick-fire: is each snippet Genuine or AI-fabricated? Points are doubled. Listen for the drama…",
    timer: 9,
    items: [
      {
        text: "“As a PolyU robotics student, I personally invented the MTR train last Tuesday using only bubble tea and Wi‑Fi.” — attributed to a “campus innovator” quote card.",
        answer: "ai",
        explain: "Impossible brag + weird specifics = tell-tale AI/fabricated nonsense.",
      },
      {
        text: "A caption under a slightly melted-looking “celebrity tutor” selfie: “I’ll leak tomorrow’s DSE English paper if this gets 10k likes 😘📚”",
        answer: "ai",
        explain: "Impossible promise + odd face artifacts vibe — treat as AI-fabricated bait.",
      },
      {
        text: "Your school’s real weekly digest email (same layout as always) lists library hours for reading week and a blood donation drive on Friday.",
        answer: "real",
        explain: "Familiar official channel + boring useful details — typically genuine.",
      },
      {
        text: "Quote graphic: local singer supposedly says “I never ate egg waffles; egg waffles ate me in Tsim Sha Tsui at 3:17am under neon rain of destiny.”",
        answer: "ai",
        explain: "Over-poetic, oddly specific gibberish — classic AI-flavoured fake quote.",
      },
      {
        text: "A classmate’s photo of the noticeboard outside the general office showing tomorrow’s room change for MATH2001 — you can see the same notice in person.",
        answer: "real",
        explain: "Verifiable on campus with your own eyes — genuine, not AI news.",
      },
    ],
  },

  ranks: [
    { min: 0, title: "🐟 Gullible Goldfish", blurb: "Keep swimming — practice makes sharp." },
    { min: 1200, title: "🐣 Curious Chick", blurb: "You’re asking better questions already." },
    { min: 2800, title: "🦉 Sharp Owl", blurb: "Rumours have a harder time past you." },
    { min: 4200, title: "🥷 Truth Ninja", blurb: "Stealthy, sceptical, unstoppable." },
  ],
};
