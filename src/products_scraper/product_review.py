import pandas as pd
import requests
import time
import random
from tqdm import tqdm

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://www.bakingo.com/',
    'sec-ch-ua-mobile' : "?0",
    'sec-ch-ua-platform' : "Windows"
}

params = {
    'metainfo': '1',
    'sort' : 'field_product_order_value',
    'current_page' : '1',
    'fc_cn' : '388'
}

product_details = []
for i in range(1, 2):
    params['current_page'] = i
    response = requests.get('https://apis.bakingo.com/api/bakingo/cakes', headers=headers, params=params)
    if response.status_code == 200:
        print('request success!!!')
        for record in response.json().get('data').get('product_review').get('reviews'):
            product_details.append(record)

print('Total:', len(product_details))
df = pd.DataFrame(product_details)
json_data = df.to_json(orient='records', indent=4)
json_data = json_data.replace("\\/", "/")
with open(f'./raw_data/reviews.json', 'w') as file:
    file.write(json_data)