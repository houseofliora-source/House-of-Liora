'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Gift, CreditCard, Wallet, Truck, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type PaymentMethod = 'cod' | 'bkash' | 'nagad'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const router = useRouter()
  
  // Local state for hydration sync
  const [mounted, setMounted] = useState(false)

  // Gift State
  const [isGift, setIsGift] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')

  // Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [trxId, setTrxId] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  })

  // Modal State
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real app, send data to the backend here.
    // For now, we simulate a successful order.
    
    setShowSuccess(true)
    clearCart()
  }

  // Prevent hydration mismatch on initial render
  if (!mounted) {
    return <div className="min-h-screen bg-[#FAF6F0]" />
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-sans selection:bg-[#B33939] selection:text-white">
      
      {/* HEADER */}
      <header className="px-6 py-8 border-b border-[#9C8D7B]/20 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-[#2D251F] hover:text-[#B33939] transition-colors font-semibold tracking-wide uppercase text-xs">
          <ChevronLeft className="w-4 h-4 mr-1" /> Return to Shop
        </Link>
        <h1 className="font-serif text-2xl md:text-3xl text-[#2D251F] tracking-wide text-center">
          House of Liora
        </h1>
        <div className="w-[120px] hidden md:block"></div> {/* Spacer for center alignment */}
      </header>

      {/* MAIN CHECKOUT SPLIT SCREEN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {cart.length === 0 && !showSuccess ? (
          <div className="text-center py-32">
            <h2 className="font-serif text-3xl text-[#2D251F] mb-4">Your cart is empty</h2>
            <p className="text-[#9C8D7B] mb-8">Discover our handcrafted luxury collection.</p>
            <Link 
              href="/" 
              className="px-8 py-4 bg-[#2D251F] text-[#FAF6F0] text-sm uppercase tracking-widest hover:bg-[#B33939] transition-colors duration-300 inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* LEFT COLUMN: ORDER SUMMARY & GIFT */}
            <div className="w-full lg:w-5/12 order-2 lg:order-1">
              <h2 className="font-serif text-2xl text-[#2D251F] mb-8 pb-4 border-b border-[#9C8D7B]/30">Order Summary</h2>
              
              <div className="space-y-6 mb-8">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex gap-4 group">
                    <div className="relative w-24 h-24 bg-[#EAE2D6] flex-shrink-0 overflow-hidden">
                      {item.product.images?.[0] && (
                        <Image
                          src={urlFor(item.product.images[0]).url()}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center flex-grow">
                      <h3 className="font-serif text-lg text-[#2D251F]">{item.product.name}</h3>
                      <p className="text-sm text-[#9C8D7B] uppercase tracking-wider mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex flex-col justify-center text-right">
                      <p className="text-[#2D251F] font-semibold">৳{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal / Total */}
              <div className="border-t border-[#9C8D7B]/30 pt-6 space-y-4">
                <div className="flex justify-between text-[#9C8D7B]">
                  <span>Subtotal</span>
                  <span>৳{cartTotal}</span>
                </div>
                <div className="flex justify-between text-[#9C8D7B]">
                  <span>Standard Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between text-xl font-serif text-[#2D251F] pt-4 border-t border-[#9C8D7B]/10">
                  <span>Total</span>
                  <span>৳{cartTotal}</span>
                </div>
              </div>

              {/* GIFT OPTIONS */}
              <div className="mt-12 bg-[#EAE2D6]/30 p-6 border border-[#9C8D7B]/20">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 border border-[#9C8D7B] rounded-sm group-hover:border-[#B33939] transition-colors">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                    />
                    <div className="absolute inset-0 bg-[#B33939] scale-0 peer-checked:scale-100 transition-transform duration-200 ease-out" />
                    <CheckCircle className="w-3 h-3 text-[#FAF6F0] z-10 opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                  </div>
                  <span className="flex items-center gap-2 text-[#2D251F] font-medium tracking-wide">
                    <Gift className="w-4 h-4 text-[#B33939]" />
                    Is this a gift for a loved one?
                  </span>
                </label>

                <div 
                  className={`grid transition-all duration-500 ease-in-out ${isGift ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs text-[#9C8D7B] mb-3 leading-relaxed">
                      Write a personalized message. We will print it on a luxurious textured card and include it with your package.
                    </p>
                    <textarea 
                      rows={4}
                      placeholder="e.g. Happy Anniversary, My Love! — John"
                      className="w-full bg-transparent border border-[#9C8D7B]/50 p-3 text-sm text-[#2D251F] placeholder:text-[#9C8D7B]/60 focus:outline-none focus:border-[#B33939] focus:ring-1 focus:ring-[#B33939] transition-all resize-none"
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: SHIPPING & PAYMENT */}
            <div className="w-full lg:w-7/12 order-1 lg:order-2">
              <form onSubmit={handlePlaceOrder} className="bg-white p-8 shadow-sm border border-[#9C8D7B]/10">
                
                <h2 className="font-serif text-2xl text-[#2D251F] mb-6">Shipping Details</h2>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#9C8D7B] mb-2">Full Name *</label>
                      <input 
                        required
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-[#FAF6F0] border-b border-[#9C8D7B]/30 px-3 py-3 text-[#2D251F] focus:outline-none focus:border-[#B33939] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#9C8D7B] mb-2">Phone Number *</label>
                      <input 
                        required
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#FAF6F0] border-b border-[#9C8D7B]/30 px-3 py-3 text-[#2D251F] focus:outline-none focus:border-[#B33939] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#9C8D7B] mb-2">Complete Delivery Address *</label>
                    <input 
                      required
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF6F0] border-b border-[#9C8D7B]/30 px-3 py-3 text-[#2D251F] focus:outline-none focus:border-[#B33939] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#9C8D7B] mb-2">City *</label>
                      <input 
                        required
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-[#FAF6F0] border-b border-[#9C8D7B]/30 px-3 py-3 text-[#2D251F] focus:outline-none focus:border-[#B33939] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#9C8D7B] mb-2">Delivery Notes (Optional)</label>
                      <input 
                        type="text" 
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full bg-[#FAF6F0] border-b border-[#9C8D7B]/30 px-3 py-3 text-[#2D251F] focus:outline-none focus:border-[#B33939] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <h2 className="font-serif text-2xl text-[#2D251F] mt-12 mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* COD */}
                  <label 
                    className={`block border p-4 cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'cod' ? 'border-[#B33939] bg-[#FAF6F0]' : 'border-[#9C8D7B]/30 hover:border-[#9C8D7B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        className="accent-[#B33939] w-4 h-4"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <Truck className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#B33939]' : 'text-[#9C8D7B]'}`} />
                      <span className={`font-medium ${paymentMethod === 'cod' ? 'text-[#B33939]' : 'text-[#2D251F]'}`}>
                        Cash on Delivery
                      </span>
                    </div>
                    {paymentMethod === 'cod' && (
                      <p className="mt-3 text-sm text-[#9C8D7B] ml-7">
                        Pay with cash upon delivery. Standard shipping charges will apply.
                      </p>
                    )}
                  </label>

                  {/* bKash */}
                  <label 
                    className={`block border p-4 cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'bkash' ? 'border-[#B33939] bg-[#FAF6F0]' : 'border-[#9C8D7B]/30 hover:border-[#9C8D7B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="bkash" 
                        className="accent-[#B33939] w-4 h-4"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                      />
                      <Wallet className={`w-5 h-5 ${paymentMethod === 'bkash' ? 'text-[#B33939]' : 'text-[#9C8D7B]'}`} />
                      <span className={`font-medium ${paymentMethod === 'bkash' ? 'text-[#B33939]' : 'text-[#2D251F]'}`}>
                        bKash Manual Payment
                      </span>
                    </div>
                    
                    <div className={`grid transition-all duration-500 ease-in-out ${paymentMethod === 'bkash' ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden ml-7">
                        <div className="bg-white p-4 border border-[#9C8D7B]/20 text-sm text-[#2D251F] leading-relaxed mb-4">
                          <p>1. Go to your bKash Menu or App</p>
                          <p>2. Select <strong>Send Money</strong></p>
                          <p>3. Enter number: <strong className="text-[#B33939] tracking-wider">017XXXXXXXX</strong></p>
                          <p>4. Enter Amount: <strong>৳{cartTotal}</strong></p>
                          <p>5. Use your phone number as Reference</p>
                        </div>
                        <label className="block text-xs uppercase tracking-widest text-[#9C8D7B] mb-2">bKash Transaction ID (TrxID) *</label>
                        <input 
                          required={paymentMethod === 'bkash'}
                          type="text"
                          placeholder="e.g. 9F8G7H6J"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          className="w-full bg-transparent border-b border-[#9C8D7B]/50 px-0 py-2 text-[#2D251F] focus:outline-none focus:border-[#B33939] transition-colors"
                        />
                      </div>
                    </div>
                  </label>

                  {/* Nagad */}
                  <label 
                    className={`block border p-4 cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'nagad' ? 'border-[#B33939] bg-[#FAF6F0]' : 'border-[#9C8D7B]/30 hover:border-[#9C8D7B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="nagad" 
                        className="accent-[#B33939] w-4 h-4"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                      />
                      <CreditCard className={`w-5 h-5 ${paymentMethod === 'nagad' ? 'text-[#B33939]' : 'text-[#9C8D7B]'}`} />
                      <span className={`font-medium ${paymentMethod === 'nagad' ? 'text-[#B33939]' : 'text-[#2D251F]'}`}>
                        Nagad Manual Payment
                      </span>
                    </div>
                    
                    <div className={`grid transition-all duration-500 ease-in-out ${paymentMethod === 'nagad' ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden ml-7">
                        <div className="bg-white p-4 border border-[#9C8D7B]/20 text-sm text-[#2D251F] leading-relaxed mb-4">
                          <p>1. Go to your Nagad Menu or App</p>
                          <p>2. Select <strong>Send Money</strong></p>
                          <p>3. Enter number: <strong className="text-[#B33939] tracking-wider">017XXXXXXXX</strong></p>
                          <p>4. Enter Amount: <strong>৳{cartTotal}</strong></p>
                          <p>5. Use your phone number as Reference</p>
                        </div>
                        <label className="block text-xs uppercase tracking-widest text-[#9C8D7B] mb-2">Nagad Transaction ID (TrxID) *</label>
                        <input 
                          required={paymentMethod === 'nagad'}
                          type="text"
                          placeholder="e.g. 7N6M5B4V"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          className="w-full bg-transparent border-b border-[#9C8D7B]/50 px-0 py-2 text-[#2D251F] focus:outline-none focus:border-[#B33939] transition-colors"
                        />
                      </div>
                    </div>
                  </label>

                </div>

                <button 
                  type="submit"
                  className="w-full mt-10 px-8 py-5 bg-[#2D251F] text-[#FAF6F0] font-medium uppercase tracking-[0.2em] hover:bg-[#B33939] transition-all duration-500 flex items-center justify-center gap-2 group"
                >
                  Place Order <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </button>
                <p className="text-center text-xs text-[#9C8D7B] mt-4">
                  By placing your order, you agree to our Terms & Conditions.
                </p>
              </form>
            </div>

          </div>
        )}
      </main>

      {/* SUCCESS MODAL */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
          showSuccess ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div 
          className="absolute inset-0 bg-[#2D251F]/60 backdrop-blur-sm"
          onClick={() => {
            setShowSuccess(false)
            router.push('/')
          }}
        />
        
        <div className={`relative w-full max-w-lg bg-[#FAF6F0] p-10 md:p-14 text-center border border-[#9C8D7B]/20 shadow-2xl transition-all duration-700 delay-100 ${
          showSuccess ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-95 opacity-0'
        }`}>
          <div className="w-16 h-16 mx-auto bg-[#2D251F] rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-[#FAF6F0]" />
          </div>
          
          <h2 className="font-serif text-3xl text-[#2D251F] mb-4">Thank You!</h2>
          
          <p className="text-[#9C8D7B] leading-relaxed mb-10">
            Your premium order has been successfully placed. We will contact you shortly to confirm delivery details.
          </p>
          
          <button 
            onClick={() => {
              setShowSuccess(false)
              router.push('/')
            }}
            className="w-full px-8 py-4 bg-transparent border border-[#2D251F] text-[#2D251F] text-sm uppercase tracking-[0.2em] hover:bg-[#2D251F] hover:text-[#FAF6F0] transition-colors duration-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>

    </div>
  )
}
