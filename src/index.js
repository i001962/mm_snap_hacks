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
