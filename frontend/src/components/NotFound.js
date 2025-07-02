import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-bg-page pt-20">
            <div className="max-w-md w-full text-center">
                <div className="font-mono text-sm mb-8 text-text-tertiary">
                    <pre className="whitespace-pre">
{`     /\\_/\\  
    ( o.o ) 
     > ^ <  `}
                    </pre>
                </div>
                
                <h1 className="text-6xl font-bold mb-4 text-text-primary">404</h1>
                
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2 text-text-secondary">
                        Oops! This page went hunting
                    </h2>
                    <p className="mb-4 text-text-tertiary">
                        Looks like this page wandered off like a curious cat. 
                        Don't worry, your MeowFeeder is still working purr-fectly!
                    </p>
                </div>

                <div className="rounded-lg shadow-md p-6 mb-8 bg-bg-card">
                    <h3 className="text-lg font-semibold mb-2 text-text-secondary">
                        🐱 Cat Fact While You're Here:
                    </h3>
                    <p className="text-sm text-text-tertiary">
                        Cats spend 70% of their lives sleeping - that's 13-16 hours a day! 
                        Good thing your MeowFeeder keeps them fed even when they're napping.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link 
                        to="/" 
                        className="block w-full font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg text-white bg-meow-pink hover:bg-meow-pink-hover"
                    >
                        🏠 Back to Home
                    </Link>
                    
                    <Link 
                        to="/dashboard" 
                        className="block w-full font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg text-white bg-meow-mint hover:bg-meow-mint-hover"
                    >
                        📊 Go to Dashboard
                    </Link>
                    
                    <button 
                        onClick={() => window.history.back()} 
                        className="block w-full font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg text-text-secondary bg-meow-light-gray hover:bg-meow-gray-hover"
                    >
                        ← Go Back
                    </button>
                </div>

                <p className="text-sm mt-8 text-text-muted">
                    Keep your kitty happy with MeowFeeder! 🐾
                </p>
            </div>
        </div>
    );
}
 
export default NotFound;