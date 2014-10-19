from django.conf.urls import url, include
from rest_framework import routers
from server import views

router = routers.DefaultRouter()
router.register(r'trip', views.TripViewSet)
router.register(r'contact', views.ContactViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browseable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^status/(?P<trip_id>\d+)', views.StatusView.as_view()),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]


#print " hello "

#initMonitorThread()