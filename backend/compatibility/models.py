from django.db import models
from django.contrib.auth.models import User

class BrandChoices(models.TextChoices):
    AMD = 'AMD', 'AMD'
    INTEL = 'Intel', 'Intel'

class SocketChoices(models.TextChoices):
    AM4 = 'AM4', 'AM4'
    AM5 = 'AM5', 'AM5'
    LGA1700 = 'LGA1700', 'LGA1700'
    LGA1200 = 'LGA1200', 'LGA1200'

class RamTypeChoices(models.TextChoices):
    DDR4 = 'DDR4', 'DDR4'
    DDR5 = 'DDR5', 'DDR5'

class FormFactorChoices(models.TextChoices):
    ATX = 'ATX', 'ATX'
    MICRO_ATX = 'Micro-ATX', 'Micro-ATX'
    MINI_ITX = 'Mini-ITX', 'Mini-ITX'

class CPU(models.Model):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=10, choices=BrandChoices.choices)
    socket_type = models.CharField(max_length=20, choices=SocketChoices.choices)
    tdp_wattage = models.PositiveIntegerField(help_text="TDP in Watts")
    core_count = models.PositiveIntegerField(default=8, null=True, blank=True)
    image_url = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    affiliate_url = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.brand} {self.name} ({self.socket_type}) - ${self.price}"

class Motherboard(models.Model):
    name = models.CharField(max_length=100)
    socket_type = models.CharField(max_length=20, choices=SocketChoices.choices)
    ram_type = models.CharField(max_length=10, choices=RamTypeChoices.choices)
    form_factor = models.CharField(max_length=20, choices=FormFactorChoices.choices)
    memory_slots = models.PositiveIntegerField(default=4, null=True, blank=True)
    image_url = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    affiliate_url = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.socket_type}, {self.ram_type}) - ${self.price}"

class RAM(models.Model):
    name = models.CharField(max_length=100)
    ram_type = models.CharField(max_length=10, choices=RamTypeChoices.choices)
    capacity_gb = models.PositiveIntegerField(help_text="Capacity in GB")
    image_url = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    affiliate_url = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.name} {self.capacity_gb}GB {self.ram_type} - ${self.price}"

class GPU(models.Model):
    name = models.CharField(max_length=100)
    recommended_psu_wattage = models.PositiveIntegerField(help_text="Recommended PSU Wattage")
    tdp_wattage = models.PositiveIntegerField(help_text="TDP in Watts")
    gpu_length_mm = models.PositiveIntegerField(help_text="GPU Length in mm", default=280)
    image_url = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    affiliate_url = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.name} (TDP: {self.tdp_wattage}W) - ${self.price}"

class PowerSupply(models.Model):
    name = models.CharField(max_length=100)
    wattage = models.PositiveIntegerField(help_text="Output Wattage")
    image_url = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    affiliate_url = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.wattage}W) - ${self.price}"

class PCBuild(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="builds")
    name = models.CharField(max_length=100)
    cpu = models.ForeignKey(CPU, on_delete=models.SET_NULL, null=True, blank=True, related_name="builds")
    motherboard = models.ForeignKey(Motherboard, on_delete=models.SET_NULL, null=True, blank=True, related_name="builds")
    ram = models.ForeignKey(RAM, on_delete=models.SET_NULL, null=True, blank=True, related_name="builds")
    gpu = models.ForeignKey(GPU, on_delete=models.SET_NULL, null=True, blank=True, related_name="builds")
    powersupply = models.ForeignKey(PowerSupply, on_delete=models.SET_NULL, null=True, blank=True, related_name="builds")
    case = models.ForeignKey('Case', on_delete=models.SET_NULL, null=True, blank=True, related_name="builds")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Build: {self.name} by {self.user.username if self.user else 'Guest'}"

class PrebuiltPC(models.Model):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=50)
    cpu_details = models.CharField(max_length=200)
    gpu_details = models.CharField(max_length=200)
    ram_details = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image_url = models.CharField(max_length=200, null=True, blank=True)
    affiliate_url = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f"Prebuilt: {self.brand} {self.name} - ${self.price}"

class Case(models.Model):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=50)
    motherboard_support = models.CharField(max_length=100, help_text="e.g. ATX, Micro-ATX, Mini-ITX")
    max_gpu_length_mm = models.PositiveIntegerField(help_text="Max supported GPU length in mm")
    color = models.CharField(max_length=50, default="Black", null=True, blank=True)
    side_panel = models.CharField(max_length=100, default="Tempered Glass", null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    image_url = models.CharField(max_length=200, null=True, blank=True)
    affiliate_url = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.brand} {self.name} - ${self.price}"

from django.db.models.signals import post_save
from django.dispatch import receiver

class AffiliateClick(models.Model):
    build = models.ForeignKey(PCBuild, on_delete=models.CASCADE, related_name='clicks')
    referrer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='referred_clicks')
    part_type = models.CharField(max_length=50)
    part_name = models.CharField(max_length=150)
    commission_usd = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    clicked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Click on {self.part_name} referred by {self.referrer.username if self.referrer else 'Guest'} - ${self.commission_usd}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_pro = models.BooleanField(default=False)

    def __str__(self):
        return f"Profile of {self.user.username} (Pro: {self.is_pro})"

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()
        else:
            UserProfile.objects.create(user=instance)

class PriceAlert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='price_alerts')
    email = models.EmailField()
    part_type = models.CharField(max_length=50) # cpu, gpu, motherboard, ram, powersupply, case
    part_id = models.PositiveIntegerField()
    part_name = models.CharField(max_length=150)
    target_price = models.DecimalField(max_digits=8, decimal_places=2)
    is_triggered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    triggered_at = models.DateTimeField(null=True, blank=True)

    @property
    def part_object(self):
        from django.apps import apps
        try:
            if self.part_type == 'cpu':
                return apps.get_model('compatibility', 'CPU').objects.get(id=self.part_id)
            elif self.part_type == 'motherboard':
                return apps.get_model('compatibility', 'Motherboard').objects.get(id=self.part_id)
            elif self.part_type == 'ram':
                return apps.get_model('compatibility', 'RAM').objects.get(id=self.part_id)
            elif self.part_type == 'gpu':
                return apps.get_model('compatibility', 'GPU').objects.get(id=self.part_id)
            elif self.part_type == 'powersupply':
                return apps.get_model('compatibility', 'PowerSupply').objects.get(id=self.part_id)
            elif self.part_type == 'case':
                return apps.get_model('compatibility', 'Case').objects.get(id=self.part_id)
        except Exception:
            return None
        return None

    def __str__(self):
        status = "Triggered" if self.is_triggered else "Active"
        return f"Alert for {self.email} on {self.part_name} at ${self.target_price} ({status})"
