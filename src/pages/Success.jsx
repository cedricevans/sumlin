
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Package, Calendar, CreditCard, Receipt } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const Success = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order details from state (for COD) or generate generic ones for Stripe success
  const orderDetails = location.state?.orderDetails || {
    id: `ORD-${Math.floor(Math.random() * 1000000)}`,
    date: new Date().toISOString(),
    method: 'Online Payment',
    status: 'Paid',
    items: [], // We don't have items if returning from Stripe without a webhook
    total: 'Paid via Stripe'
  };

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Helmet>
        <title>Order Confirmed - Sumlin Family Reunion</title>
        <meta name="description" content="Thank you for your order. Your payment was successful." />
      </Helmet>
      
      <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="max-w-3xl w-full bg-card rounded-3xl shadow-xl overflow-hidden border border-border"
        >
          <div className="gradient-burgundy p-8 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-white/80 text-lg">Thank you for supporting the Sumlin Family Reunion.</p>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Receipt className="w-4 h-4" /> Order Number
                  </h3>
                  <p className="text-xl font-bold text-foreground">{orderDetails.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Date & Time
                  </h3>
                  <p className="text-foreground font-medium">{formatDate(orderDetails.date)}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payment Method
                  </h3>
                  <p className="text-foreground font-medium">
                    {orderDetails.method}
                    {orderDetails.method === 'Cash on Delivery' && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                        Pending Payment
                      </span>
                    )}
                  </p>
                </div>
                {orderDetails.customer && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                      <Package className="w-4 h-4" /> Delivery Details
                    </h3>
                    <p className="text-foreground font-medium">{orderDetails.customer.name}</p>
                    <p className="text-muted-foreground text-sm mt-1">{orderDetails.customer.address}</p>
                    <p className="text-muted-foreground text-sm">Est. Delivery: 3-5 Business Days</p>
                  </div>
                )}
              </div>
            </div>

            {orderDetails.items && orderDetails.items.length > 0 && (
              <div className="border-t border-border pt-8 mb-10">
                <h3 className="text-xl font-bold mb-6 text-foreground">Order Summary</h3>
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 p-4 rounded-xl">
                      <div className="flex items-center gap-4">
                        <img src={item.product.image} alt={item.product.title} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                        <div>
                          <p className="font-semibold text-foreground">{item.product.title}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-foreground">{item.variant.sale_price_formatted}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
                  <span className="text-lg font-medium text-muted-foreground">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">{orderDetails.total}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-border">
              <Link 
                to="/store" 
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors duration-200"
              >
                Continue Shopping
              </Link>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold gradient-gold text-foreground hover:shadow-gold transition-all duration-200"
              >
                Return to Home <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => window.print()} 
                className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors"
              >
                Print Order Confirmation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Success;
