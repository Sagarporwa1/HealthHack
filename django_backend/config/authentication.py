import jwt
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions
import logging

logger = logging.getLogger(__name__)

class SupabaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            logger.info("No Authorization header found")
            return None

        try:
            # Header is typically "Bearer <token>"
            token = auth_header.split(' ')[1]
        except IndexError:
            raise exceptions.AuthenticationFailed('Invalid token header. No credentials provided.')

        try:
            # Supabase uses JWT_SECRET to sign its tokens
            # We assume this is set in Django settings
            jwt_secret = getattr(settings, 'SUPABASE_JWT_SECRET', None)
            if not jwt_secret:
                raise exceptions.AuthenticationFailed('SUPABASE_JWT_SECRET not configured on backend.')

            # Decode the token
            payload = jwt.decode(token, jwt_secret, algorithms=["HS256"], audience="authenticated")
            logger.info(f"Token decoded successfully for user subject: {payload.get('sub')}")
            
            # The 'sub' field in Supabase JWT is the User ID (UUID)
            user_id = payload.get('sub')
            if not user_id:
                raise exceptions.AuthenticationFailed('Invalid token payload.')

            # In a real app, you might want to link Supabase users to Django users
            # For simplicity, we'll create or get a Django user based on the email
            email = payload.get('email')
            
            # Use get_or_create to ensure the user exists in Django's DB
            user, created = User.objects.get_or_create(
                username=user_id, # Using Supabase UUID as username
                defaults={'email': email}
            )
            
            return (user, token)

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token.')
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))
