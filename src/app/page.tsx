import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Hero section
function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="orb w-[600px] h-[600px] bg-primary-400/30 -top-48 -right-48" />
                <div className="orb w-[500px] h-[500px] bg-primary-500/20 bottom-0 -left-48" style={{ animationDelay: "-7s" }} />
                <div className="orb w-[400px] h-[400px] bg-primary-300/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: "-14s" }} />
            </div>

            <div className="hero-gradient absolute inset-0 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-lg shadow-primary-500/30 animate-pulse-slow">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">
                            AutoMax<span className="text-primary-600">AI</span>
                        </span>
                    </div>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 animate-fade-in">
                    Your Intelligent{" "}
                    <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
                        Customer Agent
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 animate-slide-up">
                    Experience the future of customer support with our AI-powered assistant. Get instant, accurate answers 24/7.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                        Start Free Trial
                    </Link>
                    <Link href="#features" className="btn-secondary text-lg px-8 py-4">
                        Learn More
                    </Link>
                </div>

                {/* Chat Preview */}
                <div className="mt-16 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    <div className="card shadow-2xl shadow-primary-500/10">
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-white">AutoMax Assistant</h3>
                                <span className="text-sm text-green-500 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Online
                                </span>
                            </div>
                        </div>

                        {/* Chat Message */}
                        <div className="py-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                    </svg>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-md px-4 py-3 max-w-sm">
                                    <p className="text-slate-700 dark:text-slate-200">👋 Hello! I&apos;m your AutoMax AI assistant. How can I help you today?</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-2 mt-4 ml-11">
                                <span className="px-3 py-1.5 rounded-full border border-primary-300 dark:border-primary-600 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer transition-colors">
                                    Our Services
                                </span>
                                <span className="px-3 py-1.5 rounded-full border border-primary-300 dark:border-primary-600 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer transition-colors">
                                    Get Support
                                </span>
                                <span className="px-3 py-1.5 rounded-full border border-primary-300 dark:border-primary-600 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer transition-colors">
                                    Pricing
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Features section
function Features() {
    const features = [
        {
            icon: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                </svg>
            ),
            title: "24/7 Available",
            description: "Your AI assistant never sleeps. Provide instant support to customers around the clock.",
        },
        {
            icon: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            ),
            title: "AI Powered",
            description: "Advanced natural language understanding for accurate, context-aware responses.",
        },
        {
            icon: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
            title: "Secure",
            description: "Enterprise-grade security. Your data is encrypted and protected at all times.",
        },
        {
            icon: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            ),
            title: "Lightning Fast",
            description: "Instant responses with sub-second latency. No more waiting for support.",
        },
        {
            icon: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <path d="M12 8v8M8 12h8" />
                </svg>
            ),
            title: "Easy Integration",
            description: "Add to your website with a single line of code. No technical expertise required.",
        },
        {
            icon: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
            ),
            title: "Multi-Channel",
            description: "Support customers on your website, mobile app, and social media platforms.",
        },
    ];

    return (
        <section id="features" className="py-24 gradient-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Everything you need to provide exceptional customer support with AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="card card-hover">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white mb-5">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Pricing section
function Pricing() {
    const plans = [
        {
            name: "Starter",
            price: "$29",
            description: "Perfect for small businesses getting started",
            features: [
                "Up to 1,000 conversations/month",
                "Basic AI responses",
                "Email support",
                "1 team member",
                "Website widget",
            ],
            highlighted: false,
        },
        {
            name: "Professional",
            price: "$99",
            description: "For growing teams with more demands",
            features: [
                "Up to 10,000 conversations/month",
                "Advanced AI with context memory",
                "Priority support",
                "5 team members",
                "Custom branding",
                "Analytics dashboard",
                "API access",
            ],
            highlighted: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For large organizations with custom needs",
            features: [
                "Unlimited conversations",
                "Custom AI training",
                "Dedicated account manager",
                "Unlimited team members",
                "SLA guarantee",
                "Custom integrations",
                "On-premise deployment",
            ],
            highlighted: false,
        },
    ];

    return (
        <section id="pricing" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Choose the plan that best fits your needs. All plans include a 14-day free trial.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`card relative ${plan.highlighted
                                    ? "border-primary-500 shadow-xl shadow-primary-500/20 scale-105"
                                    : ""
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-primary-600 to-primary-400 text-white text-sm font-semibold px-4 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">{plan.name}</h3>
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                                    {plan.price}
                                    {plan.price !== "Custom" && <span className="text-lg font-normal text-slate-500">/month</span>}
                                </div>
                                <p className="text-slate-600 dark:text-slate-400">{plan.description}</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <svg className="w-5 h-5 text-primary-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/signup"
                                className={`block text-center py-3 rounded-xl font-semibold transition-all ${plan.highlighted
                                        ? "btn-primary"
                                        : "btn-secondary"
                                    }`}
                            >
                                {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// FAQ section
function FAQ() {
    const faqs = [
        {
            question: "How does the AI assistant work?",
            answer: "Our AI assistant uses advanced natural language processing to understand customer queries and provide accurate, helpful responses. It learns from your knowledge base and improves over time.",
        },
        {
            question: "Can I customize the chatbot's appearance?",
            answer: "Yes! You can fully customize the chat widget's colors, position, welcome message, and more to match your brand identity.",
        },
        {
            question: "Is there a free trial?",
            answer: "Absolutely! All plans come with a 14-day free trial. No credit card required to get started.",
        },
        {
            question: "How do I integrate it with my website?",
            answer: "Simply copy and paste a single line of code into your website. It works with any platform including WordPress, Shopify, and custom websites.",
        },
        {
            question: "What happens if the AI can't answer a question?",
            answer: "When the AI is unsure, it can seamlessly escalate to a human agent or collect the customer's contact information for follow-up.",
        },
    ];

    return (
        <section id="faq" className="py-24 gradient-bg">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Got questions? We&apos;ve got answers.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="card">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{faq.question}</h3>
                            <p className="text-slate-600 dark:text-slate-300">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// CTA section
function CTA() {
    return (
        <section className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="card bg-gradient-to-br from-primary-600 to-primary-700 border-0 py-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Ready to Transform Your Customer Support?
                    </h2>
                    <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
                        Join thousands of businesses already using AutoMax AI to delight their customers.
                    </p>
                    <Link href="/signup" className="inline-block bg-white text-primary-600 font-semibold py-4 px-8 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                        Start Your Free Trial
                    </Link>
                </div>
            </div>
        </section>
    );
}

// Main page
export default function HomePage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <Pricing />
            <FAQ />
            <CTA />
            <Footer />
        </main>
    );
}
