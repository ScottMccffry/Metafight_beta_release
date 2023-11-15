# Metafight_beta_release

MetaFight: NFT Street Fighter Platform

## Overview

This project presents an integration of a street fighting game inspired by the MUGEN game engine, with the added novelty of NFT linkage and betting functionalities similar to those found on Saltybets. It offers a digital arena where NFT collections are gamified, allowing users to bet on outcomes of matches between NFT-represented fighters. Victors in these engagements are entitled to a 2% commission from the betting stakes.

## Concept

The platform operates as a SaaS for NFT collections, enabling them to animate their digital assets as combatants in a bespoke fighting game. Users engage with the platform through a betting interface, placing stakes on these NFT fighters and participating in the economic cycle of the game.

## Technical Architecture

### Frontend

- **Technologies Used**: React.js with TailwindCSS.
- **Design Philosophy**: The frontend is designed for maintenance efficiency, with TailwindCSS reducing the complexity and file count associated with traditional CSS.
- **Inspirational Sources**: The UI takes cues from a variety of open-source designs, prominently from resources like CodePen.

### Backend

- **Framework**: Flask is employed for backend services due to its straightforward nature and Python's extensive capabilities.
- **Deployment Considerations**: Although Flask introduces complexity in public deployment scenarios, it is counterbalanced by its ease of development and Python's versatility.

### Game Mechanics

- **Development Route**: The inability to use the MUGEN engine led to the adoption of Pygame for game development, enabling the creation of a rudimentary yet functional street fighting experience suitable for reinforcement learning contexts.

### Blockchain

- **Implementation**: An ERC-20 based blockchain on the Ethereum network is utilized for the management of NFT assets and transactional operations on the platform.

### Streaming

- **Setup**: Integration with virtual monitors and Open Broadcaster Software (OBS) allows for the real-time streaming of matches. This will not be present in the GitHub repository, only the explanation of the process.


## Usage

(Describe how users can start the game, place bets, and view matches. Include any commands or scripts they need to run.)

## Project Structure

The repository is organized into four main directories, each serving a distinct aspect of the MetaFight platform:

### `backend/`
This directory contains all the server-side code written in Python using the Flask framework. It is structured as follows:

- `app/`: Contains the Flask application and its various components such as models, views, and services.
  - `models/`: Defines the data models used for the application's database.
  - `routes/`: Contains the URL routes and their corresponding request handlers.
  - `services/`: Holds the business logic and the service layer that interacts with models.
- `utils/`: Includes utility scripts and helper functions.
- `venv/`: The virtual environment directory where all the dependencies are installed.
- `instance/`: Stores instance-specific configurations and files.

### `frontend/`
This directory houses the client-side code, which is built using React.js and styled with TailwindCSS. Its structure includes:

- `public/`: Contains the static files like the HTML template, icons, and manifest files.
- `src/`: The source directory for React components and assets.
  - `assets/`: Stores static assets such as images and stylesheets.
  - `components/`: React components that make up the user interface.
  - `context/`: React context for state management across components.
  - `pages/`: The different pages of the application, each representing a route in the web app.

### `blockchain/`
This directory is dedicated to the blockchain aspect of the project and includes:

- `contracts/`: Smart contracts written in Solidity for the Ethereum blockchain.
- `scripts/`: Deployment scripts and other blockchain-related utilities.
- `test/`: Contains tests for the smart contracts ensuring their proper functioning.

### `game/`
The game directory contains the assets and code for the street fighting game:

- `assets/`: Graphics, audio files, and other game assets.
- `__pycache__/`: Compiled Python files to speed up game startup.
- The main game scripts are located in the root of this directory, which utilize the Pygame library for game development.

Each directory is equipped with its own `README.md` file that provides more detailed information about the components and how to work with them. It is recommended to read these files to understand the setup and contribution guidelines for each part of the project.




## License

(Include details about the project's license here. If the project is open-source, specify the type of license it uses.)

## Credits and Acknowledgments

(A section to acknowledge contributors, third-party services, or open-source projects that have been instrumental in the development of MetaFight.)

## Contact Information

(Provide details on how to reach out for support, to contribute, or for any discussions related to the project. This could include an email address, a Discord server, or a forum link.)


