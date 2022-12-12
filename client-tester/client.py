from dataclasses import dataclass
import aiohttp
import asyncio
import ujson

url = "https://localhost:5000"

@dataclass
class User:
    first_name: str
    last_name: str
    password: str
    email: str
    
    def toJson(self):
        return {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'password': self.password,
            'email': self.email,
        }



async def get_all():
    async with aiohttp.ClientSession() as session:
        async with session.get(url+"/api/v1/users") as resp:
            # print(resp.status)
            return await resp.json()

async def get(target: int):
    async with aiohttp.ClientSession() as session:
        async with session.get(url+"/api/v1/users/"+target) as resp:
            # print(resp.status)
            return await resp.json()

async def post(user: User):
    async with aiohttp.ClientSession() as session:
        async with session.post(url+"/api/v1/users/", data=user.toJson()) as resp:
            # print(resp.status)
            return await resp.json()

async def delete(target: int):
    async with aiohttp.ClientSession() as session:
        async with session.delete(url+"/api/v1/users/"+target) as resp:
            # print(resp.status)
            return await resp.json()

