<h1 align="center">
  Liquidations Portal
</h1>

An open source interface for viewing and interacting with MakerDAO collateral liquidations

## Development

Install it and run:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

_Requires node version >= v11.15.0_

### Environment (optional)

1. Create a local `.env` file
2. Set `INFURA_KEY` to a valid Infura API key
3. Set `ALCHEMY_KEY` to a valid Alchemy API key

If API keys aren't provided, both Alchemy and Infura will default to the public keys from [ethers.js](https://github.com/ethers-io/ethers.js/). This is probably fine in most cases, performance will just be a bit less consistent as these are heavily rate-limited.
