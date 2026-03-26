
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SmoothScroller from '@/components/SmoothScroller';
import ProductsList from '@/components/ProductsList';

const StorePage = () => {
  return (
    <>
      <Helmet>
        <title>Fundraiser - Sumlin Family Reunion Support</title>
        <meta name="description" content="Support the Sumlin Family Reunion fundraiser and review the official disclaimer, entry language, and basket options." />
      </Helmet>

      <section className="section-spacing bg-background pt-24 md:pt-32">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Family fundraiser baskets</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Support the Sumlin Family Reunion through our family fundraiser page. Basket entries, peer-payment
                records, and final ticket issuance should be managed with the admin workflow so the family can track
                every donation and every entry request.
              </p>
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.1}>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-10 max-w-4xl mx-auto text-center">
              <p className="text-base md:text-lg leading-relaxed">
                No purchase or donation is necessary to submit an entry request. A donation does not increase the odds
                of being selected. Review the family fundraiser disclaimer before taking live payments.
              </p>
              <Link
                to="/fundraiser-rules"
                className="inline-block mt-5 gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200"
              >
                Read official rules
              </Link>
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.2}>
            <div className="bg-card rounded-2xl p-8 mb-16 shadow-lg max-w-3xl mx-auto border border-border/50">
              <h2 className="text-2xl font-bold mb-6 text-center">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl gradient-gold flex items-center justify-center mb-4 text-foreground font-bold text-2xl shadow-sm">
                    1
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">Choose a basket</h3>
                  <p className="text-sm text-muted-foreground">Pick the basket or fundraiser item your family wants to support</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl gradient-burgundy flex items-center justify-center mb-4 text-white font-bold text-2xl shadow-sm">
                    2
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">Create the record</h3>
                  <p className="text-sm text-muted-foreground">Collect the family member's information and save the payment or free-entry record</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl gradient-gold flex items-center justify-center mb-4 text-foreground font-bold text-2xl shadow-sm">
                    3
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">Issue tickets and draw</h3>
                  <p className="text-sm text-muted-foreground">Confirm payment in admin, assign ticket numbers, and draw from the approved pool</p>
                </div>
              </div>
            </div>
          </SmoothScroller>

          <div className="mb-16">
            <ProductsList />
          </div>

          <SmoothScroller delay={0.4}>
            <div className="mt-16 text-center">
              <div className="bg-muted rounded-2xl p-8 max-w-2xl mx-auto border border-border/50">
                <h3 className="text-2xl font-bold mb-4">Need help?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about the fundraiser, peer-payment options, or how entries will be tracked,
                  please contact any family officer listed in the footer or open the family business page for planning support.
                </p>
              </div>
            </div>
          </SmoothScroller>
        </div>
      </section>
    </>
  );
};

export default StorePage;
