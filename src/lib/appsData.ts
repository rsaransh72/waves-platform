// =========================================================================
// WAVES PLATFORM — RICH APP DATA (Zoho-Quality Product Pages)
// =========================================================================
// Each app has: title, subtitle, tagline, color, category, icon key,
// unique features, use-cases, target audience, pricing tiers,
// integrations, FAQs, and related products.
// =========================================================================

export interface AppFeature {
  title: string;
  desc: string;
  iconKey: string; // maps to lucide icon in the page
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface AppData {
  title: string;
  subtitle: string;
  tagline: string;
  color: string;
  accentColor: string;
  category: string;
  features: AppFeature[];
  useCases: { title: string; desc: string }[];
  targetAudience: string[];
  pricing: PricingTier[];
  integrations: string[];
  faqs: FAQ[];
  relatedApps: string[]; // appId keys
}

const appsData: Record<string, AppData> = {
  // =====================================================================
  // SALES
  // =====================================================================
  crm: {
    title: "Waves CRM",
    subtitle: "Comprehensive omnichannel sales and pipeline management.",
    tagline: "Close more deals with free AI agents",
    color: "from-blue-600 to-blue-800",
    accentColor: "#2563eb",
    category: "Sales",
    features: [
      { title: "AI-Powered Lead Scoring", desc: "Automatically rank and prioritize leads using machine learning models trained on your historical conversion data.", iconKey: "sparkles" },
      { title: "Omnichannel Communication", desc: "Engage prospects via email, phone, WhatsApp, live chat, and social media — all from a single unified inbox.", iconKey: "globe" },
      { title: "Visual Pipeline Builder", desc: "Drag-and-drop deal stages, set automated actions at each stage, and get real-time conversion analytics.", iconKey: "workflow" },
      { title: "Territory Management", desc: "Define sales territories by geography, product line, or account size and auto-assign leads to the right reps.", iconKey: "map" },
      { title: "Advanced Analytics & Forecasting", desc: "Predict revenue with AI-driven forecasting, cohort analysis, and customizable dashboards.", iconKey: "chart" },
      { title: "Workflow Automation", desc: "Automate follow-ups, approval chains, field updates, and notifications with a visual rule builder.", iconKey: "zap" },
    ],
    useCases: [
      { title: "B2B Enterprise Sales", desc: "Manage complex, multi-stakeholder deals with account hierarchies, buying committees, and long sales cycles." },
      { title: "Inside Sales Teams", desc: "Power high-volume calling and emailing with auto-dialers, email sequences, and real-time activity tracking." },
      { title: "Field Sales Operations", desc: "Equip field reps with mobile CRM, geo check-ins, route planning, and offline access." },
    ],
    targetAudience: ["Sales teams of all sizes", "Business development teams", "Account managers", "Sales operations leaders"],
    pricing: [
      { name: "Standard", price: "₹800", period: "/user/month", desc: "For small teams getting started", features: ["Email integration", "Multiple pipelines", "Sales forecasting", "Custom reports"] },
      { name: "Professional", price: "₹1,400", period: "/user/month", desc: "Growing teams needing automation", features: ["AI agents", "Process management", "Inventory management", "Predictive intelligence"], highlighted: true, badge: "Most Popular" },
      { name: "Enterprise", price: "₹2,400", period: "/user/month", desc: "Large teams with complex needs", features: ["Multi-user portals", "Advanced customization", "Data enrichment", "Sandbox environments"] },
    ],
    integrations: ["WhatsApp", "Mailchimp", "Zapier", "QuickBooks", "Shopify", "Google Workspace", "Microsoft 365", "Slack"],
    faqs: [
      { q: "Can I migrate from Salesforce?", a: "Yes. We offer free migration assistance with dedicated support. If you're mid-contract, Waves CRM is free for 6 months." },
      { q: "Is there a free plan?", a: "Yes — Waves CRM offers a free tier for up to 3 users with core CRM features included." },
      { q: "Does it work with WhatsApp?", a: "Absolutely. Native WhatsApp Business API integration lets you send templates, receive messages, and track conversations inside CRM." },
    ],
    relatedApps: ["bigin", "salesiq", "campaigns", "analytics"],
  },

  bigin: {
    title: "Waves Bigin",
    subtitle: "Pipeline-centric CRM for small and growing businesses.",
    tagline: "The CRM that's as simple as a spreadsheet",
    color: "from-green-500 to-green-700",
    accentColor: "#16a34a",
    category: "Sales",
    features: [
      { title: "Pipeline View", desc: "Visualize your entire sales process with drag-and-drop deal cards across customizable stages.", iconKey: "workflow" },
      { title: "Built-in Telephony", desc: "Make and receive calls directly from Bigin. Auto-log every call with notes and recordings.", iconKey: "phone" },
      { title: "Email Integration", desc: "Send, receive, and track emails without leaving Bigin. Know when prospects open your emails.", iconKey: "mail" },
      { title: "Workflow Automation", desc: "Set up automatic email alerts, task creation, and field updates based on deal stage changes.", iconKey: "zap" },
      { title: "Mobile-First Design", desc: "Full-featured iOS and Android apps with offline support, business card scanner, and geo check-in.", iconKey: "smartphone" },
      { title: "Team Pipelines", desc: "Create separate pipelines for sales, onboarding, support, and delivery — all connected.", iconKey: "layers" },
    ],
    useCases: [
      { title: "Small Business Sales", desc: "Replace spreadsheets with a visual pipeline that every team member can update in real time." },
      { title: "Freelancers & Consultants", desc: "Track client projects, invoices, and follow-ups in one place without CRM complexity." },
      { title: "Real Estate Agents", desc: "Manage property listings, buyer inquiries, and showing schedules with custom pipelines." },
    ],
    targetAudience: ["Small businesses", "Solopreneurs", "Freelancers", "Startups under 25 employees"],
    pricing: [
      { name: "Free", price: "₹0", period: "/user/month", desc: "For individuals getting started", features: ["1 pipeline", "500 contacts", "Built-in calling", "Email integration"] },
      { name: "Express", price: "₹500", period: "/user/month", desc: "For small teams", features: ["Multiple pipelines", "Workflow automation", "Custom dashboards", "Product catalog"], highlighted: true, badge: "Best Value" },
      { name: "Premier", price: "₹1,000", period: "/user/month", desc: "For growing businesses", features: ["Mass email", "Connected pipelines", "Advanced analytics", "File management"] },
    ],
    integrations: ["Google Workspace", "Microsoft 365", "Zapier", "Mailchimp", "WhatsApp", "Stripe"],
    faqs: [
      { q: "How is Bigin different from Waves CRM?", a: "Bigin is designed specifically for small businesses that need simplicity. Waves CRM is for larger teams needing advanced automation, AI agents, and enterprise features." },
      { q: "Can I upgrade to Waves CRM later?", a: "Yes — one-click migration preserves all your data, pipelines, and customizations when you're ready to scale." },
      { q: "Is there a free plan?", a: "Yes, Bigin offers a free plan for single users with one pipeline and up to 500 contacts." },
    ],
    relatedApps: ["crm", "bookings", "forms", "invoice"],
  },

  bookings: {
    title: "Waves Bookings",
    subtitle: "Smart scheduling and appointment booking software.",
    tagline: "Let clients book meetings while you focus on work",
    color: "from-purple-500 to-purple-700",
    accentColor: "#9333ea",
    category: "Sales",
    features: [
      { title: "Custom Booking Pages", desc: "Create branded booking pages with your logo, colors, and custom fields for different service types.", iconKey: "layout" },
      { title: "Calendar Sync", desc: "Two-way sync with Google Calendar, Outlook, and Apple Calendar to prevent double-bookings.", iconKey: "calendar" },
      { title: "Automated Reminders", desc: "Send email and SMS reminders to reduce no-shows by up to 80%.", iconKey: "bell" },
      { title: "Payment Collection", desc: "Collect deposits or full payments at booking time via Stripe, Razorpay, or PayPal.", iconKey: "wallet" },
      { title: "Staff Scheduling", desc: "Assign appointments to team members based on availability, expertise, or round-robin rules.", iconKey: "users" },
      { title: "Embeddable Widget", desc: "Embed your booking calendar directly into your website or share a public link.", iconKey: "code" },
    ],
    useCases: [
      { title: "Consultants & Coaches", desc: "Let clients self-schedule discovery calls, coaching sessions, and follow-up meetings." },
      { title: "Healthcare Providers", desc: "Manage patient appointment slots, doctor availability, and multi-location scheduling." },
      { title: "Salons & Spas", desc: "Allow customers to book services, choose stylists, and pay deposits online." },
    ],
    targetAudience: ["Service professionals", "Healthcare clinics", "Consultants", "Salons & beauty businesses"],
    pricing: [
      { name: "Free", price: "₹0", period: "/staff/month", desc: "For individuals", features: ["1 booking page", "Calendar sync", "Email notifications", "Unlimited bookings"] },
      { name: "Basic", price: "₹400", period: "/staff/month", desc: "For small teams", features: ["Multiple booking pages", "SMS reminders", "Payment collection", "Custom branding"], highlighted: true, badge: "Popular" },
      { name: "Premium", price: "₹800", period: "/staff/month", desc: "For growing businesses", features: ["Group bookings", "Resource scheduling", "2-way CRM sync", "Advanced analytics"] },
    ],
    integrations: ["Google Calendar", "Outlook", "Zoom", "Google Meet", "Waves CRM", "Stripe", "Razorpay"],
    faqs: [
      { q: "Can clients reschedule or cancel?", a: "Yes — clients can reschedule or cancel from the confirmation email based on your cancellation policy settings." },
      { q: "Does it support recurring appointments?", a: "Yes, you can set up recurring bookings on daily, weekly, or monthly schedules." },
      { q: "Can I use it with my existing website?", a: "Absolutely. Embed the booking widget with a simple code snippet or share a direct link." },
    ],
    relatedApps: ["crm", "bigin", "meeting", "people"],
  },

  contactmanager: {
    title: "Waves ContactManager",
    subtitle: "Simple contact management for micro-businesses.",
    tagline: "Your digital Rolodex, supercharged",
    color: "from-blue-400 to-blue-600",
    accentColor: "#3b82f6",
    category: "Sales",
    features: [
      { title: "Smart Contact Cards", desc: "Store names, emails, phones, social profiles, and custom fields in organized contact cards.", iconKey: "user" },
      { title: "Activity Timeline", desc: "See every email, call, meeting, and note associated with a contact in chronological order.", iconKey: "clock" },
      { title: "Tags & Segments", desc: "Organize contacts with custom tags and create dynamic segments for targeted outreach.", iconKey: "tag" },
      { title: "Bulk Import/Export", desc: "Import contacts from CSV, Google Contacts, or Outlook. Export anytime with one click.", iconKey: "upload" },
      { title: "Email Tracking", desc: "Send emails from the app and track opens, clicks, and replies in real time.", iconKey: "mail" },
      { title: "Shared Contacts", desc: "Share contact lists with team members and control access with view/edit permissions.", iconKey: "share" },
    ],
    useCases: [
      { title: "Freelancer Client Management", desc: "Keep all client details, project notes, and communication history in one place." },
      { title: "Networking & Events", desc: "Scan business cards, tag contacts by event, and follow up systematically." },
      { title: "Non-Profit Donor Tracking", desc: "Manage donor information, donation history, and communication preferences." },
    ],
    targetAudience: ["Micro-businesses", "Freelancers", "Non-profits", "Solo professionals"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Up to 500 contacts", features: ["500 contacts", "Activity timeline", "Email tracking", "Mobile app"] },
      { name: "Standard", price: "₹300", period: "/user/month", desc: "For small teams", features: ["Unlimited contacts", "Shared contacts", "Bulk operations", "Custom fields"], highlighted: true },
    ],
    integrations: ["Google Contacts", "Outlook", "Mailchimp", "Zapier"],
    faqs: [
      { q: "How is this different from Bigin?", a: "ContactManager is for pure contact management without sales pipelines. If you need deal tracking, choose Bigin." },
      { q: "Can I import from Google Contacts?", a: "Yes, one-click import from Google Contacts with automatic duplicate detection." },
    ],
    relatedApps: ["bigin", "crm", "campaigns"],
  },

  // =====================================================================
  // MARKETING
  // =====================================================================
  campaigns: {
    title: "Waves Campaigns",
    subtitle: "Drive email marketing automation with AI-powered analytics.",
    tagline: "Email campaigns that deliver results, not just emails",
    color: "from-yellow-500 to-orange-500",
    accentColor: "#f59e0b",
    category: "Marketing",
    features: [
      { title: "Drag-and-Drop Editor", desc: "Build stunning email campaigns with a visual editor, pre-built templates, and dynamic content blocks.", iconKey: "layout" },
      { title: "Marketing Automation", desc: "Create multi-step journeys with triggers, conditions, and actions to nurture leads on autopilot.", iconKey: "workflow" },
      { title: "A/B Testing", desc: "Test subject lines, send times, content variations, and CTAs to optimize open and click rates.", iconKey: "split" },
      { title: "Advanced Segmentation", desc: "Target subscribers based on behavior, demographics, purchase history, and engagement scores.", iconKey: "filter" },
      { title: "Real-Time Analytics", desc: "Track opens, clicks, bounces, unsubscribes, and revenue attribution with live dashboards.", iconKey: "chart" },
      { title: "SMS Marketing", desc: "Send targeted SMS campaigns alongside email for a true multi-channel approach.", iconKey: "smartphone" },
    ],
    useCases: [
      { title: "E-commerce Email Marketing", desc: "Send abandoned cart reminders, product recommendations, and post-purchase follow-ups." },
      { title: "Newsletter Publishing", desc: "Build and grow your subscriber base with signup forms, drip sequences, and content personalization." },
      { title: "Event Promotion", desc: "Promote events with countdown timers, RSVP tracking, and automated confirmation emails." },
    ],
    targetAudience: ["Marketing teams", "E-commerce businesses", "Content creators", "Event organizers"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Up to 2,000 subscribers", features: ["6,000 emails/month", "Basic templates", "Signup forms", "Reports"] },
      { name: "Standard", price: "₹250", period: "/month", desc: "Up to 5,000 subscribers", features: ["Unlimited emails", "A/B testing", "Automation", "Dynamic content"], highlighted: true, badge: "Popular" },
      { name: "Professional", price: "₹500", period: "/month", desc: "Up to 25,000 subscribers", features: ["SMS marketing", "Advanced segmentation", "Webhooks", "Priority support"] },
    ],
    integrations: ["Waves CRM", "Shopify", "WooCommerce", "Zapier", "WordPress", "Waves Commerce", "Google Ads", "Facebook"],
    faqs: [
      { q: "What's the email sending limit?", a: "Free plan allows 6,000 emails/month. Paid plans offer unlimited email sends." },
      { q: "Can I import my existing email list?", a: "Yes, import via CSV or directly from other email platforms with our migration tool." },
      { q: "Is there GDPR compliance?", a: "Yes — built-in consent management, unsubscribe handling, and data processing agreements." },
    ],
    relatedApps: ["social", "crm", "forms", "survey"],
  },

  social: {
    title: "Waves Social",
    subtitle: "Schedule and manage your social media presence across platforms.",
    tagline: "One dashboard for all your social channels",
    color: "from-red-500 to-red-700",
    accentColor: "#dc2626",
    category: "Marketing",
    features: [
      { title: "Multi-Platform Publishing", desc: "Schedule and publish to Facebook, Instagram, Twitter/X, LinkedIn, YouTube, and Pinterest from one dashboard.", iconKey: "share" },
      { title: "Content Calendar", desc: "Plan your social strategy with a visual calendar. Drag posts to reschedule and fill content gaps.", iconKey: "calendar" },
      { title: "Social Listening", desc: "Monitor brand mentions, competitor activity, and trending topics across all platforms in real time.", iconKey: "search" },
      { title: "AI Content Suggestions", desc: "Get AI-generated post ideas, captions, and hashtag recommendations based on your audience and niche.", iconKey: "sparkles" },
      { title: "Analytics Dashboard", desc: "Track engagement, reach, follower growth, and best posting times with detailed analytics.", iconKey: "chart" },
      { title: "Team Collaboration", desc: "Assign posts for approval, leave comments, and manage team roles and permissions.", iconKey: "users" },
    ],
    useCases: [
      { title: "Agency Social Management", desc: "Manage multiple client accounts from one dashboard with role-based access and white-label reports." },
      { title: "Brand Awareness Campaigns", desc: "Plan and execute cross-platform campaigns with coordinated publishing and tracking." },
      { title: "Customer Engagement", desc: "Respond to comments, messages, and reviews across all platforms from a unified inbox." },
    ],
    targetAudience: ["Social media managers", "Marketing agencies", "Brand managers", "Content creators"],
    pricing: [
      { name: "Standard", price: "₹600", period: "/month", desc: "For individuals", features: ["7 channels", "Content calendar", "Basic analytics", "Post scheduling"] },
      { name: "Professional", price: "₹1,500", period: "/month", desc: "For teams", features: ["15 channels", "Social listening", "Team collaboration", "Custom reports"], highlighted: true, badge: "Popular" },
      { name: "Premium", price: "₹2,500", period: "/month", desc: "For agencies", features: ["Unlimited channels", "White-label reports", "Client portal", "API access"] },
    ],
    integrations: ["Facebook", "Instagram", "Twitter/X", "LinkedIn", "YouTube", "Pinterest", "Waves CRM", "Canva"],
    faqs: [
      { q: "Which social platforms are supported?", a: "Facebook, Instagram, Twitter/X, LinkedIn, YouTube, Pinterest, Google Business Profile, and TikTok." },
      { q: "Can I schedule Instagram Reels?", a: "Yes — schedule and auto-publish Reels, Stories, and carousel posts directly." },
      { q: "Does it support team approvals?", a: "Yes, set up multi-level approval workflows so posts get reviewed before publishing." },
    ],
    relatedApps: ["campaigns", "sites", "pagesense", "backstage"],
  },

  marketingplus: {
    title: "Waves Marketing Plus",
    subtitle: "Unified marketing platform for your entire team.",
    tagline: "All your marketing channels, one platform",
    color: "from-rose-500 to-pink-700",
    accentColor: "#e11d48",
    category: "Marketing",
    features: [
      { title: "Unified Campaign Manager", desc: "Orchestrate email, social, SMS, events, surveys, and webinars from a single campaign dashboard.", iconKey: "layers" },
      { title: "Marketing Automation", desc: "Build cross-channel journeys that trigger based on contact behavior across any touchpoint.", iconKey: "workflow" },
      { title: "ROI Attribution", desc: "Track marketing spend and attribute revenue to specific campaigns, channels, and touchpoints.", iconKey: "chart" },
      { title: "Brand Asset Management", desc: "Store, organize, and share brand assets with built-in version control and access permissions.", iconKey: "folder" },
      { title: "Collaboration Hub", desc: "Plan campaigns, assign tasks, share briefs, and track deliverables with your marketing team.", iconKey: "users" },
      { title: "Unified Analytics", desc: "Compare channel performance side-by-side and identify your most effective marketing strategies.", iconKey: "chart" },
    ],
    useCases: [
      { title: "Enterprise Marketing Teams", desc: "Coordinate large teams across email, social, paid, and events with unified planning and reporting." },
      { title: "Product Launches", desc: "Orchestrate multi-channel launch campaigns with coordinated messaging and real-time tracking." },
      { title: "Lead Generation Programs", desc: "Capture leads from webinars, events, and content, then nurture them through automated journeys." },
    ],
    targetAudience: ["Enterprise marketing teams", "Marketing directors", "CMOs", "Growth teams"],
    pricing: [
      { name: "Marketing Plus", price: "₹5,000", period: "/month", desc: "For growing teams", features: ["All marketing channels", "Marketing automation", "ROI analytics", "Team collaboration"], highlighted: true },
    ],
    integrations: ["Waves CRM", "Google Ads", "Facebook Ads", "LinkedIn Ads", "Zapier", "WordPress", "Shopify"],
    faqs: [
      { q: "How is this different from Campaigns?", a: "Marketing Plus bundles all marketing tools (email, social, webinars, events, analytics) into one unified platform. Campaigns is email-only." },
      { q: "Can I use individual tools separately?", a: "Yes — each tool (Campaigns, Social, etc.) works standalone, but Marketing Plus unifies them with cross-channel analytics." },
    ],
    relatedApps: ["campaigns", "social", "sites", "survey"],
  },

  sites: {
    title: "Waves Sites",
    subtitle: "Website builder to create beautiful sites without code.",
    tagline: "Build websites that convert, no coding needed",
    color: "from-emerald-500 to-emerald-700",
    accentColor: "#10b981",
    category: "Marketing",
    features: [
      { title: "Drag-and-Drop Builder", desc: "Build pixel-perfect websites with an intuitive visual editor. No coding skills required.", iconKey: "layout" },
      { title: "Designer Templates", desc: "Start with 200+ professionally designed templates for every industry and use case.", iconKey: "palette" },
      { title: "Built-in SEO Tools", desc: "Optimize every page with meta tags, alt text, XML sitemaps, and structured data markup.", iconKey: "search" },
      { title: "E-commerce Ready", desc: "Add product listings, shopping carts, and payment gateways to sell directly from your site.", iconKey: "shopping" },
      { title: "Custom Domains & SSL", desc: "Connect your domain and get free SSL certificates for secure, professional web presence.", iconKey: "globe" },
      { title: "Form Builder", desc: "Create contact forms, lead capture forms, and surveys with conditional logic and integrations.", iconKey: "form" },
    ],
    useCases: [
      { title: "Business Websites", desc: "Launch professional websites for your business with custom branding, contact forms, and blog." },
      { title: "Portfolio Sites", desc: "Showcase your work with beautiful gallery layouts, case studies, and client testimonials." },
      { title: "Landing Pages", desc: "Create high-converting landing pages for campaigns with A/B testing and analytics." },
    ],
    targetAudience: ["Small businesses", "Freelancers", "Marketing teams", "Non-profits"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Basic site", features: ["Waves subdomain", "SSL certificate", "Mobile responsive", "Basic templates"] },
      { name: "Starter", price: "₹400", period: "/month", desc: "Custom domain", features: ["Custom domain", "No ads", "50GB bandwidth", "SEO tools"], highlighted: true },
      { name: "Pro", price: "₹1,000", period: "/month", desc: "Advanced features", features: ["E-commerce", "Membership", "Unlimited bandwidth", "Priority support"] },
    ],
    integrations: ["Google Analytics", "Facebook Pixel", "Mailchimp", "Waves CRM", "Google Workspace", "Waves Forms"],
    faqs: [
      { q: "Can I use my own domain name?", a: "Yes — connect any custom domain. Free SSL certificates are automatically provisioned." },
      { q: "Is the site mobile responsive?", a: "Yes, all templates are fully responsive and you can customize the mobile view separately." },
      { q: "Can I add a blog?", a: "Yes — built-in blog engine with categories, tags, RSS feeds, and SEO optimization." },
    ],
    relatedApps: ["pagesense", "campaigns", "forms", "commerce"],
  },

  pagesense: {
    title: "Waves PageSense",
    subtitle: "Website optimization and personalization platform.",
    tagline: "Understand visitors. Optimize experiences. Convert more.",
    color: "from-blue-500 to-indigo-600",
    accentColor: "#4f46e5",
    category: "Marketing",
    features: [
      { title: "Heatmaps", desc: "Visualize where visitors click, scroll, and spend time on your pages with click, scroll, and attention heatmaps.", iconKey: "eye" },
      { title: "Session Recordings", desc: "Watch real visitor sessions to understand navigation patterns, frustrations, and drop-off points.", iconKey: "video" },
      { title: "A/B Testing", desc: "Test page variations with statistical significance and automatically deploy winning versions.", iconKey: "split" },
      { title: "Funnel Analysis", desc: "Track conversion funnels step-by-step and identify exactly where visitors abandon the process.", iconKey: "chart" },
      { title: "Personalization", desc: "Show different content to different visitor segments based on behavior, location, or referral source.", iconKey: "user" },
      { title: "Form Analytics", desc: "Analyze form completion rates, field drop-offs, and hesitation time to optimize lead capture.", iconKey: "form" },
    ],
    useCases: [
      { title: "Conversion Rate Optimization", desc: "Identify and fix conversion bottlenecks with data-driven insights from heatmaps and recordings." },
      { title: "Landing Page Testing", desc: "Run A/B tests on headlines, CTAs, images, and layouts to maximize campaign ROI." },
      { title: "E-commerce Optimization", desc: "Analyze product pages, cart flows, and checkout processes to reduce abandonment." },
    ],
    targetAudience: ["Digital marketers", "UX designers", "Product managers", "E-commerce teams"],
    pricing: [
      { name: "Analyze", price: "₹800", period: "/month", desc: "10K visitors", features: ["Heatmaps", "Session recordings", "Form analytics", "Funnel reports"] },
      { name: "Engage", price: "₹1,200", period: "/month", desc: "20K visitors", features: ["Everything in Analyze", "A/B testing", "Pop-ups", "Push notifications"], highlighted: true, badge: "Popular" },
      { name: "Optimize", price: "₹2,500", period: "/month", desc: "100K visitors", features: ["Everything in Engage", "Personalization", "Revenue goals", "Advanced targeting"] },
    ],
    integrations: ["Google Analytics", "Google Tag Manager", "Waves CRM", "Waves Sites", "WordPress", "Shopify"],
    faqs: [
      { q: "Does it slow down my website?", a: "No — the tracking script is asynchronous and under 20KB. It loads after your page content." },
      { q: "Is session recording GDPR compliant?", a: "Yes — PII is automatically masked, and you can exclude sensitive fields from recording." },
    ],
    relatedApps: ["sites", "campaigns", "social", "commerce"],
  },

  backstage: {
    title: "Waves Backstage",
    subtitle: "End-to-end event management software.",
    tagline: "Plan events that leave lasting impressions",
    color: "from-orange-500 to-red-600",
    accentColor: "#ea580c",
    category: "Marketing",
    features: [
      { title: "Event Website Builder", desc: "Create stunning event pages with registration forms, speaker profiles, and agenda displays.", iconKey: "globe" },
      { title: "Ticketing & Registration", desc: "Sell tickets, offer promo codes, and manage registrations with built-in payment processing.", iconKey: "ticket" },
      { title: "Agenda Builder", desc: "Create multi-track agendas with sessions, speakers, and room assignments.", iconKey: "calendar" },
      { title: "Attendee Management", desc: "Track registrations, check-ins, attendance, and generate name badges automatically.", iconKey: "users" },
      { title: "Sponsorship Portal", desc: "Manage sponsor tiers, logos, booth assignments, and deliver post-event reports.", iconKey: "star" },
      { title: "Post-Event Analytics", desc: "Measure event ROI with attendee surveys, engagement metrics, and lead generation reports.", iconKey: "chart" },
    ],
    useCases: [
      { title: "Conferences & Summits", desc: "Manage multi-day conferences with multiple tracks, speakers, sponsors, and exhibitors." },
      { title: "Product Launch Events", desc: "Build anticipation with countdown pages, manage RSVPs, and track attendance." },
      { title: "Community Meetups", desc: "Organize recurring community events with registration, check-in, and post-event surveys." },
    ],
    targetAudience: ["Event organizers", "Marketing teams", "Community managers", "Conference planners"],
    pricing: [
      { name: "Essentials", price: "₹1,500", period: "/event", desc: "Small events", features: ["Event website", "100 registrations", "Basic ticketing", "Email notifications"] },
      { name: "Professional", price: "₹4,000", period: "/event", desc: "Large events", features: ["1,000 registrations", "Multi-track agenda", "Sponsor portal", "Analytics"], highlighted: true },
    ],
    integrations: ["Waves CRM", "Waves Campaigns", "Zoom", "YouTube Live", "Stripe", "Razorpay"],
    faqs: [
      { q: "Does it support virtual events?", a: "Yes — host virtual and hybrid events with built-in streaming integration via Zoom or YouTube Live." },
      { q: "Can I sell tickets?", a: "Yes, with multiple ticket types, early bird pricing, promo codes, and group discounts." },
    ],
    relatedApps: ["campaigns", "social", "forms", "meeting"],
  },

  // =====================================================================
  // COMMERCE & POS
  // =====================================================================
  commerce: {
    title: "Waves Commerce",
    subtitle: "Build an online store and accept orders effortlessly.",
    tagline: "Your complete e-commerce platform",
    color: "from-blue-600 to-cyan-600",
    accentColor: "#0891b2",
    category: "Commerce and POS",
    features: [
      { title: "Storefront Builder", desc: "Design your online store with beautiful themes, custom layouts, and a drag-and-drop editor.", iconKey: "layout" },
      { title: "Product Catalog", desc: "Manage products with variants, images, categories, SKUs, and inventory tracking.", iconKey: "package" },
      { title: "Payment Gateway", desc: "Accept payments via credit cards, UPI, net banking, wallets, and COD with 15+ payment gateways.", iconKey: "wallet" },
      { title: "Order Management", desc: "Track orders from placement to delivery with automated status updates and customer notifications.", iconKey: "truck" },
      { title: "Shipping Integration", desc: "Connect with Shiprocket, Delhivery, and other carriers for automated label generation and tracking.", iconKey: "truck" },
      { title: "SEO & Marketing", desc: "Built-in SEO tools, discount coupons, abandoned cart recovery, and social selling features.", iconKey: "search" },
    ],
    useCases: [
      { title: "D2C Brands", desc: "Launch your direct-to-consumer brand with a professional storefront and end-to-end order management." },
      { title: "B2B Wholesale", desc: "Create wholesale portals with tiered pricing, bulk ordering, and customer-specific catalogs." },
      { title: "Multi-Channel Selling", desc: "Sell on your website, marketplaces, and social media with unified inventory management." },
    ],
    targetAudience: ["E-commerce businesses", "D2C brands", "Retail businesses", "Wholesale distributors"],
    pricing: [
      { name: "Starter", price: "₹500", period: "/month", desc: "New stores", features: ["100 products", "5 staff accounts", "Basic themes", "Payment gateway"] },
      { name: "Professional", price: "₹1,500", period: "/month", desc: "Growing stores", features: ["Unlimited products", "Abandoned cart recovery", "Discount engine", "Advanced SEO"], highlighted: true, badge: "Popular" },
      { name: "Enterprise", price: "₹4,000", period: "/month", desc: "High-volume", features: ["Multi-storefront", "B2B portal", "API access", "Dedicated support"] },
    ],
    integrations: ["Shiprocket", "Delhivery", "Razorpay", "Stripe", "Google Shopping", "Facebook Shop", "Waves CRM", "Waves Inventory"],
    faqs: [
      { q: "Can I sell both physical and digital products?", a: "Yes — sell physical goods with shipping, digital downloads, and subscription products all from one store." },
      { q: "What payment methods are supported?", a: "Credit/debit cards, UPI, net banking, wallets, EMI, and cash on delivery through 15+ gateway integrations." },
      { q: "Can I connect my existing domain?", a: "Yes, connect any custom domain with free SSL certificate included." },
    ],
    relatedApps: ["inventory", "campaigns", "crm", "books"],
  },

  inventory: {
    title: "Waves Inventory",
    subtitle: "Multi-channel inventory management and order fulfillment.",
    tagline: "Never run out of stock, never overstock",
    color: "from-sky-500 to-blue-600",
    accentColor: "#0284c7",
    category: "Commerce and POS",
    features: [
      { title: "Multi-Warehouse Management", desc: "Track stock across multiple warehouses and automatically route orders to the nearest location.", iconKey: "building" },
      { title: "Multi-Channel Selling", desc: "Sync inventory across Amazon, Flipkart, Shopify, and your own website in real time.", iconKey: "globe" },
      { title: "Purchase Orders", desc: "Create POs, track vendor performance, and automate reorder points based on sales velocity.", iconKey: "clipboard" },
      { title: "Batch & Serial Tracking", desc: "Track products by batch number, serial number, or expiry date for full traceability.", iconKey: "qrcode" },
      { title: "Order Fulfillment", desc: "Pick, pack, and ship orders with barcode scanning, packing slips, and carrier integration.", iconKey: "package" },
      { title: "Inventory Valuation", desc: "FIFO, weighted average, and specific identification methods for accurate financial reporting.", iconKey: "chart" },
    ],
    useCases: [
      { title: "E-commerce Fulfillment", desc: "Manage inventory across online channels with real-time sync and automated restocking." },
      { title: "Wholesale Distribution", desc: "Track bulk inventory across warehouses, manage vendor relationships, and fulfill B2B orders." },
      { title: "Manufacturing", desc: "Manage raw materials, work-in-progress, and finished goods with bill of materials support." },
    ],
    targetAudience: ["E-commerce sellers", "Wholesale distributors", "Manufacturers", "Retail businesses"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Up to 50 orders/month", features: ["1 warehouse", "50 orders/month", "Basic reports", "2 users"] },
      { name: "Standard", price: "₹1,000", period: "/org/month", desc: "Growing businesses", features: ["Multi-warehouse", "500 orders/month", "Multi-channel", "Batch tracking"], highlighted: true },
      { name: "Professional", price: "₹2,500", period: "/org/month", desc: "High-volume operations", features: ["Unlimited orders", "Automation", "API access", "Custom reports"] },
    ],
    integrations: ["Amazon", "Flipkart", "Shopify", "Waves Commerce", "Waves Books", "Shiprocket", "Delhivery", "Razorpay"],
    faqs: [
      { q: "Does it sync with Amazon and Flipkart?", a: "Yes — real-time inventory sync with Amazon, Flipkart, Shopify, and 15+ other marketplaces." },
      { q: "Can I manage multiple warehouses?", a: "Yes, track stock across unlimited warehouses with automatic inter-warehouse transfers." },
    ],
    relatedApps: ["commerce", "books", "invoice", "crm"],
  },

  // =====================================================================
  // SERVICE
  // =====================================================================
  desk: {
    title: "Waves Desk",
    subtitle: "Omnichannel customer service helpdesk and ticketing system.",
    tagline: "Delight every customer, resolve every ticket",
    color: "from-sky-500 to-blue-600",
    accentColor: "#0284c7",
    category: "Service",
    features: [
      { title: "Omnichannel Tickets", desc: "Collect support requests from email, phone, chat, social media, and web forms into a unified queue.", iconKey: "inbox" },
      { title: "AI Ticket Classification", desc: "Auto-categorize, prioritize, and assign tickets using AI trained on your support history.", iconKey: "sparkles" },
      { title: "Knowledge Base", desc: "Build a self-service portal with searchable articles, FAQs, and community forums.", iconKey: "book" },
      { title: "SLA Management", desc: "Set response and resolution time targets by priority, and get automatic escalation alerts.", iconKey: "clock" },
      { title: "Customer Satisfaction", desc: "Send CSAT surveys after ticket resolution and track agent performance over time.", iconKey: "smile" },
      { title: "Agent Workspace", desc: "Give agents a unified view of customer history, past tickets, and CRM data in one screen.", iconKey: "layout" },
    ],
    useCases: [
      { title: "SaaS Customer Support", desc: "Manage technical support with integrated knowledge base, ticket SLAs, and customer portals." },
      { title: "E-commerce Support", desc: "Handle order inquiries, returns, and refund requests with order lookup integration." },
      { title: "IT Helpdesk", desc: "Track internal IT requests, manage assets, and automate common resolution workflows." },
    ],
    targetAudience: ["Customer support teams", "IT departments", "E-commerce businesses", "SaaS companies"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "3 agents", features: ["Email ticketing", "Knowledge base", "Macros", "Mobile app"] },
      { name: "Standard", price: "₹800", period: "/agent/month", desc: "Small teams", features: ["Multi-channel", "SLA management", "Custom reports", "Workflow automation"], highlighted: true, badge: "Popular" },
      { name: "Professional", price: "₹1,400", period: "/agent/month", desc: "Large teams", features: ["AI classification", "Custom roles", "Multi-brand", "Scheduled reports"] },
    ],
    integrations: ["WhatsApp", "Slack", "Microsoft Teams", "Waves CRM", "Jira", "Shopify", "Zapier"],
    faqs: [
      { q: "How many agents can use the free plan?", a: "The free plan supports up to 3 agents with email ticketing and a basic knowledge base." },
      { q: "Does it support WhatsApp?", a: "Yes — customers can create tickets via WhatsApp, and agents can respond directly from Desk." },
      { q: "Can I customize the customer portal?", a: "Yes — fully customizable with your brand colors, logo, domain, and custom layouts." },
    ],
    relatedApps: ["salesiq", "assist", "crm", "projects"],
  },

  assist: {
    title: "Waves Assist",
    subtitle: "Remote IT support and remote access software.",
    tagline: "Connect and resolve, instantly and securely",
    color: "from-emerald-500 to-teal-700",
    accentColor: "#0d9488",
    category: "Service",
    features: [
      { title: "Instant Remote Access", desc: "Connect to any device in seconds with a simple session code. No pre-installation required.", iconKey: "monitor" },
      { title: "Unattended Access", desc: "Install a lightweight agent on managed devices for 24/7 remote access without user presence.", iconKey: "key" },
      { title: "Multi-Platform Support", desc: "Support Windows, Mac, Linux, iOS, and Android devices from a single console.", iconKey: "layers" },
      { title: "File Transfer", desc: "Transfer files between local and remote machines with drag-and-drop ease during sessions.", iconKey: "upload" },
      { title: "Session Recording", desc: "Record every support session for compliance, training, and quality assurance purposes.", iconKey: "video" },
      { title: "Multi-Monitor Support", desc: "Navigate between multiple monitors on the remote machine seamlessly during support sessions.", iconKey: "monitor" },
    ],
    useCases: [
      { title: "IT Help Desk Support", desc: "Resolve employee IT issues in minutes with instant screen sharing and remote control." },
      { title: "Managed Service Providers", desc: "Support multiple client environments with organized device groups and technician roles." },
      { title: "Customer Technical Support", desc: "Walk customers through complex setups and troubleshooting with guided remote assistance." },
    ],
    targetAudience: ["IT support teams", "MSPs", "Customer support teams", "System administrators"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "For personal use", features: ["5 sessions/month", "Screen sharing", "Chat", "Basic features"] },
      { name: "Standard", price: "₹600", period: "/tech/month", desc: "For small teams", features: ["Unlimited sessions", "File transfer", "Multi-platform", "Session recording"], highlighted: true },
      { name: "Professional", price: "₹1,200", period: "/tech/month", desc: "For enterprises", features: ["Unattended access", "Branding", "API access", "Advanced reports"] },
    ],
    integrations: ["Waves Desk", "Waves ServiceDesk", "Jira", "Zendesk", "Slack"],
    faqs: [
      { q: "Do end-users need to install anything?", a: "No — for attended sessions, users just enter a session code in their browser. Unattended access requires a small agent." },
      { q: "Is the connection encrypted?", a: "Yes — AES-256 encryption, TLS 1.2, and SOC 2 Type II certified infrastructure." },
    ],
    relatedApps: ["desk", "salesiq", "directory", "people"],
  },

  salesiq: {
    title: "Waves SalesIQ",
    subtitle: "Live chat and customer tracking for your website.",
    tagline: "Turn website visitors into paying customers",
    color: "from-blue-500 to-blue-700",
    accentColor: "#2563eb",
    category: "Service",
    features: [
      { title: "Live Chat", desc: "Engage website visitors in real time with customizable chat widgets and canned responses.", iconKey: "message" },
      { title: "Visitor Tracking", desc: "See who's on your website in real time — their location, pages viewed, time spent, and referral source.", iconKey: "eye" },
      { title: "Chatbot Builder", desc: "Build AI-powered chatbots with a visual flow builder to handle common queries 24/7.", iconKey: "bot" },
      { title: "Lead Scoring", desc: "Score visitors based on behavior and automatically route high-value prospects to sales reps.", iconKey: "target" },
      { title: "Screen Sharing", desc: "Co-browse with visitors to guide them through complex processes or troubleshoot issues.", iconKey: "monitor" },
      { title: "Mobile SDK", desc: "Add in-app chat to your iOS and Android apps with pre-built SDKs.", iconKey: "smartphone" },
    ],
    useCases: [
      { title: "Sales Engagement", desc: "Proactively engage high-intent visitors with targeted chat triggers based on behavior." },
      { title: "Customer Support", desc: "Reduce support tickets by resolving common queries via chat and self-service chatbots." },
      { title: "Lead Qualification", desc: "Use chatbots to qualify leads, collect contact info, and book meetings automatically." },
    ],
    targetAudience: ["Sales teams", "Customer support", "E-commerce businesses", "SaaS companies"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "3 operators", features: ["100 chat sessions/month", "Visitor tracking", "Canned responses", "Mobile app"] },
      { name: "Basic", price: "₹500", period: "/operator/month", desc: "Growing teams", features: ["Unlimited chats", "Chatbot builder", "Lead scoring", "Visitor history"], highlighted: true },
      { name: "Professional", price: "₹1,000", period: "/operator/month", desc: "Advanced features", features: ["Screen sharing", "Mobile SDK", "Custom bots", "API access"] },
    ],
    integrations: ["Waves CRM", "Waves Desk", "WordPress", "Shopify", "WhatsApp", "Telegram", "Facebook Messenger"],
    faqs: [
      { q: "Is there a free plan?", a: "Yes — free for up to 3 operators with 100 chat sessions per month." },
      { q: "Can I add it to my mobile app?", a: "Yes — use our iOS and Android SDKs to add in-app chat with just a few lines of code." },
    ],
    relatedApps: ["desk", "crm", "campaigns", "sites"],
  },

  lens: {
    title: "Waves Lens",
    subtitle: "Interactive remote assistance with augmented reality.",
    tagline: "See what your customer sees, in real time",
    color: "from-indigo-500 to-purple-700",
    accentColor: "#7c3aed",
    category: "Service",
    features: [
      { title: "AR Annotations", desc: "Draw arrows, circles, and markers directly on the customer's camera feed to guide them visually.", iconKey: "pencil" },
      { title: "Live Camera Sharing", desc: "Customers share their phone camera so technicians can see the problem in real time.", iconKey: "camera" },
      { title: "3D Object Placement", desc: "Place 3D models and instructions in the customer's environment using augmented reality.", iconKey: "cube" },
      { title: "Session Recording", desc: "Record AR sessions for training, documentation, and quality review.", iconKey: "video" },
      { title: "Snapshot & Markup", desc: "Capture screenshots during the session and annotate them for clear follow-up instructions.", iconKey: "image" },
      { title: "Multi-Platform", desc: "Works on any smartphone browser — no app installation required for customers.", iconKey: "smartphone" },
    ],
    useCases: [
      { title: "Field Service", desc: "Guide on-site technicians through complex repairs with AR annotations from expert engineers." },
      { title: "Equipment Installation", desc: "Walk customers through equipment setup step-by-step with visual AR markers." },
      { title: "Quality Inspection", desc: "Remotely inspect products and facilities with live camera feeds and measurements." },
    ],
    targetAudience: ["Field service teams", "Technical support", "Manufacturing", "Equipment providers"],
    pricing: [
      { name: "Standard", price: "₹1,000", period: "/tech/month", desc: "Basic AR support", features: ["AR annotations", "Live streaming", "Session recording", "Snapshot markup"], highlighted: true },
      { name: "Professional", price: "₹2,500", period: "/tech/month", desc: "Advanced features", features: ["3D object placement", "Analytics", "API access", "Branding"] },
    ],
    integrations: ["Waves Desk", "Waves Assist", "Waves FSM", "ServiceNow"],
    faqs: [
      { q: "Does the customer need to install an app?", a: "No — customers simply click a link to open their camera in the browser. No app needed." },
      { q: "What devices are supported?", a: "Any modern smartphone or tablet with a camera and browser — iOS, Android, and desktop." },
    ],
    relatedApps: ["assist", "desk", "salesiq"],
  },

  // =====================================================================
  // FINANCE
  // =====================================================================
  books: {
    title: "Waves Books",
    subtitle: "GST-compliant online accounting for growing businesses.",
    tagline: "Beautiful accounting software that just works",
    color: "from-yellow-500 to-yellow-600",
    accentColor: "#ca8a04",
    category: "Finance",
    features: [
      { title: "GST Compliance", desc: "Auto-calculate GST, generate GSTR-1/3B returns, e-invoicing, and e-way bills — all built in.", iconKey: "receipt" },
      { title: "Invoicing", desc: "Create professional invoices, set up recurring billing, and get paid faster with payment links.", iconKey: "file" },
      { title: "Expense Tracking", desc: "Record expenses, scan receipts with OCR, and auto-match with bank transactions.", iconKey: "wallet" },
      { title: "Bank Reconciliation", desc: "Connect bank accounts for auto-import and one-click reconciliation of transactions.", iconKey: "building" },
      { title: "Financial Reports", desc: "Profit & loss, balance sheet, cash flow, aging reports, and custom reports at your fingertips.", iconKey: "chart" },
      { title: "Multi-Currency", desc: "Invoice international clients in their currency with automatic exchange rate updates.", iconKey: "globe" },
    ],
    useCases: [
      { title: "Small Business Accounting", desc: "Replace Tally with cloud-native accounting — access books from anywhere, collaborate with your CA." },
      { title: "Freelancer Finances", desc: "Track income, expenses, send invoices, and file GST returns without an accountant." },
      { title: "E-commerce Accounting", desc: "Auto-import sales from Shopify, Amazon, and reconcile with bank deposits." },
    ],
    targetAudience: ["Small businesses", "Freelancers", "Accountants & CAs", "E-commerce sellers"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Sole proprietors", features: ["1 user", "1,000 invoices/year", "GST returns", "Bank feeds"] },
      { name: "Standard", price: "₹750", period: "/org/month", desc: "Small businesses", features: ["3 users", "Unlimited invoices", "Purchase orders", "Custom reports"], highlighted: true, badge: "Popular" },
      { name: "Professional", price: "₹1,500", period: "/org/month", desc: "Growing businesses", features: ["10 users", "Multi-currency", "Approval workflows", "Budgeting"] },
    ],
    integrations: ["Bank feeds", "Razorpay", "Stripe", "Waves CRM", "Waves Inventory", "Waves Expense", "GST Portal"],
    faqs: [
      { q: "Can I file GST returns directly?", a: "Yes — generate and file GSTR-1, GSTR-3B, and GSTR-9 directly from Waves Books to the GST portal." },
      { q: "Does it support e-invoicing?", a: "Yes — auto-generate e-invoices and e-way bills with direct integration to the NIC portal." },
      { q: "Can my CA access it?", a: "Yes, invite your CA as a user with accountant-level access to view and manage your books." },
    ],
    relatedApps: ["invoice", "expense", "inventory", "payroll"],
  },

  invoice: {
    title: "Waves Invoice",
    subtitle: "Fast and easy invoicing, estimations, and payment gateways.",
    tagline: "Get paid faster with professional invoices",
    color: "from-red-500 to-rose-600",
    accentColor: "#dc2626",
    category: "Finance",
    features: [
      { title: "Professional Templates", desc: "Choose from 50+ invoice templates or create your own with your brand colors and logo.", iconKey: "file" },
      { title: "Online Payments", desc: "Accept payments directly from invoices via credit card, UPI, bank transfer, and digital wallets.", iconKey: "wallet" },
      { title: "Automated Reminders", desc: "Send automatic payment reminders on due dates and escalate overdue invoices.", iconKey: "bell" },
      { title: "Time Tracking", desc: "Track billable hours and auto-generate invoices from time entries.", iconKey: "clock" },
      { title: "Estimates & Quotes", desc: "Create estimates, send them for approval, and convert to invoices with one click.", iconKey: "file" },
      { title: "Client Portal", desc: "Give clients a portal to view invoices, make payments, and download receipts.", iconKey: "user" },
    ],
    useCases: [
      { title: "Freelance Billing", desc: "Track time, create invoices, accept online payments, and manage multiple client projects." },
      { title: "Service Business Billing", desc: "Send estimates, get approvals, invoice upon completion, and collect payments online." },
      { title: "Subscription Billing", desc: "Set up recurring invoices for retainer clients with auto-charge and receipt generation." },
    ],
    targetAudience: ["Freelancers", "Service businesses", "Consultants", "Small business owners"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "5 clients", features: ["5 clients", "Unlimited invoices", "Online payments", "Basic reports"] },
      { name: "Basic", price: "₹400", period: "/month", desc: "50 clients", features: ["50 clients", "Automated reminders", "Time tracking", "Client portal"], highlighted: true },
      { name: "Standard", price: "₹800", period: "/month", desc: "Unlimited", features: ["Unlimited clients", "Custom domain", "Approval workflows", "Advanced reports"] },
    ],
    integrations: ["Razorpay", "Stripe", "PayPal", "Waves Books", "Waves Expense", "Google Workspace"],
    faqs: [
      { q: "Can clients pay directly from the invoice?", a: "Yes — every invoice includes a 'Pay Now' button that supports credit cards, UPI, and bank transfers." },
      { q: "Does it track partial payments?", a: "Yes — record partial payments and automatically update the balance due on the invoice." },
    ],
    relatedApps: ["books", "expense", "subscriptions", "checkout"],
  },

  expense: {
    title: "Waves Expense",
    subtitle: "Automate expense reporting and streamline approvals.",
    tagline: "Expense reports that submit themselves",
    color: "from-blue-500 to-blue-700",
    accentColor: "#2563eb",
    category: "Finance",
    features: [
      { title: "Receipt Scanning", desc: "Snap receipts with your phone — OCR auto-extracts merchant, amount, date, and category.", iconKey: "camera" },
      { title: "Auto-Categorization", desc: "AI learns your spending patterns and auto-categorizes expenses for faster reporting.", iconKey: "sparkles" },
      { title: "Approval Workflows", desc: "Multi-level approval chains with custom policies, spending limits, and auto-approvals.", iconKey: "checkCircle" },
      { title: "Corporate Cards", desc: "Issue virtual and physical corporate cards with real-time spending controls and auto-reconciliation.", iconKey: "card" },
      { title: "Travel Requests", desc: "Submit and approve travel requests with integrated booking and per-diem policies.", iconKey: "plane" },
      { title: "Policy Compliance", desc: "Set spending policies by category, department, or project with automatic flagging of violations.", iconKey: "shield" },
    ],
    useCases: [
      { title: "Employee Expense Claims", desc: "Employees snap receipts, submit reports on mobile, and get reimbursed faster." },
      { title: "Corporate Travel Management", desc: "Manage travel requests, approvals, bookings, and expense settlement in one flow." },
      { title: "Project Cost Tracking", desc: "Track expenses by project or client for accurate job costing and client billing." },
    ],
    targetAudience: ["Finance teams", "HR departments", "Traveling employees", "Project managers"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "3 users", features: ["3 users", "Receipt scanning", "Basic reports", "Mobile app"] },
      { name: "Standard", price: "₹300", period: "/user/month", desc: "Growing teams", features: ["Approval workflows", "Policy engine", "Corporate cards", "Integrations"], highlighted: true },
      { name: "Premium", price: "₹600", period: "/user/month", desc: "Enterprise", features: ["Advanced analytics", "Travel management", "Multi-entity", "ERP integration"] },
    ],
    integrations: ["Waves Books", "Waves Payroll", "Waves People", "SAP", "Oracle", "QuickBooks"],
    faqs: [
      { q: "Does it support receipt scanning?", a: "Yes — AI-powered OCR extracts merchant, amount, date, and tax automatically from receipt photos." },
      { q: "Can I issue corporate cards?", a: "Yes — virtual and physical corporate cards with per-card spending limits and real-time tracking." },
    ],
    relatedApps: ["books", "payroll", "people", "invoice"],
  },

  subscriptions: {
    title: "Waves Subscriptions",
    subtitle: "Manage recurring billing and subscriptions easily.",
    tagline: "Recurring revenue, simplified",
    color: "from-green-500 to-emerald-700",
    accentColor: "#059669",
    category: "Finance",
    features: [
      { title: "Subscription Plans", desc: "Create flexible pricing plans with trials, setup fees, add-ons, and metered billing.", iconKey: "layers" },
      { title: "Automated Billing", desc: "Auto-generate invoices, charge cards, and handle renewals without manual intervention.", iconKey: "refresh" },
      { title: "Dunning Management", desc: "Automatically retry failed payments, send reminders, and pause or cancel inactive subscriptions.", iconKey: "alert" },
      { title: "Customer Portal", desc: "Let customers manage subscriptions, update payment methods, and download invoices self-service.", iconKey: "user" },
      { title: "Revenue Recognition", desc: "Automatically defer and recognize revenue per ASC 606 / Ind AS 115 standards.", iconKey: "chart" },
      { title: "Proration", desc: "Handle plan upgrades, downgrades, and mid-cycle changes with automatic prorated charges.", iconKey: "calculator" },
    ],
    useCases: [
      { title: "SaaS Billing", desc: "Manage subscription tiers, usage-based pricing, and enterprise contracts with automated renewals." },
      { title: "Membership Sites", desc: "Offer monthly/annual memberships with automated access control and payment processing." },
      { title: "Media & Content", desc: "Monetize content with subscription plans, paywalls, and bundled offerings." },
    ],
    targetAudience: ["SaaS companies", "Membership businesses", "Media companies", "Service providers"],
    pricing: [
      { name: "Standard", price: "₹500", period: "/month", desc: "Up to 500 customers", features: ["Automated billing", "Customer portal", "Dunning", "Basic reports"], highlighted: true },
      { name: "Professional", price: "₹1,500", period: "/month", desc: "Unlimited", features: ["Unlimited customers", "Revenue recognition", "Multi-currency", "Advanced analytics"] },
    ],
    integrations: ["Stripe", "Razorpay", "PayPal", "Waves Books", "Waves CRM", "Zapier"],
    faqs: [
      { q: "Does it handle failed payments?", a: "Yes — automated dunning retries charges, notifies customers, and manages subscription status transitions." },
      { q: "Can customers manage their own subscriptions?", a: "Yes, via a branded self-service portal for plan changes, card updates, and invoice downloads." },
    ],
    relatedApps: ["books", "invoice", "checkout", "crm"],
  },

  checkout: {
    title: "Waves Checkout",
    subtitle: "Create custom payment pages and collect payments securely.",
    tagline: "Beautiful payment pages in minutes",
    color: "from-purple-500 to-indigo-600",
    accentColor: "#7c3aed",
    category: "Finance",
    features: [
      { title: "Payment Pages", desc: "Create stunning, branded payment pages for products, events, donations, and services.", iconKey: "layout" },
      { title: "Multiple Payment Methods", desc: "Accept cards, UPI, net banking, wallets, and international payments.", iconKey: "wallet" },
      { title: "Quantity & Variants", desc: "Add product variants, quantity selectors, and custom fields to payment pages.", iconKey: "package" },
      { title: "Automated Receipts", desc: "Send payment confirmations and tax receipts automatically upon successful payment.", iconKey: "mail" },
      { title: "Donation Pages", desc: "Create donation pages with suggested amounts, recurring donations, and tax receipts.", iconKey: "heart" },
      { title: "Analytics", desc: "Track payment page conversions, revenue, and customer data in real-time dashboards.", iconKey: "chart" },
    ],
    useCases: [
      { title: "Event Registrations", desc: "Collect event registration fees with custom forms and automatic ticket delivery." },
      { title: "Product Sales", desc: "Sell products without a full e-commerce store — just create a payment page and share the link." },
      { title: "NGO Donations", desc: "Accept one-time and recurring donations with 80G tax receipt generation." },
    ],
    targetAudience: ["Small businesses", "Non-profits", "Event organizers", "Freelancers"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "3 payment pages", features: ["3 pages", "UPI & cards", "Payment tracking", "Basic customization"] },
      { name: "Standard", price: "₹500", period: "/month", desc: "Unlimited pages", features: ["Unlimited pages", "Custom domain", "Recurring payments", "Advanced analytics"], highlighted: true },
    ],
    integrations: ["Razorpay", "Stripe", "PayPal", "Waves Books", "Waves CRM", "Google Analytics"],
    faqs: [
      { q: "Do I need a website?", a: "No — Waves Checkout creates standalone payment pages. Just share the link via email, WhatsApp, or social media." },
      { q: "What are the transaction fees?", a: "We don't charge any transaction fees. You only pay payment gateway charges (typically 2%)." },
    ],
    relatedApps: ["invoice", "commerce", "subscriptions", "books"],
  },

  payroll: {
    title: "Waves Payroll",
    subtitle: "Automated payroll processing with statutory compliance.",
    tagline: "Payroll that runs itself — accurately, every time",
    color: "from-blue-600 to-blue-800",
    accentColor: "#1d4ed8",
    category: "Finance",
    features: [
      { title: "Auto Payroll", desc: "Process salaries, deductions, and reimbursements in minutes with one-click payroll runs.", iconKey: "zap" },
      { title: "Statutory Compliance", desc: "Auto-calculate PF, ESI, PT, TDS, and LWF with direct government portal filing.", iconKey: "shield" },
      { title: "Salary Structure", desc: "Create flexible salary components — basic, HRA, special allowance, bonuses, and deductions.", iconKey: "layers" },
      { title: "Pay Slips", desc: "Generate and distribute professional pay slips via email with employee self-service access.", iconKey: "file" },
      { title: "Tax Declaration", desc: "Employees submit IT declarations online. Auto-calculate tax liability and optimize savings.", iconKey: "calculator" },
      { title: "Direct Deposit", desc: "Disburse salaries directly to employee bank accounts with integrated banking.", iconKey: "building" },
    ],
    useCases: [
      { title: "Monthly Payroll Processing", desc: "Run error-free payroll every month with automatic attendance integration and compliance checks." },
      { title: "Multi-Location Companies", desc: "Manage payroll across states with location-specific statutory rules and professional tax." },
      { title: "Contract & Freelancer Payments", desc: "Process contractor payments with TDS deduction, Form 16A generation, and compliance tracking." },
    ],
    targetAudience: ["HR teams", "Payroll administrators", "CFOs", "Small business owners"],
    pricing: [
      { name: "Basic", price: "₹40", period: "/employee/month", desc: "Essential payroll", features: ["Payroll processing", "Pay slips", "Statutory compliance", "Direct deposit"] },
      { name: "Standard", price: "₹60", period: "/employee/month", desc: "Full-featured", features: ["Everything in Basic", "Tax optimization", "Loan management", "Custom reports"], highlighted: true, badge: "Popular" },
      { name: "Premium", price: "₹100", period: "/employee/month", desc: "Enterprise", features: ["Multi-entity", "Approval workflows", "API access", "Dedicated support"] },
    ],
    integrations: ["Waves People", "Waves Expense", "Waves Books", "HDFC Bank", "ICICI Bank", "SBI"],
    faqs: [
      { q: "Does it handle PF and ESI?", a: "Yes — auto-calculate, deduct, and file PF (ECR), ESI, and professional tax contributions directly." },
      { q: "Can employees view their pay slips?", a: "Yes, via a self-service portal where they can also submit tax declarations and reimbursement claims." },
    ],
    relatedApps: ["people", "expense", "books", "recruit"],
  },

  // =====================================================================
  // HUMAN RESOURCES
  // =====================================================================
  people: {
    title: "Waves People",
    subtitle: "Core HR, attendance, payroll, and performance management.",
    tagline: "HR software that puts your people first",
    color: "from-yellow-400 to-yellow-600",
    accentColor: "#ca8a04",
    category: "HR",
    features: [
      { title: "Employee Database", desc: "Centralized employee records with custom fields, documents, and organizational charts.", iconKey: "users" },
      { title: "Attendance & Leave", desc: "Track attendance with biometric, geo-fencing, or mobile check-in. Manage leave policies and approvals.", iconKey: "clock" },
      { title: "Performance Management", desc: "Set goals, run 360° reviews, track KRAs, and manage appraisal cycles with templates.", iconKey: "target" },
      { title: "Employee Self-Service", desc: "Employees manage profiles, apply for leave, submit expenses, and access pay slips.", iconKey: "user" },
      { title: "Onboarding Workflows", desc: "Create pre-boarding checklists, digital document signing, and automated welcome sequences.", iconKey: "clipboard" },
      { title: "Learning & Development", desc: "Assign training courses, track completions, and manage skill development programs.", iconKey: "book" },
    ],
    useCases: [
      { title: "Growing Startups", desc: "Set up HR processes from day one with attendance, leave, and basic payroll integration." },
      { title: "Mid-Size Companies", desc: "Automate HR operations including performance reviews, onboarding, and compliance." },
      { title: "Remote Teams", desc: "Manage distributed teams with self-service attendance, virtual onboarding, and digital processes." },
    ],
    targetAudience: ["HR managers", "People operations teams", "CHROs", "Small business owners"],
    pricing: [
      { name: "Essential HR", price: "₹40", period: "/employee/month", desc: "Core HR", features: ["Employee database", "Leave management", "Attendance", "Document management"] },
      { name: "Professional", price: "₹80", period: "/employee/month", desc: "Full HR suite", features: ["Everything in Essential", "Performance management", "Onboarding", "L&D"], highlighted: true, badge: "Popular" },
      { name: "Premium", price: "₹120", period: "/employee/month", desc: "Enterprise HR", features: ["Custom workflows", "Advanced analytics", "API access", "Multi-entity"] },
    ],
    integrations: ["Waves Payroll", "Waves Recruit", "Waves Expense", "Slack", "Microsoft Teams", "Google Workspace"],
    faqs: [
      { q: "Does it include payroll?", a: "Payroll is available as an integrated add-on via Waves Payroll. Together they provide complete HR + Payroll." },
      { q: "Can it track attendance via biometric?", a: "Yes — integrates with biometric devices, and also supports geo-fenced mobile check-in and facial recognition." },
    ],
    relatedApps: ["payroll", "recruit", "shifts", "workerly"],
  },

  recruit: {
    title: "Waves Recruit",
    subtitle: "Applicant tracking system (ATS) for modern hiring teams.",
    tagline: "Hire better talent, faster",
    color: "from-red-500 to-red-700",
    accentColor: "#dc2626",
    category: "HR",
    features: [
      { title: "Job Posting", desc: "Publish to 75+ job boards including LinkedIn, Indeed, and Naukri with one click.", iconKey: "megaphone" },
      { title: "Candidate Pipeline", desc: "Visual Kanban board to track candidates through screening, interview, offer, and onboarding stages.", iconKey: "workflow" },
      { title: "Resume Parsing", desc: "AI-powered resume parser extracts skills, experience, and education into structured candidate profiles.", iconKey: "sparkles" },
      { title: "Interview Scheduling", desc: "Auto-schedule interviews based on team availability with calendar sync and video conferencing.", iconKey: "calendar" },
      { title: "Assessment Integration", desc: "Send coding challenges, aptitude tests, and skill assessments directly from the hiring pipeline.", iconKey: "checkCircle" },
      { title: "Offer Management", desc: "Create, send, and track offer letters with e-signature and automated onboarding triggers.", iconKey: "file" },
    ],
    useCases: [
      { title: "Startup Hiring", desc: "Post jobs, screen candidates, and move fast with collaborative hiring tools built for speed." },
      { title: "Agency Recruiting", desc: "Manage multiple client requisitions, candidate pools, and placement tracking in one platform." },
      { title: "Campus Recruitment", desc: "Manage campus drives with bulk scheduling, assessment integration, and offer rollouts." },
    ],
    targetAudience: ["HR teams", "Talent acquisition teams", "Recruitment agencies", "Hiring managers"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "1 recruiter", features: ["1 active job", "Candidate pipeline", "Email integration", "Basic reports"] },
      { name: "Standard", price: "₹1,250", period: "/recruiter/month", desc: "Growing teams", features: ["10 active jobs", "Resume parsing", "Interview scheduling", "Job board posting"], highlighted: true },
      { name: "Enterprise", price: "₹2,500", period: "/recruiter/month", desc: "Large teams", features: ["Unlimited jobs", "AI matching", "Custom workflows", "Onboarding integration"] },
    ],
    integrations: ["LinkedIn", "Indeed", "Naukri", "Waves People", "Zoom", "Google Meet", "Waves Sign"],
    faqs: [
      { q: "Can I post to multiple job boards?", a: "Yes — publish to 75+ job boards including LinkedIn, Indeed, Naukri, and Glassdoor with one click." },
      { q: "Does it parse resumes automatically?", a: "Yes — AI extracts name, email, skills, experience, and education into structured fields automatically." },
    ],
    relatedApps: ["people", "payroll", "sign", "meeting"],
  },

  workerly: {
    title: "Waves Workerly",
    subtitle: "Temp workforce management and scheduling.",
    tagline: "Simplify temp staffing operations",
    color: "from-orange-500 to-amber-600",
    accentColor: "#ea580c",
    category: "HR",
    features: [
      { title: "Worker Database", desc: "Maintain a database of temp workers with skills, availability, certifications, and work history.", iconKey: "users" },
      { title: "Job Scheduling", desc: "Create and assign shifts with drag-and-drop scheduling and automatic conflict detection.", iconKey: "calendar" },
      { title: "Timesheet Management", desc: "Digital timesheets with GPS check-in, photo verification, and manager approval workflows.", iconKey: "clock" },
      { title: "Client Management", desc: "Track client requirements, job orders, and fill rates across multiple staffing clients.", iconKey: "building" },
      { title: "Invoicing", desc: "Auto-generate invoices based on approved timesheets with configurable billing rates.", iconKey: "file" },
      { title: "Compliance Tracking", desc: "Track worker certifications, background checks, and compliance documents with expiry alerts.", iconKey: "shield" },
    ],
    useCases: [
      { title: "Temp Staffing Agencies", desc: "Manage your entire temp workforce lifecycle from recruitment to placement to payroll." },
      { title: "Event Staffing", desc: "Schedule event staff across multiple venues with availability matching and shift swaps." },
      { title: "Healthcare Staffing", desc: "Place nurses, CNA, and allied health workers with credential verification and compliance tracking." },
    ],
    targetAudience: ["Staffing agencies", "Temp workforce managers", "Event companies", "Healthcare staffing"],
    pricing: [
      { name: "Basic", price: "₹25", period: "/worker/month", desc: "Essential features", features: ["Worker database", "Scheduling", "Timesheets", "Basic invoicing"], highlighted: true },
      { name: "Standard", price: "₹50", period: "/worker/month", desc: "Full features", features: ["Everything in Basic", "Client portal", "Compliance tracking", "Advanced reports"] },
    ],
    integrations: ["Waves People", "Waves Payroll", "Waves Books", "QuickBooks"],
    faqs: [
      { q: "Is it for staffing agencies or direct employers?", a: "Primarily designed for staffing agencies, but also works for companies managing large temp workforces directly." },
    ],
    relatedApps: ["people", "shifts", "payroll", "recruit"],
  },

  shifts: {
    title: "Waves Shifts",
    subtitle: "Employee scheduling and time clock software.",
    tagline: "Smart scheduling for modern teams",
    color: "from-blue-400 to-blue-600",
    accentColor: "#3b82f6",
    category: "HR",
    features: [
      { title: "Visual Scheduler", desc: "Drag-and-drop shift planning with availability views, conflict alerts, and template schedules.", iconKey: "calendar" },
      { title: "Time Clock", desc: "Employees clock in/out via mobile, tablet kiosk, or web with GPS and photo verification.", iconKey: "clock" },
      { title: "Shift Swaps", desc: "Employees request shift swaps and managers approve — reducing no-shows and scheduling conflicts.", iconKey: "refresh" },
      { title: "Overtime Tracking", desc: "Automatic overtime calculation based on your labor laws and company policies.", iconKey: "alert" },
      { title: "Team Communication", desc: "In-app messaging for shift-specific announcements, reminders, and team updates.", iconKey: "message" },
      { title: "Labor Cost Forecasting", desc: "See labor costs in real time as you build schedules and compare against revenue projections.", iconKey: "chart" },
    ],
    useCases: [
      { title: "Retail Scheduling", desc: "Schedule store teams across multiple locations with variable shifts and seasonal demands." },
      { title: "Restaurant Operations", desc: "Manage kitchen, wait staff, and delivery schedules with demand-based shift planning." },
      { title: "Healthcare Shifts", desc: "Schedule nurses and staff across departments with credential-based assignments." },
    ],
    targetAudience: ["Retail managers", "Restaurant owners", "Shift-based businesses", "Operations managers"],
    pricing: [
      { name: "Basic", price: "₹60", period: "/location/month", desc: "Single location", features: ["Visual scheduler", "Time clock", "Shift swaps", "Mobile app"], highlighted: true },
      { name: "Standard", price: "₹150", period: "/location/month", desc: "Multi-location", features: ["Everything in Basic", "Labor forecasting", "Advanced reports", "API access"] },
    ],
    integrations: ["Waves People", "Waves Payroll", "Slack", "Google Calendar"],
    faqs: [
      { q: "Can employees swap shifts?", a: "Yes — employees can request swaps, and managers approve them. All changes update the schedule in real time." },
      { q: "Does it support multiple locations?", a: "Yes — manage schedules across unlimited locations from a single dashboard." },
    ],
    relatedApps: ["people", "payroll", "workerly", "cliq"],
  },

  // =====================================================================
  // IT & CUSTOM DEVELOPMENT
  // =====================================================================
  creator: {
    title: "Waves Creator",
    subtitle: "Low-code application development platform for custom ERP modules.",
    tagline: "Build enterprise apps 10× faster",
    color: "from-green-500 to-emerald-700",
    accentColor: "#059669",
    category: "IT & Custom Development",
    features: [
      { title: "Visual App Builder", desc: "Drag-and-drop forms, workflows, reports, and dashboards without writing code.", iconKey: "layout" },
      { title: "Custom Databases", desc: "Create relational databases with custom fields, lookups, and validation rules.", iconKey: "database" },
      { title: "Workflow Automation", desc: "Build complex business logic with conditional workflows, approvals, and scheduled actions.", iconKey: "workflow" },
      { title: "Custom Reports", desc: "Create pivot tables, charts, and KPI dashboards with drill-down capabilities.", iconKey: "chart" },
      { title: "API & Integrations", desc: "Connect to external systems via REST APIs, webhooks, and pre-built connectors.", iconKey: "plug" },
      { title: "Mobile Apps", desc: "Every app you build is automatically mobile-responsive with native iOS/Android support.", iconKey: "smartphone" },
    ],
    useCases: [
      { title: "Custom ERP Modules", desc: "Build industry-specific modules that plug into your Waves ERP — asset tracking, quality management, etc." },
      { title: "Internal Tools", desc: "Replace spreadsheet-based processes with custom apps — leave tracker, visitor management, etc." },
      { title: "Customer Portals", desc: "Build self-service portals where customers can submit requests, track orders, and access resources." },
    ],
    targetAudience: ["IT teams", "Business analysts", "Citizen developers", "CTOs"],
    pricing: [
      { name: "Standard", price: "₹600", period: "/user/month", desc: "Small apps", features: ["25K records", "5 apps", "Workflows", "Basic integrations"], highlighted: true },
      { name: "Professional", price: "₹1,500", period: "/user/month", desc: "Enterprise apps", features: ["Unlimited records", "Unlimited apps", "API access", "Custom functions"] },
    ],
    integrations: ["Waves CRM", "Waves ERP", "Waves Books", "REST APIs", "Zapier", "Google Sheets", "Slack"],
    faqs: [
      { q: "Do I need to know how to code?", a: "No — Waves Creator is designed for citizen developers. However, you can add custom logic with Deluge script if needed." },
      { q: "Can I build mobile apps?", a: "Yes — every app you build is automatically mobile-responsive and available as a native mobile app." },
    ],
    relatedApps: ["analytics", "flow", "directory", "crm"],
  },

  analytics: {
    title: "Waves Analytics",
    subtitle: "Modern BI and reporting platform for deep business insights.",
    tagline: "Ask questions, get answers — visually",
    color: "from-blue-600 to-indigo-800",
    accentColor: "#4338ca",
    category: "IT & Custom Development",
    features: [
      { title: "Drag-and-Drop Reports", desc: "Build stunning reports and dashboards with drag-and-drop ease. No SQL required.", iconKey: "chart" },
      { title: "AI Assistant", desc: "Ask questions in plain English and get instant charts, insights, and recommendations.", iconKey: "sparkles" },
      { title: "Data Blending", desc: "Combine data from multiple sources — CRM, ERP, spreadsheets, databases — into unified reports.", iconKey: "layers" },
      { title: "Collaborative Analytics", desc: "Share dashboards, comment on insights, and embed analytics in your apps and websites.", iconKey: "users" },
      { title: "Predictive Analytics", desc: "Forecast trends, detect anomalies, and model what-if scenarios with built-in ML algorithms.", iconKey: "trending" },
      { title: "White-Label Portals", desc: "Embed analytics in your product with white-label portals and branded dashboards.", iconKey: "globe" },
    ],
    useCases: [
      { title: "Sales Analytics", desc: "Track pipeline velocity, win rates, rep performance, and revenue forecasts in real time." },
      { title: "Financial Reporting", desc: "Build P&L dashboards, cash flow reports, and budget-vs-actual analysis with drill-down." },
      { title: "Embedded Analytics", desc: "Offer data insights inside your SaaS product with white-label embedded dashboards." },
    ],
    targetAudience: ["Data analysts", "Business leaders", "CXOs", "Product teams"],
    pricing: [
      { name: "Basic", price: "₹1,500", period: "/user/month", desc: "Essential BI", features: ["25 reports", "Data blending", "Dashboards", "Email scheduling"] },
      { name: "Standard", price: "₹2,500", period: "/user/month", desc: "Advanced BI", features: ["Unlimited reports", "AI assistant", "Predictive analytics", "White-label"], highlighted: true, badge: "Popular" },
    ],
    integrations: ["Waves CRM", "Waves Books", "Waves People", "Google Sheets", "MySQL", "PostgreSQL", "Salesforce", "HubSpot"],
    faqs: [
      { q: "Can I connect to external databases?", a: "Yes — connect to MySQL, PostgreSQL, SQL Server, Oracle, Snowflake, BigQuery, and 50+ data sources." },
      { q: "Does it have an AI assistant?", a: "Yes — ask questions in plain English like 'Show me top products by revenue this quarter' and get instant visualizations." },
    ],
    relatedApps: ["creator", "crm", "books", "flow"],
  },

  flow: {
    title: "Waves Flow",
    subtitle: "Integrate your apps and automate complex business workflows.",
    tagline: "Connect everything, automate anything",
    color: "from-purple-500 to-purple-700",
    accentColor: "#7c3aed",
    category: "IT & Custom Development",
    features: [
      { title: "Visual Flow Builder", desc: "Build integrations with a drag-and-drop canvas — connect triggers, actions, and conditions visually.", iconKey: "workflow" },
      { title: "900+ App Connectors", desc: "Pre-built connectors for Waves apps, Google, Microsoft, Slack, Shopify, and 900+ more.", iconKey: "plug" },
      { title: "Multi-Step Workflows", desc: "Chain multiple actions across apps with branching logic, delays, loops, and error handling.", iconKey: "layers" },
      { title: "Webhooks", desc: "Trigger flows from any app using webhooks. Send data to any endpoint via HTTP actions.", iconKey: "globe" },
      { title: "Custom Functions", desc: "Write custom code blocks in Python or JavaScript for complex data transformations.", iconKey: "code" },
      { title: "Error Handling", desc: "Built-in retry logic, error notifications, and flow execution logs for debugging.", iconKey: "alert" },
    ],
    useCases: [
      { title: "Lead Sync Automation", desc: "When a lead fills a form, create a CRM contact, send a welcome email, and notify the sales team on Slack." },
      { title: "E-commerce Order Flow", desc: "When an order is placed, update inventory, create an invoice, and trigger shipping label generation." },
      { title: "HR Onboarding", desc: "When a new hire is added to People, create accounts in IT systems, assign training, and schedule orientation." },
    ],
    targetAudience: ["IT teams", "Operations teams", "Business process owners", "No-code enthusiasts"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "5 flows", features: ["5 flows", "100 tasks/month", "Multi-step", "Basic connectors"] },
      { name: "Standard", price: "₹600", period: "/month", desc: "Growing teams", features: ["20 flows", "2,000 tasks/month", "Webhooks", "All connectors"], highlighted: true },
      { name: "Professional", price: "₹1,500", period: "/month", desc: "High-volume", features: ["100 flows", "10,000 tasks/month", "Custom functions", "Priority support"] },
    ],
    integrations: ["900+ apps", "Waves CRM", "Google Workspace", "Slack", "Shopify", "Stripe", "WhatsApp", "Trello"],
    faqs: [
      { q: "How many apps can I connect?", a: "Waves Flow supports 900+ app connectors — from Waves apps to popular SaaS tools and custom webhooks." },
      { q: "Is there a free plan?", a: "Yes — 5 flows with 100 tasks per month, perfect for getting started with automation." },
    ],
    relatedApps: ["creator", "analytics", "crm", "desk"],
  },

  directory: {
    title: "Waves Directory",
    subtitle: "Workforce identity and access management.",
    tagline: "One identity, every application",
    color: "from-gray-600 to-gray-800",
    accentColor: "#475569",
    category: "IT & Custom Development",
    features: [
      { title: "Single Sign-On (SSO)", desc: "One login for all Waves and third-party apps with SAML 2.0 and OIDC support.", iconKey: "key" },
      { title: "Multi-Factor Authentication", desc: "Enforce MFA with push notifications, OTP, biometrics, and security keys.", iconKey: "shield" },
      { title: "User Provisioning", desc: "Auto-create and deactivate user accounts across all connected applications.", iconKey: "users" },
      { title: "Device Management", desc: "Manage and enforce security policies on employee laptops, phones, and tablets.", iconKey: "monitor" },
      { title: "Conditional Access", desc: "Define access policies based on device, location, IP, time, and risk score.", iconKey: "lock" },
      { title: "Audit Logs", desc: "Complete audit trail of login events, password changes, and admin actions.", iconKey: "clipboard" },
    ],
    useCases: [
      { title: "Enterprise SSO", desc: "Give employees one login for all business apps — Waves, Google, Slack, Salesforce, and custom apps." },
      { title: "Zero Trust Security", desc: "Implement zero trust with conditional access policies, device trust, and continuous verification." },
      { title: "Employee Lifecycle Management", desc: "Auto-provision app access on Day 1 and revoke all access on last day — instantly." },
    ],
    targetAudience: ["IT administrators", "CISOs", "Security teams", "Enterprise IT"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Up to 5 users", features: ["SSO", "MFA", "5 users", "Basic policies"] },
      { name: "Standard", price: "₹25", period: "/user/month", desc: "Growing teams", features: ["Unlimited users", "Auto-provisioning", "Device management", "Conditional access"], highlighted: true },
      { name: "Premium", price: "₹50", period: "/user/month", desc: "Enterprise", features: ["Advanced policies", "Custom SAML", "API access", "Priority support"] },
    ],
    integrations: ["Google Workspace", "Microsoft 365", "Slack", "Salesforce", "AWS", "Azure AD", "Okta"],
    faqs: [
      { q: "Does it replace Active Directory?", a: "It can work alongside AD or as a cloud-native alternative for managing user identities and access policies." },
      { q: "What MFA methods are supported?", a: "Push notifications, TOTP, SMS, biometrics, hardware security keys (FIDO2), and backup codes." },
    ],
    relatedApps: ["vault", "oneauth", "people", "assist"],
  },

  // =====================================================================
  // WORKPLACE & COLLABORATION
  // =====================================================================
  mail: {
    title: "Waves Mail",
    subtitle: "Secure, ad-free business email for your organization.",
    tagline: "Business email that respects your privacy",
    color: "from-purple-500 to-purple-700",
    accentColor: "#9333ea",
    category: "Workplace",
    features: [
      { title: "Ad-Free & Private", desc: "No ads, no scanning your emails. Your data is yours — hosted in Indian data centers.", iconKey: "shield" },
      { title: "Custom Domain Email", desc: "Get professional email@yourdomain.com addresses for your entire team.", iconKey: "globe" },
      { title: "Smart Filters", desc: "AI-powered sorting, priority inbox, and custom filters to keep your inbox organized.", iconKey: "filter" },
      { title: "Calendar Integration", desc: "Built-in calendar with meeting scheduling, availability sharing, and room booking.", iconKey: "calendar" },
      { title: "30GB+ Storage", desc: "Generous storage per user with support for large attachments via Waves WorkDrive.", iconKey: "database" },
      { title: "Admin Console", desc: "Manage users, security policies, email routing, and compliance from a central admin panel.", iconKey: "settings" },
    ],
    useCases: [
      { title: "Business Communication", desc: "Professional email for teams with custom domains, shared mailboxes, and distribution lists." },
      { title: "Regulated Industries", desc: "Email hosting with data residency in India, encryption, and compliance with DPDP Act." },
      { title: "Growing Startups", desc: "Start with 5 free users and scale as your team grows — no per-user price jumps." },
    ],
    targetAudience: ["All businesses", "Startups", "Enterprises", "Government & education"],
    pricing: [
      { name: "Mail Lite", price: "₹25", period: "/user/month", desc: "5GB storage", features: ["5GB/user", "Custom domain", "Web, mobile, desktop", "Calendar"] },
      { name: "Mail Premium", price: "₹50", period: "/user/month", desc: "50GB storage", features: ["50GB/user", "E-discovery", "S/MIME encryption", "Admin policies"], highlighted: true, badge: "Popular" },
      { name: "Workplace", price: "₹100", period: "/user/month", desc: "Suite bundle", features: ["Mail + Docs + Chat", "100GB/user", "Meeting", "All collaboration tools"] },
    ],
    integrations: ["Google Calendar", "Apple Mail", "Outlook", "Thunderbird", "Waves CRM", "Waves Cliq"],
    faqs: [
      { q: "Can I use my own domain?", a: "Yes — connect your domain and create professional email addresses like name@yourcompany.com." },
      { q: "Is email data stored in India?", a: "Yes — all data is hosted in Indian data centers with full compliance to Indian data protection laws." },
      { q: "Does it support IMAP/POP?", a: "Yes — access via IMAP, POP, and ActiveSync on any email client or mobile device." },
    ],
    relatedApps: ["cliq", "workdrive", "meeting", "sign"],
  },

  workdrive: {
    title: "Waves WorkDrive",
    subtitle: "Secure document management and team collaboration.",
    tagline: "Your team's work, organized and accessible",
    color: "from-blue-500 to-blue-800",
    accentColor: "#1d4ed8",
    category: "Workplace",
    features: [
      { title: "Team Folders", desc: "Organize documents in team folders with role-based access — admin, editor, viewer, commenter.", iconKey: "folder" },
      { title: "Real-Time Editing", desc: "Edit documents, spreadsheets, and presentations collaboratively with built-in Waves Office Suite.", iconKey: "edit" },
      { title: "Version History", desc: "Track every change with automatic versioning. Restore previous versions with one click.", iconKey: "clock" },
      { title: "External Sharing", desc: "Share files and folders externally with password protection, expiry dates, and download limits.", iconKey: "share" },
      { title: "Advanced Search", desc: "Full-text search across documents, spreadsheets, and presentations including OCR for scanned PDFs.", iconKey: "search" },
      { title: "Data Room", desc: "Virtual data rooms for M&A, fundraising, and compliance with granular access controls.", iconKey: "lock" },
    ],
    useCases: [
      { title: "Team Collaboration", desc: "Replace Google Drive or Dropbox with a privacy-first platform built for business teams." },
      { title: "Document Management", desc: "Centralize company documents with approval workflows, metadata, and retention policies." },
      { title: "Client File Sharing", desc: "Share deliverables with clients via branded portals with access tracking and notifications." },
    ],
    targetAudience: ["All teams", "Legal departments", "Creative agencies", "Project managers"],
    pricing: [
      { name: "Starter", price: "₹60", period: "/user/month", desc: "Basic storage", features: ["25GB/team", "Real-time editing", "External sharing", "Mobile app"] },
      { name: "Team", price: "₹120", period: "/user/month", desc: "Growing teams", features: ["1TB/team", "Data rooms", "Admin controls", "Version history"], highlighted: true },
      { name: "Business", price: "₹240", period: "/user/month", desc: "Enterprise", features: ["5TB/team", "Custom branding", "DLP", "Advanced audit"] },
    ],
    integrations: ["Waves Mail", "Waves Writer", "Waves Sheet", "Waves Show", "Google Docs", "Microsoft Office"],
    faqs: [
      { q: "Does it support Microsoft Office files?", a: "Yes — upload, preview, and edit Word, Excel, and PowerPoint files directly in WorkDrive." },
      { q: "Is there a desktop sync client?", a: "Yes — sync folders between your desktop and WorkDrive with the Windows/Mac desktop app." },
    ],
    relatedApps: ["writer", "sheet", "show", "mail"],
  },

  writer: {
    title: "Waves Writer",
    subtitle: "Powerful word processor for collaborative teams.",
    tagline: "Write together, publish everywhere",
    color: "from-blue-400 to-blue-600",
    accentColor: "#3b82f6",
    category: "Workplace",
    features: [
      { title: "Real-Time Collaboration", desc: "Multiple users can edit simultaneously with live cursors, comments, and track changes.", iconKey: "users" },
      { title: "AI Writing Assistant", desc: "Grammar checking, rephrasing, summarization, and tone adjustment powered by AI.", iconKey: "sparkles" },
      { title: "Document Templates", desc: "Start with professional templates for proposals, reports, SOPs, and meeting notes.", iconKey: "file" },
      { title: "Digital Publishing", desc: "Publish documents as web pages, blogs, or PDFs with custom formatting and branding.", iconKey: "globe" },
      { title: "Merge Fields", desc: "Create personalized documents by merging CRM or spreadsheet data into templates.", iconKey: "merge" },
      { title: "E-Signatures", desc: "Send documents for electronic signature directly from Writer with Waves Sign integration.", iconKey: "pencil" },
    ],
    useCases: [
      { title: "Team Documentation", desc: "Create SOPs, knowledge bases, and internal wikis with collaborative editing and approval workflows." },
      { title: "Proposal Generation", desc: "Build proposals with CRM data merge, custom templates, and e-signature for fast deal closure." },
      { title: "Content Creation", desc: "Write blog posts, articles, and newsletters with AI assistance and direct publishing." },
    ],
    targetAudience: ["Content teams", "Legal teams", "Sales teams", "All businesses"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Personal use", features: ["25 documents", "Collaboration", "Basic templates", "PDF export"] },
      { name: "Business", price: "₹200", period: "/user/month", desc: "Teams", features: ["Unlimited documents", "AI assistant", "Custom branding", "Admin controls"], highlighted: true },
    ],
    integrations: ["Waves WorkDrive", "Waves CRM", "Waves Sign", "Waves Mail", "Google Drive", "Dropbox"],
    faqs: [
      { q: "Can I import from Google Docs or Word?", a: "Yes — import .docx, Google Docs, and RTF files with formatting preserved." },
      { q: "Does it have an AI assistant?", a: "Yes — AI-powered grammar checking, rephrasing, summarization, and tone adjustment built in." },
    ],
    relatedApps: ["sheet", "show", "workdrive", "sign"],
  },

  sheet: {
    title: "Waves Sheet",
    subtitle: "Collaborative spreadsheet software for data analysis.",
    tagline: "Spreadsheets built for modern teams",
    color: "from-green-500 to-emerald-600",
    accentColor: "#10b981",
    category: "Workplace",
    features: [
      { title: "1000+ Functions", desc: "All the functions you know from Excel plus unique ones for data cleaning and analysis.", iconKey: "calculator" },
      { title: "Real-Time Collaboration", desc: "Work together in real time with cell-level permissions, comments, and edit history.", iconKey: "users" },
      { title: "Pivot Tables", desc: "Summarize large datasets with pivot tables, charts, and conditional formatting.", iconKey: "chart" },
      { title: "Data Connectors", desc: "Import data from databases, APIs, CSV, and other Waves apps with scheduled refreshes.", iconKey: "database" },
      { title: "Macros & Scripts", desc: "Automate repetitive tasks with macros and extend functionality with custom scripts.", iconKey: "code" },
      { title: "Lock & Protect", desc: "Lock cells, ranges, or entire sheets with password protection and user-level permissions.", iconKey: "lock" },
    ],
    useCases: [
      { title: "Financial Modeling", desc: "Build complex financial models with cross-sheet references, scenarios, and goal seeking." },
      { title: "Data Analysis", desc: "Import, clean, and analyze datasets with pivot tables, charts, and statistical functions." },
      { title: "Project Tracking", desc: "Track project tasks, timelines, and budgets with Gantt-chart-style conditional formatting." },
    ],
    targetAudience: ["Finance teams", "Data analysts", "Project managers", "All businesses"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Personal use", features: ["25 spreadsheets", "Collaboration", "Basic functions", "Charts"] },
      { name: "Business", price: "₹200", period: "/user/month", desc: "Teams", features: ["Unlimited spreadsheets", "Data connectors", "Macros", "Admin controls"], highlighted: true },
    ],
    integrations: ["Waves WorkDrive", "Waves Analytics", "Google Sheets", "Microsoft Excel", "Waves CRM"],
    faqs: [
      { q: "Can I import Excel files?", a: "Yes — import .xlsx files with formulas, formatting, charts, and pivot tables preserved." },
      { q: "Does it support macros?", a: "Yes — record macros or write custom scripts to automate repetitive spreadsheet tasks." },
    ],
    relatedApps: ["writer", "show", "workdrive", "analytics"],
  },

  show: {
    title: "Waves Show",
    subtitle: "Create beautiful presentations and broadcast them anywhere.",
    tagline: "Presentations that leave an impression",
    color: "from-yellow-500 to-orange-500",
    accentColor: "#f59e0b",
    category: "Workplace",
    features: [
      { title: "Smart Templates", desc: "100+ designer templates with modern layouts, animations, and brand-ready designs.", iconKey: "palette" },
      { title: "Real-Time Collaboration", desc: "Co-create presentations with your team. Add comments, suggestions, and edits in real time.", iconKey: "users" },
      { title: "AI Slide Generator", desc: "Describe your presentation topic and let AI create a complete slide deck for you.", iconKey: "sparkles" },
      { title: "Live Broadcasting", desc: "Present to remote audiences with built-in broadcasting, Q&A, and polls.", iconKey: "monitor" },
      { title: "Animations & Transitions", desc: "Add professional slide transitions, element animations, and interactive embeds.", iconKey: "play" },
      { title: "Import & Export", desc: "Import PowerPoint files and export as PPTX, PDF, or shareable web links.", iconKey: "upload" },
    ],
    useCases: [
      { title: "Sales Presentations", desc: "Create compelling pitch decks with CRM data integration and personalized slides." },
      { title: "Training Materials", desc: "Build interactive training presentations with quizzes, videos, and self-paced navigation." },
      { title: "Webinar Slides", desc: "Present to global audiences with live broadcasting, audience polls, and Q&A." },
    ],
    targetAudience: ["Sales teams", "Educators", "Marketing teams", "Business professionals"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Personal use", features: ["25 presentations", "Basic templates", "PDF export", "Collaboration"] },
      { name: "Business", price: "₹200", period: "/user/month", desc: "Teams", features: ["Unlimited presentations", "AI generator", "Broadcasting", "Admin controls"], highlighted: true },
    ],
    integrations: ["Waves WorkDrive", "Waves Meeting", "YouTube", "Google Slides", "Microsoft PowerPoint"],
    faqs: [
      { q: "Can I import PowerPoint files?", a: "Yes — import .pptx files with layouts, animations, and charts preserved." },
      { q: "Can I present remotely?", a: "Yes — broadcast your presentation to remote audiences with built-in live streaming." },
    ],
    relatedApps: ["writer", "sheet", "meeting", "workdrive"],
  },

  cliq: {
    title: "Waves Cliq",
    subtitle: "Team communication and instant messaging software.",
    tagline: "Where work conversations happen",
    color: "from-blue-500 to-indigo-500",
    accentColor: "#4f46e5",
    category: "Workplace",
    features: [
      { title: "Channels & Groups", desc: "Organized conversations in topic-based channels — public, private, or cross-team.", iconKey: "hash" },
      { title: "Audio & Video Calls", desc: "Start instant audio/video calls from any conversation with screen sharing.", iconKey: "phone" },
      { title: "Bots & Integrations", desc: "Build custom bots and connect 50+ apps to bring notifications and actions into chat.", iconKey: "bot" },
      { title: "File Sharing", desc: "Share documents, images, code snippets, and files with preview and search.", iconKey: "upload" },
      { title: "Threads & Reactions", desc: "Keep conversations organized with threads and react to messages with emojis.", iconKey: "message" },
      { title: "Guest Access", desc: "Invite external collaborators with controlled access to specific channels.", iconKey: "userPlus" },
    ],
    useCases: [
      { title: "Team Communication", desc: "Replace email with real-time messaging for faster decisions and better team alignment." },
      { title: "Remote Work", desc: "Keep distributed teams connected with channels, video calls, and async communication." },
      { title: "DevOps Notifications", desc: "Pipe CI/CD alerts, monitoring, and deployment notifications into dedicated channels." },
    ],
    targetAudience: ["All teams", "Remote teams", "Engineering teams", "Project teams"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Small teams", features: ["100 users", "Channels", "File sharing", "Search history (90 days)"] },
      { name: "Unlimited", price: "₹150", period: "/user/month", desc: "Full features", features: ["Unlimited users", "Video calls", "Guest access", "Unlimited history"], highlighted: true },
    ],
    integrations: ["Waves CRM", "Waves Projects", "Waves Desk", "GitHub", "Jira", "Google Drive", "Zapier"],
    faqs: [
      { q: "How is this different from Slack?", a: "Waves Cliq is natively integrated with all Waves apps, is more affordable, and stores data in Indian data centers." },
      { q: "Is there a message history limit?", a: "Free plan retains 90 days of history. Paid plan has unlimited, searchable message history." },
    ],
    relatedApps: ["meeting", "projects", "mail", "connect"],
  },

  meeting: {
    title: "Waves Meeting",
    subtitle: "Secure online meetings and webinar solutions.",
    tagline: "Meetings that work, for teams that move fast",
    color: "from-blue-600 to-blue-800",
    accentColor: "#1d4ed8",
    category: "Workplace",
    features: [
      { title: "HD Video Conferencing", desc: "Crystal-clear video and audio for meetings up to 250 participants.", iconKey: "video" },
      { title: "Screen Sharing", desc: "Share your entire screen, specific windows, or individual tabs with annotation tools.", iconKey: "monitor" },
      { title: "Meeting Recording", desc: "Record meetings with cloud storage, automatic transcription, and sharing controls.", iconKey: "circle" },
      { title: "Virtual Backgrounds", desc: "Professional virtual backgrounds and background blur for any environment.", iconKey: "image" },
      { title: "Webinar Mode", desc: "Host webinars for up to 3,000 attendees with Q&A, polls, and hand raising.", iconKey: "users" },
      { title: "End-to-End Encryption", desc: "Optional E2E encryption for sensitive meetings with participant verification.", iconKey: "lock" },
    ],
    useCases: [
      { title: "Team Meetings", desc: "Daily standups, sprint reviews, and all-hands meetings with recording and action items." },
      { title: "Client Presentations", desc: "Present to clients with professional virtual backgrounds and screen sharing." },
      { title: "Webinars & Events", desc: "Host marketing webinars, training sessions, and town halls for thousands of attendees." },
    ],
    targetAudience: ["All teams", "Sales teams", "HR teams", "Marketing teams"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Basic meetings", features: ["100 participants", "60-min meetings", "Screen sharing", "Virtual backgrounds"] },
      { name: "Standard", price: "₹400", period: "/host/month", desc: "Teams", features: ["250 participants", "Unlimited duration", "Recording", "Admin controls"], highlighted: true },
      { name: "Professional", price: "₹800", period: "/host/month", desc: "Webinars", features: ["3,000 attendees", "Webinar mode", "Analytics", "Custom branding"] },
    ],
    integrations: ["Waves Calendar", "Waves Cliq", "Google Calendar", "Outlook", "YouTube Live", "Waves CRM"],
    faqs: [
      { q: "How many participants can join?", a: "Free meetings support up to 100 participants. Paid plans support up to 250 in meetings and 3,000 in webinars." },
      { q: "Are meetings encrypted?", a: "Yes — all meetings use TLS encryption, with optional end-to-end encryption for sensitive discussions." },
    ],
    relatedApps: ["cliq", "show", "bookings", "connect"],
  },

  projects: {
    title: "Waves Projects",
    subtitle: "Comprehensive project management and tracking.",
    tagline: "Plan, track, and deliver — on time, every time",
    color: "from-red-500 to-rose-600",
    accentColor: "#dc2626",
    category: "Workplace",
    features: [
      { title: "Gantt Charts", desc: "Plan project timelines with interactive Gantt charts, dependencies, and milestones.", iconKey: "chart" },
      { title: "Task Management", desc: "Create tasks, subtasks, and checklists with assignees, due dates, and priorities.", iconKey: "checkCircle" },
      { title: "Kanban Boards", desc: "Visualize workflow with customizable Kanban boards for agile and non-agile teams.", iconKey: "layout" },
      { title: "Time Tracking", desc: "Log hours against tasks with timers, manual entry, and approval workflows.", iconKey: "clock" },
      { title: "Document Management", desc: "Attach files, create project wikis, and maintain version-controlled documentation.", iconKey: "folder" },
      { title: "Resource Utilization", desc: "See team workload at a glance and reassign tasks to prevent burnout and bottlenecks.", iconKey: "users" },
    ],
    useCases: [
      { title: "Software Development", desc: "Manage sprints, bug tracking, code reviews, and releases with developer-friendly tools." },
      { title: "Marketing Campaigns", desc: "Plan campaign launches with task dependencies, content calendars, and team assignments." },
      { title: "Client Projects", desc: "Manage client deliverables with milestones, time tracking, and client portal access." },
    ],
    targetAudience: ["Project managers", "Engineering teams", "Marketing teams", "Agency teams"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "2 projects", features: ["2 projects", "10 users", "Task management", "Gantt charts"] },
      { name: "Premium", price: "₹400", period: "/user/month", desc: "Unlimited", features: ["Unlimited projects", "Gantt charts", "Time tracking", "Resource management"], highlighted: true },
      { name: "Enterprise", price: "₹800", period: "/user/month", desc: "Advanced", features: ["Custom roles", "Advanced analytics", "Portfolio view", "API access"] },
    ],
    integrations: ["Waves CRM", "Waves Cliq", "GitHub", "Bitbucket", "Google Drive", "Dropbox", "Zapier"],
    faqs: [
      { q: "Does it support agile methodology?", a: "Yes — Kanban boards, sprints, story points, and velocity tracking are built in." },
      { q: "Can clients view project progress?", a: "Yes — invite clients as external users with view-only access to specific project sections." },
    ],
    relatedApps: ["sprints", "bugtracker", "cliq", "workdrive"],
  },

  sprints: {
    title: "Waves Sprints",
    subtitle: "Agile project management for software development teams.",
    tagline: "Ship software faster with agile sprints",
    color: "from-purple-500 to-fuchsia-600",
    accentColor: "#a855f7",
    category: "Workplace",
    features: [
      { title: "Sprint Planning", desc: "Plan sprints with user stories, story points, effort estimation, and capacity planning.", iconKey: "calendar" },
      { title: "Scrum Board", desc: "Visualize sprint progress with customizable Scrum boards and swimlanes.", iconKey: "layout" },
      { title: "Backlog Management", desc: "Prioritize and groom your product backlog with drag-and-drop reordering and labels.", iconKey: "layers" },
      { title: "Velocity & Burndown", desc: "Track team velocity, sprint burndown, and cumulative flow with real-time charts.", iconKey: "chart" },
      { title: "Retrospectives", desc: "Run structured sprint retrospectives with action items and follow-up tracking.", iconKey: "message" },
      { title: "Release Management", desc: "Plan releases, track deployed items, and generate release notes automatically.", iconKey: "package" },
    ],
    useCases: [
      { title: "Scrum Teams", desc: "Run Scrum ceremonies with sprint planning, daily standups, reviews, and retrospectives." },
      { title: "Product Development", desc: "Manage product backlogs, plan roadmaps, and track feature delivery across releases." },
      { title: "DevOps Integration", desc: "Connect sprints with CI/CD pipelines for automated deployment tracking." },
    ],
    targetAudience: ["Software teams", "Scrum masters", "Product owners", "Engineering leads"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "5 users", features: ["5 users", "Scrum board", "Backlog", "Basic reports"] },
      { name: "Standard", price: "₹500", period: "/user/month", desc: "Growing teams", features: ["Unlimited users", "Velocity charts", "Epic management", "Integrations"], highlighted: true },
    ],
    integrations: ["GitHub", "GitLab", "Bitbucket", "Waves Projects", "Waves Cliq", "Jenkins", "CircleCI"],
    faqs: [
      { q: "Is it only for Scrum?", a: "Primarily designed for Scrum, but also supports Kanban and hybrid methodologies." },
      { q: "Does it integrate with Git?", a: "Yes — connect GitHub, GitLab, or Bitbucket to link commits and PRs to user stories." },
    ],
    relatedApps: ["projects", "bugtracker", "cliq", "flow"],
  },

  connect: {
    title: "Waves Connect",
    subtitle: "Enterprise social network and team intranet.",
    tagline: "Your company's social network",
    color: "from-cyan-500 to-blue-600",
    accentColor: "#0891b2",
    category: "Workplace",
    features: [
      { title: "News Feed", desc: "Company-wide feed for announcements, updates, achievements, and discussions.", iconKey: "rss" },
      { title: "Groups & Communities", desc: "Create interest-based groups, project communities, and departmental channels.", iconKey: "users" },
      { title: "Town Halls", desc: "Host virtual town halls with live Q&A, polls, and audience engagement features.", iconKey: "megaphone" },
      { title: "Knowledge Sharing", desc: "Build an internal wiki with articles, manuals, and best practices.", iconKey: "book" },
      { title: "Employee Recognition", desc: "Celebrate wins with badges, shout-outs, and peer-to-peer recognition.", iconKey: "award" },
      { title: "Mobile App", desc: "Stay connected on the go with native iOS and Android apps.", iconKey: "smartphone" },
    ],
    useCases: [
      { title: "Internal Communications", desc: "Replace email blasts with targeted announcements that reach the right teams." },
      { title: "Employee Engagement", desc: "Build company culture with social features, recognition, and community groups." },
      { title: "Knowledge Management", desc: "Create a searchable knowledge base that grows organically from team discussions." },
    ],
    targetAudience: ["Internal communications teams", "HR departments", "People & culture teams", "Large organizations"],
    pricing: [
      { name: "Standard", price: "₹100", period: "/user/month", desc: "Core features", features: ["News feed", "Groups", "Knowledge base", "Mobile app"], highlighted: true },
      { name: "Professional", price: "₹200", period: "/user/month", desc: "Advanced features", features: ["Town halls", "Advanced analytics", "Custom branding", "API access"] },
    ],
    integrations: ["Waves People", "Waves Cliq", "Waves Mail", "Microsoft Teams", "Slack"],
    faqs: [
      { q: "How is this different from Cliq?", a: "Cliq is for instant messaging and quick collaboration. Connect is an intranet platform for company-wide communication, culture building, and knowledge management." },
    ],
    relatedApps: ["cliq", "people", "meeting", "mail"],
  },

  sign: {
    title: "Waves Sign",
    subtitle: "Secure digital signature software for business.",
    tagline: "Get documents signed in minutes, not days",
    color: "from-blue-500 to-blue-700",
    accentColor: "#2563eb",
    category: "Workplace",
    features: [
      { title: "E-Signatures", desc: "Send documents for legally binding electronic signatures with audit trails and certificates.", iconKey: "pencil" },
      { title: "Templates", desc: "Create reusable templates with predefined signature fields for common document types.", iconKey: "file" },
      { title: "Bulk Sending", desc: "Send the same document for signing to hundreds of recipients simultaneously.", iconKey: "send" },
      { title: "Custom Branding", desc: "White-label the signing experience with your logo, colors, and custom email templates.", iconKey: "palette" },
      { title: "Aadhaar eSign", desc: "India-specific Aadhaar-based electronic signature for government-accepted digital signing.", iconKey: "shield" },
      { title: "API Access", desc: "Integrate e-signatures into your apps and workflows with comprehensive REST APIs.", iconKey: "code" },
    ],
    useCases: [
      { title: "Sales Contracts", desc: "Send proposals and contracts for signature directly from CRM and close deals faster." },
      { title: "HR Documents", desc: "Offer letters, NDAs, and policy acknowledgments signed digitally on Day 1." },
      { title: "Legal Agreements", desc: "Manage legal documents with sequential signing, witness signatures, and notarization." },
    ],
    targetAudience: ["Sales teams", "Legal teams", "HR teams", "All businesses"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "5 docs/month", features: ["5 documents/month", "1 sender", "Basic templates", "Audit trail"] },
      { name: "Standard", price: "₹600", period: "/user/month", desc: "Unlimited", features: ["Unlimited documents", "Templates", "Bulk sending", "Custom branding"], highlighted: true },
      { name: "Enterprise", price: "₹1,200", period: "/user/month", desc: "Advanced", features: ["Aadhaar eSign", "API access", "SSO", "Advanced workflows"] },
    ],
    integrations: ["Waves CRM", "Waves People", "Waves Writer", "Google Drive", "Dropbox", "Salesforce"],
    faqs: [
      { q: "Are e-signatures legally valid in India?", a: "Yes — Waves Sign complies with the IT Act 2000 and provides legally binding e-signatures with audit certificates." },
      { q: "Does it support Aadhaar eSign?", a: "Yes — Enterprise plan includes Aadhaar-based electronic signature accepted by government authorities." },
    ],
    relatedApps: ["writer", "crm", "people", "workdrive"],
  },

  // =====================================================================
  // EDUCATION
  // =====================================================================
  learn: {
    title: "Waves Learn",
    subtitle: "Create, distribute, and monetize online training courses.",
    tagline: "Your knowledge, beautifully delivered",
    color: "from-blue-500 to-indigo-600",
    accentColor: "#4f46e5",
    category: "Education",
    features: [
      { title: "Course Builder", desc: "Create structured courses with video lessons, documents, quizzes, and assignments.", iconKey: "book" },
      { title: "Learning Paths", desc: "Design multi-course learning paths with prerequisites and completion certificates.", iconKey: "workflow" },
      { title: "Assessments", desc: "Build quizzes, exams, and assignments with auto-grading and detailed analytics.", iconKey: "checkCircle" },
      { title: "Virtual Classroom", desc: "Host live training sessions with screen sharing, polls, and breakout rooms.", iconKey: "monitor" },
      { title: "Certifications", desc: "Issue branded completion certificates with verification links and expiry dates.", iconKey: "award" },
      { title: "Mobile Learning", desc: "Learners access courses on-the-go with offline support on iOS and Android.", iconKey: "smartphone" },
    ],
    useCases: [
      { title: "Employee Training", desc: "Onboard new hires, run compliance training, and develop skills with structured learning programs." },
      { title: "Customer Education", desc: "Educate customers on your product with self-paced courses and certification programs." },
      { title: "Online Course Business", desc: "Create and sell courses with built-in payment collection, enrollments, and analytics." },
    ],
    targetAudience: ["L&D teams", "Educators", "Course creators", "Training departments"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "5 learners", features: ["1 course", "5 learners", "Basic assessments", "Certificates"] },
      { name: "Standard", price: "₹500", period: "/month", desc: "50 learners", features: ["Unlimited courses", "50 learners", "Learning paths", "Analytics"], highlighted: true },
      { name: "Professional", price: "₹2,000", period: "/month", desc: "500 learners", features: ["500 learners", "Virtual classroom", "Custom branding", "API access"] },
    ],
    integrations: ["Waves People", "Waves Meeting", "Zoom", "YouTube", "Waves CRM"],
    faqs: [
      { q: "Can I sell courses?", a: "Yes — accept payments via Stripe/Razorpay, manage enrollments, and track revenue." },
      { q: "Does it support SCORM?", a: "Yes — import SCORM 1.2 and 2004 compliant course packages." },
    ],
    relatedApps: ["people", "meeting", "projects"],
  },

  // =====================================================================
  // SECURITY
  // =====================================================================
  vault: {
    title: "Waves Vault",
    subtitle: "Enterprise password manager for teams.",
    tagline: "Your secrets, locked down and accessible",
    color: "from-gray-800 to-black",
    accentColor: "#1f2937",
    category: "Security",
    features: [
      { title: "Password Vault", desc: "Store unlimited passwords with AES-256 encryption. Access from any device.", iconKey: "lock" },
      { title: "Auto-Fill", desc: "Browser extensions auto-fill passwords on websites and apps with one click.", iconKey: "zap" },
      { title: "Secure Sharing", desc: "Share passwords and secrets with team members using encrypted sharing links.", iconKey: "share" },
      { title: "Password Generator", desc: "Generate strong, unique passwords with customizable complexity requirements.", iconKey: "key" },
      { title: "Breach Monitoring", desc: "Get alerts if any of your stored passwords appear in known data breaches.", iconKey: "alert" },
      { title: "Emergency Access", desc: "Designate trusted contacts who can request access in case of emergencies.", iconKey: "shield" },
    ],
    useCases: [
      { title: "Team Password Management", desc: "Securely share credentials for shared accounts, services, and infrastructure." },
      { title: "IT Administration", desc: "Manage server passwords, API keys, certificates, and SSH keys centrally." },
      { title: "Personal Security", desc: "Store personal passwords, secure notes, credit cards, and identity documents." },
    ],
    targetAudience: ["IT teams", "All employees", "Security teams", "System administrators"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Personal", features: ["Unlimited passwords", "Auto-fill", "2FA", "1 device type"] },
      { name: "Standard", price: "₹60", period: "/user/month", desc: "Teams", features: ["Team sharing", "All devices", "Breach monitoring", "Admin console"], highlighted: true },
      { name: "Enterprise", price: "₹120", period: "/user/month", desc: "Enterprise", features: ["SSO integration", "Custom policies", "Audit logs", "Emergency access"] },
    ],
    integrations: ["Chrome", "Firefox", "Edge", "Safari", "iOS", "Android", "Waves Directory"],
    faqs: [
      { q: "Is my data encrypted?", a: "Yes — AES-256 encryption with a master password that only you know. We cannot access your data." },
      { q: "What if I forget my master password?", a: "Set up emergency contacts or use your organization's admin recovery if available." },
    ],
    relatedApps: ["directory", "oneauth", "people"],
  },

  oneauth: {
    title: "Waves OneAuth",
    subtitle: "Secure multi-factor authenticator app.",
    tagline: "One app to protect all your accounts",
    color: "from-green-600 to-emerald-800",
    accentColor: "#059669",
    category: "Security",
    features: [
      { title: "TOTP Authenticator", desc: "Generate time-based one-time passwords for any service that supports Google Authenticator.", iconKey: "key" },
      { title: "Push Notifications", desc: "Approve login requests with one tap via push notifications — no codes to enter.", iconKey: "bell" },
      { title: "QR Code Backup", desc: "Export authenticator accounts as encrypted QR codes for safe backup and device transfers.", iconKey: "qrcode" },
      { title: "Biometric Lock", desc: "Protect the authenticator app itself with fingerprint or face recognition.", iconKey: "shield" },
      { title: "Multi-Device Sync", desc: "Sync authenticator tokens across devices with encrypted cloud backup.", iconKey: "refresh" },
      { title: "Passkey Support", desc: "Use device biometrics as passwordless authentication for Waves and supported services.", iconKey: "key" },
    ],
    useCases: [
      { title: "Two-Factor Authentication", desc: "Add 2FA to all your online accounts — social media, banking, email, and cloud services." },
      { title: "Waves Account Security", desc: "Secure your Waves account with push-based MFA and trusted device management." },
      { title: "Enterprise MFA", desc: "Deploy as the company-standard authenticator app with centralized management." },
    ],
    targetAudience: ["All users", "IT administrators", "Security-conscious individuals"],
    pricing: [
      { name: "Free", price: "₹0", period: "", desc: "For everyone", features: ["Unlimited accounts", "Push notifications", "Biometric lock", "Cloud backup"], highlighted: true },
    ],
    integrations: ["Any TOTP-compatible service", "Waves Directory", "Google", "Microsoft", "AWS"],
    faqs: [
      { q: "Is it free?", a: "Yes — Waves OneAuth is completely free for personal and business use." },
      { q: "Can I transfer to a new phone?", a: "Yes — use encrypted cloud backup or QR code export to transfer all accounts to your new device." },
    ],
    relatedApps: ["vault", "directory", "mail"],
  },

  // =====================================================================
  // MISC / AI / IOT
  // =====================================================================
  agents: {
    title: "Waves AI Agents",
    subtitle: "Autonomous AI agents that execute tasks across every department.",
    tagline: "Hire AI employees for every team",
    color: "from-emerald-400 to-emerald-600",
    accentColor: "#10b981",
    category: "IT & Custom Development",
    features: [
      { title: "Pre-Built Agent Store", desc: "Browse and deploy specialized agents for sales, HR, finance, marketing, and support.", iconKey: "sparkles" },
      { title: "Custom Agent Builder", desc: "Build your own agents with natural language instructions, tools, and memory.", iconKey: "code" },
      { title: "MCP Protocol", desc: "Open protocol support — use agents with Claude, ChatGPT, or your own LLM.", iconKey: "plug" },
      { title: "Cross-App Actions", desc: "Agents can read, write, and act across all Waves apps — CRM, ERP, HR, Finance.", iconKey: "layers" },
      { title: "Human-in-the-Loop", desc: "Configure approval gates so agents check with humans before critical actions.", iconKey: "users" },
      { title: "Audit & Governance", desc: "Full audit trail of every agent action with configurable permissions and access controls.", iconKey: "shield" },
    ],
    useCases: [
      { title: "Sales Automation", desc: "Deploy agents to research prospects, draft emails, update CRM, and schedule follow-ups." },
      { title: "HR Operations", desc: "Automate onboarding tasks, answer employee queries, and process leave requests." },
      { title: "Finance Automation", desc: "Agents process invoices, reconcile expenses, and generate financial reports." },
    ],
    targetAudience: ["All businesses", "Operations teams", "IT departments", "Innovation leaders"],
    pricing: [
      { name: "Starter", price: "₹1,000", period: "/month", desc: "Basic agents", features: ["5 agents", "1,000 actions/month", "Pre-built agents", "Basic audit"], highlighted: true },
      { name: "Professional", price: "₹5,000", period: "/month", desc: "Custom agents", features: ["Unlimited agents", "Custom builder", "MCP support", "Advanced governance"] },
    ],
    integrations: ["All Waves apps", "Claude", "ChatGPT", "Custom LLMs", "Slack", "Microsoft Teams"],
    faqs: [
      { q: "What can agents do?", a: "Agents can perform any task across Waves apps — from updating CRM records to generating reports to answering support tickets." },
      { q: "Is it safe?", a: "Yes — all agents operate within your configured permissions with human-in-the-loop approval for sensitive actions." },
    ],
    relatedApps: ["crm", "flow", "creator", "analytics"],
  },

  forms: {
    title: "Waves Forms",
    subtitle: "Build powerful online forms and collect data securely.",
    tagline: "Beautiful forms that get responses",
    color: "from-sky-400 to-blue-500",
    accentColor: "#0ea5e9",
    category: "Marketing",
    features: [
      { title: "Drag-and-Drop Builder", desc: "Build forms with 30+ field types — text, dropdowns, file uploads, signatures, and more.", iconKey: "layout" },
      { title: "Conditional Logic", desc: "Show/hide fields, pages, and actions based on user responses for dynamic forms.", iconKey: "workflow" },
      { title: "Payment Collection", desc: "Accept payments through forms with Stripe, Razorpay, and PayPal integration.", iconKey: "wallet" },
      { title: "Prefilled Forms", desc: "Pre-populate form fields from CRM data for faster, personalized submissions.", iconKey: "edit" },
      { title: "Email Notifications", desc: "Send custom email confirmations and internal notifications on form submission.", iconKey: "mail" },
      { title: "Analytics & Reports", desc: "View response analytics with charts, filters, and export options.", iconKey: "chart" },
    ],
    useCases: [
      { title: "Lead Capture", desc: "Create high-converting lead forms for landing pages with CRM integration." },
      { title: "Surveys & Feedback", desc: "Collect customer feedback, NPS scores, and satisfaction surveys." },
      { title: "Event Registration", desc: "Build registration forms with ticket types, payment, and confirmation emails." },
    ],
    targetAudience: ["Marketing teams", "HR teams", "Event organizers", "All businesses"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "3 forms", features: ["3 forms", "Unlimited responses", "Basic themes", "Email notifications"] },
      { name: "Basic", price: "₹400", period: "/month", desc: "Unlimited forms", features: ["Unlimited forms", "Payment collection", "File uploads", "Custom themes"], highlighted: true },
      { name: "Standard", price: "₹800", period: "/month", desc: "Advanced", features: ["Conditional logic", "Prefilled forms", "Approval workflows", "Custom domain"] },
    ],
    integrations: ["Waves CRM", "Waves Campaigns", "Zapier", "Google Sheets", "Stripe", "Razorpay", "Slack"],
    faqs: [
      { q: "Can I collect payments through forms?", a: "Yes — integrate Stripe, Razorpay, or PayPal to collect payments directly within your forms." },
      { q: "Can I embed forms on my website?", a: "Yes — embed with an iframe, popup, or direct link. Works on any website." },
    ],
    relatedApps: ["survey", "campaigns", "crm", "sites"],
  },

  survey: {
    title: "Waves Survey",
    subtitle: "Create surveys and analyze feedback instantly.",
    tagline: "Insights from the people who matter most",
    color: "from-green-500 to-emerald-600",
    accentColor: "#10b981",
    category: "Marketing",
    features: [
      { title: "Survey Templates", desc: "200+ pre-built templates for NPS, CSAT, employee engagement, market research, and more.", iconKey: "file" },
      { title: "Question Types", desc: "25+ question types including rating scales, matrix, ranking, slider, and open-ended.", iconKey: "list" },
      { title: "Skip Logic", desc: "Create smart surveys with branching logic that adapts based on respondent answers.", iconKey: "workflow" },
      { title: "Real-Time Analytics", desc: "View responses in real time with auto-generated charts, cross-tabs, and sentiment analysis.", iconKey: "chart" },
      { title: "Multi-Channel Distribution", desc: "Share via email, social media, QR code, website embed, or SMS.", iconKey: "share" },
      { title: "Compliance", desc: "GDPR-compliant with anonymous responses, consent collection, and data retention controls.", iconKey: "shield" },
    ],
    useCases: [
      { title: "Customer Satisfaction", desc: "Send CSAT and NPS surveys after key touchpoints to measure customer experience." },
      { title: "Employee Engagement", desc: "Run pulse surveys, annual engagement surveys, and exit interviews." },
      { title: "Market Research", desc: "Conduct product research, brand awareness studies, and competitive analysis surveys." },
    ],
    targetAudience: ["Marketing teams", "HR teams", "Product teams", "Research teams"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "10 questions/survey", features: ["Unlimited surveys", "100 responses/survey", "Basic reports", "Email sharing"] },
      { name: "Plus", price: "₹600", period: "/month", desc: "Unlimited", features: ["Unlimited questions", "Unlimited responses", "Skip logic", "Custom branding"], highlighted: true },
      { name: "Pro", price: "₹1,500", period: "/month", desc: "Advanced", features: ["Sentiment analysis", "Cross-tabs", "Multi-language", "White-label"] },
    ],
    integrations: ["Waves CRM", "Waves Campaigns", "Slack", "Microsoft Teams", "Google Sheets", "Zapier"],
    faqs: [
      { q: "Is there a response limit?", a: "Free plan allows 100 responses per survey. Paid plans offer unlimited responses." },
      { q: "Can I create anonymous surveys?", a: "Yes — enable anonymous mode to collect responses without identifying respondents." },
    ],
    relatedApps: ["forms", "campaigns", "analytics", "people"],
  },

  teaminbox: {
    title: "Waves TeamInbox",
    subtitle: "Shared team inboxes for collaborative email management.",
    tagline: "Team email that actually works",
    color: "from-blue-500 to-indigo-600",
    accentColor: "#4f46e5",
    category: "Workplace",
    features: [
      { title: "Shared Inboxes", desc: "Create shared email addresses (support@, info@, sales@) with team-wide access.", iconKey: "inbox" },
      { title: "Assignment & Ownership", desc: "Assign emails to team members, set status, and track resolution.", iconKey: "user" },
      { title: "Internal Comments", desc: "Discuss emails internally with @mentions without the customer seeing.", iconKey: "message" },
      { title: "Collision Detection", desc: "See when a teammate is viewing or replying to the same email in real time.", iconKey: "alert" },
      { title: "Rules & Automation", desc: "Auto-assign, tag, and route emails based on sender, subject, or content.", iconKey: "workflow" },
      { title: "Analytics", desc: "Track response times, volume trends, and team performance metrics.", iconKey: "chart" },
    ],
    useCases: [
      { title: "Customer Support", desc: "Manage support@company.com with a team without forwarding or CC chaos." },
      { title: "Sales Inquiries", desc: "Route sales@company.com to the right rep with automatic assignment rules." },
      { title: "Hiring", desc: "Manage recruitment emails with shared inbox for hiring managers and HR." },
    ],
    targetAudience: ["Customer support teams", "Sales teams", "HR teams", "Operations teams"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "1 inbox, 5 users", features: ["1 shared inbox", "5 users", "Basic assignment", "Mobile app"] },
      { name: "Standard", price: "₹350", period: "/inbox/month", desc: "10 users", features: ["10 users", "Automation rules", "Analytics", "Integrations"], highlighted: true },
    ],
    integrations: ["Waves CRM", "Waves Desk", "Waves Cliq", "Slack", "Google Workspace"],
    faqs: [
      { q: "How is this different from Desk?", a: "TeamInbox is for collaborative email management. Desk is a full helpdesk with tickets, SLAs, and knowledge base." },
    ],
    relatedApps: ["mail", "desk", "cliq", "crm"],
  },

  // =====================================================================
  // ADDITIONAL APPS
  // =====================================================================
  voice: {
    title: "Waves Voice",
    subtitle: "Business phone and contact center, built into the apps your team already uses.",
    tagline: "Your business phone system, reimagined",
    color: "from-blue-500 to-indigo-600",
    accentColor: "#4f46e5",
    category: "Sales",
    features: [
      { title: "Cloud PBX", desc: "Full-featured business phone system with IVR, call routing, voicemail, and ring groups.", iconKey: "phone" },
      { title: "Contact Center", desc: "Inbound and outbound call center with queue management, monitoring, and analytics.", iconKey: "headphones" },
      { title: "IVR Builder", desc: "Visual drag-and-drop IVR builder for creating multi-level phone menus.", iconKey: "workflow" },
      { title: "Call Recording", desc: "Record all calls for quality assurance, training, and compliance.", iconKey: "circle" },
      { title: "Live Dashboard", desc: "Real-time dashboards showing call volumes, wait times, agent status, and SLAs.", iconKey: "chart" },
      { title: "CRM Integration", desc: "Caller info, history, and deal data pop up instantly when a call comes in.", iconKey: "user" },
    ],
    useCases: [
      { title: "Sales Teams", desc: "Make and receive calls directly from CRM with click-to-call, auto-logging, and power dialer." },
      { title: "Customer Support Centers", desc: "Set up a professional contact center with IVR, queues, and agent routing." },
      { title: "Remote Teams", desc: "Virtual phone numbers and softphones so your team can work from anywhere." },
    ],
    targetAudience: ["Sales teams", "Customer support", "Call centers", "All businesses"],
    pricing: [
      { name: "Basic", price: "₹500", period: "/user/month", desc: "Essential calling", features: ["IVR", "Call recording", "Voicemail", "Mobile app"] },
      { name: "Standard", price: "₹1,000", period: "/user/month", desc: "Contact center", features: ["Queue management", "Live dashboard", "Call monitoring", "CRM popup"], highlighted: true, badge: "Popular" },
    ],
    integrations: ["Waves CRM", "Waves Desk", "Waves SalesIQ", "Waves Bigin"],
    faqs: [
      { q: "Do I need physical phones?", a: "No — use the browser app, desktop app, or mobile app as your softphone. Works with IP phones too." },
      { q: "Can I keep my existing number?", a: "Yes — port your existing business numbers to Waves Voice." },
    ],
    relatedApps: ["crm", "desk", "salesiq", "bigin"],
  },

  iot: {
    title: "Waves IoT",
    subtitle: "Build internet of things solutions without writing code.",
    tagline: "Connect the physical and digital worlds",
    color: "from-blue-900 to-gray-900",
    accentColor: "#1e3a5f",
    category: "IT & Custom Development",
    features: [
      { title: "Device Management", desc: "Register, monitor, and manage thousands of IoT devices from a central console.", iconKey: "monitor" },
      { title: "Data Visualization", desc: "Build real-time dashboards with gauges, charts, maps, and alerts for sensor data.", iconKey: "chart" },
      { title: "Rules Engine", desc: "Set up automated actions based on sensor readings — alerts, commands, and workflows.", iconKey: "workflow" },
      { title: "MQTT & HTTP", desc: "Connect devices using MQTT, HTTP, or custom protocols with secure authentication.", iconKey: "plug" },
      { title: "Edge Computing", desc: "Process data at the edge for low-latency decision making before sending to cloud.", iconKey: "cpu" },
      { title: "API & Webhooks", desc: "Access device data and trigger actions via REST APIs and webhook integrations.", iconKey: "code" },
    ],
    useCases: [
      { title: "Smart Manufacturing", desc: "Monitor equipment health, predict failures, and optimize production with IoT sensors." },
      { title: "Facility Management", desc: "Track energy consumption, HVAC, lighting, and environmental conditions in buildings." },
      { title: "Fleet Management", desc: "Track vehicle locations, fuel consumption, driver behavior, and maintenance schedules." },
    ],
    targetAudience: ["Manufacturing", "Facility managers", "IoT developers", "Operations teams"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "5 devices", features: ["5 devices", "Basic dashboards", "Email alerts", "MQTT support"] },
      { name: "Standard", price: "₹1,500", period: "/month", desc: "50 devices", features: ["50 devices", "Custom dashboards", "Rules engine", "API access"], highlighted: true },
      { name: "Enterprise", price: "₹5,000", period: "/month", desc: "500 devices", features: ["500 devices", "Edge computing", "Custom protocols", "Priority support"] },
    ],
    integrations: ["MQTT", "HTTP", "Waves Analytics", "Waves CRM", "Waves Flow", "AWS IoT", "Azure IoT"],
    faqs: [
      { q: "What protocols are supported?", a: "MQTT, HTTP/HTTPS, CoAP, and custom protocols via our Gateway SDK." },
      { q: "How many devices can I connect?", a: "Free plan supports 5 devices. Enterprise plan supports 500+, with custom plans for larger deployments." },
    ],
    relatedApps: ["analytics", "flow", "creator"],
  },

  // Fallback entries for apps that appear in the menu but lack detailed data
  routeiq: {
    title: "Waves RouteIQ",
    subtitle: "Map-based route planning and territory management.",
    tagline: "Optimize every sales route, close more deals",
    color: "from-rose-500 to-red-700",
    accentColor: "#dc2626",
    category: "Sales",
    features: [
      { title: "Route Optimization", desc: "Plan the most efficient routes for field visits with multi-stop optimization.", iconKey: "map" },
      { title: "Territory Mapping", desc: "Define and visualize sales territories on interactive maps with heat overlays.", iconKey: "globe" },
      { title: "Check-In/Check-Out", desc: "Field reps check in at client locations with GPS verification and visit notes.", iconKey: "checkCircle" },
      { title: "CRM Integration", desc: "See CRM deals, contacts, and activities plotted on maps for geographic insights.", iconKey: "database" },
    ],
    useCases: [
      { title: "Field Sales", desc: "Plan optimal daily routes for field reps to maximize client visits and minimize travel time." },
      { title: "Territory Planning", desc: "Balance territories by geography, revenue potential, and rep capacity." },
    ],
    targetAudience: ["Field sales teams", "Sales managers", "Distribution companies"],
    pricing: [
      { name: "Standard", price: "₹800", period: "/user/month", desc: "Essential routing", features: ["Route optimization", "Territory maps", "GPS check-in", "CRM sync"], highlighted: true },
    ],
    integrations: ["Waves CRM", "Google Maps", "Waves Bigin"],
    faqs: [
      { q: "Does it work offline?", a: "Yes — routes and maps are cached for offline access during field visits." },
    ],
    relatedApps: ["crm", "bigin", "analytics"],
  },

  fsm: {
    title: "Waves FSM",
    subtitle: "Field service management software for mobile workforces.",
    tagline: "Dispatch, track, and resolve — in the field",
    color: "from-blue-600 to-indigo-800",
    accentColor: "#3730a3",
    category: "Service",
    features: [
      { title: "Work Order Management", desc: "Create, assign, and track work orders from request to completion.", iconKey: "clipboard" },
      { title: "Smart Dispatching", desc: "Auto-assign technicians based on skills, proximity, and availability.", iconKey: "map" },
      { title: "Mobile App", desc: "Technicians manage jobs, capture signatures, and submit reports from the field.", iconKey: "smartphone" },
      { title: "Inventory Tracking", desc: "Track parts and equipment assigned to technicians and job sites.", iconKey: "package" },
    ],
    useCases: [
      { title: "HVAC & Plumbing", desc: "Dispatch technicians, manage service contracts, and track job completion." },
      { title: "IT Field Support", desc: "Schedule on-site IT visits, track asset installations, and manage warranties." },
    ],
    targetAudience: ["Field service companies", "HVAC businesses", "IT service providers", "Maintenance teams"],
    pricing: [
      { name: "Standard", price: "₹1,200", period: "/user/month", desc: "Essential FSM", features: ["Work orders", "Dispatching", "Mobile app", "Basic reports"], highlighted: true },
      { name: "Professional", price: "₹2,500", period: "/user/month", desc: "Advanced", features: ["Smart dispatch", "Inventory", "Custom forms", "Analytics"] },
    ],
    integrations: ["Waves Desk", "Waves CRM", "Waves Inventory", "Google Maps"],
    faqs: [
      { q: "Does it work on mobile?", a: "Yes — native iOS and Android apps for technicians with offline support." },
    ],
    relatedApps: ["desk", "lens", "inventory", "crm"],
  },

  billing: {
    title: "Waves Billing",
    subtitle: "End-to-end billing and revenue management.",
    tagline: "Complex billing made simple",
    color: "from-blue-700 to-indigo-900",
    accentColor: "#312e81",
    category: "Finance",
    features: [
      { title: "Usage-Based Billing", desc: "Bill customers based on API calls, storage, seats, or any custom metric.", iconKey: "chart" },
      { title: "Revenue Recognition", desc: "Automate ASC 606 / Ind AS 115 revenue recognition with deferred revenue tracking.", iconKey: "trending" },
      { title: "Dunning Management", desc: "Automated payment retry, reminders, and grace periods for failed payments.", iconKey: "alert" },
      { title: "Tax Automation", desc: "Auto-calculate GST, VAT, and sales tax based on customer location.", iconKey: "calculator" },
    ],
    useCases: [
      { title: "SaaS Companies", desc: "Handle complex subscription + usage billing with tiered pricing and add-ons." },
      { title: "Telecom Providers", desc: "Rate and bill for voice, data, and SMS usage with CDR processing." },
    ],
    targetAudience: ["SaaS companies", "Telecom providers", "Subscription businesses", "CFOs"],
    pricing: [
      { name: "Standard", price: "₹2,000", period: "/month", desc: "Up to 1,000 customers", features: ["Subscription billing", "Usage metering", "Tax automation", "Dunning"], highlighted: true },
      { name: "Enterprise", price: "₹5,000", period: "/month", desc: "Unlimited", features: ["Revenue recognition", "Multi-entity", "Custom integrations", "Dedicated support"] },
    ],
    integrations: ["Stripe", "Razorpay", "Waves Books", "Waves CRM", "Salesforce"],
    faqs: [
      { q: "Does it support usage-based pricing?", a: "Yes — meter any custom usage metric and create tiered, per-unit, or volume pricing." },
    ],
    relatedApps: ["subscriptions", "books", "checkout", "crm"],
  },

  practice: {
    title: "Waves Practice",
    subtitle: "Complete practice management for accounting firms.",
    tagline: "Run your accounting firm more efficiently",
    color: "from-teal-500 to-teal-700",
    accentColor: "#0d9488",
    category: "Finance",
    features: [
      { title: "Client Management", desc: "Centralized client database with documents, communication history, and service tracking.", iconKey: "users" },
      { title: "Task & Workflow", desc: "Create recurring task templates for tax filing, audits, and compliance deadlines.", iconKey: "checkCircle" },
      { title: "Time & Billing", desc: "Track billable hours, generate invoices, and manage retainer agreements.", iconKey: "clock" },
      { title: "Document Portal", desc: "Secure client portal for document sharing, e-signatures, and collaboration.", iconKey: "folder" },
    ],
    useCases: [
      { title: "CA/CPA Firms", desc: "Manage clients, deadlines, billing, and compliance for accounting practices." },
      { title: "Tax Consulting", desc: "Track tax filing deadlines, manage client documents, and automate reminders." },
    ],
    targetAudience: ["Accounting firms", "CA/CPA practices", "Tax consultants", "Bookkeepers"],
    pricing: [
      { name: "Standard", price: "₹1,000", period: "/user/month", desc: "Growing firms", features: ["Client management", "Task workflows", "Time tracking", "Document portal"], highlighted: true },
      { name: "Premium", price: "₹2,000", period: "/user/month", desc: "Large firms", features: ["Custom branding", "Advanced reports", "API access", "Multi-office"] },
    ],
    integrations: ["Waves Books", "Waves Sign", "Waves Mail", "Tally"],
    faqs: [
      { q: "Is it only for accounting firms?", a: "Primarily designed for CA/CPA firms, but also useful for law firms and consulting practices." },
    ],
    relatedApps: ["books", "sign", "invoice", "expense"],
  },

  contracts: {
    title: "Waves Contracts",
    subtitle: "Comprehensive contract lifecycle management.",
    tagline: "Never miss a contract deadline again",
    color: "from-gray-700 to-gray-900",
    accentColor: "#374151",
    category: "Finance",
    features: [
      { title: "Contract Repository", desc: "Centralized storage for all contracts with search, tags, and version history.", iconKey: "folder" },
      { title: "Template Library", desc: "Create contract templates with merge fields for rapid agreement generation.", iconKey: "file" },
      { title: "Approval Workflows", desc: "Multi-stage approval chains with parallel and sequential review options.", iconKey: "workflow" },
      { title: "Renewal Alerts", desc: "Automatic notifications for upcoming renewals, expirations, and milestones.", iconKey: "bell" },
    ],
    useCases: [
      { title: "Vendor Contracts", desc: "Manage vendor agreements, renewals, and compliance with centralized tracking." },
      { title: "Sales Contracts", desc: "Generate, negotiate, and execute customer contracts with CRM integration." },
    ],
    targetAudience: ["Legal teams", "Procurement teams", "Sales operations", "Contract managers"],
    pricing: [
      { name: "Standard", price: "₹800", period: "/user/month", desc: "Essential CLM", features: ["Contract repository", "Templates", "Renewal alerts", "Basic workflows"], highlighted: true },
      { name: "Professional", price: "₹1,500", period: "/user/month", desc: "Advanced CLM", features: ["Advanced workflows", "Analytics", "API access", "E-signature integration"] },
    ],
    integrations: ["Waves CRM", "Waves Sign", "Waves Books", "DocuSign"],
    faqs: [
      { q: "Does it include e-signatures?", a: "Integrates with Waves Sign for built-in e-signature capability." },
    ],
    relatedApps: ["sign", "crm", "books", "writer"],
  },

  catalyst: {
    title: "Waves Catalyst",
    subtitle: "Serverless pro-code platform for building applications.",
    tagline: "Backend as a service, built for developers",
    color: "from-blue-800 to-blue-950",
    accentColor: "#1e3a8a",
    category: "IT & Custom Development",
    features: [
      { title: "Serverless Functions", desc: "Write backend logic in Java, Node.js, or Python without managing servers.", iconKey: "code" },
      { title: "Cloud Databases", desc: "Relational and NoSQL databases with ORM, migrations, and auto-scaling.", iconKey: "database" },
      { title: "File Storage", desc: "Secure file storage with CDN delivery, image processing, and access controls.", iconKey: "folder" },
      { title: "Authentication", desc: "Built-in user auth with social login, MFA, and JWT token management.", iconKey: "key" },
    ],
    useCases: [
      { title: "Web App Backend", desc: "Build full-stack web applications with serverless functions and managed databases." },
      { title: "API Development", desc: "Create and deploy REST APIs in minutes with automatic scaling and monitoring." },
    ],
    targetAudience: ["Backend developers", "Full-stack developers", "Startups", "CTOs"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Hobby projects", features: ["125K function executions", "500MB storage", "Auth & DB", "Custom domain"] },
      { name: "Scale", price: "₹2,500", period: "/month", desc: "Production apps", features: ["1M executions", "10GB storage", "Custom domain", "Priority support"], highlighted: true },
    ],
    integrations: ["GitHub", "GitLab", "Waves Flow", "Waves CRM", "Twilio", "SendGrid"],
    faqs: [
      { q: "What languages are supported?", a: "Java, Node.js, and Python for serverless functions. Client SDKs for JavaScript, iOS, and Android." },
    ],
    relatedApps: ["creator", "flow", "analytics"],
  },

  qntrl: {
    title: "Waves Qntrl",
    subtitle: "Workflow orchestration software for enterprise processes.",
    tagline: "Orchestrate business processes at scale",
    color: "from-indigo-500 to-indigo-700",
    accentColor: "#6366f1",
    category: "IT & Custom Development",
    features: [
      { title: "Visual Process Designer", desc: "Design complex business processes with a BPMN-compliant drag-and-drop editor.", iconKey: "workflow" },
      { title: "Form Builder", desc: "Create dynamic request forms with validation, conditional fields, and attachments.", iconKey: "layout" },
      { title: "SLA & Escalation", desc: "Set processing time targets and automatic escalation rules for overdue requests.", iconKey: "clock" },
      { title: "Analytics", desc: "Process mining and bottleneck analysis with real-time performance dashboards.", iconKey: "chart" },
    ],
    useCases: [
      { title: "Procurement Workflows", desc: "Automate purchase requisitions, vendor approvals, and PO generation." },
      { title: "IT Service Requests", desc: "Standardize IT request handling with SLAs, auto-routing, and resolution tracking." },
    ],
    targetAudience: ["Process owners", "Operations teams", "IT teams", "Enterprise architects"],
    pricing: [
      { name: "Business", price: "₹600", period: "/user/month", desc: "Standard workflows", features: ["Visual designer", "Forms", "SLA management", "Reports"], highlighted: true },
      { name: "Enterprise", price: "₹1,200", period: "/user/month", desc: "Advanced", features: ["BPMN support", "Process mining", "API access", "SSO"] },
    ],
    integrations: ["Waves CRM", "Waves People", "Slack", "Microsoft Teams", "Jira", "Zapier"],
    faqs: [
      { q: "Is it different from Waves Flow?", a: "Flow is for app-to-app integrations. Qntrl is for orchestrating human-centric business processes with approvals and SLAs." },
    ],
    relatedApps: ["flow", "creator", "projects"],
  },

  zeptomail: {
    title: "Waves ZeptoMail",
    subtitle: "Reliable and secure transactional email delivery.",
    tagline: "Transactional emails that actually arrive",
    color: "from-blue-400 to-cyan-600",
    accentColor: "#06b6d4",
    category: "IT & Custom Development",
    features: [
      { title: "High Deliverability", desc: "Dedicated IP pools and sender reputation management for 99%+ inbox delivery.", iconKey: "mail" },
      { title: "Email Templates", desc: "Create and manage responsive email templates with dynamic variables.", iconKey: "file" },
      { title: "Real-Time Tracking", desc: "Track delivery, opens, clicks, and bounces with real-time event webhooks.", iconKey: "chart" },
      { title: "API & SMTP", desc: "Send via REST API or SMTP relay with comprehensive documentation and SDKs.", iconKey: "code" },
    ],
    useCases: [
      { title: "Order Confirmations", desc: "Send instant order confirmations, shipping updates, and delivery notifications." },
      { title: "Password Resets", desc: "Deliver password reset emails within seconds with high reliability." },
      { title: "OTP & Verification", desc: "Send OTPs and verification emails with guaranteed sub-second delivery." },
    ],
    targetAudience: ["Developers", "E-commerce platforms", "SaaS applications", "DevOps teams"],
    pricing: [
      { name: "Pay-as-you-go", price: "₹150", period: "/10,000 emails", desc: "Flexible pricing", features: ["10,000 emails", "All features", "API & SMTP", "Real-time tracking"], highlighted: true },
    ],
    integrations: ["REST API", "SMTP", "Waves Commerce", "Waves CRM", "WordPress", "Shopify"],
    faqs: [
      { q: "Is this for marketing emails?", a: "No — ZeptoMail is exclusively for transactional emails (order confirmations, OTPs, etc.). Use Waves Campaigns for marketing." },
    ],
    relatedApps: ["mail", "campaigns", "commerce"],
  },

  bugtracker: {
    title: "Waves BugTracker",
    subtitle: "Issue tracking software for software development teams.",
    tagline: "Track bugs, ship features, stay on track",
    color: "from-red-500 to-red-800",
    accentColor: "#b91c1c",
    category: "IT & Custom Development",
    features: [
      { title: "Issue Tracking", desc: "Log bugs with priority, severity, components, and reproducibility steps.", iconKey: "alert" },
      { title: "Milestone Tracking", desc: "Group issues into milestones and releases to track progress toward goals.", iconKey: "target" },
      { title: "Custom Workflows", desc: "Define issue lifecycle stages and transitions matching your team's process.", iconKey: "workflow" },
      { title: "Git Integration", desc: "Link commits and pull requests to issues for full development traceability.", iconKey: "code" },
    ],
    useCases: [
      { title: "QA Teams", desc: "Log, reproduce, and track bugs through the resolution lifecycle." },
      { title: "Product Teams", desc: "Manage feature requests, bug reports, and improvement suggestions in one place." },
    ],
    targetAudience: ["Software developers", "QA teams", "Product managers", "DevOps teams"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "5 users", features: ["5 users", "Issue tracking", "Basic workflows", "Email notifications"] },
      { name: "Standard", price: "₹200", period: "/user/month", desc: "Teams", features: ["Unlimited users", "Custom workflows", "Git integration", "Advanced reports"], highlighted: true },
    ],
    integrations: ["GitHub", "GitLab", "Bitbucket", "Waves Projects", "Waves Sprints", "Slack"],
    faqs: [
      { q: "How is this different from Sprints?", a: "BugTracker focuses on issue/bug tracking. Sprints is for agile sprint planning with user stories and velocity tracking." },
    ],
    relatedApps: ["sprints", "projects", "cliq"],
  },

  dataprep: {
    title: "Waves DataPrep",
    subtitle: "Self-service data preparation and cleansing tool.",
    tagline: "Clean data, clear insights",
    color: "from-purple-400 to-purple-600",
    accentColor: "#9333ea",
    category: "IT & Custom Development",
    features: [
      { title: "Visual Data Profiling", desc: "Instantly see data quality, distributions, patterns, and anomalies with visual profiles.", iconKey: "chart" },
      { title: "Smart Suggestions", desc: "AI suggests data transformations — standardize formats, fix inconsistencies, merge duplicates.", iconKey: "sparkles" },
      { title: "Join & Blend", desc: "Combine data from multiple sources with visual join builder and fuzzy matching.", iconKey: "merge" },
      { title: "Export & Schedule", desc: "Export clean data to databases, files, or Waves Analytics with scheduled refreshes.", iconKey: "upload" },
    ],
    useCases: [
      { title: "Data Migration", desc: "Clean and transform data before migrating to new systems or databases." },
      { title: "Reporting Preparation", desc: "Prepare data for BI reports by deduplicating, standardizing, and enriching records." },
    ],
    targetAudience: ["Data analysts", "BI teams", "Data engineers", "Business analysts"],
    pricing: [
      { name: "Standard", price: "₹1,000", period: "/user/month", desc: "Essential prep", features: ["Data profiling", "Transformations", "Join & blend", "Export"], highlighted: true },
      { name: "Professional", price: "₹2,000", period: "/user/month", desc: "Advanced", features: ["AI suggestions", "Scheduled jobs", "API access", "Collaboration"] },
    ],
    integrations: ["Waves Analytics", "MySQL", "PostgreSQL", "Google Sheets", "CSV", "Waves CRM"],
    faqs: [
      { q: "Do I need coding skills?", a: "No — DataPrep is entirely visual with point-and-click transformations and AI suggestions." },
    ],
    relatedApps: ["analytics", "sheet", "creator"],
  },

  touchpoint: {
    title: "Waves TouchPoint",
    subtitle: "Smart networking tool that helps connect easily, track and drive conversions.",
    tagline: "Networking that drives business results",
    color: "from-red-500 to-pink-600",
    accentColor: "#e11d48",
    category: "Sales",
    features: [
      { title: "Digital Business Cards", desc: "Create and share digital business cards with NFC, QR codes, and direct links.", iconKey: "user" },
      { title: "Contact Capture", desc: "Scan physical business cards and automatically create digital contact records.", iconKey: "camera" },
      { title: "Follow-Up Automation", desc: "Set automated follow-up sequences for new contacts with personalized emails.", iconKey: "mail" },
      { title: "Analytics", desc: "Track card shares, views, and contact engagement with detailed analytics.", iconKey: "chart" },
    ],
    useCases: [
      { title: "Conference Networking", desc: "Share your card digitally at conferences, capture leads, and automate follow-ups." },
      { title: "Sales Prospecting", desc: "Use digital cards in outreach and track when prospects view your profile." },
    ],
    targetAudience: ["Sales professionals", "Business development", "Entrepreneurs", "Event attendees"],
    pricing: [
      { name: "Free", price: "₹0", period: "/month", desc: "Personal", features: ["1 digital card", "QR sharing", "Basic analytics", "Mobile app"] },
      { name: "Standard", price: "₹300", period: "/user/month", desc: "Teams", features: ["Team cards", "CRM sync", "Follow-up automation", "NFC support"], highlighted: true },
    ],
    integrations: ["Waves CRM", "Waves Bigin", "Waves Campaigns", "Google Contacts"],
    faqs: [
      { q: "Does it work with NFC?", a: "Yes — tap your phone to share your digital card instantly via NFC with compatible devices." },
    ],
    relatedApps: ["crm", "bigin", "campaigns"],
  },

  fortify: {
    title: "Waves Fortify",
    subtitle: "Build your first line of defense with secure coding training.",
    tagline: "Train developers to write secure code",
    color: "from-purple-500 to-indigo-700",
    accentColor: "#6d28d9",
    category: "Security",
    features: [
      { title: "Interactive Labs", desc: "Hands-on coding labs where developers fix real vulnerabilities in sandboxed environments.", iconKey: "code" },
      { title: "OWASP Training", desc: "Comprehensive coverage of OWASP Top 10, SANS Top 25, and industry-specific threats.", iconKey: "shield" },
      { title: "Progress Tracking", desc: "Track developer skills growth, completion rates, and security awareness scores.", iconKey: "chart" },
      { title: "Compliance Training", desc: "Meet compliance requirements for PCI-DSS, HIPAA, SOC 2, and ISO 27001.", iconKey: "checkCircle" },
    ],
    useCases: [
      { title: "Developer Security Training", desc: "Train engineering teams to identify and fix vulnerabilities during development." },
      { title: "Compliance Requirements", desc: "Meet security training mandates for PCI-DSS, HIPAA, and SOC 2 certifications." },
    ],
    targetAudience: ["Development teams", "Security teams", "CISOs", "Compliance officers"],
    pricing: [
      { name: "Standard", price: "₹500", period: "/developer/month", desc: "Core training", features: ["OWASP labs", "Progress tracking", "Certifications", "Basic reporting"], highlighted: true },
      { name: "Enterprise", price: "₹1,000", period: "/developer/month", desc: "Advanced", features: ["Custom labs", "API integration", "Advanced analytics", "SSO"] },
    ],
    integrations: ["GitHub", "Jira", "Waves Directory", "Slack"],
    faqs: [
      { q: "What languages are covered?", a: "Java, Python, JavaScript, C#, Go, Ruby, PHP, and more with language-specific vulnerability labs." },
    ],
    relatedApps: ["vault", "directory", "bugtracker"],
  },

  ulaa: {
    title: "Waves Ulaa",
    subtitle: "Privacy-first web browser tailored for work.",
    tagline: "Browse the web without being the product",
    color: "from-cyan-500 to-blue-500",
    accentColor: "#06b6d4",
    category: "Security",
    features: [
      { title: "Built-in Ad Blocker", desc: "Block ads, trackers, and fingerprinting scripts by default for faster, private browsing.", iconKey: "shield" },
      { title: "Work Profiles", desc: "Separate work and personal browsing with isolated profiles and cookie containers.", iconKey: "user" },
      { title: "Waves Integration", desc: "Quick access to Waves Mail, CRM, Projects, and all your Waves apps from the sidebar.", iconKey: "layers" },
      { title: "Session Management", desc: "Save, restore, and organize browsing sessions for different projects and tasks.", iconKey: "folder" },
    ],
    useCases: [
      { title: "Privacy-Focused Browsing", desc: "Browse without third-party tracking, ads, or data collection." },
      { title: "Work Browser", desc: "Dedicated work browser with Waves app integration and separate work profiles." },
    ],
    targetAudience: ["Privacy-conscious users", "Business professionals", "Developers", "All users"],
    pricing: [
      { name: "Free", price: "₹0", period: "", desc: "For everyone", features: ["Ad blocking", "Tracker blocking", "Work profiles", "Waves integration"], highlighted: true },
    ],
    integrations: ["All Waves apps", "Chrome extensions", "1Password", "Bitwarden"],
    faqs: [
      { q: "Is it based on Chromium?", a: "Yes — built on Chromium so it's compatible with all Chrome extensions and websites." },
    ],
    relatedApps: ["vault", "oneauth", "mail"],
  },

  cpaas: {
    title: "Waves CPaaS",
    subtitle: "Reliable, secure, and compliant multi-channel communication platform.",
    tagline: "Communication APIs for every channel",
    color: "from-yellow-500 to-orange-600",
    accentColor: "#ea580c",
    category: "IT & Custom Development",
    features: [
      { title: "SMS API", desc: "Send and receive SMS globally with high deliverability and DLT compliance for India.", iconKey: "message" },
      { title: "Voice API", desc: "Programmable voice calls with IVR, recording, transcription, and conferencing.", iconKey: "phone" },
      { title: "WhatsApp API", desc: "Send WhatsApp messages, templates, and rich media via API.", iconKey: "message" },
      { title: "Email API", desc: "Transactional and marketing email delivery with templates and analytics.", iconKey: "mail" },
    ],
    useCases: [
      { title: "OTP & Verification", desc: "Send OTPs via SMS, WhatsApp, and voice for user verification and 2FA." },
      { title: "Customer Notifications", desc: "Programmatic multi-channel notifications for orders, appointments, and alerts." },
    ],
    targetAudience: ["Developers", "Product teams", "E-commerce platforms", "Fintech companies"],
    pricing: [
      { name: "Pay-as-you-go", price: "₹0.15", period: "/SMS", desc: "Flexible pricing", features: ["SMS, Voice, WhatsApp", "REST APIs", "SDKs", "Real-time tracking"], highlighted: true },
    ],
    integrations: ["REST APIs", "Node.js SDK", "Python SDK", "Java SDK", "Waves CRM", "Waves Commerce"],
    faqs: [
      { q: "Is it DLT compliant for India?", a: "Yes — fully DLT compliant with template management and entity registration support." },
    ],
    relatedApps: ["voice", "campaigns", "zeptomail"],
  },
};

export default appsData;
