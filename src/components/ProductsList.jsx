
import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    description: "OSU 3 piece grill set, featuring a high-quality grill spatula, tongs, and a basting brush, along with 2 jars of the famous Kinders Seasoning that adds delightful flavor to any meat dish. Included are also 2 bottles of Stubbs BBQ sauce, renowned for its rich, smoky taste. As an ideal complement, you'll receive the Rodney Scott World of BBQ cookbook, packed with delicious recipes and grilling tips. To ensure you cook your meat perfectly, a digital meat thermometer is included, allowing for precise cooking temperatures. Additionally, a $25 Dicks gift card is provided, perfect for shopping for your favorite sports gear or outdoor equipment. To stay refreshed, there are 2 sports drinks and 2 bottles of root beer to quench your thirst. You will also enjoy 1 mug, stylishly designed, and 6 delectable snacks to indulge in while you grill.",
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
    description: "2016 Boeschen Vineyards, a fine cabernet sauvignon wine that is celebrated for its rich and robust flavor, bath and body lotion that leaves your skin feeling soft and rejuvenated, and the bath and body work refresh & revitalize spa treatment set which includes an array of luxurious items. This delightful set consists of 4 relaxing bath bombs that fizz delightfully in your tub, a beautifully designed tin of the secret garden organic ginger peach tea, a soothing sweet dreams teal calming herbal tea blend, a jar of pure, golden honey that is perfect for sweetening your beverages or enjoying by the spoonful. Additionally, the package includes a stylish mug for enjoying your drinks, a lovely journal for capturing your thoughts and ideas, a refreshing coconut coffee scrub that invigorates your skin, a charming 3 wick candle that fills your space with a warm ambiance, delectable chocolate truffles that melt in your mouth, and delightful shortbread cookies that are perfect for a cozy afternoon treat.",
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
    description: "3 coloring books filled with intricate designs, a variety of colorful bubbles in different sizes, a set of vibrant sidewalk chalk perfect for drawing on pavement, an exciting monopoly game to enjoy with family and friends, a beautifully crafted frame to display your favorite memories, a pack of colored pencils featuring a rainbow of colors, 2 packs of crayons that include both classic and bold shades, 2 challenging puzzles that promise hours of fun, and 6 bags of candy with assorted flavors to satisfy any sweet tooth.",
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

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const displayVariant = product.variants[0];
  const hasSale = displayVariant && displayVariant.sale_price_in_cents !== null;
  const displayPrice = hasSale ? displayVariant.sale_price_formatted : displayVariant.price_formatted;

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.variants[0];

    try {
      await addToCart(product, defaultVariant, 1, defaultVariant.inventory_quantity || 999);
      toast({
        title: "Entry Added! 🎟️",
        description: `1x ${product.title} entry added to your cart.`,
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
              {product.description}
            </p>
          </div>
          <div className="mt-auto pt-4 border-t border-border/50">
            <button 
              onClick={handleAddToCart} 
              className="w-full gradient-burgundy text-white py-3.5 rounded-xl font-semibold hover:shadow-burgundy hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> 
              Add Entry
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductsList = () => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;
