from threading import Thread
from models import Trip
import time
import sys
from django.apps import AppConfig
import signal
from datetime import timedelta, datetime
from django.utils import timezone

class Monitor(Thread):

	started = False
	stop = False
	instance = None

	@staticmethod
	def startMonitor():
		Monitor.started = True
		Monitor.instance = Monitor()
		Monitor.instance.start()

	@staticmethod
	def stopMonitor():
		Monitor.stop = True

	def __init__(self):
		super(Monitor, self).__init__()

	def run(self):
		while True:
			if Monitor.stop:
				sys.exit(0)
			allTrips = Trip.objects.all()
			for trip in allTrips:
				##ignore when lastping is none
				if (not trip.lastPing is None):
					now = datetime.now(tz=timezone.utc)
					mintues_since_last_ping = (now - trip.lastPing).seconds / 60
					if mintues_since_last_ping > trip.trigger:
						## call my wife!!
						pass
			time.sleep(1)

class ServerConfig(AppConfig):
    name = 'server'
    verbose_name = "Server"
    def ready(self):

    	if not Monitor.started:
    		Monitor.startMonitor()
    	
    	def terminate(*args):
    		if Monitor.started:
    			Monitor.stopMonitor()
    		raise KeyboardInterrupt

    	signal.signal(signal.SIGINT, terminate)
    	print " ++ ready ++"


