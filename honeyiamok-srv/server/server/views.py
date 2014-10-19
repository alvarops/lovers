import json
import time
from datetime import timedelta, datetime
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import viewsets
from models import Trip, Contact, Location
from server.server.serializers import TripSerializer, ContactSerializer
from django.views.generic import View


class TripViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    #def create(self, request):
    #    response = super(TripViewSet, self).create(request)
    #    thread = Monitor()
    #    thread.start()
    #    print response
    #    return response

class ContactViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


class StatusView(View):

    def get(self, request, trip_id=0):
        trip = Trip.objects.get(id=trip_id)
        return HttpResponse(str(json.dumps([entry.latLng for entry in trip.location_set.all()])))

    def post(self, request, trip_id=0):
        trip = Trip.objects.get(id=trip_id)
        if not trip:
            return HttpResponse("Not Found")

        lat_lng = request.GET['lat-lng']
        last_ping = datetime.now(tz=timezone.utc)
        ignore_lat_lng = False

        if trip.lastPing:
            ignore_lat_lng = not datetime.now(tz=timezone.utc) >= (trip.lastPing + timedelta(minutes=1))

        trip.lastPing = last_ping
        trip.save()

        if not ignore_lat_lng:
            location = Location()
            location.latLng = lat_lng
            location.trip = trip
            location.save()

        return HttpResponse("OK")
