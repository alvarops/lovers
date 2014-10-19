from threading import Thread, Lock
from models import Trip
import time
import sys
from django.apps import AppConfig
import signal
from datetime import timedelta, datetime
from django.utils import timezone
from server.twillio.callers.twilio_api import TwilioCall

#mutex = Lock()
#
#
#
#def start_monitor():
#    global instance, mutex
#    mutex.acquire()
#    try:
#        if not instance:
#            instance = Monitor()
#            instance.setDaemon(True)
#            instance.start()
#    finally:
#        mutex.release()
#
#
#def stop_monitor():
#    global instance
#    instance.stop = True


class Monitor(Thread):

    stop = False

    def __init__(self):
        super(Monitor, self).__init__()

    def run(self):
        print "Started..."
        while True:
            if self.stop:
                sys.exit(0)
            allTrips = Trip.objects.all()
            for trip in allTrips:
                ##ignore when lastping is none
                if not trip.lastPing is None:
                    now = datetime.now(tz=timezone.utc)
                    mintues_since_last_ping = (now - trip.lastPing).seconds / 60
                    if mintues_since_last_ping > trip.trigger:
                        print "Placing call for trip {0}.".format(trip.username)
                        call = TwilioCall([contact.phoneNumber for contact in trip.contacts.all()],
                                          "http://home.tkountis.com/honeyiamok/call_response.php?{0}",
                                          "Hello there, Your gay friend is dead.")
                        call.start()
                        trip.delete() #hack to stop the freaking callout
                        print "answered: " + str(call.has_answered())

            time.sleep(1)


instance = Monitor()
instance.setDaemon(True)
instance.start()


class ServerConfig(AppConfig):
    name = 'server'
    verbose_name = "Server"

    def ready(self):
        #start_monitor()

        def terminate(*args):
            instance.stop = True
            raise KeyboardInterrupt

        signal.signal(signal.SIGINT, terminate)