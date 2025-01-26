import requests

def check_url_status(url):
    headers = {
        "User-Agent": "Wget/1.21.1 (linux-gnu)"
    }
    
    try:
        response = requests.get(url, timeout=5, allow_redirects=True, headers=headers, verify=False)
        if response.status_code == 200:
            if response.history:
                return "Redirecting"
            return "Available"
        return "Dead"
    except requests.exceptions.Timeout:
        return "Dead"
    except requests.exceptions.RequestException:
        return "Dead"
