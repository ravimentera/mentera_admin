import re
import trafilatura
import requests
from urllib.parse import urlparse, urljoin

def extract_emails_and_social(url):
    """
    Extract emails and social media links from a website
    """
    results = {
        'emails': [],
        'facebook': None,
        'instagram': None,
        'twitter': None,
        'linkedin': None,
        'youtube': None,
        'yelp': None
    }
    
    try:
        # Try to fetch the URL
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            return results
            
        html_content = response.text
        
        # Extract emails using regex
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        emails = re.findall(email_pattern, html_content)
        results['emails'] = list(set(emails))  # Remove duplicates
        
        # Extract social media links
        base_url = urlparse(url).netloc
        
        # Define social media patterns
        social_patterns = {
            'facebook': [r'facebook\.com/[a-zA-Z0-9._%+-]+', r'fb\.com/[a-zA-Z0-9._%+-]+'],
            'instagram': [r'instagram\.com/[a-zA-Z0-9._%+-]+'],
            'twitter': [r'twitter\.com/[a-zA-Z0-9._%+-]+', r'x\.com/[a-zA-Z0-9._%+-]+'],
            'linkedin': [r'linkedin\.com/[a-zA-Z0-9._%+-/]+'],
            'youtube': [r'youtube\.com/[a-zA-Z0-9._%+-/]+'],
            'yelp': [r'yelp\.com/biz/[a-zA-Z0-9._%+-]+']
        }
        
        # Extract social links
        for platform, patterns in social_patterns.items():
            for pattern in patterns:
                matches = re.findall(pattern, html_content)
                if matches:
                    # Get the first match and ensure it's a full URL
                    social_url = matches[0]
                    if not social_url.startswith(('http://', 'https://')):
                        social_url = f'https://{social_url}'
                    results[platform] = social_url
                    break
                    
        # Extract using trafilatura for additional content
        extracted_text = trafilatura.extract(html_content)
        if extracted_text:
            # Try to find additional emails in the extracted text
            additional_emails = re.findall(email_pattern, extracted_text)
            for email in additional_emails:
                if email not in results['emails']:
                    results['emails'].append(email)
        
        return results
        
    except Exception as e:
        print(f"Error extracting data from {url}: {str(e)}")
        return results

# Example usage
if __name__ == "__main__":
    import sys
    import json
    
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = "https://example.com"
        
    results = extract_emails_and_social(url)
    print(json.dumps(results))