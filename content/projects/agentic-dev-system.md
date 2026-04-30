---
title: "Agentic Development System"
description: "A spec-driven, multi-agent system for test-driven development across production JavaScript codebases. Works with Claude Code, Gemini CLI, and Codex."
status: "Active"
tags: ["AI/ML", "Agentic", "JavaScript", "TDD"]
order: 2
featured: true
---

## Overview

A structured development system that enables AI coding agents (Claude Code, Gemini CLI, Codex) to work effectively in production codebases without context rot or regression. Built around the "agent contract" pattern: a single AGENTS.md file that any CLI tool can read and follow.

## The Problem

AI coding tools are powerful but brittle in large codebases. They lose context, introduce regressions, and produce inconsistent results across sessions. The more complex the codebase, the worse these problems get.

## The Approach

The system uses three core patterns:

**Agent contracts (AGENTS.md):** A single markdown file per repo that specifies exact commands, constraints, and step-by-step workflows. This makes the system CLI-agnostic. Claude Code, Gemini CLI, and Codex all read markdown.

**Test-driven development workflow:** Every task starts with a planning phase that produces test specifications before any implementation code. The agent writes failing tests first, then implements until they pass. This prevents the "it compiles but doesn't work" problem that plagues AI-generated code.

**Structured review engine:** A local code review system that produces structured JSON + markdown findings, enabling consistent quality checks both pre-PR (self-review) and post-PR (automated review).

## Technical Details

- Covers 3 client-side JavaScript apps and 1 server-side app (Cloud Functions)
- Firebase/Firestore + GCP stack
- Two-tier verification: fast CI checks + local Firebase emulator testing
- Prompt-file-per-task pattern for reproducible agent behavior
- Task working memory (.task/ directory) for context continuity

## Status

Actively in use across production codebases. Iterating on the review engine and multi-repo consistency.
