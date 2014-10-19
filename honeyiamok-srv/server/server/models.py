from django.db import models


class Contact(models.Model):
    name = models.CharField(max_length=50)
    phoneNumber = models.CharField(max_length=50)

    def __unicode__(self):
        return u'%s - %s' % (self.name, self.phoneNumber)


class Trip(models.Model):
    username = models.CharField(max_length=50)
    interval = models.IntegerField(default=1)
    distanceToWait = models.IntegerField(default=10)
    timeToWait = models.IntegerField(default=10)
    toLatLng = models.CharField(max_length=150)
    fromLatLng = models.CharField(max_length=150)
    lastPing = models.DateTimeField(blank=True, null=True)
    lastLocationLogged = models.DateTimeField(blank=True, null=True)
    contacts = models.ManyToManyField(Contact)


class Location(models.Model):
    latLng = models.CharField(max_length=150)
    trip = models.ForeignKey(Trip)
