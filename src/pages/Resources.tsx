import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, ExternalLink, BookOpen, PhoneCall } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  category: string;
  content: string;
  source_url: string | null;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone_number: string;
  description: string;
  available_hours: string;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resourcesData, contactsData] = await Promise.all([
          supabase.from('resources').select('*').order('category'),
          supabase.from('emergency_contacts').select('*')
        ]);

        if (resourcesData.error) throw resourcesData.error;
        if (contactsData.error) throw contactsData.error;

        setResources(resourcesData.data);
        setContacts(contactsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">PCOD Resources</h1>

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Understanding PCOD</h2>
            <p className="text-gray-600 mb-6">
              Polycystic ovary syndrome (PCOS) or PCOD is a hormonal disorder that affects women of reproductive age. 
              Find reliable information, statistics, and support resources below.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
              alt="Women's Health"
              className="w-full rounded-lg shadow-lg mb-6"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="text-xl font-semibold">{resource.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{resource.content}</p>
              {resource.source_url && (
                <a
                  href={resource.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 flex items-center"
                >
                  Learn More <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Phone className="w-6 h-6 text-purple-600 mr-2" />
            Emergency Contacts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{contact.name}</h3>
                <p className="text-gray-600 mb-2">{contact.description}</p>
                <p className="text-sm text-gray-500 mb-3">
                  Available: {contact.available_hours}
                </p>
                <a
                  href={`tel:${contact.phone_number}`}
                  className="inline-flex items-center text-purple-600 hover:text-purple-800"
                >
                  <PhoneCall className="w-4 h-4 mr-1" />
                  {contact.phone_number}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}