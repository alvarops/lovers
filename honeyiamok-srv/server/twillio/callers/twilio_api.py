import threading
import urllib
import urllib2
import uuid
import time
import twilio
import twilio.rest


class TwilioCall():

    _MY_NUMBER = "353766801984"
    _CALL_STATUS_URL = "http://home.tkountis.com/honeyiamok/{0}.txt"
    _CALL_STATUS_CB_URL = "http://home.tkountis.com/honeyiamok/call_status.php?uuid={0}"

    _numbers_list = None
    _call_answer_url = None
    _msg = None
    _uuid = None

    _call_answered = False

    def __init__(self, numbers_list, call_answer_url, msg):
        self._numbers_list = numbers_list
        self._call_answer_url = call_answer_url
        self._msg = msg

    def start(self):
        try:
            account_sid = "AC3f2187574d4c186892b1007421dac478"
            auth_token = "5f561568e22876b7e8cea48075cc919f"

            client = twilio.rest.TwilioRestClient(account=account_sid, token=auth_token)

            self._uuid = uuid.uuid4()

            answer_callback_params = urllib.urlencode({'msg': self._msg, 'uuid': str(self._uuid)})
            call_answer_callback_url = self._call_answer_url.format(answer_callback_params)
            status_callback_url = self._CALL_STATUS_CB_URL.format(str(self._uuid))

            for number in self._numbers_list:
                print "...Calling {0}".format(number)
                client.calls.create(
                    to=number,
                    from_=self._MY_NUMBER,
                    url=call_answer_callback_url,
                    status_callback=status_callback_url,
                    status_method="GET",
                    timeout=10
                )

                status_checker = threading.Thread(target=self._check_call_status)
                status_checker.daemon = True
                status_checker.start()
                status_checker.join()

                if self.has_answered():
                    break

        except twilio.TwilioRestException as e:
            print e

    def _check_call_status(self):
        uuid_str = str(self._uuid)
        call_result = None
        force_stop_counter = 5000 # hardcode stop
        while not call_result and force_stop_counter > 0:
            try:
                url = self._CALL_STATUS_URL.format(uuid_str)
                response = urllib2.urlopen(urllib2.Request(url))
                call_result = response.read()
                self._call_answered = True if int(call_result.split("\n")[0]) > 1 else False
            except:
                time.sleep(0.5)
            finally:
                force_stop_counter -= 1
                pass

        print call_result

    def has_answered(self):
        return self._call_answered


if __name__ == "__main__":
    caller = TwilioCall(["+353831535892", "+353834416095"],
                          "http://home.tkountis.com/honeyiamok/call_response.php?{0}",
                          "Hello there, I hope you are enjoying the hackathon.")
    caller.start()