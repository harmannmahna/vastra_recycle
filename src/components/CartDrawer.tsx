import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, clearCart } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const platformFee = Math.round(subtotal * 0.10); // 10% seller commission transparent note
  const shippingFee = subtotal > 1500 ? 0 : 99;
  const total = subtotal + shippingFee;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-forest-900/50 backdrop-blur-xs animate-fadeIn">
        <div className="bg-cream-100 w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-cream-300 relative">
          
          {/* Header */}
          <div className="p-6 border-b border-cream-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-forest-700" />
              <h2 className="font-poppins font-bold text-lg text-forest-900">Your Sustainable Cart</h2>
              <span className="bg-forest-700 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {cart.length}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 hover:bg-cream-200 text-forest-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {cart.length > 0 ? (
              cart.map(({ item, quantity }) => (
                <div 
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-cream-300 flex gap-3.5 items-center"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover bg-cream-200"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-forest-900/60 flex justify-between">
                      <span>{item.brand || 'Pre-loved'}</span>
                      <span>Size: {item.size}</span>
                    </div>
                    <h3 className="font-semibold text-xs text-forest-900 truncate mt-0.5">
                      {item.title}
                    </h3>
                    <div className="font-poppins font-bold text-sm text-forest-900 mt-1">
                      ₹{item.price.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-forest-900/40 hover:text-terracotta-500 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-forest-900/20 mx-auto" />
                <h3 className="font-poppins font-bold text-base text-forest-900">Your cart is empty</h3>
                <p className="text-xs text-forest-900/60">Explore our pre-loved marketplace to add clothing items.</p>
              </div>
            )}
          </div>

          {/* Cart Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-cream-300 space-y-4">
              <div className="space-y-2 text-xs text-forest-900">
                <div className="flex justify-between">
                  <span className="text-forest-900/70">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-900/70">Eco Delivery Shipping</span>
                  <span className="font-semibold">{shippingFee === 0 ? <span className="text-earthteal-600 font-bold">FREE</span> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-[11px] text-forest-900/50 pt-1 border-t border-cream-200">
                  <span>Platform Commission (10%)</span>
                  <span>Included (₹{platformFee})</span>
                </div>
                <div className="flex justify-between text-base font-poppins font-bold text-forest-900 pt-2 border-t border-cream-300">
                  <span>Total Payable</span>
                  <span className="text-forest-700">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[10px] text-earthteal-600 bg-earthteal-50 p-2.5 rounded-xl border border-earthteal-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Buyer Protection & Quality Guarantee</span>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-cream-100 font-poppins font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      )}
    </>
  );
};
