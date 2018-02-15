# seeblock
Visual interpretation of what happen in a blockchain

# Get started
### Basic
Clone the project and 
`npm install` or `yarn install`
### Getting the Ethereum blockchain
First we need Geth. If you don't have it installed globally, I suggest you to go the [installation instruction](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Mac).
Then, start download the Ethereum blockchain. It's actually really big so we will stick with the light sync mode.
```
geth --syncmode "light" console
```
It will download a light version of the blockchain. The `console` command start a JavaScript interpreter. You can follow the download by typing `eth.syncing` : if it return `false`, the sync is completed !
### Starting the project
Before seeblock can interact locally with the Ethereum blockchain, we must authorize communication protocol in Geth.
Launch
```
geth --syncmode "light" --ws --wsorigins "http://localhost:8080"
```
In another terminal, go in seeblock cloned folder and launch `npm run dev`

Go to http://localhost:8080 

Done !

# Next ?
seeblock is a work in progress. We will be happy to receive any advice on building this app.


