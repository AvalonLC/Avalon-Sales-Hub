window.AVALON_DATA = {
  "company": {
    "name": "Avalon Landscape Construction",
    "website": "avalon-lc.com",
    "tagline": "Consultative. Profitable. Operationally clean. Easy to trust."
  },
  "serviceLines": [
    "Maintenance Contract",
    "Seasonal Service",
    "Enhancement",
    "Drainage / Hardscape",
    "Design-Build",
    "Commercial Scope",
    "Specialty / Site Work",
    "Other"
  ],
  "leadSources": [
    "Website",
    "Referral",
    "Existing Client",
    "Google",
    "Social Media",
    "Yard Sign",
    "Networking",
    "Past Client",
    "Other"
  ],
  "statuses": [
    "New Lead",
    "Discovery Scheduled",
    "Site Walk Scheduled",
    "Scope Development",
    "Estimating",
    "Proposal Sent",
    "Follow-Up",
    "Verbal Yes",
    "Sold / Activation",
    "On Hold",
    "Closed Lost"
  ],
  "stages": [
    {
      "id": 1,
      "title": "Lead Intake and Routing",
      "owner": "Sales Lead / Admin Support",
      "purpose": "Decide what kind of opportunity this is before anyone starts selling.",
      "artifact": "Lead record with service line, owner, source, timing, and next step.",
      "gate": "Enough information exists to schedule a discovery call or site walk.",
      "dayUse": "Open this stage before moving an opportunity through lead intake and routing.",
      "actions": [
        "Confirm the client need and current status.",
        "Document the required information in the opportunity record.",
        "Set or confirm the next clear action with an owner and date.",
        "Do not move forward until the stage gate is satisfied."
      ],
      "redFlags": [
        "No clear next step.",
        "Decision-maker or budget comfort is unclear.",
        "Assumptions are not documented.",
        "The client expectation and internal production reality do not match."
      ]
    },
    {
      "id": 2,
      "title": "Discovery and Mutual Agreement",
      "owner": "Sales Lead / Account Manager",
      "purpose": "Create rapport, learn the buyer story, and agree on a clear next step.",
      "artifact": "Discovery notes with buying reasons, decision map, timing, budget comfort, and fit assessment.",
      "gate": "Avalon understands the real problem well enough to inspect the site and shape scope.",
      "dayUse": "Open this stage before moving an opportunity through discovery and mutual agreement.",
      "actions": [
        "Confirm the client need and current status.",
        "Document the required information in the opportunity record.",
        "Set or confirm the next clear action with an owner and date.",
        "Do not move forward until the stage gate is satisfied."
      ],
      "redFlags": [
        "No clear next step.",
        "Decision-maker or budget comfort is unclear.",
        "Assumptions are not documented.",
        "The client expectation and internal production reality do not match."
      ]
    },
    {
      "id": 3,
      "title": "Site Walk and Opportunity Qualification",
      "owner": "Sales Lead with Estimator / Project Lead as needed",
      "purpose": "Confirm site conditions, constraints, quality expectations, and project fit.",
      "artifact": "Site walk notes with measurements, photos, scope clarity, and fit decision.",
      "gate": "Avalon can accurately estimate and deliver this project at acceptable quality and margin.",
      "dayUse": "Open this stage before moving an opportunity through site walk and qualification.",
      "actions": [
        "Walk the full site with the client and document all relevant conditions.",
        "Confirm scope, quality expectations, and timeline with the client.",
        "Identify any red flags, constraints, or risks before estimating.",
        "Make the fit decision before leaving the site."
      ],
      "redFlags": [
        "Scope is vague after walking the site.",
        "Client has unrealistic price or timeline expectations.",
        "Site access, HOA, or permit complications not addressed.",
        "Fit decision was deferred without a clear reason."
      ]
    },
    {
      "id": 4,
      "title": "Scope Development",
      "owner": "Sales Lead with Estimator",
      "purpose": "Define exactly what Avalon will deliver, what is excluded, and what assumptions are baked in.",
      "artifact": "Scope document with inclusions, exclusions, assumptions, and allowances.",
      "gate": "Scope is specific enough to estimate accurately and defend in writing.",
      "dayUse": "Open this stage before moving an opportunity into estimating.",
      "actions": [
        "Draft the full scope of work with line-item inclusions.",
        "Document all exclusions and assumptions explicitly.",
        "Confirm scope aligns with client expectations from the site walk.",
        "Get internal agreement before estimating begins."
      ],
      "redFlags": [
        "Scope includes vague language like 'as needed' without limits.",
        "Exclusions have not been communicated to the client.",
        "Estimating started before scope was locked.",
        "Client-facing scope and internal scope differ."
      ]
    },
    {
      "id": 5,
      "title": "Estimating and Margin Review",
      "owner": "Estimator / Sales Lead",
      "purpose": "Price the work accurately, protect margin, and confirm the project is worth doing.",
      "artifact": "Estimate with cost breakdown, markup, final price, and margin summary.",
      "gate": "Estimate meets margin target and has been reviewed by a manager or senior estimator.",
      "dayUse": "Open this stage before finalizing a price for a proposal.",
      "actions": [
        "Build the estimate from scope, not from guess or gut.",
        "Apply correct markup for service line and project type.",
        "Run a margin check before approving the number.",
        "Document the pricing rationale for the proposal file."
      ],
      "redFlags": [
        "Estimate was built without a locked scope.",
        "Margin was reduced without changing scope.",
        "No manager sign-off on large or complex projects.",
        "Contingency was left out of high-risk work."
      ]
    },
    {
      "id": 6,
      "title": "Proposal Preparation and Delivery",
      "owner": "Sales Lead",
      "purpose": "Present the investment clearly, protect scope, and frame the decision correctly.",
      "artifact": "Proposal document with scope, price, exclusions, timeline, and next steps.",
      "gate": "Proposal is complete, reviewed, and delivered to the decision-maker with a scheduled follow-up.",
      "dayUse": "Open this stage before sending a proposal.",
      "actions": [
        "Build the proposal from the approved estimate and scope.",
        "Include all exclusions and assumptions in plain language.",
        "Present the proposal directly to the decision-maker when possible.",
        "Set the follow-up date and expectation before leaving the conversation."
      ],
      "redFlags": [
        "Proposal was emailed without a live presentation or call.",
        "No follow-up date was set at the time of delivery.",
        "Exclusions were not communicated before the client saw the price.",
        "Proposal went to someone other than the decision-maker."
      ]
    },
    {
      "id": 7,
      "title": "Follow-Up and Decision Management",
      "owner": "Sales Lead",
      "purpose": "Stay in contact, resolve objections, and move the client toward a clear decision.",
      "artifact": "Follow-up log with dates, responses, objections addressed, and next steps.",
      "gate": "Client has given a clear yes, no, or adjusted decision path.",
      "dayUse": "Open this stage each time you follow up with a proposal in progress.",
      "actions": [
        "Follow up on or before the date agreed at proposal delivery.",
        "Ask a clear question: what is the biggest concern right now?",
        "Address objections directly without discounting scope.",
        "Move the client toward a decision, not toward another call."
      ],
      "redFlags": [
        "Follow-up is happening more than three times with no movement.",
        "Client is avoiding contact without explanation.",
        "Scope or price is being negotiated without a counteroffer.",
        "No clear decision date has been agreed."
      ]
    },
    {
      "id": 8,
      "title": "Verbal Yes and Commitment",
      "owner": "Sales Lead",
      "purpose": "Confirm the client's intent and set up the formal approval process.",
      "artifact": "Notes confirming verbal yes, agreed price, scope, timeline, and next step for approval.",
      "gate": "Client has verbally confirmed scope, price, and timing, and has agreed to formal approval.",
      "dayUse": "Open this stage immediately after a client says yes before moving to contract.",
      "actions": [
        "Confirm the scope, price, and timeline verbally and in writing.",
        "Thank the client and set the clear next step for signing.",
        "Do not begin production conversations until verbal is documented.",
        "Send a summary email of what was agreed."
      ],
      "redFlags": [
        "Verbal yes was vague or conditional.",
        "No confirmation of scope or price was documented.",
        "Production was notified before approval was received.",
        "Client timeline and Avalon scheduling have not been aligned."
      ]
    },
    {
      "id": 9,
      "title": "Contract and Deposit",
      "owner": "Sales Lead / Admin",
      "purpose": "Secure formal approval and deposit to lock the project into production scheduling.",
      "artifact": "Signed contract and deposit receipt.",
      "gate": "Signed contract and deposit received.",
      "dayUse": "Open this stage to complete the formal approval and deposit collection process.",
      "actions": [
        "Send the contract based on the approved proposal and scope.",
        "Collect deposit per Avalon payment terms.",
        "Confirm receipt of signed contract and deposit before scheduling.",
        "Deliver a welcome message and set the client's expectations for next steps."
      ],
      "redFlags": [
        "Contract was modified from the approved proposal without review.",
        "Deposit was deferred or waived without manager approval.",
        "Client was scheduled before contract was signed.",
        "Scope changed after contract was sent."
      ]
    },
    {
      "id": 10,
      "title": "Sold Job Activation and Handoff",
      "owner": "Sales Lead + Project Lead",
      "purpose": "Transfer all project knowledge cleanly to production so the job starts right.",
      "artifact": "Handoff packet with scope, contract, site notes, client preferences, and production requirements.",
      "gate": "Project Lead has confirmed they have everything needed to start the job.",
      "dayUse": "Open this stage to complete the sold job activation and production handoff.",
      "actions": [
        "Complete the sold job activation checklist before the handoff meeting.",
        "Walk the project lead through the scope, client, site, and expectations.",
        "Transfer all files, photos, notes, and contract documents.",
        "Confirm the production start date and client notification plan."
      ],
      "redFlags": [
        "Handoff was done by email only with no conversation.",
        "Site photos or measurements were not transferred.",
        "Client expectations were not documented for production.",
        "Production start date was not confirmed before handoff."
      ]
    },
    {
      "id": 11,
      "title": "Production Liaison",
      "owner": "Sales Lead / Account Manager",
      "purpose": "Stay available to support production without interfering with the project lead.",
      "artifact": "Notes on any scope questions, client concerns, or change orders raised during production.",
      "gate": "Job is complete, client is satisfied, and any change orders are approved.",
      "dayUse": "Open this stage if a client question or scope issue comes up during production.",
      "actions": [
        "Check in with the project lead at key milestones.",
        "Respond to any client questions within one business day.",
        "Process change orders through proper approval before authorizing.",
        "Do not override project lead decisions without a conversation."
      ],
      "redFlags": [
        "Client is calling sales directly to complain about production.",
        "Scope creep is happening without a change order.",
        "Production and client expectations have diverged.",
        "Sales is micromanaging the project lead."
      ]
    },
    {
      "id": 12,
      "title": "Closeout, Review, and Referral",
      "owner": "Sales Lead / Account Manager",
      "purpose": "Close the job cleanly, collect feedback, and create the next opportunity.",
      "artifact": "Closeout notes, client satisfaction confirmation, review request sent, and referral conversation documented.",
      "gate": "Client has confirmed satisfaction, review has been requested, and next opportunity has been identified.",
      "dayUse": "Open this stage after production confirms job completion.",
      "actions": [
        "Contact the client within two business days of job completion.",
        "Confirm they are satisfied with the outcome.",
        "Request a Google review with a direct link.",
        "Ask about the next project or referral opportunity."
      ],
      "redFlags": [
        "Closeout call was skipped or deferred.",
        "Review was never requested.",
        "An unsatisfied client was not escalated before closeout.",
        "No next-opportunity conversation happened."
      ]
    }
  ],
  "forms": [
    {
      "id": "lead-intake",
      "title": "Lead Intake Checklist",
      "when": "Before routing any new inquiry to the pipeline.",
      "fields": [
        "Client name and primary contact",
        "Phone and email",
        "Property address",
        "Service line requested",
        "Lead source",
        "Project description or problem",
        "Urgency and preferred timeline",
        "Decision-maker confirmed",
        "Budget range or comfort level",
        "Next follow-up date and owner"
      ],
      "checklist": [
        "Client name and contact documented",
        "Service line identified and assigned",
        "Lead source recorded",
        "Decision-maker confirmed",
        "Next step set with date and owner",
        "Opportunity created in tracking system"
      ]
    },
    {
      "id": "discovery",
      "title": "Discovery Call Planner",
      "when": "Before every initial discovery conversation with a prospect.",
      "fields": [
        "What prompted the inquiry (in their words)",
        "What does the ideal outcome look like to them",
        "What has been tried before",
        "Who is involved in the decision",
        "What is the timeline and urgency",
        "What is their budget comfort range",
        "What concerns do they have about hiring",
        "What does success look like 12 months from now"
      ],
      "checklist": [
        "Buying reason documented",
        "Decision-maker identified",
        "Timeline and urgency confirmed",
        "Budget comfort explored",
        "Fit concerns noted",
        "Next step agreed and documented",
        "Follow-up date set"
      ]
    },
    {
      "id": "site-walk",
      "title": "Site Walk Checklist",
      "when": "Before every site visit with a prospect or client.",
      "fields": [
        "Site address and access notes",
        "Client present? Contact on-site",
        "Scope description confirmed at site",
        "Site conditions and constraints observed",
        "Measurements or square footage needed",
        "Photos taken of key areas",
        "HOA, permit, or utility considerations",
        "Quality expectations confirmed",
        "Fit decision: proceed, modify, or pass",
        "Next step agreed before leaving"
      ],
      "checklist": [
        "Full site walked",
        "Scope confirmed or adjusted",
        "Site photos taken",
        "Constraints documented",
        "Quality expectations confirmed",
        "Fit decision made",
        "Next step agreed before leaving site"
      ]
    },
    {
      "id": "proposal-review",
      "title": "Proposal Review Checklist",
      "when": "Before sending or presenting any proposal.",
      "fields": [
        "Client name and project description",
        "Scope matches what was discussed at site",
        "Price matches approved estimate",
        "Exclusions and assumptions documented",
        "Timeline and scheduling terms included",
        "Payment terms included",
        "Proposal presentation format confirmed",
        "Decision-maker confirmed for delivery",
        "Follow-up date set for after delivery"
      ],
      "checklist": [
        "Scope matches site walk and discovery",
        "Price matches approved estimate",
        "Exclusions written in plain language",
        "Assumptions documented",
        "Proposal reviewed by manager if required",
        "Delivery method confirmed (live or email)",
        "Follow-up date agreed before sending"
      ]
    },
    {
      "id": "follow-up",
      "title": "Follow-Up Cadence Guide",
      "when": "After every proposal delivery. Use as a repeatable follow-up structure.",
      "fields": [
        "Proposal delivered on (date)",
        "Day 1-2: Thank-you follow-up sent",
        "Day 4-5: Check-in call or email",
        "Day 8-10: Direct ask for decision or concern",
        "Day 14+: Final decision request or close",
        "Objection raised (if any)",
        "Objection addressed with (response)",
        "Decision outcome"
      ],
      "checklist": [
        "Thank-you sent within 24 hours of proposal",
        "First follow-up within 3 business days",
        "Objections identified and addressed",
        "Clear decision requested by Day 10",
        "Follow-up outcome documented",
        "Closed or moved to appropriate pipeline stage"
      ]
    },
    {
      "id": "handoff",
      "title": "Sold Job Activation Checklist",
      "when": "After contract is signed and deposit received. Complete before production handoff.",
      "fields": [
        "Client name and contact confirmed",
        "Contract signed and deposit received",
        "Scope of work document transferred",
        "Site photos and measurements transferred",
        "Client preferences and sensitivities noted",
        "HOA, permit, or access instructions included",
        "Production start date confirmed",
        "Client notification plan agreed",
        "Project lead confirmed and briefed",
        "Sales contacts removed from production daily flow"
      ],
      "checklist": [
        "Signed contract in project file",
        "Deposit confirmed received",
        "Scope document transferred to production",
        "Site photos transferred",
        "Client preferences documented",
        "Project lead briefed in person or on call",
        "Production start date confirmed",
        "Client notified of start date and contact"
      ]
    }
  ],
  "scripts": [
    {
      "category": "First Contact",
      "title": "Inbound Lead Response",
      "body": "Hi [Name], this is [Your Name] with Avalon Landscape Construction. Thank you for reaching out — I wanted to connect quickly to learn more about your project and see if we might be a good fit.\n\nCan you tell me a little about what you're looking to get done and what's prompting the project right now?"
    },
    {
      "category": "First Contact",
      "title": "Referral Introduction",
      "body": "Hi [Name], this is [Your Name] with Avalon. [Referrer name] suggested I reach out — they mentioned you may be looking at a [project type].\n\nI appreciate the introduction. I'd love to learn more about what you're working on. Do you have a few minutes to talk through it now, or is there a better time this week?"
    },
    {
      "category": "Discovery",
      "title": "Opening Discovery Question",
      "body": "Before I start asking about scope or price, I want to make sure I actually understand what you're trying to solve. So let me ask — what's the main thing that prompted you to start looking at this now?\n\nAnd what would a successful outcome look like for you, say, six months after the project is done?"
    },
    {
      "category": "Discovery",
      "title": "Decision-Maker Confirmation",
      "body": "I want to make sure I'm bringing the right information to the right people. When it comes to a decision like this — is it primarily you, or is there a partner or family member who would be part of the final call?\n\nI ask because I want to make sure whoever needs to be in the conversation is included from the start."
    },
    {
      "category": "Discovery",
      "title": "Budget Comfort Exploration",
      "body": "I know budget is a sensitive topic, so I'll be direct. We typically see projects like this ranging from [range]. I'm not asking you to commit to a number — I just want to make sure I'm building something that makes sense for your situation.\n\nIs there a range that would feel comfortable for you to invest, assuming we can deliver what you're describing?"
    },
    {
      "category": "Site Walk",
      "title": "Site Walk Opening",
      "body": "Thanks for having me out. Before we walk anything, let me just confirm — the main thing we're here to look at today is [scope summary]. Does that still reflect what you're thinking, or has anything changed since we last spoke?\n\nAnd while we walk, if you have any concerns or things you want me to pay special attention to, please point them out. That detail always helps us get the estimate right."
    },
    {
      "category": "Site Walk",
      "title": "Fit Decision Conversation",
      "body": "Based on what I've seen today, I want to be straightforward with you. This is [a strong fit / a project we can do well / something I want to think about before committing].\n\nHere's what I'm thinking from our side — [brief summary]. Does that align with your expectations, and does it make sense to move forward with an estimate?"
    },
    {
      "category": "Proposal",
      "title": "Proposal Walk-Through Opening",
      "body": "Before I walk you through the numbers, I want to recap what we're proposing — because the price only makes sense in context of what's included.\n\nWe're covering [scope summary]. We're explicitly excluding [exclusions]. Our assumptions include [key assumptions].\n\nWith that context, the investment for this scope is [price]. I want to walk you through how we got there."
    },
    {
      "category": "Proposal",
      "title": "Anchoring the Price",
      "body": "The total investment for this scope is [price].\n\nThe way we built this — [brief explanation of cost drivers]. We're not the lowest-cost option in the market, and that's intentional. What you're getting with Avalon is [differentiator].\n\nDoes this feel like the right investment range for what you're trying to accomplish?"
    },
    {
      "category": "Follow-Up",
      "title": "Post-Proposal Check-In",
      "body": "Hi [Name], this is [Your Name] with Avalon. I sent over the proposal [X days ago] and wanted to follow up. I don't want to pressure you — I just want to make sure you have everything you need to make a comfortable decision.\n\nIs there anything in the proposal you'd like me to clarify, or any concerns that came up since we last spoke?"
    },
    {
      "category": "Follow-Up",
      "title": "Direct Decision Ask",
      "body": "I want to be respectful of your time and mine, so I'll be direct. We've talked through the project, you've seen the proposal, and I've addressed the questions I know about.\n\nWhere are you at with this? Are we moving forward, is there something that's holding you back, or is this something that's off the table right now?\n\nAny of those answers are fine — I just want to make sure we're both clear on where things stand."
    },
    {
      "category": "Closing",
      "title": "Verbal Yes Confirmation",
      "body": "Excellent — I appreciate the confidence. Let me confirm what we've agreed to: [scope], at [price], starting [timeline].\n\nThe next step is getting the paperwork over to you. I'll send the contract and deposit instructions today. Once those are received, we'll lock in your spot in the schedule.\n\nIs there anything you need from me before you sign?"
    },
    {
      "category": "Closing",
      "title": "Closing the Lost Job",
      "body": "I appreciate you letting me know. I want to be honest — I'd love to understand what made the difference, if you're open to sharing. Not to change your mind, but because it helps us improve.\n\nWas it primarily the price, the scope, timing, or something about the fit? I'm asking because it helps us get better for the next conversation."
    }
  ],
  "templates": [
    {
      "category": "First Contact",
      "title": "Inbound Lead Acknowledgment",
      "subject": "Avalon Landscape Construction — Your Inquiry",
      "body": "Hi [Name],\n\nThank you for reaching out to Avalon. I received your inquiry and wanted to get back to you quickly.\n\nI'd love to learn more about your project and see if we might be a good fit. Would you be available for a quick 15-minute call this week? I'm flexible on timing — just let me know what works for you.\n\nLooking forward to connecting.\n\nBest,\n[Your Name]\nAvalon Landscape Construction\n[Phone] | [Email]"
    },
    {
      "category": "First Contact",
      "title": "Referral Follow-Up",
      "subject": "Introduction from [Referrer Name] — Avalon Landscape Construction",
      "body": "Hi [Name],\n\n[Referrer name] suggested I reach out — they mentioned you may be thinking about a landscape project and thought we might be worth talking to.\n\nAvalon Landscape Construction specializes in [service lines]. We're known for clean estimates, transparent scopes, and projects that finish the way they were sold.\n\nIf you're open to a quick conversation, I'd love to hear about what you're working on. No pressure — just an introduction.\n\nBest,\n[Your Name]\nAvalon Landscape Construction\n[Phone] | [Email]"
    },
    {
      "category": "Post-Discovery",
      "title": "Discovery Summary and Next Step",
      "subject": "Summary from Our Conversation — Avalon",
      "body": "Hi [Name],\n\nThanks for the time today. I wanted to capture what we discussed so we're both on the same page.\n\nProject: [Summary of project]\nTimeline: [What was discussed]\nNext step: [Site walk / additional info / proposal]\nDate/time confirmed: [Date]\n\nIf I missed anything or something has changed, just let me know. I'll follow up as planned.\n\nBest,\n[Your Name]\nAvalon Landscape Construction"
    },
    {
      "category": "Post-Site Walk",
      "title": "Site Walk Summary and Estimate Timeline",
      "subject": "Site Walk Summary — [Client Name] Project",
      "body": "Hi [Name],\n\nThank you for your time today. I enjoyed walking the site and getting a clear picture of what you're looking to accomplish.\n\nHere's a quick recap:\n- Project scope: [Summary]\n- Key notes: [Any conditions or preferences from the walk]\n- Next step: We'll have the estimate ready by [date]\n\nI'll be in touch by then. In the meantime, feel free to reach out if any questions come up.\n\nBest,\n[Your Name]\nAvalon Landscape Construction"
    },
    {
      "category": "Proposal",
      "title": "Proposal Delivery",
      "subject": "Avalon Proposal — [Project Name]",
      "body": "Hi [Name],\n\nAttached is the proposal for your [project type] project at [address].\n\nThe scope includes [brief summary]. The total investment for this scope is [price].\n\nI've also included the exclusions and assumptions on page [X], which I want to make sure are clear before you make a decision.\n\nI'd suggest we take 15 minutes to walk through it together — that way any questions get answered quickly and nothing is left unclear. Are you available [day/time] for a quick call?\n\nBest,\n[Your Name]\nAvalon Landscape Construction"
    },
    {
      "category": "Follow-Up",
      "title": "Post-Proposal Follow-Up (Day 3)",
      "subject": "Following Up — Avalon Proposal",
      "body": "Hi [Name],\n\nJust following up on the proposal I sent [X days ago]. I want to make sure you received it and that you have everything you need to make a comfortable decision.\n\nIf any questions have come up, or if you'd like to revisit anything in the scope, I'm happy to connect. Even a 10-minute call can often resolve what an email back-and-forth can't.\n\nLet me know the best way to move forward from here.\n\nBest,\n[Your Name]\nAvalon Landscape Construction"
    },
    {
      "category": "Follow-Up",
      "title": "Checking In (Day 10)",
      "subject": "Still Here If You Need Me — Avalon",
      "body": "Hi [Name],\n\nI don't want to be a nuisance, but I also don't want to assume you've moved on without checking in.\n\nI realize decisions like this take time, and I respect that. If there's anything I can answer, adjust, or clarify, I'd rather you have that conversation with me than leave something unresolved.\n\nWhere are you at with the project right now?\n\nBest,\n[Your Name]\nAvalon Landscape Construction"
    },
    {
      "category": "Post-Sale",
      "title": "Verbal Yes Confirmation",
      "subject": "Great News — Next Steps for Your Project",
      "body": "Hi [Name],\n\nI'm glad we're moving forward! I wanted to confirm what we've agreed to so everything is clear going in.\n\nScope: [Summary]\nPrice: [Amount]\nTimeline: [Expected start]\nNext step: I'll send the contract and deposit instructions shortly.\n\nOnce those are received, we'll lock in your spot in the schedule and get everything set in motion. Please don't hesitate to reach out with any questions between now and then.\n\nThank you for trusting us with this project.\n\nBest,\n[Your Name]\nAvalon Landscape Construction"
    },
    {
      "category": "Post-Sale",
      "title": "Sold Job Welcome",
      "subject": "Welcome to the Avalon Family — Your Project is Confirmed",
      "body": "Hi [Name],\n\nThank you — your contract and deposit have been received. Your project is officially confirmed.\n\nHere's what to expect:\n- You'll hear from our project team to coordinate access and final details.\n- Estimated start: [Date]\n- Your primary contact during production will be [Project Lead Name] at [contact info].\n\nIf anything comes up before then, you're always welcome to reach out to me directly.\n\nWe're looking forward to doing great work for you.\n\nBest,\n[Your Name]\nAvalon Landscape Construction"
    },
    {
      "category": "Post-Sale",
      "title": "Closeout and Review Request",
      "subject": "Thank You — How Did We Do?",
      "body": "Hi [Name],\n\nNow that your project is complete, I wanted to check in personally. Is everything looking the way you expected?\n\nIf there's anything we missed or anything you'd like to discuss, please let me know right away — we always want to make it right.\n\nIf you're happy with the work, we'd really appreciate a quick review on Google. It only takes a minute and it helps other homeowners find us:\n[Google Review Link]\n\nThank you again for the opportunity. We'd love to be your first call for the next project.\n\nBest,\n[Your Name]\nAvalon Landscape Construction"
    }
  ],
  "objections": [
    {
      "title": "Your price is too high.",
      "meaning": "They may be comparing to a lower quote, have an unrealistic expectation, or don't yet see the value difference.",
      "response": [
        "Acknowledge the concern without defending immediately.",
        "Ask what they're comparing it to — price only makes sense in context.",
        "Walk back through what is included and what competitors may be excluding.",
        "Ask: is the concern the total number, or the value for that number?"
      ],
      "say": "I hear you — and I appreciate you being direct. Can I ask what you're comparing it to? The reason I ask is that scope can vary significantly between proposals, and I want to make sure we're comparing the same thing. Walk me through what the other number includes and we can have a real conversation about the difference."
    },
    {
      "title": "I need to think about it.",
      "meaning": "There is likely an unspoken concern. They may not feel ready to decide, or something in the proposal wasn't clear.",
      "response": [
        "Don't push. Ask what specifically they need to think about.",
        "Identify the real concern behind the vague response.",
        "Offer a specific time to reconnect rather than leaving it open."
      ],
      "say": "Absolutely — this isn't a small decision. Help me understand what you're thinking through. Is it the price, the scope, the timing, or something about fit? I'd rather answer a real question than have you sit on something that I could clear up in five minutes."
    },
    {
      "title": "I got a cheaper quote.",
      "meaning": "A competitor has quoted lower. This could be a scope difference, a quality difference, or a credibility play.",
      "response": [
        "Ask to see the other proposal or at least understand what it includes.",
        "Do not match price — instead, explain what's different.",
        "Protect scope quality rather than cutting to compete."
      ],
      "say": "I'm glad you're comparing — that's smart. The question I'd want you to ask is: what's in their scope that's not in mine, and vice versa? Price only matters when the scope is identical. If you're comfortable sharing the other quote, I can walk you through the differences. If not, I can at least walk you through what makes ours what it is."
    },
    {
      "title": "Can you do it cheaper?",
      "meaning": "They want a lower number. The cause could be budget, value perception, or they're testing your flexibility.",
      "response": [
        "Do not discount without changing scope.",
        "Offer a scope reduction or phasing option if appropriate.",
        "Be honest about what cannot be cut without compromising quality."
      ],
      "say": "The short answer is: yes, but only if we change what we're doing. I don't want to strip margin from the same scope — that leads to problems on the job. What I can do is look at what could be phased, reduced, or removed if that gets you to a number that works. What's the most important part of this for you?"
    },
    {
      "title": "I'm not sure this is the right time.",
      "meaning": "They may have budget pressure, competing priorities, or fear of commitment. Timing objections are often really risk objections.",
      "response": [
        "Explore what would need to be different for the timing to feel right.",
        "Ask what the cost of waiting is — sometimes urgency is real.",
        "Offer to hold a spot if scheduling allows."
      ],
      "say": "That's fair. Help me understand what would need to change for the timing to feel right. Is it a financial thing, a life timing thing, or something about the project itself? I ask because sometimes we can work around timing, and sometimes we can't — but I'd rather know what we're actually dealing with."
    },
    {
      "title": "I want to get a few more quotes.",
      "meaning": "They haven't made up their mind. They may be comparison shopping or still building trust.",
      "response": [
        "Encourage it — confidence wins over desperation.",
        "Ask what criteria they'll use to decide.",
        "Set a follow-up after they've completed their process."
      ],
      "say": "Please do — that's completely reasonable. I'd rather you compare than sign with us without confidence. When you're doing that, here's what I'd suggest paying attention to: scope detail, exclusion language, and what happens if something changes during the project. Those areas are where proposals vary most. When do you plan to have all the quotes back? I'll follow up around then."
    }
  ],
  "modules": [
    {
      "id": "M1",
      "title": "The Avalon Way of Selling",
      "objective": "Understand why Avalon sells differently and why it works.",
      "lessons": [
        "What consultative selling means at Avalon",
        "The difference between pushing and guiding",
        "Why margin matters to every member of the team",
        "The role of trust in landscaping sales"
      ],
      "quiz": [
        "What is the Avalon sales philosophy in one sentence?",
        "Why does scope clarity protect both the client and Avalon?",
        "What does 'operationally clean' mean in sales context?"
      ]
    },
    {
      "id": "M2",
      "title": "Lead Intake and Routing",
      "objective": "Capture the right information and route every lead correctly from the first contact.",
      "lessons": [
        "The 10 questions every lead record needs",
        "How to route by service line and urgency",
        "What makes a lead worth pursuing vs. not",
        "Setting the right next step in the first 5 minutes"
      ],
      "quiz": [
        "What information must be captured before routing a lead?",
        "When should a lead be declined at intake?",
        "What defines a clear next step?"
      ]
    },
    {
      "id": "M3",
      "title": "Discovery and Listening",
      "objective": "Run discovery conversations that reveal the real buying reason and create trust.",
      "lessons": [
        "The purpose of discovery — it's not to pitch",
        "How to uncover the buying reason behind the request",
        "Mapping the decision: who, what, when, and why",
        "How to explore budget without creating pressure"
      ],
      "quiz": [
        "What is the single most important thing to learn in discovery?",
        "How do you confirm the decision-maker without being awkward?",
        "What signals that a discovery call went well?"
      ]
    },
    {
      "id": "M4",
      "title": "Site Walks and Qualification",
      "objective": "Use the site walk to confirm fit, gather data, and set scope expectations before estimating.",
      "lessons": [
        "What to look for on every site walk",
        "How to make a clear fit decision at the site",
        "Documenting site conditions for estimating accuracy",
        "Setting expectations before leaving the site"
      ],
      "quiz": [
        "What is the fit decision and when should it be made?",
        "What documentation must come out of every site walk?",
        "What should never be promised on the site walk?"
      ]
    },
    {
      "id": "M5",
      "title": "Scope Development and Estimating",
      "objective": "Build scopes that are accurate, defensible, and protect Avalon's margin.",
      "lessons": [
        "What belongs in a scope — and what doesn't",
        "How to write exclusions that protect Avalon",
        "The relationship between scope and estimate accuracy",
        "Margin targets and why they aren't negotiable"
      ],
      "quiz": [
        "What is the difference between a scope and a proposal?",
        "Why must exclusions be documented in writing?",
        "What happens when scope changes after estimating?"
      ]
    },
    {
      "id": "M6",
      "title": "Proposal Delivery and Presentation",
      "objective": "Present proposals in a way that builds confidence and creates momentum toward a decision.",
      "lessons": [
        "Why live presentation outperforms email-only delivery",
        "How to walk through price without apologizing",
        "Anchoring scope before revealing the number",
        "Setting the next step at the moment of delivery"
      ],
      "quiz": [
        "What is the biggest mistake salespeople make at proposal delivery?",
        "How should exclusions be presented?",
        "What should always happen before the client leaves the proposal conversation?"
      ]
    },
    {
      "id": "M7",
      "title": "Follow-Up and Objection Handling",
      "objective": "Stay in contact, resolve real objections, and move clients toward decisions.",
      "lessons": [
        "The Avalon follow-up cadence and why it works",
        "How to tell the difference between an objection and an excuse",
        "The six most common objections and how to respond",
        "When to stop following up — and how to close it gracefully"
      ],
      "quiz": [
        "What is the first follow-up question after a proposal?",
        "How do you respond to 'your price is too high'?",
        "When is it appropriate to stop following up?"
      ]
    },
    {
      "id": "M8",
      "title": "Closing and Sold Job Activation",
      "objective": "Confirm commitments clearly and hand off to production cleanly.",
      "lessons": [
        "What a verbal yes requires — and what it doesn't authorize",
        "How to confirm scope and price at the close",
        "The sold job activation checklist and why it matters",
        "How a clean handoff protects the client relationship"
      ],
      "quiz": [
        "What must be documented before a verbal yes is acted on?",
        "What is in the sold job activation handoff packet?",
        "What should sales never do after handoff to production?"
      ]
    },
    {
      "id": "M9",
      "title": "Closeout, Reviews, and Referrals",
      "objective": "Close every job cleanly and convert satisfied clients into future revenue.",
      "lessons": [
        "The closeout conversation — timing and structure",
        "How to ask for a review without being awkward",
        "Turning a satisfied client into a referral source",
        "Handling dissatisfied clients before they go public"
      ],
      "quiz": [
        "When should the closeout call happen?",
        "How do you ask for a review in a way that gets results?",
        "What is the referral conversation opener?"
      ]
    }
  ],
  "checklists": [
    {
      "id": "daily",
      "title": "Daily Sales Start-Up",
      "items": [
        "Review all open opportunities and follow-up dates",
        "Identify the top 3 priorities for today",
        "Check for any overdue follow-ups",
        "Confirm all scheduled calls, site walks, and meetings for today",
        "Review any outstanding proposals awaiting decision",
        "Prepare for any discovery calls or site walks scheduled today",
        "Update the pipeline after any calls or site visits"
      ]
    },
    {
      "id": "weekly",
      "title": "Weekly Sales Review",
      "items": [
        "Review all opportunities by stage",
        "Identify any stuck deals and plan a next action",
        "Check for any leads that haven't been contacted in 7+ days",
        "Review closed and lost jobs from the week",
        "Update pipeline totals and conversion metrics",
        "Set priorities for next week",
        "Submit any manager reports or pipeline updates"
      ]
    },
    {
      "id": "presite",
      "title": "Pre-Site Walk Prep",
      "items": [
        "Review all notes from discovery call",
        "Confirm scope and client expectations before arriving",
        "Bring site walk checklist and measurement tools",
        "Confirm address and access instructions",
        "Plan for fit decision conversation at the end of the walk",
        "Know what the next step will be before you arrive"
      ]
    },
    {
      "id": "preproposal",
      "title": "Pre-Proposal Review",
      "items": [
        "Scope matches discovery and site walk notes",
        "Price matches approved estimate",
        "Exclusions are written in plain language",
        "Assumptions are documented",
        "Timeline and payment terms are included",
        "Proposal has been reviewed by manager if required",
        "Delivery method is confirmed",
        "Follow-up date is already in calendar"
      ]
    }
  ],
  "managerAgenda": [
    "Review pipeline by stage — where are deals stuck?",
    "Identify any opportunities more than 14 days without movement",
    "Review proposals sent vs. proposals closed this week",
    "Discuss any objections or discovery issues from the week",
    "Check sold job activations — were handoffs clean?",
    "Review any closed lost jobs — what happened?",
    "Confirm training progress and skill development priorities",
    "Set individual rep priorities and commitments for next week"
  ],
  "kpis": [
    "Leads created per week",
    "Discovery calls completed",
    "Site walks scheduled and completed",
    "Proposals sent",
    "Proposals closed (won and lost)",
    "Win rate by service line",
    "Average deal size by service line",
    "Days from lead to proposal",
    "Days from proposal to close",
    "Follow-up rate (proposals touched within 3 days)",
    "Overdue follow-ups (more than 7 days no contact)"
  ],
  "nonNegotiables": [
    "Every opportunity must have a clear next step with an owner and date.",
    "No proposal is sent without scope and exclusions reviewed.",
    "Every proposal gets a live follow-up within 3 business days.",
    "No job is scheduled until contract is signed and deposit received.",
    "Every sold job gets a formal production handoff — not just a text.",
    "Every completed job gets a closeout call and review request.",
    "Discovery notes must be documented before moving to site walk.",
    "Margin targets are not negotiated without manager approval."
  ]
};
