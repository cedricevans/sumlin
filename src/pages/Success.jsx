
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Calendar, CreditCard, Receipt, Ticket } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const Success = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const isCashApp = orderDetails?.method === 'Cash App';
  // tickets = [{number, raffle_name}] — grouped display
  const tickets = orderDetails?.tickets || [];
  // Group by raffle name
  const ticketsByRaffle = tickets.reduce((acc, t) => {
    const name = t.raffle_name || 'General';
    if (!acc[name]) acc[name] = [];
    acc[name].push(t.number);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Order Confirmed - Sumlin Family Reunion</title>
        <meta name="description" content="Thank you for supporting the Sumlin Family Reunion fundraiser." />
      </Helmet>

      <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="max-w-2xl w-full bg-card rounded-3xl shadow-xl overflow-hidden border border-border"
        >
          <div className="gradient-burgundy p-8 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {isCashApp ? 'Entries Reserved!' : 'Order Confirmed!'}
            </h1>
            <p className="text-white/80 text-lg">
              {isCashApp
                ? 'Your raffle entries are saved. Complete payment via Cash App to confirm.'
                : 'Thank you for supporting the Sumlin Family Reunion.'}
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Order info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-muted/50 border border-border/50 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5" /> Reference
                </p>
                <p className="font-bold text-foreground">{orderDetails?.referenceCode || orderDetails?.id || '—'}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 border border-border/50 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date
                </p>
                <p className="font-medium text-foreground text-sm">{orderDetails?.date ? formatDate(orderDetails.date) : '—'}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 border border-border/50 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Payment
                </p>
                <p className="font-medium text-foreground">{orderDetails?.method || '—'}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 border border-border/50 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" /> Entries
                </p>
                <p className="font-bold text-foreground">{orderDetails?.entryCount ?? '—'}</p>
              </div>
            </div>

            {/* Ticket numbers */}
            {tickets.length > 0 && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" /> Your Tickets by Raffle
                </p>
                <div className="space-y-2">
                  {Object.entries(ticketsByRaffle).map(([raffle, nums]) => (
                    <div key={raffle} className="flex items-start gap-3 text-sm">
                      <span className="font-semibold text-foreground min-w-[160px]">{raffle}:</span>
                      <span className="text-muted-foreground">{nums.map((n) => `#${n}`).join(' · ')}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">Keep these numbers — they are your raffle entries.</p>
              </div>
            )}

            {/* Cash App payment instructions */}
            {isCashApp && (
              <div className="rounded-2xl border border-amber-300/50 bg-amber-50/50 p-5">
                <p className="font-semibold text-amber-800 mb-2">Action Required — Send Payment</p>
                <p className="text-sm text-amber-700 mb-3">
                  Your entries are reserved but will not be confirmed until payment is received.
                </p>
                <p className="text-sm text-amber-700">
                  Send <strong>{orderDetails?.total}</strong> via Cash App to{' '}
                  <strong className="font-bold">$SumlinReunionClub</strong>
                </p>
                <p className="text-xs text-amber-600 mt-2">
                  Include your reference code <strong>{orderDetails?.referenceCode}</strong> in the Cash App note.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/store"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors duration-200"
              >
                Back to Store
              </Link>
              <Link
                to="/"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold gradient-gold text-foreground hover:shadow-gold transition-all duration-200"
              >
                Return to Home <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            <div className="text-center">
              <button
                onClick={() => window.print()}
                className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors"
              >
                Print this confirmation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Success;
