---
title: WSL Oppsett
description: Sett opp Windows Subsystem for Linux for optimal echo Webkom utvikling på Windows.
---

WSL (Windows Subsystem for Linux) gir deg et komplett Linux-miljø på Windows, som er ideelt for webutvikling. Denne guiden hjelper deg med å sette opp WSL for echo Webkom utvikling.

## Hvorfor WSL?

- **Konsistent miljø**: Samme kommandoer som macOS og Linux
- **Bedre ytelse**: Raskere filoperasjoner for Node.js prosjekter
- **Native verktøy**: Tilgang til Linux-verktøy og package managers
- **Docker support**: Enklere Docker-integrasjon

## 1. Aktiver WSL

### WSL 2 (Anbefalt)

Åpne PowerShell som administrator og kjør:

```powershell
# Aktiver WSL feature
wsl --install

# Eller manuelt:
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**Restart datamaskinen** etter at du har aktivert WSL.

### Sett WSL 2 som standard

```powershell
wsl --set-default-version 2
```

## 2. Installer Ubuntu

### Fra Microsoft Store

1. Åpne Microsoft Store
2. Søk etter "Ubuntu" eller "Ubuntu 22.04 LTS"
3. Installer den nyeste LTS-versjonen

### Fra kommandolinje

```powershell
# List tilgjengelige distribusjoner
wsl --list --online

# Installer Ubuntu
wsl --install -d Ubuntu-22.04
```

## 3. Første gangs oppsett

### Opprett bruker

Første gang du starter Ubuntu vil du bli bedt om å:

1. Opprette et brukernavn (bruk samme som Windows-bruker for enkelhets skyld)
2. Sette et passord (kan være forskjellig fra Windows-passordet)

### Oppdater systemet

```bash
sudo apt update && sudo apt upgrade -y
```

## 4. Installer essensielle verktøy

### Node.js og pnpm

```bash
# Installer Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal eller kjør:
source ~/.bashrc

# Installer latest Node.js LTS
nvm install --lts
nvm use --lts

# Installer pnpm
npm install -g pnpm
```

### Git

```bash
sudo apt install git
```

### Docker (valgfritt)

```bash
# Installer Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Legg til bruker i docker gruppen
sudo usermod -aG docker $USER

# Start Docker service
sudo service docker start
```

## 5. Konfigurer utviklingsmiljø

### Sett opp Git (se Git guide for detaljer)

```bash
git config --global user.name "Ditt Navn"
git config --global user.email "din.epost@student.uib.no"
```

### Installer cenv for echo utvikling

```bash
# Installer cenv
curl -sSL https://raw.githubusercontent.com/echo-webkom/cenv/main/install.sh | bash

# Restart terminal
exec bash

# Verifiser installasjon
cenv --version
```

## 6. VSCode integrasjon

### Installer WSL extension

1. Åpne VSCode på Windows
2. Installer "WSL" extension (`ms-vscode-remote.remote-wsl`)
3. Restart VSCode

### Åpne prosjekt i WSL

```bash
# Fra WSL terminal, naviger til prosjektmappen
cd /home/username/projects
git clone git@github.com:echo-webkom/echo-web-mono.git
cd echo-web-mono

# Åpne i VSCode
code .
```

VSCode vil automatisk koble til WSL og installere nødvendige extensions.

## 7. Filsystem og ytelse

### Hvor skal prosjekter ligge?

- **Anbefalt**: `/home/username/projects/` (WSL filsystem)
- **Unngå**: `/mnt/c/Users/...` (Windows filsystem - langsommere)

### Performance tips

```bash
# Sett execution policy for bedre ytelse
echo 'export NODE_OPTIONS="--max-old-space-size=8192"' >> ~/.bashrc

# Excluder node_modules fra Windows Defender
# Kjør i PowerShell som administrator:
# Add-MpPreference -ExclusionPath "\\wsl$\Ubuntu-22.04\home\username\projects"
```

## 8. Nyttige WSL kommandoer

```powershell
# Fra Windows PowerShell/CMD

# List alle WSL distribusjoner
wsl --list --verbose

# Start spesifikk distribusjon
wsl -d Ubuntu-22.04

# Stopp WSL
wsl --shutdown

# Åpne filutforsker i WSL
wsl explorer.exe .

# Kjør Linux kommando fra Windows
wsl ls -la
```

## 9. Terminal setup

### Installer Windows Terminal (anbefalt)

```powershell
# Fra Microsoft Store eller:
winget install Microsoft.WindowsTerminal
```

### Zsh og Oh My Zsh (valgfritt)

```bash
# Installer zsh
sudo apt install zsh

# Installer Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Sett zsh som standard shell
chsh -s $(which zsh)
```

## 10. Feilsøking

### WSL tar lang tid å starte

```powershell
# Restart WSL service
wsl --shutdown
wsl
```

### Tilkoblingsproblemer med VSCode

1. Sjekk at WSL extension er installert
2. Restart både VSCode og WSL
3. Prøv å koble til manuelt: `Ctrl+Shift+P` → "WSL: Connect to WSL"

### Docker ikke working

```bash
# Start Docker service
sudo service docker start

# Eller legg til i startup
echo 'sudo service docker start' >> ~/.bashrc
```

### Filrettigheter issues

```bash
# Fix ownership av filer
sudo chown -R $USER:$USER /home/$USER/projects

# Sett korrekte permissions
chmod -R 755 /home/$USER/projects
```

### Slow file operations

- Sørg for at prosjekter ligger i WSL filsystem (`/home/...`)
- Ikke i Windows filsystem (`/mnt/c/...`)
- Bruk `git clone` i WSL, ikke Windows

## 11. Best Practices

### Filstruktur

```
Windows: C:\Users\YourName\
WSL:     /home/username/
         ├── projects/           # Alle development prosjekter
         │   ├── echo-web-mono/
         │   └── andre-prosjekter/
         └── .ssh/              # SSH nøkler
```

### SSH nøkler

- Opprett SSH nøkler i WSL (`ssh-keygen`)
- Ikke kopier fra Windows til WSL
- Hver WSL distribusjon bør ha sine egne nøkler

### Environment variables

```bash
# Legg til i ~/.bashrc eller ~/.zshrc
export EDITOR="code --wait"
export BROWSER="wslview"

# echo-spesifikke environment variables
export NODE_ENV="development"
```

## 12. Integrasjon med Windows

### Åpne Windows Explorer fra WSL

```bash
# Åpne current directory i Windows Explorer
explorer.exe .

# Åpne spesifikk mappe
explorer.exe /home/username/projects
```

### Kopiere mellom WSL og Windows

```bash
# Kopier til Windows clipboard
cat file.txt | clip.exe

# Fra Windows til WSL (lim inn i terminal)
# Høyreklikk i terminal
```

## Neste steg

- Følg [Git Oppsett](/guides/sette-opp-git) for Git-konfigurasjon i WSL
- Installer [VSCode](/guides/vscode-oppsett) med WSL integration
- Sett opp [Utviklingsmiljø](/guides/development-setup) for echo prosjekter
