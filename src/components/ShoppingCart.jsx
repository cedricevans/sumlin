
import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, CreditCard, Truck, Loader2, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/hooks/use-toast';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [codForm, setCodForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCodForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some entries to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'online') {
        // Check if we are using mock products (fallback mode)
        const hasMockProducts = cartItems.some(item => item.variant.id.startsWith('var_'));
        
        if (hasMockProducts) {
          // Simulate online checkout success for mock products to prevent Stripe API errors
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const orderDetails = {
            id: `ORD-${Math.floor(Math.random() * 1000000)}`,
            date: new Date().toISOString(),
            items: [...cartItems],
            total: getCartTotal(),
            method: 'Online Payment (Simulated)',
            status: 'Paid'
          };

          clearCart();
          setIsCartOpen(false);
          navigate('/success', { state: { orderDetails } });
          return;
        }

        // Real Stripe Checkout Flow
        const items = cartItems.map(item => ({
          variant_id: item.variant.id,
          quantity: item.quantity,
        }));

        const successUrl = `${window.location.origin}/success`;
        const cancelUrl = window.location.href;

        const { url } = await initializeCheckout({ items, successUrl, cancelUrl });

        clearCart();
        window.location.href = url;
      } else {
        // Cash on Delivery Flow
        if (!codForm.name || !codForm.email || !codForm.phone || !codForm.address) {
          toast({
            title: 'Missing Information',
            description: 'Please fill out all fields for Cash on Delivery.',
            variant: 'destructive',
          });
          setIsProcessing(false);
          return;
        }

        // Simulate COD order processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const orderDetails = {
          id: `ORD-${Math.floor(Math.random() * 1000000)}`,
          date: new Date().toISOString(),
          items: [...cartItems],
          total: getCartTotal(),
          method: 'Cash on Delivery',
          customer: { ...codForm }
        };

        clearCart();
        setIsCartOpen(false);
        setCodForm({ name: '', email: '', phone: '', address: '' });
        navigate('/success', { state: { orderDetails } });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: 'Checkout Error',
        description: 'There was a problem processing your checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [cartItems, clearCart, toast, paymentMethod, codForm, navigate, getCartTotal, setIsCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/60 z-50 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card text-card-foreground shadow-2xl flex flex-col rounded-l-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-card-foreground flex items-center gap-2">
                <ShoppingCartIcon className="w-6 h-6 text-primary" />
                Your Cart
              </h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Ticket size={32} className="text-muted-foreground/50" />
                  </div>
                  <p className="text-lg font-medium text-foreground">Your cart is empty</p>
                  <p className="text-sm mt-2">Looks like you haven't added any fundraiser entries yet.</p>
                  <Button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/store');
                    }} 
                    className="mt-6 gradient-gold text-foreground hover:shadow-gold"
                  >
                    Browse Baskets
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.variant.id} className="flex items-center gap-4 bg-background border border-border p-3 rounded-xl shadow-sm">
                        <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-foreground line-clamp-1">{item.product.title}</h3>
                          <p className="text-sm text-muted-foreground">Entry</p>
                          <p className="text-sm text-primary font-bold mt-1">
                            {item.variant.sale_price_formatted || item.variant.price_formatted}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center border border-border rounded-lg bg-card">
                            <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 text-foreground hover:bg-muted rounded-l-lg transition-colors">-</button>
                            <span className="px-2 text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} className="px-2 py-1 text-foreground hover:bg-muted rounded-r-lg transition-colors">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.variant.id)} className="text-destructive hover:text-destructive/80 text-xs font-medium transition-colors">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4 text-foreground">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('online')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                          paymentMethod === 'online' 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        <CreditCard className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">Online Pay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                          paymentMethod === 'cod' 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        <Truck className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">Cash App / COD</span>
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {paymentMethod === 'cod' && (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 overflow-hidden"
                          onSubmit={handleCheckout}
                        >
                          <p className="text-xs text-muted-foreground mb-2">
                            Please provide your details. You will need to send payment via Cash App to $SumlinReunionClub.
                          </p>
                          <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={codForm.name}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                          />
                          <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={codForm.email}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                          />
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={codForm.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                          />
                          <textarea
                            name="address"
                            placeholder="Delivery Address (Optional)"
                            value={codForm.address}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full resize-none"
                          />
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border bg-muted/30">
                <div className="flex justify-between items-center mb-4 text-foreground">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold text-primary">{getCartTotal()}</span>
                </div>
                <Button 
                  onClick={handleCheckout} 
                  disabled={isProcessing}
                  className="w-full gradient-burgundy text-white font-semibold py-6 text-lg rounded-xl hover:shadow-burgundy transition-all duration-300"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </span>
                  ) : (
                    `Complete Order • ${getCartTotal()}`
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
