import base64, hashlib
from Crypto.Util.Padding import pad, unpad
from Crypto.Cipher import AES
from django.conf import settings
import json
from dotenv import load_dotenv

class PrivateJSON:
    def __init__(self, data):
        load_dotenv(verbose=True)
        self.mode = settings.DJANGO_PRIVATE_API_MODE == "True"
        self.key = hashlib.sha256(str(settings.DJANGO_PRIVATE_API_KEY).encode('utf-8')).digest()
        
        if self.mode:
            self.data = self.encrypt(json.dumps(data).encode('utf-8'))
        else:
            self.data = json.dumps(data)
            
    def encrypt(self, message):
        raw = pad(message, AES.block_size)
        cipher = AES.new(self.key, AES.MODE_CBC)
        enc = base64.b64encode(cipher.iv + cipher.encrypt(raw)).decode('utf-8')
        return enc
        
    def decrypt(self, enc):
        raw = base64.b64decode(enc)
        cipher = AES.new(self.key, AES.MODE_CBC, raw[:AES.block_size])
        dec = unpad(cipher.decrypt(raw[AES.block_size:]), AES.block_size).decode('utf-8')
        return dec
    
    def get(self):
        if self.mode:
            return str(self.data)
        else:
            return json.loads(self.data)