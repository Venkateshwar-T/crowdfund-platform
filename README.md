# CrowdFund

A modern decentralized crowdfunding platform built with Next.js, Ethereum (Sepolia), and The Graph.

## Features

- **Blockchain Escrow**: Funds are held securely by a smart contract.
- **USD Stable Goals**: Uses Chainlink Oracles to manage ETH volatility.
- **Decentralized Indexing**: Powered by a custom Subgraph for real-time data.
- **IPFS Media**: Campaign images are stored permanently on the distributed web.
- **Transparent Profiles**: Verifiable contribution and campaign history.

## Tech Stack

- **Frontend**: Next.js 15, React 19, ShadCN UI, Tailwind CSS
- **Blockchain**: Viem, Wagmi, RainbowKit
- **Indexing**: Apollo Client, GraphQL (The Graph)
- **Database**: Firestore (for off-chain user metadata)
