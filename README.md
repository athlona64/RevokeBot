# HOW TO WORK
This is programable to list all transactions on chain via etherscan provider and check all transaction if your approve balance > 0 for spender to interact with contract will approve 0 replace(this step is revoke)

## Installation

```bash
https://github.com/athlona64/RevokeBot.git
```

```bash
npm i
```

## Config .env

```nodejs
# Replace value in .env file to config your wallet and RPC, API ETHERSCAN

SECRET=replace with your private key
ADDRESS=replace with your address

RPC_MAINNET=https://eth-mainnet.g.alchemy.com/v2/replace-your-api-key
API_MAINNET=replace with your apikey from etherscan

RPC_ARB=https://arb-mainnet.g.alchemy.com/v2/replace-your-api-key
API_ARB=replace with your apikey from arbscan
```

## Start bot
```bash
node app_arbitrum.js
```

## Note
Can your custom more chain with copy file and change name to another chain and add RPC to .env file afther that edit RPC process in app_...js file in 3 step


## License

[MIT](https://choosealicense.com/licenses/mit/)