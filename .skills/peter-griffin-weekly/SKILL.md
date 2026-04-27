---
name: peter-griffin-weekly
description: Generate a humorous weekly git summary script written as a Family Guy dialog between Peter Griffin, Stewie, and Brian. Each character has their own voice and Fish Audio emotion tags. Output saved to peter-griffin-weekly-summary.txt in the repo root.
user-invokable: true
args:
  - name: since
    description: How far back to look for commits (e.g. "1 week ago", "2 weeks ago"). Defaults to "1 week ago".
    required: false
---

Generate a short, funny Family Guy-style dialog script summarizing recent git commits in this repo.

## Step 1: Gather commits

Run:

```
git log --since="1 week ago" --oneline --no-merges
```

If the `since` arg was provided, use that value instead of "1 week ago".

For each commit, get a brief summary of what changed:

```
git show <hash> --stat
```

Focus on the intent behind the change — what feature, fix, or refactor it represents. Group small related commits together.

## Step 2: Write the script

Write a dialog between **Peter**, **Stewie**, and **Brian**. Keep it short — around 20–25 lines total.

### Character voices

**Peter** — rambling, enthusiastic, makes absurd analogies, misunderstands technical things but rolls with it. Always opens and closes the segment.

**Brian** — slightly condescending, corrects Peter with accurate technical explanations, fancies himself smarter than everyone.

**Stewie** — contemptuous, dry, delivers one-liners, occasionally impressed against his will.

### Format

Each line must follow this exact format — character name on its own line, emotion tag on the next, then the dialog:

```
CHARACTER
(emotion) Dialog text here.
```

### Emotion tags

Use Fish Audio emotion tags sparingly — one per line, chosen to match the character's tone in that moment. Good defaults per character:

- Peter: `(excited)`, `(confident)`, `(confused)`, `(proud)`, `(satisfied)`
- Brian: `(calm)`, `(sarcastic)`, `(confident)`, `(embarrassed)`
- Stewie: `(disdainful)`, `(contemptuous)`, `(indifferent)`, `(resigned)`, `(bored)`

Do not stack multiple emotion tags. Do not exaggerate — one grounded emotion per line is enough.

### Coverage

- Mention the most interesting or impactful commits (features, notable fixes, refactors)
- Skip trivial one-liners unless they're funny
- Peter opens with a preamble, Stewie reacts to one or two things, Brian corrects Peter on one technical point, Peter closes

## Step 3: Save output

Write the script to `peter-griffin-weekly-summary.txt` in the repo root, overwriting any existing file.

Confirm to the user where the file was saved.
