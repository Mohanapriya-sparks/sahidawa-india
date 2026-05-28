import os
import requests
from bs4 import BeautifulSoup
import pdfplumber
import logging
import sys
from io import BytesIO

# Adjust path so we can import services
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from services.alert_extractor import extract_alerts_from_text

logging.basicConfig(level=logging.INFO)

CDSCO_ALERTS_URL = "https://cdsco.gov.in/opencms/opencms/en/Notifications/Alerts/"
INGEST_API_URL = os.getenv("API_BASE_URL", "http://localhost:3000") + "/api/v1/alerts/ingest"
API_SECRET_KEY = os.getenv("API_SECRET_KEY", "secret-key-123")

def scrape_cdsco_alerts():
    logging.info(f"Checking {CDSCO_ALERTS_URL} for new alerts...")
    try:
        # Note: CDSCO often requires specific headers or fails SSL checks. 
        # Disabling verify for the sake of functionality with government sites.
        response = requests.get(CDSCO_ALERTS_URL, verify=False, timeout=15)
        response.raise_for_status()
    except requests.RequestException as e:
        logging.error(f"Failed to fetch CDSCO alerts page: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    
    pdf_links = []
    for a in soup.find_all('a', href=True):
        if a['href'].lower().endswith('.pdf'):
            link = a['href']
            if not link.startswith('http'):
                link = "https://cdsco.gov.in" + link
            pdf_links.append(link)
    
    if not pdf_links:
        logging.info("No PDF links found on the alerts page.")
        return
        
    recent_pdf = pdf_links[0]
    logging.info(f"Processing recent alert PDF: {recent_pdf}")
    
    process_alert_pdf(recent_pdf)

def process_alert_pdf(pdf_url: str):
    try:
        pdf_response = requests.get(pdf_url, verify=False, timeout=15)
        pdf_response.raise_for_status()
    except requests.RequestException as e:
        logging.error(f"Failed to download PDF {pdf_url}: {e}")
        return
        
    text_content = ""
    try:
        with pdfplumber.open(BytesIO(pdf_response.content)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    text_content += text + "\n"
    except Exception as e:
        logging.error(f"Error parsing PDF with pdfplumber: {e}")
        return
        
    if not text_content.strip():
        logging.warning("No text extracted from PDF. It might be image-based.")
        return
        
    logging.info("Extracted text from PDF, sending to LangChain for structural parsing...")
    alerts = extract_alerts_from_text(text_content)
    
    if not alerts:
        logging.warning("No alerts extracted from the text by LangChain.")
        return
        
    logging.info(f"Extracted {len(alerts)} alerts. Sending to Ingest API...")
    ingest_alerts(alerts)

def ingest_alerts(alerts: list):
    headers = {
        "Content-Type": "application/json",
        "x-api-secret": API_SECRET_KEY
    }
    
    payload = {
        "alerts": alerts
    }
    
    try:
        response = requests.post(INGEST_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        logging.info("Successfully ingested alerts to the gateway.")
    except requests.RequestException as e:
        logging.error(f"Failed to ingest alerts: {e}")

if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    scrape_cdsco_alerts()
