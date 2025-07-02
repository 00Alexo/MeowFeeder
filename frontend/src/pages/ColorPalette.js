const ColorPalette = () => {
    const colorPalette = {
        'Brand Colors': {
            'meow-pink': '#F4B6C2',
            'meow-pink-hover': '#F29CB3',
            'meow-mint': '#A3D2CA',
            'meow-mint-hover': '#8BC7BE',
            'meow-beige': '#FFE8D6',
            'meow-beige-hover': '#F5D5B8',
            'meow-light-gray': '#D3D3D3',
            'meow-gray-hover': '#C0C0C0',
        },
        'Interface Colors': {
            'bg-page': '#F8F9FA',
            'bg-navbar': '#F1F5F9',
            'bg-card': '#FFFFFF',
        },
        'Typography': {
            'text-primary': '#374151',
            'text-secondary': '#4B5563',
            'text-tertiary': '#6B7280',
            'text-muted': '#9CA3AF',
        },
        'Structural Elements': {
            'border-light': '#E2E8F0',
            'border-default': '#E5E7EB',
        }
    };

    const ColorSwatch = ({ name, value, colorClass }) => (
        <div className="flex flex-col items-center p-4 rounded-lg border border-border-light bg-bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
            <div 
                className={`w-16 h-16 rounded-lg mb-3 border border-border-light ${colorClass ? `bg-${colorClass}` : ''}`}
                style={!colorClass ? { backgroundColor: value } : {}}
            ></div>
            <div className="text-center">
                <p className="text-sm font-medium text-text-primary mb-1">{name}</p>
                <p className="text-xs text-text-tertiary font-mono">{value}</p>
                {colorClass && <p className="text-xs text-text-muted mt-1">CSS: bg-{colorClass}</p>}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-page pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-text-primary mb-4">Design System</h1>
                    <p className="text-text-tertiary text-lg max-w-3xl mx-auto">
                        Our carefully crafted color palette creates a cohesive, accessible, and modern user experience 
                        across all MeowFeeder products and touchpoints.
                    </p>
                </div>

                {/* Color Sections */}
                {Object.entries(colorPalette).map(([sectionName, colors]) => (
                    <div key={sectionName} className="mb-12">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-text-primary mb-2">
                                {sectionName}
                            </h2>
                            <div className="w-12 h-1 bg-meow-pink rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            {Object.entries(colors).map(([colorName, colorValue]) => (
                                <ColorSwatch 
                                    key={colorName}
                                    name={colorName}
                                    value={colorValue}
                                    colorClass={colorName}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Design Principles */}
                <div className="mt-16 mb-12">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-text-primary mb-2">Design Principles</h2>
                        <div className="w-12 h-1 bg-meow-mint rounded-full"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-bg-card p-6 rounded-lg border border-border-light">
                            <div className="w-12 h-12 bg-meow-pink rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-white text-xl">🎨</span>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Accessibility First</h3>
                            <p className="text-text-tertiary">
                                All color combinations meet WCAG 2.1 AA standards for contrast ratios, 
                                ensuring our platform is accessible to all users.
                            </p>
                        </div>
                        <div className="bg-bg-card p-6 rounded-lg border border-border-light">
                            <div className="w-12 h-12 bg-meow-mint rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-white text-xl">🔧</span>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Systematic Approach</h3>
                            <p className="text-text-tertiary">
                                Our color system is built with consistent naming conventions and 
                                semantic meaning, making it easy for developers to implement.
                            </p>
                        </div>
                        <div className="bg-bg-card p-6 rounded-lg border border-border-light">
                            <div className="w-12 h-12 bg-meow-beige rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-text-primary text-xl">🎯</span>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Brand Consistency</h3>
                            <p className="text-text-tertiary">
                                Every color choice reinforces our brand identity while maintaining 
                                professional standards and user trust.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Usage Examples */}
                <div className="mt-16">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-text-primary mb-2">Implementation Examples</h2>
                        <div className="w-12 h-1 bg-meow-beige rounded-full"></div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Interactive Elements */}
                        <div className="bg-bg-card p-6 rounded-lg border border-border-light">
                            <h3 className="text-lg font-medium text-text-secondary mb-4">Interactive Elements</h3>
                            <div className="space-y-3">
                                <button className="w-full py-3 px-4 rounded-lg bg-meow-pink hover:bg-meow-pink-hover text-white transition-colors duration-200 font-medium">
                                    Primary Action
                                </button>
                                <button className="w-full py-3 px-4 rounded-lg bg-meow-mint hover:bg-meow-mint-hover text-white transition-colors duration-200 font-medium">
                                    Secondary Action
                                </button>
                                <button className="w-full py-3 px-4 rounded-lg border border-meow-pink text-meow-pink hover:bg-meow-pink hover:text-white transition-colors duration-200 font-medium">
                                    Tertiary Action
                                </button>
                            </div>
                        </div>

                        {/* Content Hierarchy */}
                        <div className="bg-bg-card p-6 rounded-lg border border-border-light">
                            <h3 className="text-lg font-medium text-text-secondary mb-4">Content Hierarchy</h3>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-text-primary font-semibold text-lg">Primary Heading</h4>
                                    <p className="text-text-secondary text-sm">Used for main page titles and primary content</p>
                                </div>
                                <div>
                                    <h5 className="text-text-secondary font-medium">Secondary Heading</h5>
                                    <p className="text-text-tertiary text-sm">Section headers and subheadings</p>
                                </div>
                                <div>
                                    <p className="text-text-tertiary">Body text and descriptions</p>
                                </div>
                                <div>
                                    <p className="text-text-muted text-sm">Supporting text and captions</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="bg-bg-card p-6 rounded-lg border border-border-light">
                            <h3 className="text-lg font-medium text-text-secondary mb-4">Status & Feedback</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-meow-mint rounded-full"></div>
                                    <span className="text-text-tertiary text-sm">Device Connected</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-meow-pink rounded-full"></div>
                                    <span className="text-text-tertiary text-sm">Action Required</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-meow-light-gray rounded-full"></div>
                                    <span className="text-text-tertiary text-sm">Inactive</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specifications */}
                <div className="mt-12 bg-bg-card p-8 rounded-lg border border-border-light">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Technical Implementation</h3>
                        <p className="text-text-tertiary">
                            Our design system is built on Tailwind CSS with custom color tokens for consistent implementation across all platforms.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-semibold text-text-primary mb-3">Primary Brand Colors</h4>
                            <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Pink:</span>
                                    <span className="text-text-tertiary">#F4B6C2</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Mint:</span>
                                    <span className="text-text-tertiary">#A3D2CA</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Beige:</span>
                                    <span className="text-text-tertiary">#FFE8D6</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-primary mb-3">Usage Guidelines</h4>
                            <ul className="space-y-2 text-sm text-text-tertiary">
                                <li>• Use primary colors for key interactive elements</li>
                                <li>• Maintain consistent hover states with darker variants</li>
                                <li>• Apply neutral colors for backgrounds and structure</li>
                                <li>• Follow semantic color naming for maintainability</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ColorPalette;