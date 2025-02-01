import React from 'react';
import { Edit, Trash2, Globe } from 'lucide-react';
import type { FAQ, Language } from '../types/faq';

interface FAQListProps {
  faqs: FAQ[];
  currentLanguage: Language;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => Promise<void>;
  onLanguageChange: (lang: Language) => void;
  isAuthenticated: boolean;
}

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'bn', label: 'Bengali' },
];

export function FAQList({
  faqs,
  currentLanguage,
  onEdit,
  onDelete,
  onLanguageChange,
  isAuthenticated,
}: FAQListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-900">Frequently Asked Questions</h2>
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="rounded-md border-indigo-200 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white shadow-sm"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden sm:rounded-lg border border-indigo-100"
          >
            <div className="px-6 py-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg leading-6 font-semibold text-indigo-900">
                  {currentLanguage === 'en'
                    ? faq.question
                    : faq.translations[currentLanguage]?.question || faq.question}
                </h3>
                {isAuthenticated && (
                  <div className="flex space-x-3 ml-4">
                    <button
                      onClick={() => onEdit(faq)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(faq.id)}
                      className="text-rose-600 hover:text-rose-900 transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              <div
                className="mt-4 prose prose-indigo max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html:
                    currentLanguage === 'en'
                      ? faq.answer
                      : faq.translations[currentLanguage]?.answer || faq.answer,
                }}
              />
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-indigo-100">
            <p className="text-gray-500 text-lg">No FAQs available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}