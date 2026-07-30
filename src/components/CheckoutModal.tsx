import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, Smartphone, Truck, ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Address } from '../types';

export const CheckoutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { cart, completeCheckout, currentUser } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [address, setAddress] = useState<Address>(currentUser?.address || {
    id: 'addr_default',
    userId: currentUser?.id || 'usr_temp',
    line1: 'C-14, Hauz Khas Enclave',
    city: 'New Delhi',
    state: 'Delhi NCR',
    pincode: '110016',
    isDefault: true
  });

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const shippingFee = subtotal > 1500 ? 0 : 99;
  const total = subtotal + shippingFee;

  const handlePayment = () => {
    setErrorMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      const res = completeCheckout(paymentMethod, address);
      setIsProcessing(false);
      if (res.success) {
        onClose();
        alert('Order Placed Successfully! Seller will dispatch your item within 24 hours in Delhi NCR.');
      } else {
        setErrorMessage(res.message || 'Checkout failed.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream-100 border border-cream-300 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-300 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-forest-700 text-white rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-poppins font-bold text-xl text-forest-900">Secure Order Checkout</h2>
              <p className="text-xs text-forest-900/60 font-medium">VastraChakra Delivery (Delhi NCR Only)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-cream-200 text-forest-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Address Selection */}
        <div className="space-y-3 text-xs sm:text-sm">
          <h3 className="font-semibold text-forest-900">1. Delivery Address (Delhi NCR Only)</h3>
          <div className="bg-white p-4 rounded-2xl border border-cream-300 space-y-2">
            <div className="flex justify-between font-bold text-forest-900">
              <span>{currentUser?.name || 'Customer'}</span>
              <span className="text-[10px] bg-forest-700/10 text-forest-700 px-2 py-0.5 rounded-full font-bold">Delhi NCR</span>
            </div>
            <input
              type="text"
              placeholder="Flat, House no., Building, Street"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className="w-full px-3 py-1.5 bg-cream-100 border rounded-lg text-xs"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="City (e.g. New Delhi)"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="px-3 py-1.5 bg-cream-100 border rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="State (e.g. Delhi NCR)"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="px-3 py-1.5 bg-cream-100 border rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Pincode (e.g. 110016)"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                className="px-3 py-1.5 bg-cream-100 border rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3 text-xs sm:text-sm">
          <h3 className="font-semibold text-forest-900">2. Select Payment Method</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-forest-900 text-cream-100 border-forest-900 shadow-sm'
                  : 'bg-white text-forest-900 border-cream-300 hover:border-forest-700'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="font-bold text-xs">UPI / GPay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'card'
                  ? 'bg-forest-900 text-cream-100 border-forest-900 shadow-sm'
                  : 'bg-white text-forest-900 border-cream-300 hover:border-forest-700'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-bold text-xs">Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'cod'
                  ? 'bg-forest-900 text-cream-100 border-forest-900 shadow-sm'
                  : 'bg-white text-forest-900 border-cream-300 hover:border-forest-700'
              }`}
            >
              <Truck className="w-5 h-5" />
              <span className="font-bold text-xs">Cash on Delivery</span>
            </button>
          </div>

          {paymentMethod === 'upi' && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Enter VPA / UPI ID (e.g. mobile@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl text-xs font-mono"
              />
            </div>
          )}
        </div>

        {/* Amount Summary */}
        <div className="bg-white p-4 rounded-2xl border border-cream-300 space-y-2 text-xs">
          <div className="flex justify-between font-bold text-forest-900 text-sm">
            <span>Total Payable Amount</span>
            <span className="text-forest-700">₹{total.toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-forest-900/60 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-earthteal-500" />
            <span>Includes 10% platform commission & seller insurance</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 rounded-full bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white font-poppins font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span>Processing Payment...</span>
          ) : (
            <>
              <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain inline" />
              <span>Pay ₹{total.toLocaleString()} & Complete Order</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};

