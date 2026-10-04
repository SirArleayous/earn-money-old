import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content py-10 border-t border-base-300">
            <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand Overview */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="SINEX Logo" className="w-10 h-10 rounded-full object-cover" />
                        <span className="text-2xl font-bold tracking-wider">SINEX</span>
                    </div>
                    <p className="text-sm opacity-80">
                        SirArleayous Innovation Nexus Ltd (SINEX) is a multi-country digital opportunity, task, research, and rewards ecosystem.
                    </p>
                </div>

                {/* Quick Navigation */}
                <div>
                    <h3 className="font-bold text-lg mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-[#00d7c0]">Home</Link></li>
                        <li><Link to="/about" className="hover:text-[#00d7c0]">About SINEX</Link></li>
                        <li><Link to="/contact" className="hover:text-[#00d7c0]">Contact Us</Link></li>
                        <li><Link to="/dashboard" className="hover:text-[#00d7c0]">Dashboard</Link></li>
                    </ul>
                </div>

                {/* Terminology / Role Links */}
                <div>
                    <h3 className="font-bold text-lg mb-3">Ecosystem</h3>
                    <ul className="space-y-2 text-sm">
                        <li><span className="opacity-80">For Users (Tasks & Rewards)</span></li>
                        <li><span className="opacity-80">For Clients & Businesses</span></li>
                        <li><span className="opacity-80">Multi-Country Operations</span></li>
                        <li><span className="opacity-80">Developer API Hub</span></li>
                    </ul>
                </div>

                {/* Social & Corporate Info */}
                <div>
                    <h3 className="font-bold text-lg mb-3">Connect With Us</h3>
                    <div className="flex gap-4 mb-4 text-xl">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#00d7c0]"><FaFacebook /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#00d7c0]"><FaTwitter /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#00d7c0]"><FaLinkedin /></a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#00d7c0]"><FaGithub /></a>
                    </div>
                    <p className="text-xs opacity-70">
                        Powered by SirArleayous Innovation Nexus Ltd
                    </p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-base-300 text-center text-sm opacity-70">
                <p>&copy; {new Date().getFullYear()} SINEX (SirArleayous Innovation Nexus Ltd). All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;