'use client';

export default function SimpleContactsList({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="simple-contacts-loading">
        <div className="mini-spinner"></div>
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
    <div className="simple-contacts-list">
      {emails.length > 0 && (
        <div className="contact-section">
          <h4>Emails:</h4>
          <ul className="contact-list">
            {emails.map((email, index) => (
              <li key={index}>
                <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
                  {email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {socialLinks.length > 0 && (
        <div className="contact-section">
          <h4>Social Media:</h4>
          <ul className="contact-list">
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {emails.length === 0 && socialLinks.length === 0 && (
        <p className="no-contacts-message">No contact information found</p>
      )}
    </div>
  );
}