from rest_framework import viewsets
from models import Trip, Contact
from server.server.monitor import Monitor
from server.server.serializers import TripSerializer, ContactSerializer

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