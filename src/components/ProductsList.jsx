
import React, { useCallback, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Loader2, Ticket } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';

// Fallback mock products to ensure the 3 fundraiser baskets ALWAYS display
// even if the backend API is empty or fails to load.
const MOCK_FUNDRAISER_BASKETS = [
  {
    id: 'mock_bbq_1',
    title: "Men's BBQ Basket",
    description: "A cookout-ready basket with grilling tools, seasonings, barbecue sauce, a BBQ cookbook, snacks, drinks, and a gift card for the grill master in the family.",
    image: "https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/be567f8a47ffdaa2f39d977fd2d9cf10.png",
    price_in_cents: 100,
    variants: [{
      id: 'var_bbq_1',
      title: '1 Entry',
      price_in_cents: 100,
      sale_price_in_cents: null,
      price_formatted: '$1.00',
      sale_price_formatted: '$1.00',
      inventory_quantity: 999,
      manage_inventory: false,
      currency_info: { code: 'USD', symbol: '$' }
    }]
  },
  {
    id: 'mock_spa_2',
    title: "Women's Spa Basket",
    description: "A relaxing self-care basket filled with spa treats, teas, sweets, a candle, a journal, and other cozy touches for a peaceful day in.",
    image: "https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/4e17bdac7a15fc4de24fd0d3a1a19629.png",
    price_in_cents: 100,
    variants: [{
      id: 'var_spa_2',
      title: '1 Entry',
      price_in_cents: 100,
      sale_price_in_cents: null,
      price_formatted: '$1.00',
      sale_price_formatted: '$1.00',
      inventory_quantity: 999,
      manage_inventory: false,
      currency_info: { code: 'USD', symbol: '$' }
    }]
  },
  {
    id: 'mock_fun_3',
    title: "Children's Fun Basket",
    description: "A playful basket packed with games, coloring supplies, bubbles, chalk, puzzles, candy, and family-friendly fun for the kids.",
    image: "https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/bbde91523509fa15237854796570ffb9.png",
    price_in_cents: 100,
    variants: [{
      id: 'var_fun_3',
      title: '1 Entry',
      price_in_cents: 100,
      sale_price_in_cents: null,
      price_formatted: '$1.00',
      sale_price_formatted: '$1.00',
      inventory_quantity: 999,
      manage_inventory: false,
      currency_info: { code: 'USD', symbol: '$' }
    }]
  }
];

function formatProductDescription(description) {
  if (!description) {
    return 'Basket details coming soon.';
  }

  return description
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const displayVariant = product.variants[0];
  const hasSale = displayVariant && displayVariant.sale_price_in_cents !== null;
  const displayPrice = hasSale ? displayVariant.sale_price_formatted : displayVariant.price_formatted;
  const description = formatProductDescription(product.description);

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.variants[0];

    try {
      await addToCart(product, defaultVariant, 1, defaultVariant.inventory_quantity || 999);
      toast({
        title: "Entry Added! 🎟️",
        description: `${product.title} was added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [product, addToCart, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="h-full"
    >
      <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full group border border-border/50">
        <div className="relative overflow-hidden bg-muted aspect-[4/3]">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 gradient-gold text-foreground px-4 py-1.5 rounded-full font-bold text-lg shadow-md flex items-center gap-1.5">
            <Ticket className="w-4 h-4" />
            <span>{displayPrice}</span>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold mb-3 text-balance text-foreground">{product.title}</h3>
          <div className="mb-6 flex-grow">
            <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary mb-3">
              Fundraiser basket
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {description}
            </p>
          </div>
          <div className="mt-auto pt-4 border-t border-border/50">
            <button 
              onClick={handleAddToCart} 
              className="w-full gradient-burgundy text-white py-3.5 rounded-xl font-semibold hover:shadow-burgundy hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> 
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CartSummaryPrompt = ({ setIsCartOpen }) => {
  const { cartItems, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return null;
  }

  const totalEntries = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const basketCount = cartItems.length;
  const basketNames = cartItems
    .slice(0, 2)
    .map((item) => item.product?.title)
    .filter(Boolean)
    .join(' · ');
  const extraBasketCount = basketCount > 2 ? basketCount - 2 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.25 }}
        className="mx-auto mt-8 w-full max-w-3xl"
      >
        <div className="rounded-[1.75rem] border border-primary/20 bg-card/95 p-4 shadow-[0_18px_50px_-22px_rgba(87,13,33,0.45)] backdrop-blur md:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Selected raffle items</p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {basketCount} {basketCount === 1 ? 'basket' : 'baskets'} · {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {basketNames}
                {extraBasketCount > 0 ? ` + ${extraBasketCount} more` : ''}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current total</p>
              <p className="mt-1 text-xl font-bold text-foreground">{getCartTotal()}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-burgundy px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-burgundy"
          >
            <ShoppingCart className="h-4 w-4" />
            View selected items
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProductsList = ({ setIsCartOpen }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsResponse = await getProducts();

        if (!productsResponse || !productsResponse.products || productsResponse.products.length === 0) {
          // Fallback to mock products if API returns empty
          console.log("API returned empty products, using fallback fundraiser baskets.");
          setProducts(MOCK_FUNDRAISER_BASKETS);
          return;
        }

        const productIds = productsResponse.products.map(product => product.id);
        const quantitiesResponse = await getProductQuantities({
          fields: 'inventory_quantity',
          product_ids: productIds
        });

        const variantQuantityMap = new Map();
        if (quantitiesResponse && quantitiesResponse.variants) {
          quantitiesResponse.variants.forEach(variant => {
            variantQuantityMap.set(variant.id, variant.inventory_quantity);
          });
        }

        const productsWithQuantities = productsResponse.products.map(product => ({
          ...product,
          variants: product.variants.map(variant => ({
            ...variant,
            inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
          }))
        }));

        setProducts(productsWithQuantities);
      } catch (err) {
        console.error('Failed to load products from API, using fallback:', err);
        setProducts(MOCK_FUNDRAISER_BASKETS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Loading fundraiser baskets...</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      <CartSummaryPrompt setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default ProductsList;
