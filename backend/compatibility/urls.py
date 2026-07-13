from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CPUViewSet,
    MotherboardViewSet,
    RAMViewSet,
    GPUViewSet,
    PowerSupplyViewSet,
    PCBuildViewSet,
    PrebuiltPCViewSet,
    CaseViewSet,
    register_view,
    login_view,
    upgrade_view,
    track_click_view,
    analytics_view,
    register_price_alert
)

router = DefaultRouter()
router.register(r'cpus', CPUViewSet, basename='cpu')
router.register(r'motherboards', MotherboardViewSet, basename='motherboard')
router.register(r'rams', RAMViewSet, basename='ram')
router.register(r'gpus', GPUViewSet, basename='gpu')
router.register(r'powersupplies', PowerSupplyViewSet, basename='powersupply')
router.register(r'builds', PCBuildViewSet, basename='build')
router.register(r'prebuilts', PrebuiltPCViewSet, basename='prebuilt')
router.register(r'cases', CaseViewSet, basename='case')

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('upgrade/', upgrade_view, name='upgrade'),
    path('clicks/', track_click_view, name='track_click'),
    path('analytics/', analytics_view, name='analytics'),
    path('price-alerts/', register_price_alert, name='price_alerts'),
    path('', include(router.urls)),
]
