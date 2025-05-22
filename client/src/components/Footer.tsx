import React from 'react';
import { Link } from 'wouter';
import { 
  Twitter, 
  Github, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  ArrowUpRight, 
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-bg/70 border-t border-primary/10 backdrop-blur-sm">
      {/* Subscribe Section */}
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-800 pb-10 mb-10">
          <div>
            <h3 className="text-xl font-bold mb-2">Stay up to date</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Subscribe to our newsletter to get the latest updates and news about BNWSwap
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
            <div className="relative w-full sm:w-auto max-w-sm">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-primary/20 focus:border-primary/50 outline-none text-gray-300"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: About */}
          <div>
            <Link href="/">
              <div className="flex items-center mb-5 cursor-pointer hover:opacity-90 transition-opacity">
                <div className="flex items-center justify-center bg-primary rounded-full w-8 h-8 mr-2">
                  <Sparkles size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-primary">BNWSwap</h2>
              </div>
            </Link>
            <p className="text-gray-400 mb-4">
              The most powerful decentralized exchange on Binance Smart Chain, offering seamless token swaps with the best rates.
            </p>
            <div className="flex space-x-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/swap">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Swap
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/liquidity">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Liquidity
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/farms">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Farms
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/pools">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Staking Pools
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/launchpad">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Launchpad
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Documentation
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    FAQ
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/tutorials">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Tutorials
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Help Center
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Contact Us
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Careers
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Blog
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/partners">
                  <span className="text-gray-400 hover:text-primary transition-colors flex items-center cursor-pointer">
                    <ArrowUpRight size={14} className="mr-2" />
                    Partners
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} BNWSwap. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/terms">
              <span className="text-gray-500 hover:text-primary transition-colors text-sm cursor-pointer">
                Terms of Service
              </span>
            </Link>
            <Link href="/privacy">
              <span className="text-gray-500 hover:text-primary transition-colors text-sm cursor-pointer">
                Privacy Policy
              </span>
            </Link>
            <Link href="/risk">
              <span className="text-gray-500 hover:text-primary transition-colors text-sm cursor-pointer">
                Risk Disclosure
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;