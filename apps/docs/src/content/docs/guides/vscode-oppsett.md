---
title: VSCode Oppsett
description: Sett opp VSCode med anbefalte extensions og innstillinger for echo Webkom utvikling.
---

Denne guiden hjelper deg med å sette opp Visual Studio Code optimalt for TypeScript og React-utvikling i echo Webkom. Du lærer om essensielle extensions, innstillinger, og arbeidsflyt.

## 1. Installer VSCode

Last ned og installer Visual Studio Code fra [code.visualstudio.com](https://code.visualstudio.com/).

### Installer via package managers (valgfritt)

```bash
# macOS med Homebrew
brew install --cask visual-studio-code
```

## 2. Essensielle Extensions

### TypeScript og React utvikling

```bash
# Installer via kommandolinje (valgfritt)
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
code --install-extension ms-vscode.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

**Obligatoriske extensions:**

1. **TypeScript Importer** (`pmneo.tsimporter`)

   - Automatisk import av TypeScript moduler
   - Intelligent code completion

2. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)

   - Autocomplete for Tailwind klasser
   - Hover-forhåndsvisning av CSS

3. **ESLint** (`ms-vscode.eslint`)

   - Lint og feildeteksjon i koden
   - Automatisk fixing av vanlige problemer

4. **Prettier** (`esbenp.prettier-vscode`)
   - Automatisk kodeformatering
   - Konsistent kodestil

### React-spesifikke extensions

```bash
code --install-extension ms-vscode.vscode-emmet
```

### Git & Collaboration

```bash
code --install-extension eamodio.gitlens
code --install-extension github.vscode-pull-request-github
```

8. **GitLens** (`eamodio.gitlens`)

   - Forbedret Git-integrasjon
   - Blame annotations og commit historikk

9. **GitHub Pull Requests** (`github.vscode-pull-request-github`)
   - Håndter PR-er direkte i VSCode
   - Code review i editoren

## 3. VSCode Innstillinger

Opprett eller oppdater `settings.json` filen din:

```json
{
  // Formatering og linting
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },

  // Prettier som standard formatter
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // TypeScript-spesifikke innstillinger
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",

  // React-spesifikke innstillinger
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },

  // Tailwind CSS
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["clsx\\(([^)]*)\\)", "'([^']*)'"]
  ],

  // Søk og filer
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true,
    "**/build": true
  },

  // Editor forbedringer
  "editor.minimap.enabled": false,
  "editor.linkedEditing": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.inlineSuggest.enabled": true
}
```

## 4. Nyttige Snippets

Opprett egne snippets for echo Webkom utvikling. Gå til File → Preferences → Configure User Snippets:

### TypeScript React Snippets (`typescriptreact.json`)

```json
{
  "echo React Component": {
    "prefix": "erc",
    "body": [
      "type ${1:ComponentName}Props = {",
      "  $2",
      "}",
      "",
      "export const ${1:ComponentName} = ({ $3 }: ${1:ComponentName}Props) => {",
      "  return (",
      "    <div className=\"$4\">",
      "      $0",
      "    </div>",
      "  );",
      "};"
    ],
    "description": "echo React Component with TypeScript"
  },

  "echo Server Action": {
    "prefix": "esa",
    "body": [
      "\"use server\";",
      "",
      "import { auth } from \"@/auth/server\";",
      "import { db } from \"@echo-webkom/db\";",
      "",
      "export async function ${1:actionName}() {",
      "  const session = await auth();",
      "  ",
      "  if (!session?.user) {",
      "    throw new Error(\"Unauthorized\");",
      "  }",
      "",
      "  $0",
      "}"
    ],
    "description": "echo Server Action template"
  }
}
```

## 5. Keyboard Shortcuts

Viktige shortcuts for echo Webkom utvikling:

| Shortcut               | Funksjon            |
| ---------------------- | ------------------- |
| `Cmd/Ctrl + Shift + P` | Command Palette     |
| `Cmd/Ctrl + P`         | Quick Open File     |
| `Cmd/Ctrl + Shift + F` | Global søk          |
| `Cmd/Ctrl + D`         | Velg neste match    |
| `Alt + Shift + F`      | Format Document     |
| `Cmd/Ctrl + Shift + O` | Go to Symbol        |
| `F12`                  | Go to Definition    |
| `Shift + F12`          | Find All References |
| `Cmd/Ctrl + Shift + L` | Select all matches  |
| `Cmd/Ctrl + /`         | Toggle comment      |

## 6. Produktivitetstips

### IntelliSense og Autocomplete

- Bruk `Ctrl + Space` for å utløse suggestions
- `Tab` for å akseptere suggestions
- `Esc` for å lukke suggestion-menyen

### Quick Actions

- `Cmd/Ctrl + .` for Quick Fix actions
- Automatisk import av manglende moduler
- Refactoring shortcuts

### Multi-cursor Editing

- `Alt + Click` for å plassere flere cursors
- `Cmd/Ctrl + Shift + L` for å velge alle forekomster
- `Cmd/Ctrl + D` for å velge neste forekomst

### File Navigation

- `Cmd/Ctrl + P` → skriv filnavn for rask navigering
- `@` symbol for å hoppe til symboler i fil
- `#` symbol for å søke i workspace

## 7. Troubleshooting

### TypeScript funker ikke?

1. Sjekk at TypeScript extension er installert og aktivert
2. Restart TypeScript Server: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"
3. Kontroller at `tsconfig.json` er konfigurert riktig

### ESLint issues

1. Sjekk at `eslint.config.js` finnes i prosjektet
2. Restart ESLint Server: `Cmd/Ctrl + Shift + P` → "ESLint: Restart ESLint Server"
3. Kontroller at ESLint extension kan finne config-filen

### Prettier ikke formatting

1. Kontroller at Prettier er satt som default formatter
2. Sjekk `prettier.config.cjs` i prosjektrotmappen
3. Enable "Format on Save" i settings

## 8. echo Webkom Workflow

### Daglig arbeidsflyt

1. Åpne terminal i VSCode (`Ctrl + `` ` ``)
2. Pull latest changes: `git pull origin main`
3. Start development server: `pnpm dev`
4. Bruk integrated terminal for alle Git-operasjoner

### Code Review

- Bruk GitHub Pull Requests extension
- Review endringer direkte i VSCode
- Kommenter på linjer og submit reviews
