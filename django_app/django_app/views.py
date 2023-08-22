from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class Home(APIView): # Home
    permission_classes = [AllowAny]
    def get(self, request, format=None): # Home
        return Response({
                'v1' : '/api/v1',
            })