import { Link } from 'react-router-dom';
import { useState } from 'react';
import MeowInput from '../components/MeowInput';
import hungryCat from '../assets/hungryCat.png'
import Google from '../assets/google.png';
import Apple from '../assets/apple.png';
import { useSignIn } from "../hooks/useSignIn";
import { useAuthContext } from '../hooks/useAuthContext.js';
import NotFound from '../components/NotFound.js';

const SignIn = () => {
    const { user, isAuthReady } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signin, error, isLoading, errorFields } = useSignIn();

    const getFieldError = (fieldName) => {
        if (!errorFields) return null;
        const errorField = errorFields.find(err => err.field === fieldName);
        return errorField ? errorField.error : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signin(email, password);
    }

    if (!isAuthReady) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#EDF8FD]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5F5FDF]"></div>
            </div>
        );
    }

    if (user) {
        return <NotFound />;
    }

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 bg-bg-card flex p-8 flex-col">
                <div className='w-full h-full mt-8 flex justify-between flex-col'>
                    {/* <div className="text-right">
                        <span className="text-xs text-text-muted font-medium">MeowFeeder</span>
                    </div> */}

                    <div className='flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full px-2 sm:px-0'>
                        <div className='text-center mb-6 sm:mb-8'>
                            <h2 className='text-text-primary font-bold text-2xl sm:text-3xl mb-2'>
                                Welcome back
                            </h2>
                            <p className='text-text-secondary text-sm sm:text-base'>
                                Sign in to your MeowFeeder account
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-6">
                            <MeowInput
                                label="Email address"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                error={getFieldError("email")}
                            />

                            <MeowInput
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                error={getFieldError("password")}
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-meow-pink focus:ring-meow-pink border-border-input rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                                        Remember me
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="text-sm text-meow-pink hover:text-meow-pink-hover font-medium">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-meow-pink hover:bg-meow-pink-hover disabled:bg-meow-pink/50 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg text-sm sm:text-base"
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>

                            {error && !errorFields && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                                    <p className="text-red-600 text-xs sm:text-sm flex items-center space-x-2">
                                        <span>⚠️</span>
                                        <span>{error}</span>
                                    </p>
                                </div>
                            )}

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border-light"></div>
                                </div>
                                <div className="relative flex justify-center text-xs sm:text-sm">
                                    <span className="px-2 bg-bg-card text-text-muted">Or continue with</span>
                                </div>
                            </div>

                            <div className="mx-auto flex flex-row justify-center gap-8 sm:gap-16">
                                <img className="w-12 h-12 sm:w-16 sm:h-16 cursor-pointer hover:scale-105 transition-transform duration-200" src={Google} alt="Google" />
                                <img className="w-12 h-12 sm:w-16 sm:h-16 cursor-pointer hover:scale-105 transition-transform duration-200" src={Apple} alt="Apple" />
                            </div>
                        </form>
                    </div>
                    
                    <div className='flex flex-row space-x-1 sm:space-x-2 px-4 sm:px-0 mt-2 justify-center lg:justify-normal'>
                        <p className='text-text-secondary text-sm sm:text-base'>
                           Don't have an account? 
                        </p>
                        <Link to="/sign-up" className="text-meow-pink hover:text-meow-pink-hover font-semibold text-sm sm:text-base">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-1/2 relative overflow-hidden hidden md:flex max-h-screen">
                <div className="absolute inset-0 bg-gradient-to-br from-meow-pink/10 to-meow-mint/10 z-10"></div>
                <img 
                    src={hungryCat}
                    alt="MeowFeeder Cat" 
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
 
export default SignIn;