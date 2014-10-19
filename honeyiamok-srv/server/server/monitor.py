import json
from threading import Thread
import math
from models import Trip
import time
import sys
from django.apps import AppConfig
import signal
from datetime import timedelta, datetime
from django.utils import timezone
from server.twillio.callers.twilio_api import TwilioCall


def compute_distance_of_recent_points(trip):
    locations_list = trip.location_set.all()
    if len(locations_list) < 2:
        return 0

    points = locations_list[len(locations_list) - 2:]

    point_a = {
        'x': float(points[0].latLng.split(",")[0]),
        'y': float(points[0].latLng.split(",")[1])
    }

    point_b = {
        'x': float(points[1].latLng.split(",")[0]),
        'y': float(points[1].latLng.split(",")[1])
    }

    print json.dumps(point_a)
    print json.dumps(point_b)

    return math.hypot(point_b['x'] - point_a['x'], point_b['y'] - point_a['y'])


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
                if trip.lastPing:
                    now = datetime.now(tz=timezone.utc)

                    distance = compute_distance_of_recent_points(trip)
                    minutes_since_last_loc_change = (now - trip.lastLocationLogged).seconds / 60

                    print str(distance) + " and " + str(minutes_since_last_loc_change)
                    if minutes_since_last_loc_change >= trip.trigger and distance <= 0:
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