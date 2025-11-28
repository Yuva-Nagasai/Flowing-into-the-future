import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl text-white">NanoShop</span>
            </Link>
            <p className="text-sm">
              Your one-stop shop for quality products at great prices.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white">All Products</Link></li>
              <li><Link to="/products?featured=true" className="hover:text-white">Featured</Link></li>
              <li><Link to="/products?category=electronics" className="hover:text-white">Electronics</Link></li>
              <li><Link to="/products?category=clothing" className="hover:text-white">Clothing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
              <li><Link to="/register" className="hover:text-white">Register</Link></li>
              <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@nanoshop.com" className="hover:text-white">Contact Us</a></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} NanoShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
