const { errors: rpcErrors } = require('eth-json-rpc-errors');
const { IPFS } = require('./ipfs');

const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  protocol: 'https',
});

module.exports.onRpcRequest = async ({ origin, request }) => {
  console.log('starting....')
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });
  console.log('state', state);
  if (!state) {
    state = {book:[]}; 
    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  switch (request.method) {
      case 'add':
        return await ipfs.add(request.params[0]);
      case 'cat':
        return await ipfs.cat(request.params[0]);

      case 'storeAddress': 
        state.book.push({
          name:request.nameToStore,
          address:request.addressToStore
        });
        await wallet.request({
          method: 'snap_manageState', 
          params: ['update', state], 
        }); 
        return true; 
    case 'retrieveAddresses': 
      return state.book;   
    case 'hello':
      let address_book = state.book.map(function(item){
          return `${item.name}: ${item.address}`; 
        }).join("\n"); 
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${origin}!`,
            description: 'Address book:',
            textAreaContent: address_book,
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
};
