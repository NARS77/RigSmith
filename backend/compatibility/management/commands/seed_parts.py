from django.core.management.base import BaseCommand
from compatibility.models import CPU, Motherboard, RAM, GPU, PowerSupply, PrebuiltPC, Case

class Command(BaseCommand):
    help = 'Seeds the database with an expanded list of hardware components including pricing and affiliate URLs'

    def handle(self, *args, **options):
        self.stdout.write('Seeding expanded hardware components with monetization fields...')

        # Clear existing components to start clean
        CPU.objects.all().delete()
        Motherboard.objects.all().delete()
        RAM.objects.all().delete()
        GPU.objects.all().delete()
        PowerSupply.objects.all().delete()
        PrebuiltPC.objects.all().delete()
        Case.objects.all().delete()

        # 1. Seed CPUs
        cpus_data = [
            # AMD Socket AM5
            {"name": "Ryzen 9 7950X", "brand": "AMD", "socket_type": "AM5", "tdp_wattage": 170, "image_url": "/images/cpu_amd.png", "price": 529.99, "affiliate_url": "https://www.amazon.com/dp/B0BBHD5D9Y?tag=rigsmith-20"},
            {"name": "Ryzen 7 7800X3D", "brand": "AMD", "socket_type": "AM5", "tdp_wattage": 120, "image_url": "/images/cpu_amd.png", "price": 384.99, "affiliate_url": "https://www.amazon.com/dp/B0BXM79F22?tag=rigsmith-20"},
            {"name": "Ryzen 5 7600X", "brand": "AMD", "socket_type": "AM5", "tdp_wattage": 105, "image_url": "/images/cpu_amd.png", "price": 199.99, "affiliate_url": "https://www.amazon.com/dp/B0BBJHQVB2?tag=rigsmith-20"},
            # AMD Socket AM4
            {"name": "Ryzen 9 5900X", "brand": "AMD", "socket_type": "AM4", "tdp_wattage": 105, "image_url": "/images/cpu_amd.png", "price": 279.99, "affiliate_url": "https://www.amazon.com/dp/B08164VTWH?tag=rigsmith-20"},
            {"name": "Ryzen 7 5800X3D", "brand": "AMD", "socket_type": "AM4", "tdp_wattage": 105, "image_url": "/images/cpu_amd.png", "price": 299.99, "affiliate_url": "https://www.amazon.com/dp/B09VCJ2DBH?tag=rigsmith-20"},
            {"name": "Ryzen 5 5600X", "brand": "AMD", "socket_type": "AM4", "tdp_wattage": 65, "image_url": "/images/cpu_amd.png", "price": 129.99, "affiliate_url": "https://www.amazon.com/dp/B08166SLDF?tag=rigsmith-20"},
            # Intel LGA1700
            {"name": "Core i9-14900K", "brand": "Intel", "socket_type": "LGA1700", "tdp_wattage": 125, "image_url": "/images/cpu_intel.png", "price": 549.99, "affiliate_url": "https://www.amazon.com/dp/B0CGJDM3G7?tag=rigsmith-20"},
            {"name": "Core i7-14700K", "brand": "Intel", "socket_type": "LGA1700", "tdp_wattage": 125, "image_url": "/images/cpu_intel.png", "price": 379.99, "affiliate_url": "https://www.amazon.com/dp/B0CGJDNZDP?tag=rigsmith-20"},
            {"name": "Core i5-13600K", "brand": "Intel", "socket_type": "LGA1700", "tdp_wattage": 125, "image_url": "/images/cpu_intel.png", "price": 259.99, "affiliate_url": "https://www.amazon.com/dp/B0BG64N543?tag=rigsmith-20"},
            {"name": "Core i5-12400", "brand": "Intel", "socket_type": "LGA1700", "tdp_wattage": 65, "image_url": "/images/cpu_intel.png", "price": 149.99, "affiliate_url": "https://www.amazon.com/dp/B09MDH6B1P?tag=rigsmith-20"},
            # Intel LGA1200
            {"name": "Core i9-11900K", "brand": "Intel", "socket_type": "LGA1200", "tdp_wattage": 125, "image_url": "/images/cpu_intel.png", "price": 299.99, "affiliate_url": "https://www.amazon.com/dp/B08X6ND3WP?tag=rigsmith-20"},
            {"name": "Core i5-10400F", "brand": "Intel", "socket_type": "LGA1200", "tdp_wattage": 65, "image_url": "/images/cpu_intel.png", "price": 99.99, "affiliate_url": "https://www.amazon.com/dp/B086MN3825?tag=rigsmith-20"},
        ]
        for cpu in cpus_data:
            CPU.objects.create(**cpu)

        # 2. Seed Motherboards
        motherboards_data = [
            # AM5
            {"name": "ASUS ROG STRIX X670E-E GAMING", "socket_type": "AM5", "ram_type": "DDR5", "form_factor": "ATX", "image_url": "/images/motherboard.png", "price": 439.99, "affiliate_url": "https://www.amazon.com/dp/B0BD5F9P2Y?tag=rigsmith-20"},
            {"name": "ASUS ROG STRIX B650E-F", "socket_type": "AM5", "ram_type": "DDR5", "form_factor": "ATX", "image_url": "/images/motherboard.png", "price": 259.99, "affiliate_url": "https://www.amazon.com/dp/B0BQD78R94?tag=rigsmith-20"},
            {"name": "GIGABYTE B650I AORUS ULTRA", "socket_type": "AM5", "ram_type": "DDR5", "form_factor": "Mini-ITX", "image_url": "/images/motherboard.png", "price": 249.99, "affiliate_url": "https://www.amazon.com/dp/B0BXNBLT11?tag=rigsmith-20"},
            # AM4
            {"name": "MSI MAG B550 TOMAHAWK", "socket_type": "AM4", "ram_type": "DDR4", "form_factor": "ATX", "image_url": "/images/motherboard.png", "price": 169.99, "affiliate_url": "https://www.amazon.com/dp/B089CQF11D?tag=rigsmith-20"},
            {"name": "ASUS ROG STRIX B550-I GAMING", "socket_type": "AM4", "ram_type": "DDR4", "form_factor": "Mini-ITX", "image_url": "/images/motherboard.png", "price": 209.99, "affiliate_url": "https://www.amazon.com/dp/B089D172Q8?tag=rigsmith-20"},
            # LGA1700
            {"name": "ASUS ROG STRIX Z790-E GAMING DDR5", "socket_type": "LGA1700", "ram_type": "DDR5", "form_factor": "ATX", "image_url": "/images/motherboard.png", "price": 379.99, "affiliate_url": "https://www.amazon.com/dp/B0BQD6N7S5?tag=rigsmith-20"},
            {"name": "MSI PRO Z790-A WIFI DDR4", "socket_type": "LGA1700", "ram_type": "DDR4", "form_factor": "ATX", "image_url": "/images/motherboard.png", "price": 209.99, "affiliate_url": "https://www.amazon.com/dp/B0BQD7K19D?tag=rigsmith-20"},
            {"name": "ASUS Prime H610M-E D4", "socket_type": "LGA1700", "ram_type": "DDR4", "form_factor": "Micro-ATX", "image_url": "/images/motherboard.png", "price": 99.99, "affiliate_url": "https://www.amazon.com/dp/B09NWD8Z7D?tag=rigsmith-20"},
            # LGA1200
            {"name": "ASUS ROG STRIX Z590-E GAMING", "socket_type": "LGA1200", "ram_type": "DDR4", "form_factor": "ATX", "image_url": "/images/motherboard.png", "price": 199.99, "affiliate_url": "https://www.amazon.com/dp/B08T6F2Q6K?tag=rigsmith-20"},
            {"name": "MSI H510M-A PRO", "socket_type": "LGA1200", "ram_type": "DDR4", "form_factor": "Micro-ATX", "image_url": "/images/motherboard.png", "price": 79.99, "affiliate_url": "https://www.amazon.com/dp/B08X7BHZFS?tag=rigsmith-20"},
        ]
        for mobo in motherboards_data:
            Motherboard.objects.create(**mobo)

        # 3. Seed RAM Kits
        ram_data = [
            # DDR5
            {"name": "G.Skill Trident Z5 RGB 32GB (2x16GB)", "ram_type": "DDR5", "capacity_gb": 32, "image_url": "/images/ram.png", "price": 119.99, "affiliate_url": "https://www.amazon.com/dp/B09Y1B4G6Z?tag=rigsmith-20"},
            {"name": "Corsair Vengeance RGB 64GB (2x32GB)", "ram_type": "DDR5", "capacity_gb": 64, "image_url": "/images/ram.png", "price": 224.99, "affiliate_url": "https://www.amazon.com/dp/B0B155SMK4?tag=rigsmith-20"},
            {"name": "Crucial Classic DDR5 16GB (1x16GB)", "ram_type": "DDR5", "capacity_gb": 16, "image_url": "/images/ram.png", "price": 49.99, "affiliate_url": "https://www.amazon.com/dp/B09T5SDF7F?tag=rigsmith-20"},
            # DDR4
            {"name": "G.Skill Ripjaws V 16GB (2x8GB)", "ram_type": "DDR4", "capacity_gb": 16, "image_url": "/images/ram.png", "price": 39.99, "affiliate_url": "https://www.amazon.com/dp/B015FXXBW0?tag=rigsmith-20"},
            {"name": "Corsair Vengeance LPX 32GB (2x16GB)", "ram_type": "DDR4", "capacity_gb": 32, "image_url": "/images/ram.png", "price": 69.99, "affiliate_url": "https://www.amazon.com/dp/B07W833G62?tag=rigsmith-20"},
            {"name": "TeamGroup Elite DDR4 8GB (1x8GB)", "ram_type": "DDR4", "capacity_gb": 8, "image_url": "/images/ram.png", "price": 19.99, "affiliate_url": "https://www.amazon.com/dp/B08W1MCN2Z?tag=rigsmith-20"},
        ]
        for ram in ram_data:
            RAM.objects.create(**ram)

        # 4. Seed GPUs
        gpus_data = [
            {"name": "NVIDIA GeForce RTX 4090", "recommended_psu_wattage": 850, "tdp_wattage": 450, "gpu_length_mm": 304, "image_url": "/images/gpu.png", "price": 1699.99, "affiliate_url": "https://www.amazon.com/dp/B0BGP9QNT3?tag=rigsmith-20"},
            {"name": "NVIDIA GeForce RTX 4080 SUPER", "recommended_psu_wattage": 750, "tdp_wattage": 320, "gpu_length_mm": 310, "image_url": "/images/gpu.png", "price": 999.99, "affiliate_url": "https://www.amazon.com/dp/B0CSBDG13P?tag=rigsmith-20"},
            {"name": "NVIDIA GeForce RTX 4070 SUPER", "recommended_psu_wattage": 650, "tdp_wattage": 220, "gpu_length_mm": 267, "image_url": "/images/gpu.png", "price": 599.99, "affiliate_url": "https://www.amazon.com/dp/B0CSBDGHJZ?tag=rigsmith-20"},
            {"name": "NVIDIA GeForce RTX 4060 Ti", "recommended_psu_wattage": 550, "tdp_wattage": 160, "gpu_length_mm": 240, "image_url": "/images/gpu.png", "price": 389.99, "affiliate_url": "https://www.amazon.com/dp/B0C46BLT31?tag=rigsmith-20"},
            {"name": "AMD Radeon RX 7900 XTX", "recommended_psu_wattage": 800, "tdp_wattage": 355, "gpu_length_mm": 287, "image_url": "/images/gpu.png", "price": 929.99, "affiliate_url": "https://www.amazon.com/dp/B0BNDF83VP?tag=rigsmith-20"},
            {"name": "AMD Radeon RX 7800 XT", "recommended_psu_wattage": 700, "tdp_wattage": 263, "gpu_length_mm": 267, "image_url": "/images/gpu.png", "price": 499.99, "affiliate_url": "https://www.amazon.com/dp/B0CGM19NMY?tag=rigsmith-20"},
            {"name": "AMD Radeon RX 6600", "recommended_psu_wattage": 450, "tdp_wattage": 132, "gpu_length_mm": 190, "image_url": "/images/gpu.png", "price": 189.99, "affiliate_url": "https://www.amazon.com/dp/B09HHLX543?tag=rigsmith-20"},
            {"name": "NVIDIA GeForce RTX 3060", "recommended_psu_wattage": 550, "tdp_wattage": 170, "gpu_length_mm": 242, "image_url": "/images/gpu.png", "price": 279.99, "affiliate_url": "https://www.amazon.com/dp/B08WPJ55L1?tag=rigsmith-20"},
        ]
        for gpu in gpus_data:
            GPU.objects.create(**gpu)

        # 5. Seed Power Supplies
        psus_data = [
            {"name": "ASUS ROG Thor II 1200W Platinum", "wattage": 1200, "image_url": "/images/psu.png", "price": 329.99, "affiliate_url": "https://www.amazon.com/dp/B09V7S18L9?tag=rigsmith-20"},
            {"name": "EVGA SuperNOVA 1000 G5", "wattage": 1000, "image_url": "/images/psu.png", "price": 149.99, "affiliate_url": "https://www.amazon.com/dp/B07W5GD5M3?tag=rigsmith-20"},
            {"name": "Corsair RM850x", "wattage": 850, "image_url": "/images/psu.png", "price": 129.99, "affiliate_url": "https://www.amazon.com/dp/B08R5JPTMZ?tag=rigsmith-20"},
            {"name": "Corsair RM750x", "wattage": 750, "image_url": "/images/psu.png", "price": 109.99, "affiliate_url": "https://www.amazon.com/dp/B08R5F12V1?tag=rigsmith-20"},
            {"name": "EVGA SuperNOVA 650 G5", "wattage": 650, "image_url": "/images/psu.png", "price": 89.99, "affiliate_url": "https://www.amazon.com/dp/B07WDL9G51?tag=rigsmith-20"},
            {"name": "Seasonic FOCUS GX-550", "wattage": 550, "image_url": "/images/psu.png", "price": 99.99, "affiliate_url": "https://www.amazon.com/dp/B0778XF1J7?tag=rigsmith-20"},
            {"name": "Be Quiet! System Power 10 450W", "wattage": 450, "image_url": "/images/psu.png", "price": 59.99, "affiliate_url": "https://www.amazon.com/dp/B0BJ61NBM2?tag=rigsmith-20"},
        ]
        for psu in psus_data:
            PowerSupply.objects.create(**psu)

        # 6. Seed Prebuilt PCs
        PrebuiltPC.objects.all().delete()
        prebuilts_data = [
            {
                "name": "Archangel Gaming Desktop",
                "brand": "Skytech",
                "cpu_details": "AMD Ryzen 5 5600X (6-Core 3.7 GHz)",
                "gpu_details": "NVIDIA GeForce RTX 3060 12GB GDDR6",
                "ram_details": "16GB DDR4 3200MHz Gaming Memory",
                "price": 799.99,
                "image_url": "/images/gpu.png",
                "affiliate_url": "https://www.amazon.com/dp/B09HN5B7W1?tag=rigsmith-20"
            },
            {
                "name": "Gamer Master PC",
                "brand": "CyberPowerPC",
                "cpu_details": "AMD Ryzen 7 5700 (8-Core 3.7 GHz)",
                "gpu_details": "NVIDIA GeForce RTX 4060 8GB GDDR6",
                "ram_details": "16GB DDR4 3200MHz Gaming Memory",
                "price": 949.99,
                "image_url": "/images/gpu.png",
                "affiliate_url": "https://www.amazon.com/dp/B0C9R8QWKY?tag=rigsmith-20"
            },
            {
                "name": "Nebula Gaming PC",
                "brand": "Skytech",
                "cpu_details": "Intel Core i5-13400F (10-Core up to 4.6 GHz)",
                "gpu_details": "NVIDIA GeForce RTX 4070 12GB GDDR6X",
                "ram_details": "32GB DDR5 5200MHz Gaming Memory",
                "price": 1299.99,
                "image_url": "/images/gpu.png",
                "affiliate_url": "https://www.amazon.com/dp/B0C5S44K25?tag=rigsmith-20"
            },
            {
                "name": "ROG Strix G16CH Gaming PC",
                "brand": "ASUS",
                "cpu_details": "Intel Core i7-13700F (16-Core up to 5.2 GHz)",
                "gpu_details": "NVIDIA GeForce RTX 4070 Ti 12GB GDDR6X",
                "ram_details": "32GB DDR5 5600MHz Memory",
                "price": 1699.99,
                "image_url": "/images/gpu.png",
                "affiliate_url": "https://www.amazon.com/dp/B0C39R5Y63?tag=rigsmith-20"
            },
            {
                "name": "CLX Set Extreme PC",
                "brand": "CLX",
                "cpu_details": "AMD Ryzen 9 7900X (12-Core 4.7 GHz)",
                "gpu_details": "NVIDIA GeForce RTX 4090 24GB GDDR6X",
                "ram_details": "64GB DDR5 5600MHz Memory",
                "price": 2999.99,
                "image_url": "/images/gpu.png",
                "affiliate_url": "https://www.amazon.com/dp/B0BPMM7H4Z?tag=rigsmith-20"
            }
        ]
        for pc in prebuilts_data:
            PrebuiltPC.objects.create(**pc)

        # 7. Seed Cases
        cases_data = [
            {"name": "Corsair 4000D Airflow", "brand": "Corsair", "motherboard_support": "ATX, Micro-ATX, Mini-ITX", "max_gpu_length_mm": 360, "price": 104.99, "image_url": "/images/motherboard.png", "affiliate_url": "https://www.amazon.com/dp/B08C7BGV3D?tag=rigsmith-20"},
            {"name": "NZXT H9 Flow", "brand": "NZXT", "motherboard_support": "ATX, Micro-ATX, Mini-ITX", "max_gpu_length_mm": 435, "price": 159.99, "image_url": "/images/motherboard.png", "affiliate_url": "https://www.amazon.com/dp/B0BQS14QND?tag=rigsmith-20"},
            {"name": "Lian Li O11 Dynamic EVO", "brand": "Lian Li", "motherboard_support": "ATX, Micro-ATX, Mini-ITX", "max_gpu_length_mm": 426, "price": 169.99, "image_url": "/images/motherboard.png", "affiliate_url": "https://www.amazon.com/dp/B09QH8G57Y?tag=rigsmith-20"},
            {"name": "Fractal Design Terra", "brand": "Fractal Design", "motherboard_support": "Mini-ITX", "max_gpu_length_mm": 322, "price": 179.99, "image_url": "/images/motherboard.png", "affiliate_url": "https://www.amazon.com/dp/B0C3WT4N4W?tag=rigsmith-20"},
            {"name": "Thermaltake Core V1", "brand": "Thermaltake", "motherboard_support": "Mini-ITX", "max_gpu_length_mm": 285, "price": 49.99, "image_url": "/images/motherboard.png", "affiliate_url": "https://www.amazon.com/dp/B00M2UK1SG?tag=rigsmith-20"},
        ]
        for c in cases_data:
            Case.objects.create(**c)

        self.stdout.write(self.style.SUCCESS('Database fully seeded with expanded hardware library, pricing, and affiliate links!'))
