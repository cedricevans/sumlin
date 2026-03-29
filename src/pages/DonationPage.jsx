import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Heart, Mail, Receipt, Ticket, User, Users, Star, Gift } from 'lucide-react';
import ParallaxHero from '@/components/ParallaxHero';
import SmoothScroller from '@/components/SmoothScroller';
import ContactSection from '@/components/ContactSection';

const PAYPAL_BUSINESS_EMAIL = 'dbass@seniorcarexpress.com';
const PAYPAL_DONATE_LINK = `https://www.paypal.com/donate/?business=${encodeURIComponent(PAYPAL_BUSINESS_EMAIL)}&currency_code=USD`;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function buildPayPalUrl({ amount, tickets, reference }) {
  const params = new URLSearchParams({
    business: PAYPAL_BUSINESS_EMAIL,
    currency_code: 'USD',
  });

  if (amount > 0) {
    params.set('amount', amount.toFixed(2));
  }

  const itemName = reference
    ? `Sumlin Fundraiser ${reference}`
    : tickets > 0
    ? `Sumlin Fundraiser – ${tickets} ticket${tickets === 1 ? '' : 's'}`
    : 'Sumlin Family Reunion Fundraiser';

  params.set('item_name', itemName);

  return `https://www.paypal.com/donate/?${params.toString()}`;
}

const reasons = [
  {
    icon: Users,
    title: 'Reunion Activities',
    description: 'Help cover the cost of events, entertainment, and activities that bring the family together.',
    gradient: 'gradient-burgundy',
    iconColor: 'text-white',
  },
  {
    icon: Gift,
    title: 'Family Awards',
    description: 'Fund prizes, scholarships, and recognition for family members who go above and beyond.',
    gradient: 'gradient-gold',
    iconColor: 'text-foreground',
  },
  {
    icon: Star,
    title: 'Memories & Keepsakes',
    description: 'Support photo books, videos, and commemorative items that preserve our legacy for generations.',
    gradient: 'gradient-burgundy',
    iconColor: 'text-white',
  },
  {
    icon: Heart,
    title: 'Family in Need',
    description: 'A portion of donations go directly to supporting family members facing hardship.',
    gradient: 'gradient-gold',
    iconColor: 'text-foreground',
  },
];

const DonationPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const amountFromQuery = Number.parseFloat(searchParams.get('amount') || '0');
  const ticketsFromQuery = Number.parseInt(searchParams.get('tickets') || '0', 10);
  const name = searchParams.get('name') || location.state?.customer?.name || '';
  const email = searchParams.get('email') || location.state?.customer?.email || '';
  const orderId = searchParams.get('orderId') || location.state?.orderId || '';
  const referenceCode = searchParams.get('reference') || location.state?.referenceCode || '';
  const tickets = Array.isArray(location.state?.tickets) ? location.state.tickets : [];
  const legacyTicketNumbers = Array.isArray(location.state?.ticketNumbers) ? location.state.ticketNumbers : [];
  const ticketsByRaffle = tickets.reduce((acc, ticket) => {
    const raffleName = ticket?.raffle_name || 'General';
    const ticketNumber = ticket?.number ?? ticket?.ticket_number;

    if (ticketNumber === undefined || ticketNumber === null) {
      return acc;
    }

    if (!acc[raffleName]) {
      acc[raffleName] = [];
    }

    acc[raffleName].push(ticketNumber);
    return acc;
  }, {});
  const hasGroupedTickets = Object.keys(ticketsByRaffle).length > 0;

  const hasCheckoutContext = amountFromQuery > 0 || ticketsFromQuery > 0 || Boolean(referenceCode);
  const paypalUrl = buildPayPalUrl({
    amount: amountFromQuery,
    tickets: ticketsFromQuery,
    reference: referenceCode,
  });

  return (
    <>
      <Helmet>
        <title>Donate | Sumlin Family Reunion 2026</title>
        <meta
          name="description"
          content="Support the Sumlin Family Reunion 2026 with a donation. Every contribution helps make our reunion unforgettable."
        />
      </Helmet>

      <ParallaxHero
        backgroundImage="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/b21b2d1ea8690c7803645629877d22a3.jpg"
        title="Support the Family"
        tagline="Every dollar given is an investment in our legacy"
        height="min-h-[60vh]"
      />

      <section className="section-spacing bg-background">
        <div className="container-custom max-w-4xl">
          <SmoothScroller>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-primary mb-6">
                <Heart className="w-4 h-4" />
                Final Payment
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {hasCheckoutContext ? 'Complete Your Fundraiser Payment' : 'Make a Difference'}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                {hasCheckoutContext
                  ? 'Your entry information has been saved. Use the PayPal button below to finish the payment for the exact number of tickets you selected.'
                  : 'Your generosity keeps the Sumlin Family Reunion alive. Every contribution helps us create unforgettable memories and honor the legacy that connects us all.'}
              </p>
            </div>
          </SmoothScroller>

          {hasCheckoutContext && (
            <SmoothScroller delay={0.05}>
              <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-lg mb-10">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-muted/50 p-5 border border-border/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Ticket className="w-5 h-5 text-primary" />
                      <p className="font-semibold">Entry Summary</p>
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-2">{formatCurrency(amountFromQuery || 0)}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticketsFromQuery} ticket{ticketsFromQuery === 1 ? '' : 's'} selected
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted/50 p-5 border border-border/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-primary" />
                      <p className="text-sm text-muted-foreground">{name || 'Name pending'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <p className="text-sm text-muted-foreground">{email || 'Email pending'}</p>
                    </div>
                    {(referenceCode || orderId) && (
                      <div className="flex items-center gap-3">
                        <Receipt className="w-4 h-4 text-primary" />
                        <p className="text-sm text-muted-foreground">{referenceCode || orderId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {(hasGroupedTickets || legacyTicketNumbers.length > 0) && (
                  <div className="mt-6 rounded-2xl border border-border/50 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                      Reserved Ticket Numbers
                    </p>
                    {hasGroupedTickets ? (
                      <div className="space-y-2">
                        {Object.entries(ticketsByRaffle).map(([raffleName, numbers]) => (
                          <div key={raffleName} className="flex flex-col gap-1 text-sm sm:flex-row sm:gap-3">
                            <span className="font-semibold text-foreground sm:min-w-[160px]">{raffleName}:</span>
                            <span className="text-muted-foreground">{numbers.map((number) => `#${number}`).join(' · ')}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {legacyTicketNumbers.map((number) => `#${number}`).join(' · ')}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-8 text-center">
                  <motion.a
                    href={paypalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-3 gradient-burgundy text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <img
                      src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                      alt="PayPal"
                      className="w-7 h-7 object-contain"
                    />
                    Pay {formatCurrency(amountFromQuery || 0)} with PayPal
                  </motion.a>

                  <p className="text-sm text-muted-foreground mt-4">
                    Please pay the exact amount shown above so the donation matches your ticket count.
                  </p>
                </div>
              </div>
            </SmoothScroller>
          )}

          {!hasCheckoutContext && (
            <SmoothScroller delay={0.05}>
              <div className="text-center mb-10">
                <motion.a
                  href={PAYPAL_DONATE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 gradient-burgundy text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                    alt="PayPal"
                    className="w-7 h-7 object-contain brightness-0 invert"
                  />
                  Donate with PayPal
                </motion.a>

                <p className="text-sm text-muted-foreground mt-4">
                  Secure payment via PayPal — no account required.
                </p>
              </div>
            </SmoothScroller>
          )}
        </div>
      </section>

      <section className="section-spacing bg-muted/50">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Where Your Money Goes</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every donation is used to directly improve the reunion experience and support our family.
              </p>
            </div>
          </SmoothScroller>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {reasons.map((item, index) => (
              <SmoothScroller key={item.title} delay={index * 0.1}>
                <div className="bg-card rounded-2xl p-6 text-center shadow-lg border border-border/50 h-full flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-xl ${item.gradient} flex items-center justify-center mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </SmoothScroller>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
};

export default DonationPage;
