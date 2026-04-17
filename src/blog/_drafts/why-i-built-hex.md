---
title: "Why I Built Hex: An Autonomous Agent on a Retired iMac"
description: "Notes on wiring up OpenClaw, Ollama, Telegram, and a GitHub-backed memory store to run a personal AI agent on old hardware."
date: 2026-04-16
tags: ["ai-agents", "automation"]
---

Most AI agent demos assume you have either a beefy GPU or an unlimited OpenAI budget. I had neither — what I had was a 2021 M1 iMac with 16GB of RAM sitting on a shelf and a growing list of repetitive tasks I didn't want to do anymore.

This is the short version of how I turned that iMac into **Hex**, a persistent agent that handles research, drafting, and job-search legwork on my behalf.

## The stack

- **Orchestration:** OpenClaw — lets me chain tool calls with explicit approval steps.
- **Model:** Cloud-hosted Ollama endpoint running Nemotron, with MiniMax as fallback. Local inference on 16GB was a non-starter for reliable tool-calling.
- **Control channel:** Telegram. I can nudge Hex from my phone without SSH'ing into anything.
- **Memory:** A GitHub repo (`hex-brain`) where Hex opens PRs against its own notes. I approve or reject them like any other code review.
- **Credentials:** 1Password service accounts scoped to a dedicated `Hex` vault.

## What I learned

The single biggest lesson: **local inference is seductive but wrong** for agent workloads on consumer hardware. The moment you need reliable function calling across multi-step plans, 7B and 13B models degrade to the point of unusability. Cloud-hosted open models hit the right tradeoff.

The second lesson: **memory as PRs** is the cleanest pattern I've found for human-in-the-loop agents. Every long-term "learning" is reviewable, revertible, and version-controlled. No mystery state.

## What's next

Gmail integration via IMAP + app passwords is up next. Then job-search automation — which doubles as the first real case study for [Hexward](/).

If you're building something similar, or want help wiring AI automation into a small business, [let me know](/#contact).
