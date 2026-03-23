---
title: "From Woodshop to Code: Eight Years of Shipping Tables Before Shipping Software"
description: "How running my woodworking factory taught me more about building software than I expected, and what the transition to AI engineering looked like from the inside."
date: 2026-03-22
tags: ["career", "ai-ml"]
draft: false
featured: true
readingTime: 8
lastModified: 2026-03-23
---

Every week for eight years, I solved a bin packing problem by hand.

I didn't know that's what it was called. I just knew I had raw hardwood boards of varying lengths and widths, a stack of customer orders with specific dimensions, and a limited amount of production space to work with. My job was to figure out the most efficient way to cut those boards to fill those orders with minimal waste while maximizing output on a factory floor that never felt big enough.

I was running a woodworking factory. Armani Fine Woodworking. We built hardwood countertops and shipped them direct to customers' doors across the country. And every piece of that operation was a system I'd designed from scratch, years before I'd ever written a line of code.

## The Factory Years

The whole thing started with a single Etsy order. I built the first butcher block in a spare bedroom, packed it up, and shipped it myself. Within a few months I'd moved into a garage. Within two years, a proper factory. That trajectory taught me something I keep coming back to: start with one customer, solve their problem well, and the system scales from there.

Running a manufacturing business teaches you that everything is a pipeline. I built the ecommerce website for all our sales. On armanifinewoodworking.com, I built a custom pricing calculator where customers could plug in their countertop dimensions and get an instant quote. That calculator had to account for material costs per board foot, waste factor, labor time, finishing materials, packaging, and shipping weight to their zip code. It was the most complex thing I'd ever built at the time, and I didn't think of myself as a technical person.

Orders flowed in from the site, hit the production queue, moved through cutting, sanding, finishing, and QC, then got packaged and shipped. I was scheduling production runs, batching similar orders together, managing queue priority based on deadlines and material availability. That's a scheduling algorithm. I just called it "Tuesday."

A few years in, I had an amazing team of woodworkers. And something I didn't expect happened: each person started optimizing their own subprocess within the larger production flow. Someone found a way to batch ripsaw cuts that saved material. The finisher developed a rotation system that increased throughput. Nobody asked them to do this. They owned their part of the pipeline and made it better on their own. The whole system improved because the people inside it were independently improving their pieces of it. If that sounds like a well-functioning engineering team, it's because it is.

It was a grind. Sawdust in everything. Logistics headaches. Shipping damage claims. The margins were tight and the days were long. But I was building an end-to-end system that took raw lumber and turned it into finished countertops on someone's kitchen island, and the team I'd built was making that system better every week.

I didn't romanticize it at the time. You don't when you're in it. But looking back, we were doing systems engineering with table saws instead of servers.

## The Pivot

After about eight years, two things converged: I was genuinely burnt out on manufacturing, and I was getting more and more fascinated by what was happening in tech.

Part of it was watching my brother. He's a talented software engineer, and at the time he was at MongoDB during their high-growth years. Seeing what he was building, and the pace of it, made something click. I'd been solving engineering problems with lumber for nearly a decade. What if I did it with code?

Then I started reading about machine learning and neural networks, and the fit was immediate. Systems. Inputs and outputs. Feedback loops. Optimization under constraints. I'd been doing this work intuitively for years. I wanted to understand the formal version.

Selling a woodworking factory isn't a quick process. It took about a year to find a buyer. But I eventually closed the sale and was ready to start the next chapter.

Then COVID hit the US three weeks later.

The timing was either terrible or perfect, depending on how you look at it. I'd just walked away from my entire livelihood with a plan to go back to school, and the world shut down. But it also meant zero distractions. No commute. No temptation to "maybe just consult for a while." The bridge was burned.

## The Accelerated Path

I finished my Computer Science degree in 16 months during the pandemic. Summa Cum Laude from CSU Global.

I'm not saying that to brag. I'm saying it because when you're changing careers in your thirties and the runway is short, you move differently. There's a specific kind of motivation that comes from having no fallback plan.

After the degree, I spent about a year building Racquet Rivalry from scratch. A mobile app connecting local racquet sports players by skill level and match preferences. Flutter, Firebase, the whole stack. This was pre-ChatGPT, pre-AI-assisted coding. Every line typed by hand, every bug tracked down manually, every deployment pipeline figured out from documentation and Stack Overflow.

The app shipped. About 1,900 downloads. And a negative review in the first week, possibly from a competitor, though I'll never know for sure. That one stung more than I expected. You spend a year building something alone, put it in the world, and the first piece of feedback is someone tearing it down. But I learned more about building and shipping a real product from that one app than from any course or tutorial. App store review processes. User feedback loops. The gap between "works on my machine" and "works in production." That year was worth more than the download count suggests.

What I wanted next was to do meaningful work with a team. Solo building taught me a lot, but I wanted collaboration. Code reviews. Shared problem-solving. I found a position as a Senior Software Engineer at the National Cancer Institute, working on the Connect for Cancer Prevention Study, one of the largest prospective cancer studies ever conducted. The study tracks 200,000 participants starting before any cancer diagnosis, collecting specimens over decades, with the goal of finding new early detection markers. The datasets we're building will eventually be anonymized and available to researchers across academia and institutions far beyond the government.

Three years in, and it still feels worth showing up for. The tech isn't always the latest and greatest, but knowing that the data infrastructure I build could help a researcher somewhere find an early detection marker ten years from now makes it worthwhile in a way that's hard to quantify.

Once I was settled at NCI, I could finally chase what I'd originally pivoted for. I went back for my Master's in AI/ML, doing the program while working full-time. Graduated with a 4.0. The coursework gave me solid foundations, though I'll be honest: I've learned more from building things than from any classroom.

## The AI Chapter

What drew me to AI wasn't the hype. It was the force multiplication.

AI and ML are fundamentally about building systems that learn and adapt. That clicked immediately with how I'd always thought about problems. The factory was a system I optimized by hand over eight years. Machine learning is a system that optimizes itself. The jump from one to the other felt less like a career change and more like a natural progression.

I'm post-masters now and fully in it. I'm building a spec-driven, multi-agent development system that uses AI agents for test-driven development across production codebases. I'm researching reinforcement learning applied to EMini futures trading, which, for the record, is humbling. Markets are significantly harder than textbook problems. I'm rebuilding Racquet Rivalry using the agentic development tools I'm building. And I'm writing about all of it, because I think practitioners sharing real experiences is more valuable than another think piece about the future of AI.

## What I Actually Believe About What Comes Next

The gap between the AI hype cycle and what actually works in production is enormous. Almost nobody is filling that middle ground honestly. I find that space fascinating.

I think Jevons' paradox is about to play out in software. When steam engines got more efficient, coal consumption didn't drop. It increased, because efficiency made new applications economically viable. The same thing is happening with code. As AI makes software dramatically faster and cheaper to produce, the response won't be "we need fewer developers." It'll be "we can finally build all the software we never had the budget for." There's going to be a lot more software in the world. And most of it will be good.

Agentic development is barely getting started. I run multiple AI agents on different parts of a codebase at the same time now. Two years ago, that wasn't possible. Two years from now, it'll be the baseline. The developers who do well won't be the ones who type the fastest. They'll be the ones who can think in systems, write clear specifications, and direct agents toward the right problems.

Which brings me back to the factory floor.

The skills that matter most in this moment aren't the ones I learned in a CS program. They're the ones I accidentally picked up running a manufacturing operation for eight years. Understanding systems end-to-end. Knowing what customers actually need versus what they ask for. Optimizing a process with real constraints, not just theoretical ones. Thinking about the full pipeline, from first input to final output, and everything that can break in between.

I didn't plan this career arc. Eight years of sawdust wasn't a strategic move toward AI engineering. But it turns out that building real things for real customers, and dealing with all the messy reality that comes with it, teaches you something that no bootcamp covers: how to think about whole systems. And right now, with AI agents that can write code but can't decide what to build or why, that might be the most valuable skill there is.
