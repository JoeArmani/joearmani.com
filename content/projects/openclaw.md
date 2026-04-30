---
title: "OpenClaw"
description: "A founder-OS control plane I'm building around operator control: visible task state, approval guardrails, durable multi-agent workflows, and a single inbox for the work that needs my attention."
status: "Active"
tags: ["AI/ML", "Agentic", "Operator Control", "Node.js"]
order: 1
featured: true
---

## Overview

OpenClaw is the control plane I'm building for running multi-agent founder workflows on my own infrastructure. The design goal is operator control — every task is visible, consequential actions go through approval guardrails, and multi-step work survives a closed laptop because state is durable on the filesystem.

## The Problem

Most agent demos hide the middle. A prompt goes in, something impressive comes out, and the work is invisible until it's wrong. That's fine for showing capability. It doesn't scale to the kind of delegation a founder actually needs — multiple agents running in parallel across products, coaches, research, growth, and content, with a human responsible for what they do.

## What's in It

**Operator inbox.** A focused approval and blocker view sourced from gateway state, not Slack. Slack approval cards are the notification path; the inbox is the recovery surface.

**Status snapshot.** A canonical health view reporting gateway health, pairing signal, pending approvals, blocked-work indicators, and recent failures. When a CLI surface is incomplete or unreliable, the snapshot says `unknown` or `partial` explicitly instead of implying certainty.

**Durable workflow runner.** Multi-agent handoffs persist as filesystem state. If a session dies, the work survives — pick up at the last completed step. A read-only inspection wrapper is allowlisted across every exec-capable agent so workflow recovery doesn't generate routine approval friction.

**Source-controlled agent profiles.** Per-agent `SOUL.md`, `TOOLS.md`, `MEMORY.md`, `IDENTITY.md`, and `USER.md` live in the repo and render into the runtime on sync. No drift between what's on disk and what the agent is actually using.

**Scheduled background work.** Source-of-truth cron jobs sync into the gateway scheduler with last/next-run reporting and consecutive-failure counts.

## Architecture Notes

- Local Docker Compose gateway built on a pinned OpenClaw image digest
- All approval cards route to a single ops channel via build-time runtime rendering
- Repo holds the declarative source of truth; live runtime state lives outside the repo so secrets, sessions, and generated memory don't get committed
- Quality gates: zero-dependency regression suite, coverage thresholds on the runtime renderer, GitHub Actions on every PR

## Status

Active. I'm building toward the operating model, not claiming I've solved every part of it. The first post in the operator-control series — [Operator Control for Agentic Systems](/blog/operator-control-for-agentic-systems/) — describes the thinking behind the design.
