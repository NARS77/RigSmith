from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import CPU, Motherboard, RAM, GPU, PowerSupply, PCBuild, UserProfile, AffiliateClick, PriceAlert

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Pro Membership Profile'

admin.site.unregister(User)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = BaseUserAdmin.list_display + ('is_pro_member',)

    def is_pro_member(self, obj):
        try:
            return obj.profile.is_pro
        except UserProfile.DoesNotExist:
            return False
    is_pro_member.boolean = True
    is_pro_member.short_description = 'Pro Member'

@admin.register(CPU)
class CPUAdmin(admin.ModelAdmin):
    list_display = ('id', 'brand', 'name', 'socket_type', 'tdp_wattage')
    list_filter = ('brand', 'socket_type')
    search_fields = ('name',)

@admin.register(Motherboard)
class MotherboardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'socket_type', 'ram_type', 'form_factor')
    list_filter = ('socket_type', 'ram_type', 'form_factor')
    search_fields = ('name',)

@admin.register(RAM)
class RAMAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'ram_type', 'capacity_gb')
    list_filter = ('ram_type',)
    search_fields = ('name',)

@admin.register(GPU)
class GPUAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'tdp_wattage', 'recommended_psu_wattage')
    search_fields = ('name',)

@admin.register(PowerSupply)
class PowerSupplyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'wattage')
    search_fields = ('name',)

@admin.register(PCBuild)
class PCBuildAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'cpu', 'motherboard', 'ram', 'gpu', 'powersupply')
    search_fields = ('name',)

@admin.register(AffiliateClick)
class AffiliateClickAdmin(admin.ModelAdmin):
    list_display = ('id', 'build', 'referrer', 'part_type', 'part_name', 'commission_usd', 'clicked_at')
    list_filter = ('part_type', 'referrer')
    search_fields = ('part_name', 'referrer__username')

@admin.register(PriceAlert)
class PriceAlertAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'part_type', 'part_name', 'target_price', 'is_triggered', 'created_at', 'triggered_at')
    list_filter = ('is_triggered', 'part_type')
    search_fields = ('email', 'part_name')
