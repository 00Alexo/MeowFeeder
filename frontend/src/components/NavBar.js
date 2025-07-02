import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 shadow-lg bg-bg-navbar border-b border-border-light">
            <div className="container mx-auto flex justify-between items-center">
                <Link className="flex items-center space-x-2" to="/home">
                    <div className="w-8 h-8 rounded-lg bg-meow-pink flex items-center justify-center">
                        <span className="text-white font-bold text-sm">MF</span>
                    </div>
                    <h1 className="text-xl font-semibold text-text-primary tracking-tight">MeowFeeder</h1>
                </Link>
                <div className="flex space-x-1">
                    {/* <Link 
                        to="/home" 
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-text-secondary hover:text-text-primary hover:bg-meow-pink hover:bg-opacity-30"
                    >
                        Home
                    </Link> */}
                    {/* <Link 
                        to="/dashboard" 
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-text-secondary hover:text-text-primary hover:bg-meow-mint hover:bg-opacity-30"
                    >
                        Dashboard
                    </link> */}
                    <div className="ml-4 flex space-x-2">
                        <Link to="/sign-in"
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-meow-pink text-meow-pink hover:bg-meow-pink hover:text-white transition-all duration-200">
                            Sign In
                        </Link>
                        <Link to="/sign-up"
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-meow-pink text-white hover:bg-meow-pink-hover transition-all duration-200">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
