import { Link } from 'react-router-dom';
import { useState } from 'react';
import MeowInput from '../components/MeowInput';
import MeowFeeder from '../assets/signupcat.png'
import Google from '../assets/google.png';
import Apple from '../assets/apple.png';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', username, email, password, confirmPassword);
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 bg-bg-card flex p-8 flex-col">
                <div className='w-full h-full mt-8 flex justify-between flex-col'>
                    {/* <div className='flex-row space-x-2 md:flex hidden'>
                        <div className="w-8 h-8 rounded-lg bg-meow-pink flex items-center justify-center">
                            <span className="text-white font-bold text-sm">MF</span>
                        </div>
                        <h1 className="text-xl font-semibold text-text-primary tracking-tight">MeowFeeder</h1>
                    </div> */}

                    <div className='flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full px-2 sm:px-0'>
                        <div className='text-center mb-6 sm:mb-8'>
                            <h2 className='text-text-primary font-bold text-2xl sm:text-3xl mb-2'>
                                Sign up to MeowFeeder
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-6">
                            <MeowInput
                                label="Your name"
                                name="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                // error={errors.fullName}
                            />

                            <MeowInput
                                label="Email address"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                // error={}
                            />

                            <MeowInput
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Create a secure password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                // error={errors.password}
                            />

                            <MeowInput
                                label="Confirm Password"
                                name="Confirm Password"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                // error={errors.confirmPassword}
                            />
                            <button
                                type="submit"
                                className="w-full bg-meow-pink hover:bg-meow-pink-hover text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg text-sm sm:text-base"
                            >
                                Create Account
                            </button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border-light"></div>
                                </div>
                                <div className="relative flex justify-center text-xs sm:text-sm">
                                    <span className="px-2 bg-bg-card text-text-muted">Or continue with</span>
                                </div>
                            </div>

                            <div className="mx-auto flex flex-row justify-center gap-8 sm:gap-16">
                                <img className="w-12 h-12 sm:w-16 sm:h-16 cursor-pointer hover:scale-105 transition-transform duration-200" src={Google}></img>
                                <img className="w-12 h-12 sm:w-16 sm:h-16 cursor-pointer hover:scale-105 transition-transform duration-200" src={Apple}></img>
                            </div>
                        </form>
                    </div>
                    
                    <div className='flex flex-row space-x-1 sm:space-x-2 px-4 sm:px-0 mt-2 justify-center lg:justify-normal'>
                        <p className='text-text-secondary text-sm sm:text-base'>
                           Have an account? 
                        </p>
                        <Link to="/sign-in" className="text-meow-pink hover:text-meow-pink-hover font-semibold text-sm sm:text-base">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-1/2 relative overflow-hidden hidden md:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-meow-pink/10 to-meow-mint/10 z-10"></div>
                <img 
                    src={MeowFeeder}
                    alt="MeowFeeder Cat" 
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
 
export default SignUp;