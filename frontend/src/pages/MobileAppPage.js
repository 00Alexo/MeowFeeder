import React from 'react';
import { Link } from 'react-router-dom';

const MobileAppPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-meow-pink/10 via-meow-beige/20 to-meow-mint/10 py-12 pt-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/home" className="inline-flex items-center text-meow-pink hover:text-meow-pink-hover mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-text-primary mb-4">Get the MeowFeeder App</h1>
          <p className="text-text-secondary text-lg">Control your pet's feeding schedule on the go</p>
        </div>

        {/* App Not Available Warning */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-3">App Currently Unavailable</h2>
          <p className="text-red-600 text-lg mb-4">
            The MeowFeeder mobile application is currently not working and is unavailable for use.
          </p>
          <div className="bg-red-100 rounded-lg p-4 mb-4">
            <p className="text-red-700 font-medium">
              ⚠️ App is availabale for download, but not functional at the moment.
            </p>
          </div>
        </div>

        {/* App Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">Mobile App Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-meow-pink mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-secondary">Schedule feeding times remotely</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-meow-pink mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-secondary">Monitor feeding history</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-meow-pink mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-secondary">Real-time device status</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-meow-pink mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-secondary">Multiple device management</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-meow-pink to-meow-mint rounded-3xl p-8 text-white">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">MeowFeeder</h3>
                <p className="text-sm opacity-90">Smart Pet Feeding</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-text-primary mb-6">Download Now</h3>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">            
            <a 
              href="https://expo.dev/artifacts/eas/76cUd9rbhjwWo4kqRcX7Mf.apk" 
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Get it for</div>
                <div className="text-lg font-semibold">Android</div>
              </div>
            </a>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-meow-beige/20 border border-meow-beige rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Under development!</h3>
          <p className="text-text-secondary">
            The MeowFeeder mobile app is currently in development. 
            <br className="hidden sm:block" />
            Please make sure to report any bugs to help the well-being of our app.
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center bg-meow-pink text-white px-6 py-3 rounded-xl hover:bg-meow-pink-hover transition-colors mt-4"
          >
            Get Notified
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileAppPage;
