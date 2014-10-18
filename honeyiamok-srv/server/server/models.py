from django.db import models

class Contact(models.Model):
	name = models.CharField(max_length=50)
	phoneNumber = models.CharField(max_length=50)
	pass

class Location(models.Model):
	latLng = models.CharField(max_length=150)

class Trip(models.Model):
	username = models.CharField(max_length=50)
	interval = models.IntegerField()
	toLatLng = models.CharField(max_length=150)
	fromLatLng = models.CharField(max_length=150)
	lastPing = models.DateField(blank=True, null=True)
	contacts = models.ManyToManyField(Contact)
	locations = models.ManyToManyField(Location, null=True)

