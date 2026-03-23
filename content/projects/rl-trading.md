---
title: "RL Trading Environment"
description: "Research on applying deep reinforcement learning to EMini futures trading. Cross-attention models, custom reward engineering, and a lot of humbling results."
status: "Research"
tags: ["Python", "PyTorch", "Reinforcement Learning", "Finance"]
order: 3
featured: true
---

## Overview

A research project applying deep reinforcement learning to intraday futures trading. The system operates on EMini contracts (ES, NQ, YM) using multi-timeframe data and custom environment design.

## Technical Architecture

**Environment:** Custom OpenAI Gym environment built in Python with PyTorch. Handles multi-timeframe data for three futures instruments, position management with realistic margin requirements, and market impact/slippage modeling.

**Model pipeline:** A cross-attention model processes multi-instrument, multi-timeframe features before feeding into the RL agent. This allows the system to capture inter-market relationships that single-instrument models miss.

**Reward engineering:** Multi-factor reward function combining Sharpe ratio, Sortino ratio, Calmar ratio, trade frequency scoring, and time decay penalties. Designed to encourage risk-adjusted returns rather than raw PnL maximization.

**Training:** Stable Baselines 3 for the RL component, with separate supervised pre-training of the attention model. Uses SubprocVecEnv for parallel training environments.

## Key Learnings

- Reward function design dominates model architecture choices in trading RL
- Realistic transaction cost and slippage modeling is essential. Without it, the agent learns strategies that only work in simulation
- Multi-instrument cross-attention captures regime shifts better than single-instrument approaches

## Status

Research phase. Refining the reward function and exploring different RL algorithms. This is a research project in applied ML, not a production trading system.
