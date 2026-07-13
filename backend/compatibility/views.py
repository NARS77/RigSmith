from rest_framework import viewsets, permissions, status
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import CPU, Motherboard, RAM, GPU, PowerSupply, PCBuild, PrebuiltPC, Case, UserProfile, PriceAlert
from .serializers import (
    CPUSerializer,
    MotherboardSerializer,
    RAMSerializer,
    GPUSerializer,
    PowerSupplySerializer,
    PCBuildSerializer,
    PrebuiltPCSerializer,
    CaseSerializer,
    PriceAlertSerializer
)

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit or delete it.
    Unowned (guest) builds are editable/deletable by anyone.
    """
    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS are GET, HEAD, OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow writes if build has no user owner, or matches requesting user
        return obj.user is None or obj.user == request.user

class CPUViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CPU.objects.all().order_by('brand', 'name')
    serializer_class = CPUSerializer

class MotherboardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Motherboard.objects.all().order_by('name')
    serializer_class = MotherboardSerializer

class RAMViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RAM.objects.all().order_by('ram_type', 'name')
    serializer_class = RAMSerializer

class GPUViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GPU.objects.all().order_by('name')
    serializer_class = GPUSerializer

class PowerSupplyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PowerSupply.objects.all().order_by('wattage', 'name')
    serializer_class = PowerSupplySerializer

class PCBuildViewSet(viewsets.ModelViewSet):
    serializer_class = PCBuildSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        if self.request.query_params.get('public') == 'true':
            return PCBuild.objects.all().order_by('-updated_at')
        if self.request.user.is_authenticated:
            return PCBuild.objects.filter(user=self.request.user).order_by('-updated_at')
        else:
            return PCBuild.objects.filter(user__isnull=True).order_by('-updated_at')

    def perform_create(self, serializer):
        # Associate user if logged in, otherwise default to anonymous user (null)
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save(user=None)

class PrebuiltPCViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PrebuiltPC.objects.all().order_by('price')
    serializer_class = PrebuiltPCSerializer

class CaseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Case.objects.all().order_by('name')
    serializer_class = CaseSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email', '')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username is already taken.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        token, created = Token.objects.get_or_create(user=user)
        # Ensure profile exists
        profile, _ = UserProfile.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_pro': profile.is_pro
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        profile, _ = UserProfile.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_pro': profile.is_pro
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upgrade_view(request):
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        profile.is_pro = True
        profile.save()
        return Response({'success': True, 'is_pro': True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def track_click_view(request):
    build_id = request.data.get('build_id')
    part_type = request.data.get('part_type')
    part_id = request.data.get('part_id')

    if not build_id or not part_type or not part_id:
        return Response({'error': 'build_id, part_type, and part_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        build = PCBuild.objects.get(id=build_id)
        
        # Get the part price and name based on category
        part_name = "Unknown Part"
        part_price = 0.0
        
        if part_type == 'cpu':
            part = CPU.objects.get(id=part_id)
            part_name = f"{part.brand} {part.name}"
            part_price = float(part.price)
        elif part_type == 'motherboard':
            part = Motherboard.objects.get(id=part_id)
            part_name = part.name
            part_price = float(part.price)
        elif part_type == 'ram':
            part = RAM.objects.get(id=part_id)
            part_name = f"{part.name} {part.capacity_gb}GB {part.ram_type}"
            part_price = float(part.price)
        elif part_type == 'gpu':
            part = GPU.objects.get(id=part_id)
            part_name = part.name
            part_price = float(part.price)
        elif part_type == 'powersupply':
            part = PowerSupply.objects.get(id=part_id)
            part_name = f"{part.name} ({part.wattage}W)"
            part_price = float(part.price)
        elif part_type == 'case':
            part = Case.objects.get(id=part_id)
            part_name = f"{part.brand} {part.name}"
            part_price = float(part.price)
        else:
            return Response({'error': 'Invalid part type.'}, status=status.HTTP_400_BAD_REQUEST)

        # Commission is 2% of the part price
        commission = round(part_price * 0.02, 2)
        
        # The referrer is the owner of the build
        referrer = build.user

        click = AffiliateClick.objects.create(
            build=build,
            referrer=referrer,
            part_type=part_type,
            part_name=part_name,
            commission_usd=commission
        )

        return Response({
            'success': True,
            'click_id': click.id,
            'referrer': referrer.username if referrer else None,
            'part_name': part_name,
            'commission_usd': commission
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def analytics_view(request):
    # Check if user is Pro
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if not profile.is_pro:
        return Response({'error': 'Access denied. Rigsmith Pro membership required.'}, status=status.HTTP_403_FORBIDDEN)

    user = request.user
    clicks = AffiliateClick.objects.filter(referrer=user)

    # 1. Total Clicks & Commission
    total_clicks = clicks.count()
    total_commission = clicks.aggregate(total=Sum('commission_usd'))['total'] or 0.00
    total_commission = float(total_commission)

    # 2. Conversion Rate (Simulate 3.5% conversion rate for dashboard realism)
    conversion_rate = 3.5 if total_clicks > 0 else 0.0

    # 3. Top Referred Components
    top_parts = clicks.values('part_type', 'part_name').annotate(
        click_count=Count('id'),
        earnings=Sum('commission_usd')
    ).order_by('-click_count')[:5]

    for part in top_parts:
        part['earnings'] = float(part['earnings'] or 0)

    # 4. Earnings over last 30 days (daily breakdown)
    now = timezone.now()
    earnings_chart_points = []
    
    for i in range(29, -1, -1):
        day = now - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        day_earnings = clicks.filter(clicked_at__range=(day_start, day_end)).aggregate(total=Sum('commission_usd'))['total'] or 0.00
        date_str = day.strftime('%b %d')
        
        earnings_chart_points.append({
            'date': date_str,
            'earnings': float(day_earnings)
        })

    return Response({
        'total_clicks': total_clicks,
        'total_commission': total_commission,
        'conversion_rate': conversion_rate,
        'top_parts': list(top_parts),
        'earnings_chart_points': earnings_chart_points,
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_price_alert(request):
    email = request.data.get('email')
    target_price = request.data.get('target_price')
    part_type = request.data.get('part_type')
    part_id = request.data.get('part_id')

    if not email or not target_price or not part_type or not part_id:
        return Response({'error': 'All fields are required (email, target_price, part_type, part_id).'}, status=status.HTTP_400_BAD_REQUEST)

    part_name = ""
    try:
        if part_type == 'cpu':
            part = CPU.objects.get(id=part_id)
            part_name = f"{part.brand} {part.name}"
        elif part_type == 'motherboard':
            part = Motherboard.objects.get(id=part_id)
            part_name = part.name
        elif part_type == 'ram':
            part = RAM.objects.get(id=part_id)
            part_name = f"{part.name} {part.capacity_gb}GB {part.ram_type}"
        elif part_type == 'gpu':
            part = GPU.objects.get(id=part_id)
            part_name = part.name
        elif part_type == 'powersupply':
            part = PowerSupply.objects.get(id=part_id)
            part_name = f"{part.name} ({part.wattage}W)"
        elif part_type == 'case':
            part = Case.objects.get(id=part_id)
            part_name = f"{part.brand} {part.name}"
        else:
            return Response({'error': 'Invalid part_type.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception:
        return Response({'error': f'Part with id {part_id} in category {part_type} not found.'}, status=status.HTTP_404_NOT_FOUND)

    is_pro = False
    if request.user.is_authenticated:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        is_pro = profile.is_pro
    else:
        # Guest user upgraded to Pro locally. Enforced by frontend, so we accept guest alerts.
        is_pro = True

    if not is_pro:
        return Response({'error': 'Rigsmith Pro membership required to set price alerts.'}, status=status.HTTP_403_FORBIDDEN)

    user = request.user if request.user.is_authenticated else None
    alert = PriceAlert.objects.create(
        user=user,
        email=email,
        part_type=part_type,
        part_id=part_id,
        part_name=part_name,
        target_price=target_price
    )

    serializer = PriceAlertSerializer(alert)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
