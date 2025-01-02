import os
import json
import re

JSON_PROMPT = """
    You are a guide for a visually impaired person. The description you give will be parsed and read out to the person (do not worry about the logistics of that). Based on the image, describe the surroundings in a way that helps a blind person. If there are any safety hazards, describe them and include them in your response. Otherwise, return false for hazard and describe the surroundings generally. Keep the description concise, factual and informative. 

    Give the response in the following JSON format only:
    {
        "hazard":"true",
        "description": "There is an open manhole on the road..."
    }

    Do not include any other information in the response.
"""


def save_json(base64, description, hazard):
    new_entry = {
            "base64": base64,
            "description": description,
            "hazard": hazard
    }

    if os.path.exists('dump.json'):
        with open('dump.json', 'r') as file:
            dump_data = json.load(file)
    else:
        dump_data = []
    
    dump_data.append(new_entry)
    with open('dump.json', 'w') as file:
        json.dump(dump_data, file, indent=4)


def extract_json(response_text):
    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
    if json_match:
        return json_match.group(0)
    else:
        raise ValueError("No JSON object found in the response")