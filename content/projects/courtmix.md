---
title: "CourtMix"
description: "A live racquet-sports court directory with 5,000+ verified places across four states, powered by an AI extraction and verification pipeline."
status: "Active"
tags: ["Astro", "Firebase", "Cloudflare", "AI Pipeline", "Data"]
order: 1
featured: true
links:
  live: "https://courtmix.net"
---

## Overview

CourtMix is a live web directory for tennis and pickleball players at [courtmix.net](https://courtmix.net), currently listing 5,000+ verified places across four states (Colorado, Kansas, Michigan, and Arizona) and expanding nationwide.

The site is built on Astro and Cloudflare on top of a Firebase backend. Visitors can search and browse local courts right away with no account wall or paywall.

## Data and Verification Pipeline

Public court data is messy. Municipal park PDFs, city recreation tables, club pages, and open map records regularly disagree on surface types, lighting, public access, or whether a facility is actually free to play.

To keep listings honest at multi-state scale, CourtMix uses an ingestion workflow built around AI extraction + independent verification, with human approval on merges and hard-to-undo changes. Extraction passes normalize raw municipal and web sources into structured candidates, an independent verifier cross-checks key claims against source text, and record merges, ownership claims, and production writes wait for explicit human sign-off.

## From Racquet Rivalry to CourtMix

CourtMix grew out of Racquet Rivalry, my first mobile app. I built Racquet Rivalry with Flutter and Firebase in 2022 as a local matchmaking app for tennis, pickleball, and table tennis players, reaching roughly 1,900 downloads on Google Play before running into the classic local marketplace cold-start problem.

Instead of throwing away that foundation, its Firebase backend evolved into the data and API layer behind the live CourtMix web directory. The mobile matchmaking experience remains on the future roadmap, built on top of a directory that already solves local discovery on day one.

## Status

Live and actively expanding coverage state by state at [courtmix.net](https://courtmix.net).
