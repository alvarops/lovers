class custom_middle(object):
	def process_response(self, request, response):
		response['Access-Control-Allow-Origin'] = "http://127.0.0.1:9000"
		response['Access-Control-Allow-Headers'] = "accept, content-type"
		response['Access-Control-Allow-Methods'] = "POST, GET, OPTIONS"
		response['Access-Control-Allow-Credentials'] = "true"
		return response