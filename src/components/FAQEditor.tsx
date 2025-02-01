import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save } from 'lucide-react';
import type { FAQFormData } from '../types/faq';

interface FAQEditorProps {
  initialData?: FAQFormData;
  onSave: (data: FAQFormData) => Promise<void>;
}

export function FAQEditor({ initialData, onSave }: FAQEditorProps) {
  const [formData, setFormData] = useState<FAQFormData>(
    initialData || { question: '', answer: '' }
  );
  const [saving, setSaving] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Question
        </label>
        <input
          type="text"
          id="question"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors duration-200"
          required
        />
      </div>

      <div>
        <label
          htmlFor="answer"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Answer
        </label>
        <div className="mt-1 bg-white rounded-md shadow-sm border border-gray-300">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={formData.answer}
            onChange={(content) => setFormData({ ...formData, answer: content })}
            modules={modules}
            formats={formats}
            className="h-64"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save FAQ'}
        </button>
      </div>
    </form>
  );
}