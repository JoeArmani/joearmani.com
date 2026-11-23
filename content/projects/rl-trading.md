---
title: "RL Trading Environment"
description: "Applied ML research into deep reinforcement learning for intraday futures, which has since evolved into ongoing private work on systematic trading tooling."
status: "Research"
tags: ["Python", "PyTorch", "Reinforcement Learning", "Finance"]
order: 5
featured: false
---

## Overview

An applied ML research project built around a custom Gym environment for intraday EMini futures (ES, NQ, YM), multi-timeframe feature pipelines, and realistic market-friction modeling.

## Technical Architecture

- **Environment:** Custom OpenAI Gym environment written in Python with PyTorch. Handles multi-timeframe market data across futures instruments, position management with realistic margin constraints, and slippage/commission modeling.
- **Model pipeline:** A cross-attention model processes multi-instrument, multi-timeframe features before feeding representations to the RL agent to test whether inter-market structure improves regime adaptation.
- **Reward engineering:** Risk-adjusted reward formulation combining Sharpe, Sortino, and Calmar metrics with trade-frequency and holding-time penalties rather than raw PnL maximization.
- **Training:** Stable Baselines 3 with supervised pre-training for the attention backbone and parallelized `SubprocVecEnv` rollouts.

## Key Learnings

- Reward formulation and realistic transaction-cost modeling dominate architecture choices
- Without accurate slippage and execution assumptions, agents quickly overfit to simulator artifacts
- Markets are a much harder non-stationary problem than textbook RL benchmarks

## Status

The original RL testbed has evolved into ongoing private work on systematic ES futures execution and early options-selling tooling. I keep implementation details private here; financial markets remain one of the hardest problems I've worked on, and treating research skepticism as a baseline saves a lot of tuition.
