from models import Trip, Contact
from rest_framework import serializers

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('id', 'name', 'phoneNumber')

class TripSerializer(serializers.ModelSerializer):
    depth = 2

    class Meta:
        model = Trip
        fields = ('id', 'username', 'interval', 'toLatLng', 'fromLatLng', 'lastPing', 'contacts', 'location_set')