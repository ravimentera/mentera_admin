'use client';

import { useState } from 'react';

export default function ContactsTable({ data, isLoading }) {
  const [activeTab, setActiveTab] = useState('emails');
  
  if (isLoading) {
    return (
      <div className="contacts-loading">
        <div className="spinner"></div>
        <p>Extracting contact information...</p>
      </div>
    );
  }
  
  if (!data) {
    return null;
  }
  
  const { emails, facebook, instagram, twitter, linkedin, youtube, yelp } = data;
  
  const socialLinks = [
    { id: 'facebook', name: 'Facebook', url: facebook },
    { id: 'instagram', name: 'Instagram', url: instagram },
    { id: 'twitter', name: 'Twitter', url: twitter },
    { id: 'linkedin', name: 'LinkedIn', url: linkedin },
    { id: 'youtube', name: 'YouTube', url: youtube },
    { id: 'yelp', name: 'Yelp', url: yelp },
  ].filter(link => link.url);
  
  return (
    <div className="contacts-table-container">
      <div className="contacts-tabs">
        <button 
          className={`tab-button ${activeTab === 'emails' ? 'active' : ''}`}
          onClick={() => setActiveTab('emails')}
        >
          Emails ({emails.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          Social Media ({socialLinks.length})
        </button>
      </div>
      
      <div className="contacts-content">
        {activeTab === 'emails' && (
          <div className="emails-table">
            {emails.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email, index) => (
                    <tr key={index}>
                      <td>{email}</td>
                      <td>
                        <a 
                          href={`mailto:${email}`} 
                          className="contact-action-button"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Send Email
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data-message">No email addresses found</div>
            )}
          </div>
        )}
        
        {activeTab === 'social' && (
          <div className="social-table">
            {socialLinks.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {socialLinks.map((link, index) => (
                    <tr key={index}>
                      <td>{link.name}</td>
                      <td>
                        <a 
                          href={link.url} 
                          className="contact-action-button"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Visit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data-message">No social media links found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}