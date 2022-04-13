const initalTemplate = {
  current: {
    rpc: {
      name: 'Wanchain Mainnet',
      rpcUrl: 'https://gwan-ssl.wandevs.org:56891',
      explorer: 'https://wanscan.org/'
    },
    wallet: {},
    contract: {}
  },
  rpcList: [
    {
      name: 'Wanchain Mainnet',
      rpcUrl: 'https://gwan-ssl.wandevs.org:56891',
      explorer: 'https://wanscan.org/'
    }
  ],
  walletList: [
    // {
    //   name: 'Account 1',
    //   address: '0x4Cf0A877E906DEaD748A41aE7DA8c220E4247D9e',
    //   pk: 'xxxx', // encrypted private key
    // },
  ],
  contractList: [
    {
      name: 'ZooKeeper Farming',
      contract: '0x4E4Cb1b0b4953EA657EAF29198eD79C22d1a74A2',
      abi: []
    }
  ],
  unlock: '', // check decrypt tauri-wallet = U2FsdGVkX19ZqVilAVmROv4Bn0S2EBEtI1agRYMexpc=
}
