import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useState, useEffect, useRef } from "react";

const NavBar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const mobileButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
                mobileButtonRef.current && !mobileButtonRef.current.contains(event.target)) {
                setShowMobileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        setShowMobileMenu(false);
    };

    const handleMobileMenuToggle = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    const closeMobileMenu = () => {
        setShowMobileMenu(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 shadow-lg bg-bg-navbar border-b border-border-light">
            <div className="container mx-auto flex justify-between items-center">
                <Link className="flex items-center space-x-2" to="/home">
                    <div className="w-8 h-8 rounded-lg bg-meow-pink flex items-center justify-center">
                        <span className="text-white font-bold text-sm">MF</span>
                    </div>
                    <h1 className="text-xl font-semibold text-text-primary tracking-tight">MeowFeeder</h1>
                </Link>
                
                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link 
                                to="/dashboard"
                                className="px-4 py-2 text-sm font-medium rounded-lg text-text-primary hover:bg-meow-pink hover:bg-opacity-50 transition-all duration-200"
                            >
                                Dashboard
                            </Link>
                            <Link 
                                to="/mobile-app"
                                className="px-4 py-2 text-sm font-medium rounded-lg text-text-primary hover:bg-meow-mint hover:bg-opacity-50 transition-all duration-200 flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>Mobile App</span>
                            </Link>
                            <Link 
                                to="/add-device"
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-meow-pink text-white hover:bg-meow-pink-hover transition-all duration-200"
                            >
                                Add Device
                            </Link>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg text-text-primary hover:bg-meow-pink hover:bg-opacity-50 transition-all duration-200"
                                >
                                    <div className="w-6 h-6 rounded-full bg-meow-pink flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span>{user.username}</span>
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-light z-50">
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-xs text-text-muted border-b border-border-light">
                                                Signed in as <strong>{user.username}</strong>
                                            </div>
                                            <Link
                                                to="/settings"
                                                className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex space-x-2">
                            <Link 
                                to="/mobile-app"
                                className="px-4 py-2 text-sm font-medium rounded-lg text-text-primary hover:bg-meow-mint hover:bg-opacity-50 transition-all duration-200 flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>Get App</span>
                            </Link>
                            <Link to="/sign-in"
                            className="px-4 py-2 text-sm font-medium rounded-lg border border-meow-pink text-meow-pink hover:bg-meow-pink hover:text-white transition-all duration-200">
                                Sign In
                            </Link>
                            <Link to="/sign-up"
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-meow-pink text-white hover:bg-meow-pink-hover transition-all duration-200">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <button
                        ref={mobileButtonRef}
                        onClick={handleMobileMenuToggle}
                        className="p-2 rounded-lg text-text-primary hover:bg-meow-pink hover:bg-opacity-50 transition-all duration-200"
                        aria-label={showMobileMenu ? "Close menu" : "Open menu"}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showMobileMenu ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {showMobileMenu && (
                <div ref={mobileMenuRef} className="lg:hidden absolute top-full left-0 right-0 bg-bg-navbar border-b border-border-light shadow-lg">
                    <div className="px-6 py-4 space-y-3">
                        {user ? (
                            <>
                                <Link 
                                    to="/dashboard"
                                    className="block px-4 py-2 text-sm font-medium rounded-lg text-text-primary hover:bg-meow-pink hover:bg-opacity-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    to="/mobile-app"
                                    className="block px-4 py-2 text-sm font-medium rounded-lg text-text-primary hover:bg-meow-mint hover:bg-opacity-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    📱 Mobile App
                                </Link>
                                <Link 
                                    to="/add-device"
                                    className="block px-4 py-2 text-sm font-medium rounded-lg bg-meow-pink text-white hover:bg-meow-pink-hover transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Add Device
                                </Link>
                                <Link
                                    to="/settings"
                                    className="block px-4 py-2 text-sm font-medium rounded-lg text-text-primary hover:bg-gray-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Settings
                                </Link>
                                <div className="border-t border-border-light pt-3">
                                    <div className="px-4 py-2 text-xs text-text-muted">
                                        Signed in as <strong>{user.username}</strong>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/mobile-app"
                                    className="block px-4 py-2 text-sm font-medium rounded-lg text-text-primary hover:bg-meow-mint hover:bg-opacity-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    📱 Get App
                                </Link>
                                <Link 
                                    to="/sign-in"
                                    className="block px-4 py-2 text-sm font-medium rounded-lg border border-meow-pink text-meow-pink hover:bg-meow-pink hover:text-white transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/sign-up"
                                    className="block px-4 py-2 text-sm font-medium rounded-lg bg-meow-pink text-white hover:bg-meow-pink-hover transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
