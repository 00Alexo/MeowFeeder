import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePageMobile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-meow-pink/10 via-meow-beige/20 to-meow-mint/10 relative overflow-hidden pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-20 left-4 w-16 h-16 bg-meow-pink/20 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-8 w-12 h-12 bg-meow-mint/30 rounded-lg rotate-45 animate-pulse"></div>
        <div className="absolute top-60 left-8 w-8 h-8 bg-meow-pink/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-6 w-20 h-20 bg-meow-mint/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-60 left-6 w-14 h-14 bg-meow-beige/40 rounded-lg rotate-12 animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 py-4">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-meow-pink rounded-2xl mb-4">
            <span className="text-white font-bold text-xl">MF</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">MeowFeeder</h1>
          <p className="text-text-secondary text-sm">Smart pet feeding made simple</p>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-meow-pink to-meow-mint rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-meow-beige rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Never Miss a <span className="text-meow-pink">Feeding</span> Again
          </h2>
          <p className="text-text-secondary text-base leading-relaxed mb-8">
            Schedule, monitor, and control your pet's feeding schedule remotely with our smart IoT solution.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
              <div className="w-12 h-12 bg-meow-pink/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-meow-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary text-lg">Smart Scheduling</h3>
                <p className="text-text-secondary text-sm">Set custom feeding times and portions for your pet</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
              <div className="w-12 h-12 bg-meow-mint/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-meow-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary text-lg">Real-time Monitoring</h3>
                <p className="text-text-secondary text-sm">Track feeding history and portion sizes</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
              <div className="w-12 h-12 bg-meow-beige/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary text-lg">Remote Controller</h3>
                <p className="text-text-secondary text-sm">Control feeding remotely with physical remote</p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-text-primary text-center mb-6">How It Works</h3>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-meow-pink rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-text-primary">Set Up Your Device</h4>
                <p className="text-text-secondary text-sm">Connect your MeowFeeder to Wi-Fi and add it to your account</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-meow-mint rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-text-primary">Schedule Feeding Times</h4>
                <p className="text-text-secondary text-sm">Create custom feeding schedules through our mobile app</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-meow-beige/60 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-text-primary">Monitor & Control</h4>
                <p className="text-text-secondary text-sm">Track feeding history and control remotely anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-meow-pink to-meow-mint p-6 rounded-2xl mb-6">
            <h3 className="text-white text-xl font-bold mb-2">Ready to Get Started?</h3>
            <p className="text-white/90 text-sm mb-4">Join thousands of pet owners who trust MeowFeeder</p>
            <Link 
              to="/signup" 
              className="inline-flex items-center bg-white text-meow-pink px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Create Account
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Link 
              to="/sign-in" 
              className="text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-text-secondary text-xs">
            © 2025 MeowFeeder. Smart pet care solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePageMobile;
