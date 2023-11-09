# Metafight_beta_release
MetaFight: NFT Street Fighter Platform

Overview
This project presents an integration of a street fighting game inspired by the MUGEN game engine, with the added novelty of NFT linkage and betting functionalities similar to those found on Saltybets. It offers a digital arena where NFT collections are gamified, allowing users to bet on outcomes of matches between NFT-represented fighters. Victors in these engagements are entitled to a 2% commission from the betting stakes.

Concept
The platform operates as a SaaS for NFT collections, enabling them to animate their digital assets as combatants in a bespoke fighting game. Users engage with the platform through a betting interface, placing stakes on these NFT fighters and participating in the economic cycle of the game.

Technical Architecture

Frontend
Technologies Used: React.js with TailwindCSS.
Design Philosophy: The frontend is designed for maintenance efficiency, with TailwindCSS reducing the complexity and file count associated with traditional CSS.
Inspirational Sources: The UI takes cues from a variety of open-source designs, prominently from resources like CodePen. An example can be viewed here.

Backend
Framework: Flask is employed for backend services due to its straightforward nature and Python's extensive capabilities.
Deployment Considerations: Although Flask introduces complexity in public deployment scenarios, it is counterbalanced by its ease of development and Python's versatility.

Game Mechanics
Development Route: The inability to use the MUGEN engine led to the adoption of Pygame for game development, enabling the creation of a rudimentary yet functional street fighting experience suitable for reinforcement learning contexts.

Blockchain
Implementation: An ERC-20 based blockchain on the Ethereum network is utilized for the management of NFT assets and transactional operations on the platform.

Streaming
Setup: Integration with virtual monitors and Open Broadcaster Software (OBS) allows for the real-time streaming of matches, This will not be present in the github repository, only the explanation of process.

