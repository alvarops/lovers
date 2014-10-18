from django.contrib.auth.models import User, Group
from django.http import HttpResponse
from rest_framework import viewsets
from models import Trip, Contact
from server.server.serializers import UserSerializer, GroupSerializer, TripSerializer, ContactSerializer
from django.views.generic import View


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class TripViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class ContactViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


class StatusView(View):

    def get(self, request):
        trip_id = request.GET['id'] if request.GET and request.GET['id'] else 0
        trip = Trip.objects.filter(id=trip_id)
        return HttpResponse(str(trip))
