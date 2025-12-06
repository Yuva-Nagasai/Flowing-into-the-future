import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Star, ArrowLeft, Minus, Plus, Check, Zap, Shield, Download, Package } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import ProductGallery from '../../components/shop/ProductGallery';
import ProductGrid from '../../components/shop/ProductGrid';
import shopApi from '../../utils/shopApi';
import shopSampleProducts from '../../data/shopSampleProducts';
import type { Product } from '../../types/shop';

export default function ShopProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isAuthenticated } = useShopAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'license'>('description');
  const [addingToCart, setAddingToCart] = useState(false);

  const elevatedCardClass = useMemo(
    () =>
      theme === 'dark'
        ? 'bg-slate-900/80 border border-slate-700/70 backdrop-blur-sm'
        : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border border-accent-red/30 backdrop-blur-sm shadow-lg',
    [theme]
  );

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getProduct(slug!);
      if (res.success && res.data) {
        setProduct(res.data);
        if (res.data.categoryId) {
          const relatedRes = await shopApi.getProducts({ category: res.data.category?.slug, limit: 4 });
          if (relatedRes.success) {
            setRelatedProducts(relatedRes.data.filter(p => p.id !== res.data!.id).slice(0, 4));
          } else {
            const fallbackRelated = shopSampleProducts
              .filter(p => p.id !== res.data!.id && p.category?.slug === res.data.category?.slug)
              .slice(0, 4);
            setRelatedProducts(fallbackRelated);
          }
        }
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Failed to fetch product');
    }

    const fallbackProduct = shopSampleProducts.find(p => p.slug === slug);
    if (fallbackProduct) {
      setProduct(fallbackProduct);
      const fallbackRelated = shopSampleProducts
        .filter(p => p.slug !== fallbackProduct.slug && p.category?.slug === fallbackProduct.category?.slug)
        .slice(0, 4);
      setRelatedProducts(fallbackRelated);
    } else {
      setProduct(null);
      setRelatedProducts([]);
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !product) return;
    setAddingToCart(true);
    await addToCart(product.id, quantity);
    setAddingToCart(false);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated || !product) return;
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product?.name,
        text: product?.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <ShopNav />
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className={`aspect-square rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'}`} />
            <div className="space-y-4">
              <div className={`h-8 w-3/4 rounded animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'}`} />
              <div className={`h-6 w-1/2 rounded animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'}`} />
              <div className={`h-32 w-full rounded animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'}`} />
            </div>
          </div>
        </div>
        <Footer variant="shop" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <ShopNav />
        <div className="container mx-auto px-4 lg:px-6 py-20 text-center">
          <Package className={`w-20 h-20 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Product Not Found
          </h1>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/shop/products"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                : 'bg-accent-blue text-white hover:bg-accent-blue/90'
            }`}
          >
            Browse Products
          </Link>
        </div>
        <Footer variant="shop" />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discount = product.comparePrice
    ? Math.round(((parseFloat(product.comparePrice) - parseFloat(product.price)) / parseFloat(product.comparePrice)) * 100)
    : 0;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead
        title={product.name}
        description={product.shortDescription || product.description}
        ogImage={product.thumbnail || product.images[0]}
        ogType="product"
      />
      <ShopNav />

      <div className="container mx-auto px-4 lg:px-6 py-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/shop/products')}
          className={`relative group overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
              : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </span>
          <div
            className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                : 'bg-gradient-to-r from-accent-blue to-accent-red'
            }`}
          />
        </motion.button>
      </div>

      <section className="container mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={product.images} productName={product.name} />

          <div className={`space-y-6 p-6 rounded-3xl ${elevatedCardClass}`}>
            <div>
              {product.category && (
                <Link
                  to={`/shop/category/${product.category.slug}`}
                  className={`inline-block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`}
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className={`text-3xl lg:text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {product.name}
              </h1>

              {product.totalReviews > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(parseFloat(product.averageRating))
                            ? 'text-yellow-400 fill-yellow-400'
                            : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {parseFloat(product.averageRating).toFixed(1)} ({product.totalReviews} reviews)
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4">
                <span
                  className={`text-4xl font-bold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`}
                >
                  ₹{parseFloat(product.price).toFixed(2)}
                </span>
                {product.comparePrice && (
                  <>
                    <span
                      className={`text-xl line-through ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      ₹{parseFloat(product.comparePrice).toFixed(2)}
                    </span>
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white">
                      -{discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {product.shortDescription || product.description}
            </p>

            <div className={`flex flex-wrap items-center gap-4 p-4 rounded-2xl ${elevatedCardClass}`}>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Licenses:
              </span>
              <div className={`flex items-center gap-2 border rounded-lg ${
                theme === 'dark' ? 'border-slate-600' : 'border-gray-300'
              }`}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`p-2 rounded-l-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-gray-200 hover:bg-slate-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className={`w-12 text-center font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={`p-2 rounded-r-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-gray-200 hover:bg-slate-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className={`text-sm flex items-center gap-1 ${
                theme === 'dark' ? 'text-electric-green' : 'text-green-600'
              }`}>
                <Zap className="w-4 h-4" />
                Instant Download
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className={`relative group overflow-hidden flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {addingToCart ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <ShoppingCart className="w-5 h-5" />
                    )}
                    {addingToCart ? 'Added!' : 'Add to Cart'}
                  </span>
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                        : 'bg-gradient-to-r from-accent-blue to-accent-red'
                    }`}
                  />
                </button>
              ) : (
                <Link
                  to="/shop/login"
                  className={`relative group overflow-hidden flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Login to Buy
                  </span>
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                        : 'bg-gradient-to-r from-accent-blue to-accent-red'
                    }`}
                  />
                </Link>
              )}

              {isAuthenticated && (
                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 rounded-xl border transition-all ${
                    inWishlist
                      ? 'bg-red-500 border-red-500 text-white'
                      : theme === 'dark'
                        ? 'border-slate-600 text-gray-300 hover:bg-slate-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              )}

              <button
                onClick={handleShare}
                className={`p-4 rounded-xl border transition-all ${
                  theme === 'dark'
                    ? 'border-slate-600 text-gray-300 hover:bg-slate-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`text-center p-4 rounded-2xl ${elevatedCardClass}`}>
                <Zap className={`w-6 h-6 mx-auto mb-2 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                }`} />
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Instant Access
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Download Now
                </p>
              </div>
              <div className={`text-center p-4 rounded-2xl ${elevatedCardClass}`}>
                <Shield className={`w-6 h-6 mx-auto mb-2 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                }`} />
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Secure Pay
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  100% Safe
                </p>
              </div>
              <div className={`text-center p-4 rounded-2xl ${elevatedCardClass}`}>
                <Download className={`w-6 h-6 mx-auto mb-2 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                }`} />
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Lifetime Access
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Forever
                </p>
              </div>
            </div>

            {product.sku && (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                SKU: {product.sku}
              </p>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 text-sm rounded-full ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-6 py-8">
        <div className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex gap-8">
            {(['description', 'reviews', 'license'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-lg font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? theme === 'dark'
                      ? 'border-electric-green text-electric-green'
                      : 'border-accent-blue text-accent-blue'
                    : theme === 'dark'
                      ? 'border-transparent text-gray-400 hover:text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab === 'license' ? 'License & Access' : tab}
                {tab === 'reviews' && product.totalReviews > 0 && ` (${product.totalReviews})`}
              </button>
            ))}
          </div>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {product.description}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className={`p-6 rounded-xl ${
                        theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                          theme === 'dark'
                            ? 'bg-electric-blue/20 text-electric-blue'
                            : 'bg-accent-blue/10 text-accent-blue'
                        }`}>
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {review.user?.name || 'Anonymous'}
                            </span>
                            {review.verified && (
                              <span className="text-xs text-green-500 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          {review.title && (
                            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {review.title}
                            </h4>
                          )}
                          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 rounded-xl ${
                  theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
                }`}>
                  <Star className={`w-12 h-12 mx-auto mb-3 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    No reviews yet. Be the first to review this product!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'license' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl ${elevatedCardClass}`}>
                <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Instant Access
                </h4>
                <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• Immediate download after purchase</li>
                  <li>• Access from your account dashboard anytime</li>
                  <li>• Lifetime access to your purchased products</li>
                  <li>• Download on unlimited devices for personal use</li>
                </ul>
              </div>
              <div className={`p-4 rounded-2xl ${elevatedCardClass}`}>
                <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  License Terms
                </h4>
                <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• Personal license included with purchase</li>
                  <li>• Commercial license available (check product details)</li>
                  <li>• No redistribution or resale permitted</li>
                  <li>• Contact support for extended licensing options</li>
                </ul>
              </div>
              <div className={`p-4 rounded-2xl ${elevatedCardClass}`}>
                <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Refund Policy
                </h4>
                <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• 14-day money-back guarantee</li>
                  <li>• Contact support for any issues</li>
                  <li>• Refunds processed within 3-5 business days</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className={`py-16 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
          <div className="container mx-auto px-4 lg:px-6">
            <h2
              className={`text-2xl font-bold mb-8 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Related{' '}
              <span
                className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}
              >
                Products
              </span>
            </h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        </section>
      )}

      <Footer variant="shop" />
    </div>
  );
}
