import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { FAQEditor } from './components/FAQEditor';
import { FAQList } from './components/FAQList';
import { supabase } from './lib/supabase';
import type { FAQ, Language, FAQFormData } from './types/faq';

function App() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isEditing, setIsEditing] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) fetchFAQs();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchFAQs();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchFAQs = async () => {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching FAQs:', error);
      return;
    }

    setFaqs(data || []);
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123',
    });

    if (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please check your credentials.');
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    setFaqs([]);
  };

  const handleSave = async (formData: FAQFormData) => {
    if (!session) {
      alert('Please sign in to manage FAQs');
      return;
    }

    if (editingFaq) {
      const { error } = await supabase
        .from('faqs')
        .update({
          question: formData.question,
          answer: formData.answer,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingFaq.id);

      if (error) {
        console.error('Error updating FAQ:', error);
        return;
      }
    } else {
      const { error } = await supabase.from('faqs').insert([
        {
          question: formData.question,
          answer: formData.answer,
          translations: {},
        },
      ]);

      if (error) {
        console.error('Error creating FAQ:', error);
        return;
      }
    }

    setIsEditing(false);
    setEditingFaq(null);
    fetchFAQs();
  };

  const handleDelete = async (id: string) => {
    if (!session) {
      alert('Please sign in to manage FAQs');
      return;
    }

    if (!confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    const { error } = await supabase.from('faqs').delete().eq('id', id);

    if (error) {
      console.error('Error deleting FAQ:', error);
      return;
    }

    fetchFAQs();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-indigo-600 font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-900">FAQ Management System</h1>
            {session ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-600 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Sign In
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="bg-white shadow-lg sm:rounded-xl p-8 border border-indigo-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
              </h2>
              <FAQEditor
                initialData={
                  editingFaq
                    ? {
                        question: editingFaq.question,
                        answer: editingFaq.answer,
                      }
                    : undefined
                }
                onSave={handleSave}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {session && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add FAQ
                  </button>
                </div>
              )}
              <FAQList
                faqs={faqs}
                currentLanguage={currentLanguage}
                onEdit={(faq) => {
                  if (!session) {
                    alert('Please sign in to edit FAQs');
                    return;
                  }
                  setEditingFaq(faq);
                  setIsEditing(true);
                }}
                onDelete={handleDelete}
                onLanguageChange={setCurrentLanguage}
                isAuthenticated={!!session}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;