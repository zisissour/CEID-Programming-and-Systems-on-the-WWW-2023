#install latest Chrome driver to your machine https://sites.google.com/chromium.org/driver/
#install Beautiful Soup 
#install selenium

#imports
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import json 



#base product URL
URL = "https://e-katanalotis.gov.gr"

#final JSON
results = {}
results['fetch_date']=int(time.time())
results['products']=[]
results['categories']=[]

#get product information
options = webdriver.ChromeOptions()
options.add_argument('--headless')
# executable_path param is where the Chrome driver is installed
browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
browser.get(URL)

#get product information
product_ids = browser.execute_script("return Array.from(Ember.Namespace.NAMESPACES_BY_ID['katanalotis-microsite'].__container__.cache['service:store'].recordArrayManager._liveRecordArrays.product.content).map(({id}) => id)")
product_categories = browser.execute_script("return Array.from(Ember.Namespace.NAMESPACES_BY_ID['katanalotis-microsite'].__container__.cache['service:store'].recordArrayManager._liveRecordArrays.product.content).map(({_record}) => _record.category)")
product_subcategories = browser.execute_script("return Array.from(Ember.Namespace.NAMESPACES_BY_ID['katanalotis-microsite'].__container__.cache['service:store'].recordArrayManager._liveRecordArrays.product.content).map(({_record}) => _record.sub_category)")
product_names = browser.execute_script("return Array.from(Ember.Namespace.NAMESPACES_BY_ID['katanalotis-microsite'].__container__.cache['service:store'].recordArrayManager._liveRecordArrays.product.content).map(({_record}) => _record.name)")
product_images = browser.execute_script("return Array.from(Ember.Namespace.NAMESPACES_BY_ID['katanalotis-microsite'].__container__.cache['service:store'].recordArrayManager._liveRecordArrays.product.content).map(({_record}) => _record.image)")


for i in range(len(product_ids)):
    pdetails = {}
    pdetails['id']=product_ids[i]
    pdetails['name']=product_names[i]
    pdetails['category']=product_categories[i]
    pdetails['subcategory']=product_subcategories[i]
    pdetails['image'] = product_images[i]
    results['products'].append(pdetails)
    
#get categories information
browser.get(URL+"/products/navbar")
category_names = browser.execute_script("return Array.from(Ember.Namespace.NAMESPACES_BY_ID['katanalotis-microsite'].__container__.cache['service:store'].recordArrayManager._liveRecordArrays.category.content).map(({_record})=>_record.name)")
category_ids = browser.execute_script("return Array.from(Ember.Namespace.NAMESPACES_BY_ID['katanalotis-microsite'].__container__.cache['service:store'].recordArrayManager._liveRecordArrays.category.content).map(({_record})=>_record.uuid)")
subcategories = browser.execute_script("return Array.from(Ember.Namespace.NAMESPACES_BY_ID['katanalotis-microsite'].__container__.cache['service:store'].recordArrayManager._liveRecordArrays.category.content).map(({_record})=>_record.sub_categories)")

for i in range(len(category_ids)):
    cdetails = {}
    cdetails['id']=category_ids[i]
    cdetails['name']=category_names[i]
    cdetails['subcategories']=subcategories[i]
    results['categories'].append(cdetails)

browser.quit()
print('Done')

with open("products.json", "w", encoding='utf-8') as outfile:
    json.dump(results, outfile, ensure_ascii=False, indent=2)