<h1 align="center">Flipper</h1>
<p align="center"><b>Share, Donate, Create</b></p>

<p align="center">
    <img src="https://raw.githubusercontent.com/marcelofeitoza/chainlink-hackathon/main/assets/Mockup.png" alt="Flipper"/>
</p>

# The Problem

Social networks have been facing growing user rejection due to concerns over governance issues. Users are apprehensive about new policies negatively impacting their experience, and there is a fear of potential censorship through strict codes of conduct. The lack of user participation in decision-making processes has eroded trust in current social network platforms. Moreover, there is an increasing problem of government censorship, where platforms are being blocked or restricted by governments, limiting freedom of expression and access to information.

# Our Solution: Flipper

Flipper takes a bold stance against censorship and firmly upholds the values of free speech. The platform recognizes the vital importance of allowing individuals to express their thoughts and opinions without fear of retribution or suppression. By leveraging cutting-edge technologies, such as blockchain and decentralized autonomous organization (DAO), Flipper provides a robust solution to the governance censor, ensuring that users' freedom of expression is protected.

Through its decentralized nature, Flipper utilizes artificial intelligence (AI) algorithms that are transparent, unbiased, and continuously improving. Flipper uses recommendation algorithms that offer the user the most relevant content always, without any kind of bias or manipulation. If you like it, you'll see it.

In Flipper, users have the ability to engage in open discussions, share diverse perspectives, and challenge prevailing narratives, fostering intellectual discourse and driving positive change. The platform's commitment to free speech enables users to express their ideas, collaborate on projects, and collectively contribute to a thriving digital ecosystem where innovation and creativity thrive.

## DAO: Empowering the Community

Flipper operates as a Decentralized Autonomous Organization (DAO), placing power back into the hands of the users. The DAO allows users to actively participate in shaping the platform's rules, policies, and features through a transparent voting system. This approach fosters a sense of community ownership and ensures that decisions are made collectively rather than unilaterally imposed by a centralized authority.

## Tech for Good: Building a Better Digital Space

At Flipper, we are committed to creating a safe, inclusive, and empowering environment for all users. We prioritize user privacy, security, and data protection, ensuring that user information remains secure and under their control. Our AI-powered algorithms work tirelessly to promote positive engagement, reduce harmful content, and combat misinformation. Flipper's dedication to tech for good sets us apart as a platform that genuinely cares about its users and their well-being.

## Artificial Intelligence: Enhancing User Experience

Flipper leverages advanced artificial intelligence techniques, including TF-IDF (Term Frequency-Inverse Document Frequency) and KNN (K-Nearest Neighbors), to provide a seamless and intelligent social media experience. Our AI algorithms analyze user behavior, preferences, and interests to personalize content feeds, ensuring that users see the most relevant and engaging posts. By understanding the context and relevance of different content, Flipper adapts and evolves with the needs of its diverse user base, enhancing the overall user experience.

## AWS Infrastructure: Ensuring Reliability and Accessibility

To address the problem of government censorship and ensure platform availability, Flipper leverages AWS infrastructure. By utilizing Amazon Web Services' global network of servers and cloud services, Flipper can maintain a reliable and accessible platform. This helps to circumvent regional restrictions and ensure that users can access Flipper regardless of their location.

## Blockchain: Enabling Transparency and Security

Flipper incorporates blockchain technology to enhance transparency and security. With the integration of blockchain, Flipper ensures that user interactions and transactions are recorded immutably, providing transparency and trust in the platform's operations. Additionally, blockchain enables secure and decentralized storage of user data, further protecting user privacy.

### Chainlink Services

Flipper brings with it an emerging blockchain technology, the oracles, which were implemented through chainlink technologies. A donation system with automatic conversion from dollar to AVAX was integrated using Chainlink Data Feed to create a partnership ecosystem, allowing users to support posts that raise awareness or make them laugh. In addition, the platform features the creation of dynamic NFTs for user profile photos, bringing the advantage of creating a transparent history of the image which the user identifies through the Chainlink Automation service and IPFS.,

With Flipper, we're revolutionizing social media governance, placing power back into the hands of the users. By embracing DAO, leveraging technology for good, and harnessing the potential of artificial intelligence, Flipper is set to redefine the social media landscape and create a platform that truly reflects the values and desires of its community.

Join us on Flipper and be part of the social media revolution!

## Architecture

#### Blockchain Architecture

<img src="https://raw.githubusercontent.com/marcelofeitoza/chainlink-hackathon/main/assets/Architecture.jpg" width="100%;" alt="Architecture image">
<br>

#### AWS Architecture

<img src="https://raw.githubusercontent.com/marcelofeitoza/chainlink-hackathon/main/assets/AWSArchitecture.jpg" width="100%;" alt="Architecture image">
<br>

## Technologies

-   Front-end
    -   Next.js
    -   TypeScript
    -   Tailwind CSS
-   Back-end
    -   Node.js
    -   Express.js
    -   Prisma
    -   Postgresql
-   Blockchain
    -   Solidity
    -   Truffle
    -   Hardhat
    -   Ethers.js
    -   Chainlink Services (Automation, Data Feed, Functions)
    -   IPFS
-   Artificial Intelligence
    -   Python
    -   Rust

## File tree

```
├── backend
│    ├── controllers
│    ├── database
│    ├── middlewares
│    ├── prisma
│    ├── routes
│    ├── services
│
├── blockchain
│    ├── build
│    ├── contracts
│    ├── migrations
│
├── dao
│    ├── contracts
│    ├── deploy
│    ├── scripts
│    ├── test
│    ├── utils
│
├── frontend
│    ├── animations
│    ├── assets
│    ├── components
│    ├── pages
│    ├── services
│    ├── styles
│    ├── utils
│
├── ai
```


## Running application

To run the application there are some dependencies that need to be installed due to the technologies used, they are:

-   Node Js

### Run client

To run the frontend client it is necessary to enter the frontend repository named `frontend` and run the following commands to install the project dependencies and then to run the client.

```
  $ npm i
  $ npm run dev
```

### Run server

To run the backend server it is necessary to enter the frontend repository named `backend` and run the following commands to install the project dependencies and then to run the server.

```
  $ npx prisma migrate dev
  $ npm i
  $ npm run dev
```
