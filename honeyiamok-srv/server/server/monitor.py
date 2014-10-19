from threading import Thread
import math
from models import Trip
import time
import sys
from django.apps import AppConfig
import signal
from datetime import datetime
from django.utils import timezone
from server.twillio.callers.twilio_api import TwilioCall


def point_from_lng_lat(lng_lat):
    coords = lng_lat.split(",")
    return {
        'lng': float(coords[0]),
        'lat': float(coords[1])
    }


def compute_distance_of_recent_points_in_meters(trip):
    locations_list = trip.location_set.all()
    locations_list_sz = len(locations_list)
    if locations_list_sz < 2:
        return 0

    points = locations_list[locations_list_sz - 2:]
    point_a = point_from_lng_lat(points[0].latLng)
    point_b = point_from_lng_lat(points[1].latLng)

    R = 6371 * 1000  # radius of the earth in meters
    x = (point_b['lng'] - point_a['lng']) * math.cos(0.5 * (point_b['lat'] + point_a['lat']))
    y = point_b['lat'] - point_a['lat']
    return R * math.sqrt(x * x + y * y) # in meters


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

                    distance = compute_distance_of_recent_points_in_meters(trip)
                    minutes_since_last_loc_change = (now - trip.lastLocationLogged).seconds / 60
                    minutes_since_last_ping = (now - trip.lastPing).seconds / 60

                    print str(distance) + " and " + str(minutes_since_last_loc_change)
                    if (minutes_since_last_loc_change >= trip.timeToWait and distance <= trip.distanceToWait) or \
                            minutes_since_last_ping >= trip.timeToWait:
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