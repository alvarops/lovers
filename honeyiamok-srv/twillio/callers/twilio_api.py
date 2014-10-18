import twilio
import twilio.rest

class TwillioCaller():

    _MY_NUMBER = "353766801984"

    _numbers_list = None
    _url = None

    def __init__(self, numbers_list, url):
        self._numbers_list = numbers_list
        self._url = url

    def start_call_chain(self):
        try:
            account_sid = "AC3f2187574d4c186892b1007421dac478"
            auth_token = "5f561568e22876b7e8cea48075cc919f"

            client = twilio.rest.TwilioRestClient(account=account_sid, token=auth_token)

            client.calls.create(
                to=self._numbers_list[0],
                from_=self._MY_NUMBER,
                url=self._url
            )
        except twilio.TwilioRestException as e:
            print e

if __name__ == "__main__":
    caller = TwillioCaller(["+353831535892"], "http://home.tkountis.com/honeyiamok/example.xml")
    caller.start_call_chain()