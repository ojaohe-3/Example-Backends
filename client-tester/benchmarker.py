import asyncio
import time
from threading import Thread
import aiohttp
from client import User, url
import numpy as np
from tqdm import tqdm
import os
import random

# pg pool by default only allows 20 connections at a time, if we spawn more database sessions it will not be able to keep up
semaphore = asyncio.Semaphore(20) 

NUMBER_OF_CLIENT_TO_TEST = 30_000
# NUMBER_OF_RUNS = 20

# cache friendly test
delay_post = np.zeros(NUMBER_OF_CLIENT_TO_TEST)
delay_get_all = np.zeros(NUMBER_OF_CLIENT_TO_TEST)
delay_get = np.zeros(NUMBER_OF_CLIENT_TO_TEST)
delay_delete = np.zeros(NUMBER_OF_CLIENT_TO_TEST)
clients = np.array((list(range(NUMBER_OF_CLIENT_TO_TEST))))

def find_user_id(email: str, users: list[dict]):
    for _dict in users:
        if email in _dict['email']:
            return _dict['id']
    return -1
            

async def benchmark_task(data, session):
    for index in tqdm(data):
        # prevents anymore then the specified amount to connect to the server
        async with semaphore: 
            u = User(f'test{index}', f'test{index}', f'test{index}', f'test{index}@test.com')
            start = time.time()

            async with session.post(url+"/api/v1/users/", data=u.toJson(), ssl=False) as resp:
                res = await resp.json()
                if not res['success']:
                    print("failed at post.",res)
                    return None
            delay_post[index] = time.time() - start
            await asyncio.sleep(random.random())
            start = time.time()
            async with session.get(url+"/api/v1/users", ssl=False) as resp:
                res = await resp.json()
                if 'success' in res:
                    print("failed at get all.",res)
                    return None
                delay_get_all[index] = time.time() - start
                
                id = find_user_id(f'test{index}@test.com', res)

            start = time.time()
            await asyncio.sleep(random.random())
            async with session.get(url+"/api/v1/users/"+str(id), ssl=False) as resp:
                res = await resp.json()
                if not res['success']:
                    print("test at get id", res)
                    return None
                delay_get[index] = time.time() - start

            await asyncio.sleep(random.random())
            start = time.time()   
            async with session.delete(url+"/api/v1/users/"+str(id), ssl=False) as resp:
                res = await resp.json()
                if not res['success']:
                    print("test at delete failed", res)
                    return None
                delay_delete[index] = time.time() - start
            


async def create_all_session(data, n, cores, loop):
    async with aiohttp.ClientSession() as session:
        regions = [data[i:i + n] for i in range(0, len(data), n)]
        tasks = [loop.create_task(benchmark_task(
            regions[i], session)) for i in range(cores)]
        _ = await asyncio.gather(*tasks)
    print('\n'*cores)
    print("====================================")
    print("benchmark results:\n\tmean\tstd\tmax\tmin")
    print("====================================")
    
    print(f"post:\t{delay_post.mean()}\t{delay_post.std()}\t{delay_post.max()}\t{delay_post.min()}")
    
    print(f"getall:\t{delay_get_all.mean()}\t{delay_get_all.std()}\t{delay_get_all.max()}\t{delay_get_all.min()}")
    
    print(f"get:\t{delay_get.mean()}\t{delay_get.std()}\t{delay_get.max()}\t{delay_get.min()}")
    
    print(f"delete:\t{delay_delete.mean()}\t{delay_delete.std()}\t{delay_delete.max()}\t{delay_delete.min()}")
    
    print("====================================")
    
    print("saving to file...")
    results = np.array([delay_post, delay_get_all, delay_get, delay_delete])
    print(results)
    np.savetxt('./result.gz',results, fmt="%10.5f", delimiter=",")


def start_background_loop(loop: asyncio.AbstractEventLoop) -> None:
    asyncio.set_event_loop(loop)
    loop.run_forever()


def run_multi_fetch(data, n, cores=os.cpu_count()):
    loop = asyncio.new_event_loop()
    t = Thread(target=start_background_loop, args=(loop,), daemon=True)
    t.start()
    task = asyncio.run_coroutine_threadsafe(
        create_all_session(data, n, cores, loop), loop)
    task.result()


if __name__ == '__main__':


    run_multi_fetch(clients, int(len(clients)/os.cpu_count()))
