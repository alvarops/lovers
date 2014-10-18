from django.contrib.auth.models import User, Group
from models import Trip, Contact
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ('username', 'interval', 'toLatLng', 'fromLatLng', 'contacts')
        depth = 1

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('name', 'phoneNumber', 'trip')