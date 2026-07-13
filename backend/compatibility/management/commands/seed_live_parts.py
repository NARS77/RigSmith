import urllib.request
import urllib.parse
import json
from django.core.management.base import BaseCommand
from compatibility.models import CPU, Motherboard, RAM, GPU, PowerSupply, PrebuiltPC, Case

class Command(BaseCommand):
    help = 'Fetches and seeds the database with the latest parts from the pc-part-dataset'

    def handle(self, *args, **options):
        self.stdout.write('Starting Live Hardware Database Seeding...')

        urls = {
            "cpu": "https://raw.githubusercontent.com/docyx/pc-part-dataset/master/data/json/cpu.json",
            "gpu": "https://raw.githubusercontent.com/docyx/pc-part-dataset/master/data/json/video-card.json",
            "motherboard": "https://raw.githubusercontent.com/docyx/pc-part-dataset/master/data/json/motherboard.json",
            "ram": "https://raw.githubusercontent.com/docyx/pc-part-dataset/master/data/json/memory.json",
            "powersupply": "https://raw.githubusercontent.com/docyx/pc-part-dataset/master/data/json/power-supply.json",
            "case": "https://raw.githubusercontent.com/docyx/pc-part-dataset/master/data/json/case.json"
        }

        # Clear existing models
        CPU.objects.all().delete()
        Motherboard.objects.all().delete()
        RAM.objects.all().delete()
        GPU.objects.all().delete()
        PowerSupply.objects.all().delete()
        Case.objects.all().delete()
        PrebuiltPC.objects.all().delete()

        # Helper to generate Amazon link
        def get_affiliate_url(name):
            query = urllib.parse.quote(name)
            return f"https://www.amazon.com/s?k={query}&tag=rigsmith-20"

        # 1. Fetch & Seed CPUs
        try:
            self.stdout.write('Fetching CPUs...')
            req = urllib.request.urlopen(urls["cpu"])
            cpus = json.loads(req.read().decode('utf-8'))
            
            cpu_count = 0
            for item in cpus[:25]: # Limit to top 25 parts to keep it curated
                name = item.get('name', '')
                price = item.get('price')
                if not price or price <= 0:
                    price = 199.99  # fallback default
                
                # Determine brand
                brand = "AMD" if "amd" in name.lower() or "ryzen" in name.lower() else "Intel"
                
                # Heuristics for socket
                microarch = item.get('microarchitecture', '')
                name_lower = name.lower()
                micro_lower = str(microarch).lower()
                
                socket_type = "AM4"
                if brand == "AMD":
                    # Check Zen 4/5 or 7000/8000/9000
                    if any(x in name_lower for x in ["7600", "7700", "7800", "7900", "7950", "9600", "9700", "9800", "9900", "9950"]):
                        socket_type = "AM5"
                    elif "zen 4" in micro_lower or "zen 5" in micro_lower:
                        socket_type = "AM5"
                    else:
                        socket_type = "AM4"
                else:
                    # Intel
                    if any(x in name_lower for x in ["12400", "12600", "12700", "12900", "13400", "13600", "13700", "13900", "14400", "14600", "14700", "14900"]):
                        socket_type = "LGA1700"
                    else:
                        socket_type = "LGA1200"

                tdp = item.get('tdp', 65)
                if not tdp:
                    tdp = 65

                image = "/images/cpu_amd.png" if brand == "AMD" else "/images/cpu_intel.png"

                CPU.objects.create(
                    name=name,
                    brand=brand,
                    socket_type=socket_type,
                    tdp_wattage=tdp,
                    core_count=item.get('core_count', 8),
                    image_url=image,
                    price=price,
                    affiliate_url=get_affiliate_url(name)
                )
                cpu_count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully seeded {cpu_count} CPUs.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to seed CPUs: {e}'))

        # 2. Fetch & Seed Motherboards
        try:
            self.stdout.write('Fetching Motherboards...')
            req = urllib.request.urlopen(urls["motherboard"])
            mobos = json.loads(req.read().decode('utf-8'))

            mobo_count = 0
            for item in mobos[:25]:
                name = item.get('name', '')
                price = item.get('price')
                if not price or price <= 0:
                    price = 149.99

                # Standardize socket
                socket = str(item.get('socket', 'AM4')).strip().upper()
                if "LGA1700" in socket or "1700" in socket:
                    socket_type = "LGA1700"
                elif "LGA1200" in socket or "1200" in socket:
                    socket_type = "LGA1200"
                elif "AM5" in socket:
                    socket_type = "AM5"
                else:
                    socket_type = "AM4"

                # Detect RAM Type
                if socket_type == "AM5":
                    ram_type = "DDR5"
                elif socket_type in ["AM4", "LGA1200"]:
                    ram_type = "DDR4"
                else: # LGA1700
                    ram_type = "DDR4" if "ddr4" in name.lower() else "DDR5"

                # Clean Form Factor
                ff = str(item.get('form_factor', 'ATX')).lower()
                if "mini-itx" in ff or "mini itx" in ff or "itx" in ff:
                    form_factor = "Mini-ITX"
                elif "micro-atx" in ff or "micro atx" in ff or "matx" in ff:
                    form_factor = "Micro-ATX"
                else:
                    form_factor = "ATX"

                Motherboard.objects.create(
                    name=name,
                    socket_type=socket_type,
                    ram_type=ram_type,
                    form_factor=form_factor,
                    memory_slots=item.get('memory_slots', 4),
                    image_url="/images/motherboard.png",
                    price=price,
                    affiliate_url=get_affiliate_url(name)
                )
                mobo_count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully seeded {mobo_count} Motherboards.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to seed Motherboards: {e}'))

        # 3. Fetch & Seed RAM Kits
        try:
            self.stdout.write('Fetching RAM Kits...')
            req = urllib.request.urlopen(urls["ram"])
            rams = json.loads(req.read().decode('utf-8'))

            ram_count = 0
            for item in rams[:20]:
                name = item.get('name', '')
                price = item.get('price')
                if not price or price <= 0:
                    price = 79.99

                # Detect memory generation
                speed = item.get('speed', [0, 3200])
                if "ddr5" in name.lower():
                    ram_type = "DDR5"
                elif "ddr4" in name.lower():
                    ram_type = "DDR4"
                elif speed and len(speed) >= 2 and speed[1] >= 4800:
                    ram_type = "DDR5"
                else:
                    ram_type = "DDR4"

                # Calculate capacity
                modules = item.get('modules', [2, 8])
                capacity = 16
                if isinstance(modules, list) and len(modules) >= 2:
                    capacity = int(modules[0]) * int(modules[1])

                RAM.objects.create(
                    name=name,
                    ram_type=ram_type,
                    capacity_gb=capacity,
                    image_url="/images/ram.png",
                    price=price,
                    affiliate_url=get_affiliate_url(name)
                )
                ram_count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully seeded {ram_count} RAM Kits.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to seed RAM Kits: {e}'))

        # 4. Fetch & Seed GPUs
        try:
            self.stdout.write('Fetching GPUs...')
            req = urllib.request.urlopen(urls["gpu"])
            gpus = json.loads(req.read().decode('utf-8'))

            gpu_count = 0
            for item in gpus[:20]:
                name = item.get('name', '')
                price = item.get('price')
                if not price or price <= 0:
                    price = 399.99

                chipset = item.get('chipset', '').lower()
                
                # Estimate TDP and PSU from chipset
                tdp = 200
                psu = 600
                if "4090" in chipset:
                    tdp, psu = 450, 850
                elif "4080" in chipset or "7900 xtx" in chipset or "9900 xtx" in chipset:
                    tdp, psu = 320, 750
                elif "4070" in chipset or "7800 xt" in chipset:
                    tdp, psu = 220, 650
                elif "4060" in chipset or "7700 xt" in chipset or "3070" in chipset:
                    tdp, psu = 160, 550
                elif "3060" in chipset or "6600" in chipset or "7600" in chipset:
                    tdp, psu = 170, 550

                length = item.get('length', 270)
                if not length:
                    length = 270

                GPU.objects.create(
                    name=name,
                    recommended_psu_wattage=psu,
                    tdp_wattage=tdp,
                    gpu_length_mm=length,
                    image_url="/images/gpu.png",
                    price=price,
                    affiliate_url=get_affiliate_url(name)
                )
                gpu_count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully seeded {gpu_count} GPUs.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to seed GPUs: {e}'))

        # 5. Fetch & Seed Power Supplies
        try:
            self.stdout.write('Fetching Power Supplies...')
            req = urllib.request.urlopen(urls["powersupply"])
            psus = json.loads(req.read().decode('utf-8'))

            psu_count = 0
            for item in psus[:20]:
                name = item.get('name', '')
                price = item.get('price')
                if not price or price <= 0:
                    price = 99.99

                wattage = item.get('wattage', 750)
                if not wattage:
                    wattage = 750

                PowerSupply.objects.create(
                    name=name,
                    wattage=wattage,
                    image_url="/images/psu.png",
                    price=price,
                    affiliate_url=get_affiliate_url(name)
                )
                psu_count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully seeded {psu_count} Power Supplies.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to seed Power Supplies: {e}'))

        # 6. Fetch & Seed Cases
        try:
            self.stdout.write('Fetching Cases...')
            req = urllib.request.urlopen(urls["case"])
            cases = json.loads(req.read().decode('utf-8'))

            case_count = 0
            for item in cases[:15]:
                name = item.get('name', '')
                price = item.get('price')
                if not price or price <= 0:
                    price = 89.99

                # Determine Brand
                name_lower = name.lower()
                brand = "Generic"
                for b in ["corsair", "nzxt", "fractal", "lian li", "montech", "phanteks", "thermaltake", "be quiet", "cooler master"]:
                    if b in name_lower:
                        brand = b.title()
                        break
                if brand == "Generic" and len(name.split()) > 0:
                    brand = name.split()[0]

                # Determine motherboard support and GPU limit
                case_type = item.get('type', '').lower()
                if "mini" in case_type:
                    support = "Mini-ITX"
                    clearance = 310
                elif "micro" in case_type:
                    support = "Micro-ATX, Mini-ITX"
                    clearance = 340
                else:
                    support = "ATX, Micro-ATX, Mini-ITX"
                    clearance = 380

                Case.objects.create(
                    name=name,
                    brand=brand,
                    motherboard_support=support,
                    max_gpu_length_mm=clearance,
                    color=item.get('color', 'Black'),
                    side_panel=item.get('side_panel', 'Tempered Glass'),
                    price=price,
                    image_url="/images/motherboard.png",
                    affiliate_url=get_affiliate_url(name)
                )
                case_count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully seeded {case_count} Cases.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to seed Cases: {e}'))

        # 7. Seed Prebuilt PCs (standard fallback)
        try:
            self.stdout.write('Seeding Prebuilt PCs fallback list...')
            prebuilts_data = [
                {
                    "name": "Archangel Gaming Desktop",
                    "brand": "Skytech",
                    "cpu_details": "AMD Ryzen 7 9800X3D (8-Core 4.7 GHz)",
                    "gpu_details": "NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X",
                    "ram_details": "32GB DDR5 5600MHz Gaming Memory",
                    "price": 1499.99,
                    "image_url": "/images/gpu.png",
                    "affiliate_url": get_affiliate_url("Skytech Archangel RTX 4070 SUPER")
                },
                {
                    "name": "CLX Set Extreme PC",
                    "brand": "CLX",
                    "cpu_details": "Intel Core i9-14900K (24-Core 3.2 GHz)",
                    "gpu_details": "NVIDIA GeForce RTX 4090 24GB GDDR6X",
                    "ram_details": "64GB DDR5 6000MHz Memory",
                    "price": 2999.99,
                    "image_url": "/images/gpu.png",
                    "affiliate_url": get_affiliate_url("CLX Set Intel Core i9 14900K RTX 4090")
                },
                {
                    "name": "Nebula Gaming PC",
                    "brand": "Skytech",
                    "cpu_details": "AMD Ryzen 5 7600X (6-Core up to 4.7 GHz)",
                    "gpu_details": "NVIDIA GeForce RTX 4060 8GB GDDR6",
                    "ram_details": "16GB DDR5 5200MHz Memory",
                    "price": 849.99,
                    "image_url": "/images/gpu.png",
                    "affiliate_url": get_affiliate_url("Skytech Nebula RTX 4060")
                }
            ]
            for pc in prebuilts_data:
                PrebuiltPC.objects.create(**pc)
            self.stdout.write(self.style.SUCCESS('Successfully seeded Prebuilt PCs.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to seed Prebuilt PCs: {e}'))

        self.stdout.write(self.style.SUCCESS('Hardware Database Fully Updated with Latest Parts!'))
