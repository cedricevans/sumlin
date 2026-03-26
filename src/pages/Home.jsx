import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch 4 products to be displayed in the featured collection
        const response = await getProducts({
          limit: 4
        });
        if (response.products.length > 0) {
          const productIds = response.products.map(p => p.id);
          const quantitiesResponse = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: productIds
          });
          const variantQuantityMap = new Map();
          quantitiesResponse.variants.forEach(v => variantQuantityMap.set(v.id, v.inventory_quantity));
          const productsWithQuantities = response.products.map((product) => ({
            ...product,
            variants: product.variants.map(variant => ({
              ...variant,
              inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
            }))
          }));
          setFeaturedProducts(productsWithQuantities);
        }
      } catch (err) {
        setError(err.message || "Failed to load featured products.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);
  const handleSeeDetails = useCallback((e, product) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`, {
      state: {
        featuredImage: product.image
      }
    });
  }, [navigate]);
  return <>
      <Helmet>
        <title>Midcentury Decor - Vintage & Retro Home Furniture</title>
        <meta name="description" content="Discover curated midcentury modern, vintage, and retro home decor from Berlin. Shop unique furniture, lighting, and decorative pieces." />
      </Helmet>

      <div className="bg-white">
        <section className="relative min-h-[85vh] flex items-center pt-16 lg:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8
            }}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-gray-900 mb-6">Midcentury modern home decor</h1>
                <motion.p initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.2,
                duration: 0.8
              }} className="text-lg text-gray-600 mb-8 max-w-lg">
                  Curated vintage and retro home decor from Berlin, bringing timeless design and character to your space.
                </motion.p>
                <Link to="/shop">
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              scale: 0.95
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <img className="w-full h-64 object-cover rounded-2xl" alt="Close up of a wooden armchair with beige cushions" src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/847762c9de2e98d5e74cb9671a97c5e6.png" />
                    <img className="w-full h-48 object-cover rounded-2xl" alt="Orange armchair in a stylish room with a floor lamp" src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/72d0a0dd168792218977e06b8e6ab6ba.png" />
                  </div>
                  <div className="space-y-4 pt-8">
                    <img className="w-full h-48 object-cover rounded-2xl" alt="Patterned armchair under a modern white pendant light" src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/c8f65dffbba17cd88fe9c26b8579ef97.png" />
                    <img className="w-full h-64 object-cover rounded-2xl" alt="Modern living room with wooden furniture and earthy tones" src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/f32be0a20771f1542b287fffb71de084.png" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="text-center mb-12">
              <h2 className="text-4xl font-light tracking-tight text-gray-900 mb-4">Featured collection</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Handpicked vintage and retro pieces to elevate your space
              </p>
            </motion.div>

            {loading && <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 text-gray-900 animate-spin" />
              </div>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                {featuredProducts.map((product, index) => {
              const displayVariant = product.variants[0];
              const hasSale = displayVariant && displayVariant.sale_price_in_cents !== null;
              const displayPrice = hasSale ? displayVariant.sale_price_formatted : displayVariant.price_formatted;
              return <motion.div key={product.id} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.6,
                delay: index * 0.1
              }} className="group">
                      <Link to={`/product/${product.id}`} state={{
                  featuredImage: product.image
                }} className="block">
                        <div className="relative overflow-hidden rounded-2xl mb-4 bg-gray-100 aspect-square">
                          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.title} src={product.image} />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 md:hidden">
                            <Button onClick={e => handleSeeDetails(e, product)} className="bg-white text-gray-900 hover:bg-white/90 rounded-full px-6 py-3 shadow-lg transform group-hover:scale-100 scale-90 transition-transform" aria-label="See product details">
                              See Details
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 text-center">
                          {/* Removed the product type label */}
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {product.title}
                          </h3>
                          <p className="text-gray-900 font-medium">{displayPrice}</p>
                        </div>
                      </Link>
                    </motion.div>;
            })}
              </div>}

            <div className="text-center mt-12">
              <Link to="/shop">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6">
                  View All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8
            }}>
                <img className="w-full h-[500px] object-cover rounded-2xl" alt="Stylish room with an orange armchair and a floor lamp" src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/urban-vintage-bapixnpmwrm-unsplash-MdKpN.jpg" />
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              x: 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8
            }}>
                <h2 className="text-4xl font-light tracking-tight text-gray-900 mb-6">Curated with care</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Every piece in our collection is carefully selected for its unique character, quality craftsmanship, and timeless design. We believe in bringing the warmth and authenticity of vintage decor into modern homes.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Based in Berlin, we source authentic midcentury modern, vintage, and retro pieces that tell a story and add personality to your space.
                </p>
                <Link to="/about">
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6">
                    Learn More About Us
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>;
};
export default Home;