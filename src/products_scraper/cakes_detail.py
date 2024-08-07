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

def parser_product(json):
    d = dict()
    d['id'] = json.get('node_id')
    d['sku'] = json.get('sku')
    d['product_type'] = json.get('product_type')
    d['title'] = json.get('title')
    d['url'] = json.get('url')
    d['sell_price'] = json.get('sell_price')
    d['list_price'] = json.get('list_price')
    d['ribbon'] = json.get('ribbon')
    d['rating'] = json.get('rating')
    d['total_reviews'] = json.get('total_reviews')
    d['ingredient'] = json.get('ingredient')
    d['description'] = json.get('full_desc')
    d['isSelected'] = json.get('isSelected')
    
    images = json.get('images', [])
    image_sources = [image.get('src') for image in images]
    d['image_sources'] = image_sources
    d['customize'] = json.get('customize')
    d['eggless'] = json.get('eggless')
    d['preparation_time'] = json.get('preparation_time')
    d['exp_product'] = json.get('exp_product')
    d['discount'] = json.get('discount')
    return d

category_urls = {
    'cakes': 'https://apis.bakingo.com/api/bakingo/cakes',
    'best_seller': 'https://apis.bakingo.com/api/bakingo/best-seller',
    'eggless_cakes': 'https://apis.bakingo.com/api/bakingo/eggless-cakes',
    'half_cakes': 'https://apis.bakingo.com/api/bakingo/half-cakes',
    'heart_shape_cakes': 'https://apis.bakingo.com/api/bakingo/heart-shape-cakes',
    'rose_cakes': 'https://apis.bakingo.com/api/bakingo/rose-cakes'
}

for category, url in category_urls.items():
    product_details = []
    # for i in range(1, 7):
    for i in range(1, 2):
        params['current_page'] = i
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            print(f'Request success for {category} page {i}')
            for record in response.json().get('data').get('results'):
                product_details.append(parser_product(record))
        else:
            print(f'Request failed for {category} page {i}: {response.status_code}')
    
    if product_details:
        print('Total:', len(product_details))
        df = pd.DataFrame(product_details)
        json_data = df.to_json(orient='records', indent=4)
        json_data = json_data.replace("\\/", "/")
        with open(f'./raw_data/{category}.json', 'w') as file:
            file.write(json_data)
        print(f'Saved {len(product_details)} products for {category} to {category}.json')