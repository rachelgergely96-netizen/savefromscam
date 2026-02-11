export const SCENARIOS = [
  {
    id: 1,
    type: "Text Message",
    icon: "\u{1F4AC}",
    difficulty: "Beginner",
    from: "+1 (833) 555-0147",
    message:
      "ALERT: Your EZPass account has an unpaid toll of $4.75. Your driving privileges will be suspended if not paid within 24hrs. Pay now: ez-pass-payment.securetolls.net/verify",
    redFlags: [
      {
        text: "ez-pass-payment.securetolls.net",
        label:
          "Fake domain \u2014 real EZPass uses ezpassnh.com or state-specific sites",
      },
      {
        text: "suspended within 24hrs",
        label:
          "Urgency tactic \u2014 creates panic to prevent you from thinking clearly",
      },
      {
        text: "$4.75",
        label: "Small amount \u2014 designed to seem not worth questioning",
      },
    ],
    isScam: true,
    explanation:
      "This is a classic toll road phishing scam that surged 900% in 2025. Real toll agencies send physical mail for unpaid tolls \u2014 they never text you a payment link.",
    tip: "Always go directly to the official toll website by typing it into your browser. Never click links in texts about unpaid tolls.",
  },
  {
    id: 2,
    type: "Phone Call",
    icon: "\u{1F4DE}",
    difficulty: "Intermediate",
    from: "Caller ID: 'Social Security Admin'",
    message:
      '"Hello, this is Officer James Mitchell, badge number 4471, from the Social Security Administration. We\'ve detected fraudulent activity on your Social Security number. Your SSN has been linked to criminal activity in Texas and your benefits will be frozen immediately unless you verify your identity. I need your full Social Security number and date of birth to prevent the suspension. This is time-sensitive \u2014 if you hang up, a warrant will be issued for your arrest."',
    redFlags: [
      {
        text: "badge number 4471",
        label:
          "Fake authority \u2014 SSA employees don't have 'badge numbers'",
      },
      {
        text: "your benefits will be frozen immediately",
        label:
          "Threat tactic \u2014 SSA never threatens to freeze benefits over the phone",
      },
      {
        text: "I need your full Social Security number",
        label:
          "Data harvesting \u2014 SSA already has your SSN and would never ask for it",
      },
      {
        text: "a warrant will be issued for your arrest",
        label:
          "Intimidation \u2014 law enforcement doesn't call to warn about arrest warrants",
      },
    ],
    isScam: true,
    explanation:
      "This is a government impersonation scam, one of the costliest fraud types with median losses over $14,000. The SSA will never call threatening arrest, ask for your full SSN, or demand immediate action.",
    tip: "Hang up immediately. If you're worried, call the SSA directly at 1-800-772-1213 (their real number, which you can verify on ssa.gov).",
  },
  {
    id: 3,
    type: "Email",
    icon: "\u2709\uFE0F",
    difficulty: "Advanced",
    from: "careers@amaz0n-recruiting.com",
    message:
      "Subject: Remote Position \u2014 Customer Experience Coordinator ($42/hr)\n\nHi! Based on your LinkedIn profile, we'd love to offer you a remote Customer Experience Coordinator position at Amazon. The role pays $42/hour, fully remote, flexible schedule.\n\nTo get started, please complete our onboarding form which requires your banking details for direct deposit setup, and a $75 equipment fee for your home office starter kit (laptop + headset), which will be reimbursed on your first paycheck.\n\nPlease complete onboarding within 48 hours to secure your spot.",
    redFlags: [
      {
        text: "amaz0n-recruiting.com",
        label:
          "Spoofed domain \u2014 uses '0' instead of 'o'. Real Amazon emails come from @amazon.com",
      },
      {
        text: "$42/hour, fully remote, flexible schedule",
        label:
          "Too good to be true \u2014 unrealistic compensation for an entry-level role",
      },
      {
        text: "$75 equipment fee",
        label:
          "Upfront payment \u2014 legitimate employers never charge you to start working",
      },
      {
        text: "within 48 hours to secure your spot",
        label:
          "Artificial urgency \u2014 pressure to act before you can research the offer",
      },
    ],
    isScam: true,
    explanation:
      "Employment scams surged dramatically in 2025 as layoffs increased. Scammers impersonate real companies on LinkedIn and job boards. They steal your banking info through fake 'onboarding' and collect upfront fees that are never reimbursed.",
    tip: "Visit the company's official careers page directly. Real companies never charge equipment fees, and the hiring process always involves actual interviews.",
  },
];

export const COMMUNITY_POSTS = [
  {
    user: "Margaret T.",
    location: "Orlando, FL",
    time: "2 hours ago",
    type: "Phone",
    scam: "Got a call claiming to be from FPL saying my power would be shut off in 1 hour unless I paid with gift cards. FPL confirmed it was fake.",
    votes: 47,
    verified: true,
  },
  {
    user: "Robert K.",
    location: "Maitland, FL",
    time: "5 hours ago",
    type: "Text",
    scam: "Received a text about an undelivered USPS package with a link to 'usps-redelivery.tracking-info.com'. Definitely phishing.",
    votes: 32,
    verified: true,
  },
  {
    user: "Carol A.",
    location: "Winter Park, FL",
    time: "1 day ago",
    type: "Email",
    scam: "Email claiming my Publix pharmacy prescription was ready with a link to 'verify insurance.' Publix doesn't send emails like this.",
    votes: 89,
    verified: true,
  },
  {
    user: "James W.",
    location: "Altamonte Springs, FL",
    time: "1 day ago",
    type: "Online",
    scam: "Facebook Marketplace seller wanted payment via Zelle before showing the furniture. Used stock photos. Classic marketplace scam.",
    votes: 24,
    verified: false,
  },
  {
    user: "Patricia M.",
    location: "Kissimmee, FL",
    time: "2 days ago",
    type: "Phone",
    scam: "Grandson voice clone asking for bail money. Used our actual grandson's name. We called him directly \u2014 he was fine. Terrifying how real it sounded.",
    votes: 156,
    verified: true,
  },
];

export const SAMPLE_SCAM_TEXT = `Hi Grandma, it's me, your grandson Michael. I'm in trouble and I need your help. I was in a car accident and I got arrested. Please don't tell Mom and Dad \u2014 I'm so embarrassed. My lawyer says I need $2,000 for bail posted today or I'll have to stay in jail over the weekend. Can you send it through Zelle to my lawyer's account? His number is 555-0199. Please hurry, I'm really scared.`;
