#!/usr/bin/python3

import subprocess

def fix(msg):
    print(f"FIX: {msg}")

def log(msg):
    print(f"LOG: {msg}")

def err(msg):
    print(f"ERR: {msg}")
    exit(1)

def read_env_file(file_path):
    env_vars = {}
    with open(file_path) as file:
        for line in file:
            if line.strip() and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                env_vars[key] = value

    return env_vars

def check_env_file():
    example = read_env_file(".env.example")
    env = read_env_file(".env")
    ok = True

    for k, v in example.items():
        if k not in env:
            fix(f"Missing field {k} in .env")
            ok = False
            continue

        private = v == '""'
        if not private and v != env[k]:
            fix(f"Field {k} in .env doesnt match .env.example")
            ok = False
        elif env[k] == "":
            ok = False
            fix(f"Missing value for {k} in .env")

    if ok:
        log(".env OK")

def check_docker_running():
    cmd = 'docker ps --filter name=echo-web-db --format {{.ID}}'
    res = subprocess.run(cmd.split(" "), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    if res.returncode != 0:
        err("Failed to run docker command")
    elif res.stdout == "":
        fix("Docker container not running")
    else:
        log("Docker OK")

if __name__ == "__main__":
    check_env_file()
    check_docker_running()

