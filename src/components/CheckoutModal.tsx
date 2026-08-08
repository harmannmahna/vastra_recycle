import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { X, CreditCard, Smartphone, QrCode, Truck, ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Address } from '../types';

export const CheckoutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { cart, completeCheckout, currentUser } = useApp();
  const { showToast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr' | 'card' | 'cod'>('qr');
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
  const platformFee = Math.round(subtotal * 0.05);
  const shippingFee = subtotal > 1500 ? 0 : 99;
  const total = subtotal + platformFee + shippingFee;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=sanyam0902@okhdfcbank&pn=Sanyam%20Masta&am=${total}&cu=INR`;

  const handlePayment = () => {
    setErrorMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      const pMethod = paymentMethod === 'qr' ? 'upi' : paymentMethod;
      const res = completeCheckout(pMethod, address);
      setIsProcessing(false);
      if (res.success) {
        onClose();
        showToast('Order Placed Successfully! 🎉', 'Seller will dispatch your item within 24 hours in Delhi NCR.', 'success');
      } else {
        setErrorMessage(res.message || 'Checkout failed.');
        showToast('Checkout Failed', res.message || 'Payment processing failed.', 'error');
      }
    }, 1200);
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
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('qr')}
              className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'qr'
                  ? 'bg-forest-900 text-cream-100 border-forest-900 shadow-sm'
                  : 'bg-white text-forest-900 border-cream-300 hover:border-forest-700'
              }`}
            >
              <QrCode className="w-5 h-5 text-terracotta-500" />
              <span className="font-bold text-[11px]">UPI QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-forest-900 text-cream-100 border-forest-900 shadow-sm'
                  : 'bg-white text-forest-900 border-cream-300 hover:border-forest-700'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="font-bold text-[11px]">UPI ID</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'card'
                  ? 'bg-forest-900 text-cream-100 border-forest-900 shadow-sm'
                  : 'bg-white text-forest-900 border-cream-300 hover:border-forest-700'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-bold text-[11px]">Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'cod'
                  ? 'bg-forest-900 text-cream-100 border-forest-900 shadow-sm'
                  : 'bg-white text-forest-900 border-cream-300 hover:border-forest-700'
              }`}
            >
              <Truck className="w-5 h-5" />
              <span className="font-bold text-[11px]">COD</span>
            </button>
          </div>

          {/* QR Code Option */}
          {paymentMethod === 'qr' && (
            <div className="p-4 bg-white rounded-2xl border border-cream-300 flex flex-col items-center space-y-2 text-center animate-fadeIn">
              <span className="text-xs font-bold text-forest-900">Scan QR Code with GPay / PhonePe / Paytm</span>
              <div className="p-3 bg-white border border-forest-700/20 rounded-2xl shadow-md flex flex-col items-center space-y-2">
                <img src={qrUrl} alt="Sanyam Masta UPI QR Code" className="w-44 h-44 object-contain" />
                <div className="text-center">
                  <div className="font-bold text-xs text-forest-900">Sanyam Masta</div>
                  <div className="text-[11px] text-forest-900/70 font-mono font-semibold">UPI ID: sanyam0902@okhdfcbank</div>
                </div>
              </div>
            </div>
          )}

          {/* UPI ID Option */}
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
        <div className="bg-white p-4 rounded-2xl border border-cream-300 space-y-1.5 text-xs">
          <div className="flex justify-between text-forest-900/70">
            <span>Items Subtotal:</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-forest-900/70">
            <span>VastraChakra Platform Fee (5%):</span>
            <span>₹{platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-forest-900/70">
            <span>Delivery Fee:</span>
            <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
          </div>
          <div className="flex justify-between font-bold text-forest-900 text-sm pt-2 border-t border-cream-200">
            <span>Total Payable Amount</span>
            <span className="text-terracotta-600 font-extrabold text-lg">₹{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 rounded-full bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white font-poppins font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span>Verifying Payment...</span>
          ) : (
            <>
              <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain inline" />
              <span>Confirm & Pay ₹{total.toLocaleString()}</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};


