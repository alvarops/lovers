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
	print resp.text
	obj = resp.json()
	return obj["access_token"]
	
def point_to_address(x, y):
	token = refresh_token()
	# url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer/reverseGeocode'
	url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode'
	params = dict(
	    location="51.5286416,-0.1015987",
	    token=token,
	    f='pjson',
	    outSR='',
	    distance=50
	)
	# params = dict(
	# 	location=`x` + ',' + `y`,
	# 	distance=50,
	# 	outSR='',
	# 	f='pjson'
	# 	)
	resp = requests.get(url=url, params=params)
	print resp.url
	print resp.text
	data = resp.json()
	# data = resp.loads(resp.text).json()
	return data["address"]["Address"] + ", " + data["address"]["City"] 
