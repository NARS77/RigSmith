from rest_framework import serializers
from .models import CPU, Motherboard, RAM, GPU, PowerSupply, PCBuild, PrebuiltPC, Case, PriceAlert

class CPUSerializer(serializers.ModelSerializer):
    brand_display = serializers.CharField(source='get_brand_display', read_only=True)
    socket_type_display = serializers.CharField(source='get_socket_type_display', read_only=True)

    class Meta:
        model = CPU
        fields = '__all__'

class MotherboardSerializer(serializers.ModelSerializer):
    socket_type_display = serializers.CharField(source='get_socket_type_display', read_only=True)
    ram_type_display = serializers.CharField(source='get_ram_type_display', read_only=True)
    form_factor_display = serializers.CharField(source='get_form_factor_display', read_only=True)

    class Meta:
        model = Motherboard
        fields = '__all__'

class RAMSerializer(serializers.ModelSerializer):
    ram_type_display = serializers.CharField(source='get_ram_type_display', read_only=True)

    class Meta:
        model = RAM
        fields = '__all__'

class GPUSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPU
        fields = '__all__'

class PowerSupplySerializer(serializers.ModelSerializer):
    class Meta:
        model = PowerSupply
        fields = '__all__'

class PCBuildSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True, default='Guest')

    class Meta:
        model = PCBuild
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Extract fields for validation, taking existing instance state into account
        cpu = attrs.get('cpu', self.instance.cpu if self.instance else None)
        motherboard = attrs.get('motherboard', self.instance.motherboard if self.instance else None)
        ram = attrs.get('ram', self.instance.ram if self.instance else None)
        gpu = attrs.get('gpu', self.instance.gpu if self.instance else None)
        powersupply = attrs.get('powersupply', self.instance.powersupply if self.instance else None)
        case = attrs.get('case', self.instance.case if self.instance else None)

        errors = {}

        # Rule 1: CPU socket_type must match Motherboard socket_type
        if cpu and motherboard:
            if cpu.socket_type != motherboard.socket_type:
                errors['cpu'] = f"CPU socket ({cpu.socket_type}) is incompatible with motherboard socket ({motherboard.socket_type})."
                errors['motherboard'] = f"Motherboard socket ({motherboard.socket_type}) is incompatible with CPU socket ({cpu.socket_type})."

        # Rule 2: RAM ram_type must match Motherboard ram_type
        if ram and motherboard:
            if ram.ram_type != motherboard.ram_type:
                errors['ram'] = f"RAM type ({ram.ram_type}) is incompatible with motherboard memory support ({motherboard.ram_type})."
                errors['motherboard'] = f"Motherboard memory support ({motherboard.ram_type}) is incompatible with RAM type ({ram.ram_type})."

        # Rule 3: Combined TDP of CPU and GPU + 100W overhead must not exceed PSU wattage
        if powersupply:
            cpu_tdp = cpu.tdp_wattage if cpu else 0
            gpu_tdp = gpu.tdp_wattage if gpu else 0
            total_required = cpu_tdp + gpu_tdp + 100
            
            if total_required > powersupply.wattage:
                errors['powersupply'] = (
                    f"Combined power consumption ({total_required}W) exceeds PSU capacity ({powersupply.wattage}W). "
                    f"Required: CPU ({cpu_tdp}W) + GPU ({gpu_tdp}W) + 100W overhead."
                )

        # Rule 4: Case Motherboard Form Factor Support
        if case and motherboard:
            supported_sizes = [s.strip().lower() for s in case.motherboard_support.split(',')]
            if motherboard.form_factor.lower() not in supported_sizes:
                errors['case'] = f"Case supports {case.motherboard_support}, which is incompatible with {motherboard.form_factor} Motherboard."
                errors['motherboard'] = f"Motherboard form factor ({motherboard.form_factor}) exceeds Case size support ({case.motherboard_support})."

        # Rule 5: Case GPU Length Clearance Limit
        if case and gpu:
            if gpu.gpu_length_mm > case.max_gpu_length_mm:
                errors['case'] = f"Case max GPU clearance ({case.max_gpu_length_mm}mm) is too short for GPU length ({gpu.gpu_length_mm}mm)."
                errors['gpu'] = f"GPU length ({gpu.gpu_length_mm}mm) exceeds Case clearance space ({case.max_gpu_length_mm}mm)."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def to_representation(self, instance):
        # Provide rich nested objects for reads (GET) instead of plain IDs
        rep = super().to_representation(instance)
        if instance.cpu:
            rep['cpu'] = CPUSerializer(instance.cpu).data
        if instance.motherboard:
            rep['motherboard'] = MotherboardSerializer(instance.motherboard).data
        if instance.ram:
            rep['ram'] = RAMSerializer(instance.ram).data
        if instance.gpu:
            rep['gpu'] = GPUSerializer(instance.gpu).data
        if instance.powersupply:
            rep['powersupply'] = PowerSupplySerializer(instance.powersupply).data
        if instance.case:
            rep['case'] = CaseSerializer(instance.case).data
        return rep

class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = '__all__'

class PrebuiltPCSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrebuiltPC
        fields = '__all__'

class PriceAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceAlert
        fields = '__all__'
        read_only_fields = ['user', 'is_triggered', 'created_at', 'triggered_at']
