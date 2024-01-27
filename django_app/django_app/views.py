from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.forms import AuthenticationForm, UsernameField
from django.contrib.auth import views
from django import forms
from hashlib import sha256


class Home(APIView): # Home
    permission_classes = [AllowAny]
    def get(self, request, format=None): # Home
        return Response({
                'v1' : '/api/v1',
            })
        

class CustomLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(CustomLoginForm, self).__init__(*args, **kwargs)

    username = UsernameField(widget=forms.TextInput(
        attrs={'class': 'form-control', 'placeholder': 'ID'}))
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Password',
        }
    ))
    
class CustomLoginView(views.LoginView):
    authentication_form = CustomLoginForm
    template_name='admin/login.html'
    
    def post(self, request, *args, **kwargs):
        request.POST._mutable = True
        request.POST['password'] = sha256(request.POST['password'].encode()).hexdigest()
        request.POST._mutable = False
        return super().post(request, *args, **kwargs)