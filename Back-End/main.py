from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import base64
import requests

app = Flask(__name__)

# You can specify particular origins, methods, and headers
CORS(app, resources={r"/process_image": {"origins": "*"}}, supports_credentials=True)

# OpenAI API Key
api_key = "include your API Key"

#@app.route("/api_check")
#def api_check():
#   return jsonify({"success": "API Running"})

@app.route('/process_image', methods=['POST', 'OPTIONS'])
@cross_origin() # This decorator can be used to allow (on a per route basis) CORS
def process_image():
    # Receive image file from the request
    image_file = request.files['image']

    # Convert the image file to Base64
    base64_image = base64.b64encode(image_file.read()).decode('utf-8')

    # Setup headers and payload for OpenAI API
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4-turbo",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Think up of hints that can lead to the answer in this image. Compile a step-by-step list that leads to the answer but only give me a small part of it, around 2-4 steps. The steps of the small part should be substantial enough as to include what data structure or algorithm to use to solve the problem. Start your response with Hint: and no lists, just in sentences."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    # Send the request to OpenAI
    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    # Return the response from OpenAI
    if response.status_code == 200:
        response_data = response.json()
        # Extracting just the content part of the response
        try:
            content = response_data['choices'][0]['message']['content']
            #print(content)
            return jsonify({'content': content})
        except KeyError as e:
            return jsonify({'error': 'Failed to extract content', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'Failed to process image', 'status_code': response.status_code}), response.status_code


if __name__ == '__main__':
    app.run(debug=True)  # Optional: only if you want to run in debug mode
