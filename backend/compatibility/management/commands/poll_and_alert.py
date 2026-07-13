import os
import sys
import time
import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal
from django.conf import settings

from compatibility.models import CPU, Motherboard, RAM, GPU, PowerSupply, Case, PriceAlert

class Command(BaseCommand):
    help = 'Simulates hardware price fluctuations and triggers price drop email alerts.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--loop',
            action='store_true',
            help='Run the command in a continuous loop to poll prices',
        )
        parser.add_argument(
            '--interval',
            type=int,
            default=10,
            help='Interval in seconds between polling cycles',
        )

    def handle(self, *args, **options):
        loop = options['loop']
        interval = options['interval']

        self.stdout.write(self.style.SUCCESS("Starting Rigsmith Price Alert & Polling Worker..."))
        
        # Ensure mock_emails folder exists
        # Write to backend/mock_emails/ relative to backend root
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        mock_emails_dir = os.path.join(backend_dir, 'mock_emails')
        os.makedirs(mock_emails_dir, exist_ok=True)
        self.stdout.write(f"Mock emails will be saved to: {mock_emails_dir}")

        if loop:
            self.stdout.write(f"Running in loop mode. Polling every {interval} seconds. Press Ctrl+C to stop.")
            try:
                while True:
                    self.run_polling_cycle(mock_emails_dir)
                    time.sleep(interval)
            except KeyboardInterrupt:
                self.stdout.write(self.style.SUCCESS("Polling worker stopped."))
        else:
            self.run_polling_cycle(mock_emails_dir)

    def run_polling_cycle(self, mock_emails_dir):
        self.stdout.write(f"\n--- Price Polling Cycle Started at {timezone.now().strftime('%Y-%m-%d %H:%M:%S')} ---")
        
        # 1. Fluctuate prices of parts
        self.fluctuate_prices()

        # 2. Check and trigger active alerts
        self.process_alerts(mock_emails_dir)

    def fluctuate_prices(self):
        # We will retrieve all components in the database and apply a random price change
        models = [CPU, Motherboard, RAM, GPU, PowerSupply, Case]
        updated_count = 0

        for model in models:
            items = model.objects.all()
            for item in items:
                # 35% chance to update a component's price in this cycle
                if random.random() < 0.35:
                    old_price = float(item.price)
                    # Fluctuate by -8% (price drop) to +3% (small rise)
                    pct = random.uniform(-0.08, 0.03)
                    new_price = round(old_price * (1.0 + pct), 2)
                    
                    # Prevent prices from dropping too low (don't go below $15.00)
                    if new_price < 15.00:
                        new_price = 15.00
                        
                    item.price = Decimal(f"{new_price:.2f}")
                    item.save()
                    updated_count += 1
                    
        self.stdout.write(self.style.HTTP_INFO(f"Successfully fluctuated live prices for {updated_count} components."))

    def process_alerts(self, mock_emails_dir):
        active_alerts = PriceAlert.objects.filter(is_triggered=False)
        self.stdout.write(f"Checking {active_alerts.count()} active price alert(s)...")

        triggered_count = 0
        for alert in active_alerts:
            part = alert.part_object
            if not part:
                self.stdout.write(self.style.WARNING(f"Part object not found for alert {alert.id} ({alert.part_name}). Skipping."))
                continue

            current_price = Decimal(part.price)
            target_price = Decimal(alert.target_price)

            if current_price <= target_price:
                # Alert triggered!
                alert.is_triggered = True
                alert.triggered_at = timezone.now()
                alert.save()

                triggered_count += 1
                self.stdout.write(self.style.SUCCESS(
                    f"ALERT TRIGGERED: '{part.name}' dropped to ${current_price:.2f} (Target: ${target_price:.2f}) "
                    f"for {alert.email}"
                ))

                # Write HTML email mockup to directory
                self.create_mock_email(alert, part, current_price, mock_emails_dir)

        if triggered_count > 0:
            self.stdout.write(self.style.SUCCESS(f"Processed and triggered {triggered_count} alerts in this cycle."))

    def create_mock_email(self, alert, part, current_price, mock_emails_dir):
        timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
        email_filename = f"alert_{alert.id}_{timestamp}.html"
        email_path = os.path.join(mock_emails_dir, email_filename)

        image_url = part.image_url if getattr(part, 'image_url', None) else "https://via.placeholder.com/150"
        affiliate_url = part.affiliate_url if getattr(part, 'affiliate_url', None) else "https://www.amazon.com"

        html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rigsmith Price Drop Notification</title>
  <style>
    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0d0e12;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
    }}
    .email-container {{
      max-width: 600px;
      margin: 40px auto;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }}
    .header {{
      background: linear-gradient(135deg, #f59e0b, #d97706);
      padding: 30px 20px;
      text-align: center;
      position: relative;
    }}
    .bell-icon {{
      font-size: 40px;
      margin-bottom: 10px;
    }}
    .header h1 {{
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #0d0e12;
      letter-spacing: 0.5px;
    }}
    .content {{
      padding: 30px;
    }}
    .alert-banner {{
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 25px;
      text-align: center;
    }}
    .alert-banner h2 {{
      margin: 0;
      color: #10b981;
      font-size: 18px;
    }}
    .part-details-card {{
      display: flex;
      align-items: center;
      gap: 20px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 25px;
    }}
    .part-thumbnail {{
      width: 80px;
      height: 80px;
      object-fit: contain;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 5px;
    }}
    .part-info {{
      flex: 1;
    }}
    .part-title {{
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 10px 0;
    }}
    .price-compare {{
      display: flex;
      gap: 20px;
      font-size: 14px;
    }}
    .price-box {{
      display: flex;
      flex-direction: column;
    }}
    .price-label {{
      color: #94a3b8;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    .price-val {{
      font-weight: 700;
      font-size: 16px;
    }}
    .price-val.target {{
      color: #3b82f6;
    }}
    .price-val.current {{
      color: #10b981;
      font-size: 18px;
    }}
    .cta-button {{
      display: block;
      width: 100%;
      box-sizing: border-box;
      background: linear-gradient(90deg, #10b981, #059669);
      color: #ffffff;
      text-decoration: none;
      text-align: center;
      padding: 14px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
      transition: all 0.2s ease;
      margin-top: 10px;
    }}
    .footer {{
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="bell-icon">🔔</div>
      <h1>RIGSMITH PRICE DROP ALERT</h1>
    </div>
    <div class="content">
      <div class="alert-banner">
        <h2>Good news! A component on your radar just dropped in price.</h2>
      </div>
      
      <div class="part-details-card">
        <img class="part-thumbnail" src="{image_url}" alt="{alert.part_name}">
        <div class="part-info">
          <h3 class="part-title">{alert.part_name}</h3>
          <div class="price-compare">
            <div class="price-box">
              <span class="price-label">Target Price</span>
              <span class="price-val target">${alert.target_price:.2f}</span>
            </div>
            <div class="price-box">
              <span class="price-label">Current Live Price</span>
              <span class="price-val current">${current_price:.2f}</span>
            </div>
          </div>
        </div>
      </div>
      
      <a href="{affiliate_url}" class="cta-button" target="_blank">View Live Affiliate Deal & Buy Now</a>
    </div>
    <div class="footer">
      <p>You received this email because you registered for price alerts on Rigsmith.</p>
      <p>&copy; 2026 Rigsmith. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
"""
        with open(email_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        self.stdout.write(f"Mock email document written to: {email_path}")
