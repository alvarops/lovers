from django.db import models

class Contact(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=50)
	phoneNumber = models.CharField(max_length=50)
	pass
	#trip = models.ForeignKey(to=Trip, related_name="contacts")

class Trip(models.Model):
	id = models.AutoField(primary_key=True)
	username = models.CharField(max_length=50)
	interval = models.IntegerField()
	toLatLng = models.CharField(max_length=50)
	fromLatLng = models.CharField(max_length=50)
	contacts = models.ManyToManyField(Contact)

