import requests

def refresh_token():
	url='https://www.arcgis.com/sharing/oauth2/token?'
	params = dict(
		client_id='0LJAis2QiQCmounR',
		grant_type='client_credentials',
		client_secret='e892cf4b205b440c8fb07a39ff254a36',
		f='pjson'
	)
	resp = requests.get(url=url, params=params)
	# print resp.text
	obj = resp.json()
	return obj["access_token"]
	
def point_to_address(longitude, latitude):
	token = refresh_token()
	url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode'
	params = dict(
	    location=`longitude` + "," + `latitude`,
	    token=token,
	    f='pjson',
	    outSR='',
	    distance=50
	)
	## longitude, latitude
	resp = requests.get(url=url, params=params)
	# print resp.url
	# print resp.text
	data = resp.json()
	address = data["address"]["Address"]
	city = data["address"]["City"] 
	neighborhood = data["address"]["Neighborhood"] 
	return ", ".join([x for x in (address, city, neighborhood) if x])

