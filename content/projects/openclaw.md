---
title: "OpenClaw Control Plane"
description: "My personal, source-controlled OpenClaw setup for running multi-agent workflows with visible task state, approval guardrails, and provider-agnostic orchestration."
status: "Active"
tags: ["AI/ML", "Agentic", "Operator Control", "Node.js"]
order: 3
featured: true
---

## Overview

This is my personal, source-controlled OpenClaw setup for running multi-agent ops and publishing workflows on my own infrastructure. I'm a user building on top of OpenClaw rather than an upstream contributor, and I keep it running alongside newer integrated agent tools because it stays provider-agnostic and keeps state under my own version control.

## The Problem

Most agent demos hide the middle. A prompt goes in, an answer comes out, and the intermediate tool calls, blocks, and side effects stay buried in scrollback until something goes wrong. That gets harder to manage when multiple agents run across different projects, content drafts, and routine operations with one person responsible for what ships.

## What's in My Setup

**Operator inbox.** A focused approval and blocker view sourced from gateway state rather than Slack scrollback. Slack approval cards handle notifications, while the inbox acts as the recovery surface.

**Status snapshot.** A canonical health view reporting gateway status, pairing signal, pending approvals, blocked-work indicators, and recent failures. When a CLI check is incomplete or unreliable, the snapshot surfaces `unknown` or `partial` explicitly instead of guessing.

**Durable workflow runner.** Multi-agent handoffs persist as filesystem state, so work survives a closed laptop and resumes from the last completed step. Read-only inspection wrappers are allowlisted across exec-capable agents so recovery doesn't trigger routine approval spam.

**Source-controlled agent profiles.** Per-agent `SOUL.md`, `TOOLS.md`, `MEMORY.md`, `IDENTITY.md`, and `USER.md` live in a git repository and sync into the runtime on deploy, preventing drift between disk config and running agents.

**Scheduled background work.** Source-of-truth cron jobs sync into the gateway scheduler with last/next-run reporting and consecutive-failure tracking.

## Architecture Notes

- Local Docker Compose gateway running on a pinned OpenClaw image digest
- Approval cards routed to a single ops channel via build-time runtime rendering
- Declarative source of truth in git, with live runtime state, secrets, and session history stored outside the repo
- Zero-dependency regression tests, runtime renderer coverage checks, and GitHub Actions on every PR

## Status

Active in daily personal use for ops and content workflows. The first post in the operator-control series, [Operator Control for Agentic Systems](/blog/operator-control-for-agentic-systems/), walks through the design principles behind this setup.
