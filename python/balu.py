import requests

API_URL = "https://api-inference.huggingface.co/models/ozair23/mobilenet_v2_1.0_224-finetuned-plantdisease"
headers = {
    "Authorization": f"Bearer hftoken"
}

# Open image in binary mode
with open("th.jpg", "rb") as f:
    image_bytes = f.read()

# Send POST request with binary data
response = requests.post(API_URL, headers=headers, data=image_bytes)

# Output response
print(response.status_code)
print(response.json())
