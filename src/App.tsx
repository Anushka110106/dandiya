import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Calendar, Clock, Users, Mail, Phone, Instagram, Facebook, Music, Sparkles, Star, Heart, Check, X, AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import CountdownTimer from './components/CountdownTimer';
import DandiyaTutorial from './components/DandiyaTutorial';
import EventSchedule from './components/EventSchedule';
import SocialBuzz from './components/SocialBuzz';
import CulturalExplorer from './components/CulturalExplorer';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tickets: 1
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');
    setDebugInfo(null);
    setIsPolling(false);
    setPollingAttempts(0);

    try {
      console.log('🚀 Starting UPI payment process...');
      setDebugInfo({ step: 'Calling process-payment function for UPI', timestamp: new Date().toISOString() });
      
      // Call Supabase Edge Function for UPI payment processing
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          tickets: formData.tickets,
          totalAmount: ticketPrice * formData.tickets
        }
      });

      console.log('📦 Process UPI payment response:', { data, error });
      setDebugInfo({ step: 'Process payment response received', data, error, timestamp: new Date().toISOString() });

      if (error) {
        throw new Error(error.message || 'Payment processing failed');
      }

      if (data.success) {
        console.log('✅ UPI payment link generated, redirecting user...');
        setDebugInfo({ step: 'UPI link generated, redirecting...', upiLink: data.upiLink, timestamp: new Date().toISOString() });
        
        // Store registration details
        setRegistrationId(data.registrationId);
        setTicketId(data.ticketId);
        
        // Redirect to UPI app
        window.location.href = data.upiLink;
        
        // Start polling for payment status after a short delay
        setTimeout(() => {
          startPaymentStatusPolling(data.registrationId);
        }, 2000);
        
        setIsProcessing(false);
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setDebugInfo({ step: 'Payment failed', error: err, timestamp: new Date().toISOString() });
      setIsProcessing(false);
    }
  };

  const startPaymentStatusPolling = (regId: string) => {
    console.log('🔄 Starting payment status polling...');
    setIsPolling(true);
    setPollingAttempts(0);
    
    const maxAttempts = 60; // Poll for 5 minutes (every 5 seconds)
    const pollInterval = 5000; // 5 seconds
    
    const pollPaymentStatus = async () => {
      try {
        setPollingAttempts(prev => prev + 1);
        console.log(`🔍 Polling attempt ${pollingAttempts + 1}/${maxAttempts}`);
        
        const { data, error } = await supabase.functions.invoke('check-upi-payment-status', {
          body: { registrationId: regId }
        });
        
        if (error) {
          console.error('❌ Error checking payment status:', error);
          return;
        }
        
        console.log('📊 Payment status check result:', data);
        setDebugInfo({ 
          step: 'Payment status check', 
          attempt: pollingAttempts + 1,
          status: data.paymentStatus,
          timestamp: new Date().toISOString() 
        });
        
        if (data.paymentStatus === 'completed') {
          // Payment successful
          console.log('🎉 Payment confirmed!');
          setIsPolling(false);
          setPaymentSuccess(true);
          setShowPayment(false);
          setIsRegistered(true);
          setTicketId(data.ticketId);
          
          // Send confirmation email
          try {
            await supabase.functions.invoke('send-confirmation-email', {
              body: { registration: data.registration }
            });
          } catch (emailError) {
            console.error('Email sending failed:', emailError);
          }
          
          return true; // Stop polling
        } else if (data.paymentStatus === 'failed') {
          // Payment failed
          console.log('❌ Payment failed');
          setIsPolling(false);
          setError('Payment failed. Please try again.');
          return true; // Stop polling
        }
        
        // Continue polling if status is still 'pending'
        if (pollingAttempts >= maxAttempts - 1) {
          console.log('⏰ Polling timeout reached');
          setIsPolling(false);
          setError('Payment status could not be confirmed automatically. Please contact support with your ticket ID: ' + ticketId);
          return true; // Stop polling
        }
        
        return false; // Continue polling
      } catch (err) {
        console.error('❌ Polling error:', err);
        return false; // Continue polling
      }
    };
    
    // Start immediate check, then set interval
    pollPaymentStatus().then(shouldStop => {
      if (!shouldStop) {
        const intervalId = setInterval(async () => {
          const stop = await pollPaymentStatus();
          if (stop) {
            clearInterval(intervalId);
          }
        }, pollInterval);
        
        // Cleanup interval on component unmount or when polling stops
        return () => clearInterval(intervalId);
      }
    });
  };

  const ticketPrice = 499;
  const totalAmount = ticketPrice * formData.tickets;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-yellow-500 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-bounce">
          <Star className="text-yellow-300 w-8 h-8" fill="currentColor" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse">
          <Sparkles className="text-gold w-6 h-6" fill="currentColor" />
        </div>
        <div className="absolute bottom-20 left-20 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="w-4 h-16 bg-gradient-to-b from-red-500 to-yellow-500 rounded-full transform rotate-12"></div>
        </div>
        <div className="absolute bottom-32 right-32 animate-spin" style={{ animationDuration: '4s' }}>
          <div className="w-4 h-16 bg-gradient-to-b from-orange-500 to-red-500 rounded-full transform -rotate-12"></div>
        </div>
        <div className="absolute top-1/2 left-10 animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="w-3 h-12 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full transform rotate-45"></div>
        </div>
        <div className="absolute top-1/3 right-10 animate-pulse" style={{ animationDelay: '2s' }}>
          <div className="w-3 h-12 bg-gradient-to-b from-red-400 to-pink-500 rounded-full transform -rotate-45"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-white font-bold text-xl">Navratri Dandiya Night 2025</div>
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Schedule', 'Tutorial', 'Venue', 'Culture', 'Social', 'Register'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="text-white hover:text-yellow-300 transition-colors duration-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Landing Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative">
        <div className="text-center z-10 px-4">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Navami Raas Leela
            </h1>
            <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent mb-4">
              Dandiya Event 2025
            </div>
            <div className="text-4xl mb-8">💃🔥</div>
          </div>
          
          <p className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            🌟🎉 Our Team Welcomes You to the Ultimate Dandiya Experience! 💃✨<br/>
            Namaste Dandiya Warriors! 🙌💥<br />
            Join us for the Maha-Bhanga of Navratri at Mukut Regency!
          </p>
          
          <button
            onClick={() => scrollToSection('register')}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
          >
            Register Now
          </button>
        </div>
        
        <div className="absolute bottom-5 center-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white w-8 h-8" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">About The Event</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4">🥁</div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">Beats</h3>
              <p className="text-white">Feel the rhythm that will shake the ground</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4">💃</div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">Dance</h3>
              <p className="text-white">Experience the energy of traditional Garba</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">Energy</h3>
              <p className="text-white">Lights that will awaken the entire city</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <p className="text-xl md:text-2xl text-white leading-relaxed">
              "This Navratri, we are creating a cultural blast full of energy, music, lights, and dance. 
              The beats will shake the ground, the lights will awaken the city, and our names will be remembered forever!"
            </p>
          </div>
        </div>
      </section>

      {/* Event Schedule Section */}
      <section id="schedule" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-12">Event Schedule</h2>
          <EventSchedule />
        </div>
      </section>

      {/* Dandiya Tutorial Section */}
      <section id="tutorial" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-12">Learn Dandiya</h2>
          <DandiyaTutorial />
        </div>
      </section>

      {/* Venue & Date Section */}
      <section id="venue" className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">Venue & Date</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <MapPin className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">Venue</h3>
              <p className="text-xl text-white mb-2">Mukut Regency 🏨</p>
              <p className="text-white opacity-80">(Tentative)</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <Calendar className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">Date & Time</h3>
              <p className="text-xl text-white mb-2">September 28, 2025</p>
              <p className="text-white opacity-80">6:00 PM onwards</p>
            </div>
          </div>

          <CountdownTimer />
        </div>
      </section>

      {/* Cultural Explorer Section */}
      <section id="culture" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-12">Cultural Explorer</h2>
          <CulturalExplorer />
        </div>
      </section>

      {/* Social Buzz Section */}
      <section id="social" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-12">Social Buzz</h2>
          <SocialBuzz />
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-12">Register Now</h2>
          
          {!isRegistered ? (
            <>
              {!showPayment ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <form onSubmit={handleRegistration} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white mb-2">Contact Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2">Number of Tickets</label>
                        <select
                          value={formData.tickets}
                          onChange={(e) => setFormData({...formData, tickets: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50"
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num} className="bg-gray-800">{num}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-400/20 rounded-lg p-4 border border-yellow-300/30">
                      <div className="flex justify-between text-white text-lg">
                        <span>Ticket Price (per person):</span>
                        <span>₹{ticketPrice}</span>
                      </div>
                      <div className="flex justify-between text-white text-lg mt-2">
                        <span>Quantity:</span>
                        <span>{formData.tickets}</span>
                      </div>
                      <hr className="border-white/30 my-2" />
                      <div className="flex justify-between text-yellow-300 text-xl font-bold">
                        <span>Total Amount:</span>
                        <span>₹{totalAmount}</span>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Proceed to Payment
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                  <h3 className="text-3xl font-bold text-white mb-6">Complete Payment</h3>
                  
                  {error && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-center text-red-400 mb-2">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Payment Error</span>
                      </div>
                      <p className="text-red-300">{error}</p>
                    </div>
                  )}
                  
                  <div className="bg-white/10 rounded-lg p-6 mb-6">
                    <div className="text-white text-lg mb-4">
                      <p><strong>Name:</strong> {formData.name}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Tickets:</strong> {formData.tickets}</p>
                      <p className="text-yellow-300 text-xl font-bold mt-4">
                        Total: ₹{totalAmount}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setShowPayment(false);
                        setError('');
                        setIsPolling(false);
                      }}
                      disabled={isProcessing || isPolling}
                      className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing || isPolling}
                      className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                    >
                      {isProcessing || isPolling ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {isProcessing ? 'Processing...' : `Checking Payment Status... (${pollingAttempts}/60)`}
                        </>
                      ) : (
                        'Pay with UPI'
                      )}
                    </button>
                  </div>
                  
                  {isPolling && (
                    <div className="mt-4 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                      <div className="flex items-center justify-center text-blue-300 mb-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-300 mr-2"></div>
                        <span className="font-semibold">Waiting for Payment Confirmation</span>
                      </div>
                      <p className="text-blue-200 text-sm text-center">
                        Complete your payment in the UPI app and return here. We'll automatically detect when your payment is successful.
                      </p>
                      <p className="text-blue-200 text-xs text-center mt-2">
                        Attempt {pollingAttempts}/60 • Checking every 5 seconds
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Debug Information */}
              {debugInfo && (
                <div className="mt-6 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold mb-2">Debug Info:</h4>
                  <pre className="text-blue-200 text-xs overflow-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="bg-green-500/20 backdrop-blur-md rounded-2xl p-8 border border-green-400/30 text-center">
              <Check className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">Registration Successful! 🎉</h3>
              <p className="text-xl text-white mb-6">
                Thank you for registering for Team Welcome – Dandiya Event 2025!
              </p>
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <p className="text-white mb-4">
                  <strong>Confirmation Email Sent To:</strong> {formData.email}
                </p>
                <div className="bg-yellow-400/20 rounded-lg p-4 border border-yellow-300/30">
                  <p className="text-yellow-300 font-bold text-lg mb-2">Your Ticket ID:</p>
                  <p className="text-white text-2xl font-mono bg-black/30 rounded px-4 py-2 inline-block">
                    {ticketId}
                  </p>
                </div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30 mb-6">
                <h4 className="text-blue-300 font-bold mb-2">Email Confirmation Details:</h4>
                <p className="text-white text-sm">
                  📧 <strong>Subject:</strong> "Dandiya Event 2025 – Registration Confirmed 🎉"<br />
                  📝 <strong>Content:</strong> Complete event details, ticket information, and instructions<br />
                  🎫 <strong>Includes:</strong> Your unique ticket ID and event guidelines
                </p>
              </div>
              <p className="text-white">
                Get ready for a cultural blast with music, dance, and joy! See you on the dance floor 💃🔥
              </p>
              
              {/* Manual confirmation option for testing */}
              <div className="mt-6 bg-orange-500/20 rounded-lg p-4 border border-orange-400/30">
                <h4 className="text-orange-300 font-bold mb-2">For Testing/Manual Confirmation:</h4>
                <button
                  onClick={async () => {
                    const { data } = await supabase.functions.invoke('manual-payment-confirm', {
                      body: { registrationId, ticketId }
                    });
                    if (data.success) window.location.reload();
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm"
                >
                  Manually Confirm Payment (Testing Only)
                </button>
              </div>
              <p className="text-white mt-4">
                Get ready for a cultural blast with music, dance, and joy! See you on the dance floor 💃🔥
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-12">Event Highlights</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🎭", title: "Cultural Performances" },
              { emoji: "🎵", title: "Live Music" },
              { emoji: "🏆", title: "Dance Competitions" },
              { emoji: "🍽️", title: "Traditional Food" },
              { emoji: "📸", title: "Photo Booth" },
              { emoji: "🎁", title: "Prizes & Gifts" },
              { emoji: "🌟", title: "Celebrity Guests" },
              { emoji: "🎪", title: "Cultural Exhibits" }
            ].map((item, index) => (
              <div key={index} className="aspect-square bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex flex-col items-center justify-center border border-white/20 hover:scale-105 transition-transform duration-300 p-4">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <p className="text-white text-center text-sm font-semibold">{item.title}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-white text-xl">More photos from previous events coming soon!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Team Welcome</h3>
              <p className="text-white/80">Creating unforgettable cultural experiences since years!</p>
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Contact Info</h4>
              <div className="space-y-2 text-white/80">
                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>events@teamwelcome.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>+91 9876543210</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Follow Us</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                <Instagram className="w-8 h-8 text-white/80 hover:text-yellow-300 cursor-pointer transition-colors duration-300" />
                <Facebook className="w-8 h-8 text-white/80 hover:text-yellow-300 cursor-pointer transition-colors duration-300" />
              </div>
            </div>
          </div>
          
          <hr className="border-white/20 my-8" />
          <div className="text-center text-white/60">
            <p>&copy; 2025 Team Welcome. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Success/Payment Animation */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
            <div className="animate-bounce mb-4">
              <Check className="w-16 h-16 text-green-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Processing confirmation email...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {(isProcessing || isPolling) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {isProcessing ? 'Processing Payment' : 'Waiting for Payment'}
            </h3>
            <p className="text-gray-600">
              {isProcessing 
                ? 'Please wait while we process your registration...' 
                : `Complete your payment in the UPI app. Checking status... (${pollingAttempts}/60)`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
