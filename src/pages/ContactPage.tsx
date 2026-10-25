import React, { useState } from 'react';
import { PageId } from '../types';
import {
  Mail,
  Send,
  Check,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
  Copy,
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: PageId) => void;
  onOpenTestingGuide: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onOpenTestingGuide }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Fee Rate Discrepancy');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleCopyMessage = () => {
    const text = `Subject: [Feeora Feedback] ${subject}
From: ${name} (${email})
Message:
${message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 transition-colors duration-200">
      {/* Title */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EDFD] dark:bg-[#262143] border border-[#6750D8]/20 text-xs font-semibold text-[#6750D8] dark:text-[#B5A5FF]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Feedback & Contact</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#191725] dark:text-[#F7F6FC] tracking-tight">
          Contact Us & Report Fee Changes
        </h1>
        <p className="text-sm sm:text-base text-[#686778] dark:text-[#B5B2C4] leading-relaxed max-w-2xl">
          Did a payment provider recently alter their interchange fees or currency conversion spread? Let us know so we can verify the source and update our calculators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="md:col-span-7 bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 sm:p-8 space-y-6 shadow-soft transition-colors">
          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold">Feedback Prepared!</h2>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Because this application operates on a 100% free client-side architecture without storing personal data on external servers, click below to open your email client or copy the formatted message.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <a
                  href={`mailto:parkermalbourro@gmail.com?subject=${encodeURIComponent(`[Feeora] ${subject}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`}
                  className="px-4 py-2.5 rounded-xl bg-[#6750D8] text-white text-xs font-bold hover:bg-[#553EC6] transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open in Email App</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#15141E] border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-[#21202D] transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#686778] dark:text-[#B5B2C4] hover:underline block mx-auto pt-2"
              >
                &larr; Write another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#191725] dark:text-[#F7F6FC] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full py-2.5 px-3 bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] text-[#191725] dark:text-[#F7F6FC] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6750D8] dark:focus:ring-[#B5A5FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191725] dark:text-[#F7F6FC] mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full py-2.5 px-3 bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] text-[#191725] dark:text-[#F7F6FC] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6750D8] dark:focus:ring-[#B5A5FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191725] dark:text-[#F7F6FC] mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full py-2.5 px-3 border border-[#E9E7EF] dark:border-[#333242] rounded-xl text-sm font-medium text-[#191725] dark:text-[#F7F6FC] bg-[#FAF9FC] dark:bg-[#15141E] focus:outline-none focus:ring-2 focus:ring-[#6750D8] dark:focus:ring-[#B5A5FF]"
                >
                  <option value="Fee Rate Discrepancy">Report a Fee Schedule Change</option>
                  <option value="New Feature Request">Request a New Gateway (Wise, Revolut, etc.)</option>
                  <option value="General Feedback">General Feedback & Suggestions</option>
                  <option value="Bug Report">Technical Bug Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191725] dark:text-[#F7F6FC] mb-1">
                  Message / Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please specify the payment provider, the updated fee, and the official source URL if available..."
                  className="w-full py-2.5 px-3 bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] text-[#191725] dark:text-[#F7F6FC] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6750D8] dark:focus:ring-[#B5A5FF]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#6750D8] hover:bg-[#553EC6] dark:bg-[#B5A5FF] dark:text-[#11111A] dark:hover:bg-[#C5B8FF] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Submit Feedback</span>
              </button>

              <p className="text-[11px] text-[#9593A5] text-center">
                100% private. No personal information is stored on external databases.
              </p>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 space-y-4 shadow-soft transition-colors">
            <h2 className="text-base font-bold text-[#191725] dark:text-[#F7F6FC]">
              Frequently Asked Support Questions
            </h2>
            <div className="space-y-3 text-xs text-[#686778] dark:text-[#B5B2C4]">
              <div>
                <p className="font-bold text-[#191725] dark:text-[#F7F6FC]">How quickly are rates updated?</p>
                <p className="text-[#686778] dark:text-[#B5B2C4] mt-0.5">
                  We verify official pricing tables every quarter, and update immediately when major provider policies change.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
                <p className="font-bold text-[#191725] dark:text-[#F7F6FC]">Will you add Wise or other providers?</p>
                <p className="text-[#686778] dark:text-[#B5B2C4] mt-0.5">
                  Yes, Wise and Revolut fee estimators are currently on our free open roadmap.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
                <p className="font-bold text-[#191725] dark:text-[#F7F6FC]">Can I deploy this myself?</p>
                <p className="text-[#686778] dark:text-[#B5B2C4] mt-0.5">
                  Yes! Click below to view the free hosting guide.
                </p>
                <button
                  onClick={onOpenTestingGuide}
                  className="text-[#6750D8] dark:text-[#B5A5FF] font-bold hover:underline mt-1 inline-flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>View Free Deployment Guide &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
