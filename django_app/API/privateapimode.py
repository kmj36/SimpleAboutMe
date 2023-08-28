import base64, os, hashlib
from Crypto.Util.Padding import pad, unpad
from Crypto.Cipher import AES
from dotenv import load_dotenv

class PrivateAPI:
    def __init__(self):
        load_dotenv(verbose=True)
    
    @staticmethod
    def encrypt(message):
        key = hashlib.sha256(os.environ.get('PRIVATE_API_AES_ENCRYPTION_KEY').encode('utf-8')).digest()
        raw = pad(str(message).encode('utf-8'), AES.block_size)
        cipher = AES.new(key, AES.MODE_CBC)
        enc = base64.b64encode(cipher.iv + cipher.encrypt(raw))
        return str(enc)[2:-1]
    
    @staticmethod
    def decrypt(enc):
        key = hashlib.sha256(os.environ.get('PRIVATE_API_AES_ENCRYPTION_KEY').encode('utf-8')).digest()
        enc = base64.b64decode(enc)
        iv = enc[:AES.block_size]
        cipher = AES.new(key, AES.MODE_CBC, iv)
        dec = unpad(cipher.decrypt(enc[AES.block_size:]), AES.block_size)
        return dec.decode('utf-8')