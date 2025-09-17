---
title: GitHub CLI (gh)
---

## Hva er GitHub CLI?

GitHub CLI (ogs� bare kalt `gh`) er GitHubs kommandolinje-verkt�y som lar deg jobbe med GitHub repositories, issues, pull requests og fra den vakre terminalen din.

## Installering

### macOS

```sh
brew install gh
```

### Annet

Les [installasjonsinstruksjonene](https://github.com/cli/cli#installation) for andre operativsystemer.

## Autentisering

F�r du kan bruke GitHub CLI m� du autentisere deg:

```sh
gh auth login
```

F�lg instruksjonene for � logge inn via nettleser eller personal access token.

## Tips og triks

### Pull Requests

#### Opprette pull request

```sh
# Opprett PR fra current branch
gh pr create

# Opprett draft PR
gh pr create --draft
```

#### Jobbe med eksisterende PRs

```sh
# List alle PRs
gh pr list

# Se detaljer om en PR
gh pr view 123

# Sjekk ut en PR lokalt
gh pr checkout 123

# Lukk en PR
gh pr close 123
```

#### PR reviews

```sh
# Be om review
gh pr edit 123 --add-reviewer @username

# Godkjenn en PR
gh pr review 123 --approve

# Request changes
gh pr review 123 --request-changes --body "Trenger endringer her"

# Komment�r p� PR
gh pr comment 123 --body "God jobb!"
```

### Issues

#### Opprette og administrere issues

```sh
# Opprett nytt issue
gh issue create --title "Bug rapport" --body "Beskrivelse av bug"

# List issues
gh issue list

# Se issue detaljer
gh issue view 456

# Lukk issue
gh issue close 456

# Reopen issue
gh issue reopen 456

# Assign issue til deg selv
gh issue edit 456 --add-assignee @me
```

#### Issue templates

```sh
# Opprett issue med template
gh issue create --template bug_report.md
```

### Repository operasjoner

#### Klone repositories

```sh
# Klon med gh (setter opp riktige remotes)
gh repo clone owner/repo

# Klon din egen fork
gh repo clone repo --fork
```

#### Repository info

```sh
# Se repository info
gh repo view

# Se repository info i nettleseren din
gh repo view --web

# Se repository info for annet repo
gh repo view owner/repo

# List repositories
gh repo list owner

# Opprett nytt repository
gh repo create my-new-repo --public
```

### Workflow og Actions

#### Se workflow status

```sh
# List workflow runs
gh run list

# Se detaljer om en workflow run
gh run view 789

# Se logs fra workflow
gh run view 789 --log
```

#### Trigger workflows

```sh
# Trigger workflow manuelt
gh workflow run "CI" --ref main
```

#### Webhooks og notifications

```sh
# Se notifikasjoner
gh api notifications
```

### Vanlige workflows

#### Feature branch workflow

```sh
# Opprett og bytt til ny branch
git checkout -b feature/ny-feature

# Gj�r endringer og commit
git add . && git commit -m "Legg til ny feature"

# Push og opprett PR
gh pr create --title "Ny feature" --body "Beskrivelse"
```

#### Review workflow

```sh
# Se PRs som venter p� review
gh pr list --search "review-requested:@me"

# Sjekk ut PR for lokal testing
gh pr checkout 123

# Review PR
gh pr review 123 --approve --body "LGTM!"
```

## Troubleshooting

### Vanlige problemer

#### Authentication issues

```sh
# Sjekk auth status
gh auth status
```

#### Permission issues

```sh
# Sjekk hvilke scopes du har
gh auth status

# Login med flere scopes
gh auth login --scopes repo,admin:repo_hook
```

## Ressurser

- [Offisiell dokumentasjon](https://cli.github.com/manual/)
- [GitHub CLI cheat sheet](https://github.com/github/gh-cli/blob/trunk/docs/cheatsheet.md)
- [GitHub API dokumentasjon](https://docs.github.com/en/rest)
