
import React from 'react';
import {useState, useMemo, useEffect, useCallback} from 'react';
import {
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';


import {
  configure,
  handleResponse,
  WalletMobileSDKEVMProvider,
  
} from '@coinbase/wallet-mobile-sdk';
import {MMKV} from 'react-native-mmkv';

// import { ethers } from "ethers";
// import Web3 from 'web3';
// import CoinbaseSdk from '@coinbase/wallet-sdk' 
// Configure Mobile SDK
configure({
  hostURL: new URL('https://wallet.coinbase.com/wsegue'),
  // callbackURL: new URL('example.rn.dapp://'), // Your app's Universal Link
  callbackURL: new URL('example.rn.dapp://'), // Your app's Universal Link
  hostPackageName: 'org.toshi',
});

const provider = new WalletMobileSDKEVMProvider();
const storage = new MMKV();

const TestingPage = function () {

  

  const [log, setLog] = useState('');

  const cachedAddress = useMemo(() => storage.getString('address'), []);
  const [address, setAddress] = useState(cachedAddress);

  const isConnected = address !== undefined;

  useEffect(function setupDeeplinkHandling() {
    // Pass incoming deeplinks into Mobile SDK
    const subscription = Linking.addEventListener('url', ({url}) => {
      console.log('-- handleResponse --', url);
      handleResponse(url);
    });

    return function cleanup() {
      subscription.remove();
    };
  }, []);

  const logMessage = useCallback(message => {
    setLog(prev => `${message}\n${prev}`);
  }, []);

  // Initiate connection to Wallet
  const connectWallet = useCallback(async () => {
    logMessage('--> eth_requestAccounts\n');

    try {
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
        params: [],
      });
      setAddress(accounts[0]);
      storage.set('address', accounts[0]);
      console.log(accounts)
      logMessage(`<-- ${accounts}`);
    } catch (e) {
      console.error(e.message);
      logMessage('<-- error connecting');
    }




//-----------------------------------------------------------------------------------------






    // const provider = new ethers.EtherscanProvider("goerli",'MPZZ1QI7ZR2MN6I6TH4AETRXJFQUNF95P9')

  
    // const address = '0x0FDdBD90d75cfc418E2f1c36598F938843016452';

    // provider.getBalance(address).then((balance) => {
    //   const etherBalance = ethers.formatEther(balance);
    //   console.log(`Balance of ${address}: ${etherBalance} ETH`);
    // }).catch((err) => {
    //   console.error('Error fetching balance:', err);
    // });



// ---------------------------------------------------------
  
  
//   const privateKey = '63a373e7dad479c06fd155b9a52dcf069da7ada6689f2ee6c70c70a4ee86147c';

// // Replace with your Infura or Ethereum node URL
//   const ethereumNodeUrl = 'https://goerli.infura.io/v3/2ddacf7ad8c84db58157e98d8842999b';
//   const provider = new ethers.JsonRpcProvider(ethereumNodeUrl);

//   console.log(provider)
//   const wallet = new ethers.Wallet(privateKey, provider);
//   console.log(wallet)
  
//   const amountInWei = ethers.parseEther('0.1');

//   const transaction = {
//     to: "0x4A79A44301d234743CeC7337928DE0F3c27c1E76",
//     value: amountInWei,
    
//   };
//   const signedTransaction = await wallet.signTransaction(transaction);
//   const tx = await provider.sendTransaction(signedTransaction);
//   console.log('Transaction hash:', tx.hash);





  }, [logMessage]);

  // Reset connection to Wallet
  const resetConnection = useCallback(() => {
    logMessage('--- Disconnect\n');

    provider.disconnect();
    setAddress(undefined);
    storage.delete('address');
  }, [logMessage]);

  const personalSign = useCallback(async () => {
    logMessage('--> personal_sign\n');

    try {
      const result = await provider.request({
        method: 'personal_sign',
        params: ['0x48656c6c6f20776f726c64', address],
      });

      logMessage(`<-- ${result}`);
    } catch (e) {
      logMessage(`<-- ${e.message}`);
    }
  }, [logMessage, address]);

  const switchToEthereumChain = useCallback(async () => {
    logMessage('--> wallet_switchEthereumChain: 0x1\n');

    try {
      const result = await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '0x1'}],
      });

      logMessage(`<-- ${result}`);
    } catch (e) {
      console.error(e.message);
      logMessage('<-- error');
    }
  }, [logMessage]);

  const switchToPolygonChain = useCallback(async () => {
    logMessage('--> wallet_switchEthereumChain: 0x89\n');

    try {
      const result = await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '0x89'}],
      });

      logMessage(`<-- ${result}`);
    } catch (e) {
      console.error(e.message);
      logMessage('<-- error');
    }
  }, [logMessage]);

  const addMumbaiTestnet = useCallback(async () => {
    logMessage('--> wallet_addEthereumChain: Mumbai Testnet\n');

    try {
      const result = await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x13881',
            chainName: 'Matic(Polygon) Mumbai Testnet',
            nativeCurrency: {
              name: 'tMATIC',
              symbol: 'tMATIC',
              decimals: 18,
            },
            rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
            blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
          },
        ],
      });

      logMessage(`<-- ${result}`);
    } catch (e) {
      console.error(e.message);
      logMessage('<-- error');
    }
  }, [logMessage]);
  
  
  const watchAssets = useCallback(async () => {
    logMessage('--> Watch Assests\n');

    try {
      const result = await provider.request(
      //   {
      //   "jsonrpc":"2.0",
      //   method: "eth_sendTransaction",
      //   params: [
      //     {
      //       from: "0x0FDdBD90d75cfc418E2f1c36598F938843016452",
      //       to: "0x4A79A44301d234743CeC7337928DE0F3c27c1E76",
      //       gas: "0x76c0", // 30400
      //       gasPrice: "0x9184e72a000", // 10000000000000
      //       value: "0x9184e72a", // 2441406250
      //       data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
      //     },
      //   ],
      //   id:1
      // }
      {
        id: 1,
      jsonrpc: "2.0",
      method: "eth_sendTransaction",
      params: [
        {
          // "data":"0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
        "data": "0x606060405236156100f95763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305d2035b81146100fb57806306fdde031461011f578063095ea7b3146101af57806318160ddd146101d057806323b872dd146101f2578063313ce567146102195780633f4ba83a1461023b57806340c10f191461025f5780635c975abb1461029257806370a08231146102b65780637d64bcb4146102e45780638456cb59146103085780638da5cb5b1461032c57806395d89b4114610358578063a9059cbb146103e8578063c14a3b8c14610409578063dd62ed3e14610447578063f2fde38b1461047b575bfe5b341561010357fe5b61010b610499565b604080519115158252519081900360200190f35b341561012757fe5b61012f6104a9565b604080516020808252835181830152835191928392908301918501908083838215610175575b80518252602083111561017557601f199092019160209182019101610155565b505050905090810190601f1680156101a15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101b757fe5b6101ce600160a060020a0360043516602435610537565b005b34156101d857fe5b6101e06105d7565b60408051918252519081900360200190f35b34156101fa57fe5b6101ce600160a060020a03600435811690602435166044356105dd565b005b341561022157fe5b6101e0610607565b60408051918252519081900360200190f35b341561024357fe5b61010b61060d565b604080519115158252519081900360200190f35b341561026757fe5b61010b600160a060020a0360043516602435610695565b604080519115158252519081900360200190f35b341561029a57fe5b61010b610769565b604080519115158252519081900360200190f35b34156102be57fe5b6101e0600160a060020a0360043516610779565b60408051918252519081900360200190f35b34156102ec57fe5b61010b610798565b604080519115158252519081900360200190f35b341561031057fe5b61010b61080d565b604080519115158252519081900360200190f35b341561033457fe5b61033c61089a565b60408051600160a060020a039092168252519081900360200190f35b341561036057fe5b61012f6108a9565b604080516020808252835181830152835191928392908301918501908083838215610175575b80518252602083111561017557601f199092019160209182019101610155565b505050905090810190601f1680156101a15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156103f057fe5b6101ce600160a060020a0360043516602435610937565b005b341561041157fe5b61033c600160a060020a036004351660243560443561095f565b60408051600160a060020a039092168252519081900360200190f35b341561044f57fe5b6101e0600160a060020a03600435811690602435166109f3565b60408051918252519081900360200190f35b341561048357fe5b6101ce600160a060020a0360043516610a20565b005b60035460a860020a900460ff1681565b6005805460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561052f5780601f106105045761010080835404028352916020019161052f565b820191906000526020600020905b81548152906001019060200180831161051257829003601f168201915b505050505081565b801580159061056a5750600160a060020a0333811660009081526002602090815260408083209386168352929052205415155b156105755760006000fd5b600160a060020a03338116600081815260026020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a35b5050565b60045481565b60035460a060020a900460ff16156105f55760006000fd5b610600838383610a79565b5b5b505050565b60075481565b60035460009033600160a060020a0390811691161461062c5760006000fd5b60035460a060020a900460ff1615156106455760006000fd5b6003805474ff0000000000000000000000000000000000000000191690556040517f7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b3390600090a15060015b5b5b90565b60035460009033600160a060020a039081169116146106b45760006000fd5b60035460a860020a900460ff16156106cc5760006000fd5b6004546106df908363ffffffff610b9d16565b600455600160a060020a03831660009081526001602052604090205461070b908363ffffffff610b9d16565b600160a060020a038416600081815260016020908152604091829020939093558051858152905191927f0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d412139688592918290030190a25060015b5b5b92915050565b60035460a060020a900460ff1681565b600160a060020a0381166000908152600160205260409020545b919050565b60035460009033600160a060020a039081169116146107b75760006000fd5b6003805475ff000000000000000000000000000000000000000000191660a860020a1790556040517fae5184fba832cb2b1f702aca6117b8d265eaf03ad33eb133f19dde0f5920fa0890600090a15060015b5b90565b60035460009033600160a060020a0390811691161461082c5760006000fd5b60035460a060020a900460ff16156108445760006000fd5b6003805474ff0000000000000000000000000000000000000000191660a060020a1790556040517f6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff62590600090a15060015b5b5b90565b600354600160a060020a031681565b6006805460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561052f5780601f106105045761010080835404028352916020019161052f565b820191906000526020600020905b81548152906001019060200180831161051257829003601f168201915b505050505081565b60035460a060020a900460ff161561094f5760006000fd5b6105d38282610bb9565b5b5b5050565b600354600090819033600160a060020a039081169116146109805760006000fd5b60035460a860020a900460ff16156109985760006000fd5b3085846109a3610cb1565b600160a060020a039384168152919092166020820152604080820192909252905190819003606001906000f08015156109d857fe5b90506109e48185610695565b508091505b5b5b509392505050565b600160a060020a038083166000908152600260209081526040808320938516835292905220545b92915050565b60035433600160a060020a03908116911614610a3c5760006000fd5b600160a060020a03811615610a74576003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790555b5b5b50565b600060606064361015610a8c5760006000fd5b600160a060020a038086166000908152600260209081526040808320338516845282528083205493881683526001909152902054909250610ad3908463ffffffff610b9d16565b600160a060020a038086166000908152600160205260408082209390935590871681522054610b08908463ffffffff610c8716565b600160a060020a038616600090815260016020526040902055610b31828463ffffffff610c8716565b600160a060020a038087166000818152600260209081526040808320338616845282529182902094909455805187815290519288169391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a35b5b5050505050565b6000828201610bae84821015610ca0565b8091505b5092915050565b60406044361015610bca5760006000fd5b600160a060020a033316600090815260016020526040902054610bf3908363ffffffff610c8716565b600160a060020a033381166000908152600160205260408082209390935590851681522054610c28908363ffffffff610b9d16565b600160a060020a038085166000818152600160209081526040918290209490945580518681529051919333909316927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a35b5b505050565b6000610c9583831115610ca0565b508082035b92915050565b801515610a745760006000fd5b5b50565b60405161025f80610cc28339019056006060604052341561000c57fe5b60405160608061025f8339810160409081528151602083015191909201515b4281116100385760006000fd5b60008054600160a060020a03808616600160a060020a031992831617909255600180549285169290911691909117905560028190555b5050505b6101de806100816000396000f300606060405263ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416634e71d92d811461003a575bfe5b341561004257fe5b61004a61004c565b005b6001546000903373ffffffffffffffffffffffffffffffffffffffff9081169116146100785760006000fd5b6002544210156100885760006000fd5b6000805460408051602090810184905281517f70a0823100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff3081166004830152925192909316936370a082319360248082019492918390030190829087803b151561010157fe5b6102c65a03f1151561010f57fe5b505060405151915050600081116101265760006000fd5b60008054600154604080517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9283166004820152602481018690529051919092169263a9059cbb926044808201939182900301818387803b151561019d57fe5b6102c65a03f115156101ab57fe5b5050505b505600a165627a7a723058204c37435b790331d68c36965a2a6a779ee7dfa9e5ef15513f34e6101f902c29460029a165627a7a72305820bd47f6ac2bce50684ad966d758abb0d15a897d3c3e985efd1d4b5ce46e7353360029",
        // "data":'0x11',
        "from": "0x0FDdBD90d75cfc418E2f1c36598F938843016452",
        "gas": "0x76c0",
        "gasPrice": "0x9184e72a000",
        "to": "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
        "value": "0x9184e72a"
      }
    ]
    }


      ).then(res=>console.log(res))
      console.log(result)

      logMessage(`<-- ${result}`);
    } catch (e) {
      console.error(e.message);
      logMessage('<-- error');
    }
  }, [logMessage]);



  const sendTransaction = useCallback(async () => {
    logMessage('--> Send Transaction usieng makeReq method\n');

    const result = await provider.request(
        {
        "jsonrpc":"2.0",
        method: "eth_sendTransaction",
        params: [
          {
            from: "0x0FDdBD90d75cfc418E2f1c36598F938843016452",
            to: "0x4A79A44301d234743CeC7337928DE0F3c27c1E76",
            gas: "0x76c0", // 30400
            gasPrice: "0x9184e72a000", // 10000000000000
            value: "0x9184e72a", // 2441406250
            data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
          },
        ],
        id:1
      }).then(res=>console.log(res))
      console.log(result)
  
  }, [logMessage]);



  const onApproveWatchAsset=() =>{
    console.log("yes")
  }  
  const onDenyWatchAsset=() => {
    console.log("no")
  }

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar />
      <ScrollView style={styles.scrollViewStyle}>
        <Section title="Methods">
          {!isConnected ? (
            <Button title="Connect Wallet" onPress={connectWallet} />
          ) : (
            <>
              <Button title="Reset Connection" onPress={resetConnection} />
              <Button title="Personal Sign" onPress={personalSign} />
              <Button
                title="Switch Chain: Ethereum"
                onPress={switchToEthereumChain}
              />
              <Button
                title="Switch Chain: Polygon"
                onPress={switchToPolygonChain}
              />
              <Button
                title="Add Chain: Mumbai Testnet"
                onPress={addMumbaiTestnet}
              />
              <Button
                title="Watch Assets"
                onPress={()=>{sendTransaction()}}
              />
            </>
          )}
        </Section>
      </ScrollView>
      <ScrollView style={styles.scrollViewStyle}>
        <Section title="Output">
          <Text style={{color: Colors.black}}>{log}</Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = function ({children, title}) {
  return (
    <View style={[styles.sectionContainer]}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: Colors.black,
          },
        ]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  scrollViewStyle: {
    height: '50%',
  },
});

export default TestingPage;






// import React, { useState } from 'react';

// import {
//   Button,
//   Text,
//   View,
//   SafeAreaView,
//   TextInput
// } from 'react-native';
// import { initOnRamp } from '@coinbase/cbpay-js';

// const TestingPage = () => {
//   const [amount, setAmount] = useState('');
//   const [destinationWallet, setDestinationWallet] = useState('0x0FDdBD90d75cfc418E2f1c36598F938843016452');

  
//   const handlePay = async () => {
//     const options = {
//       appId: 'com.crypto_lottery_app',
//       widgetParameters: {
//         destinationWallets: [{ address: destinationWallet, blockchains: ['ethereum'] }],
//       },
//     };
//     const onrampInstance = await initOnRamp(options);
//     await onrampInstance.open();
//   };

//   return (
//     <SafeAreaView>
//       <View>
//         <Text>Amount:</Text>
//         <TextInput
//           value={amount}
//           onChangeText={setAmount}
//           placeholder="Enter amount"
//         />
//       </View>
//       <View>
//         <Text>Destination Wallet:</Text>
//         <TextInput
//           value={destinationWallet}
//           onChangeText={setDestinationWallet}
//           placeholder="Enter destination wallet address"
//         />
//       </View>
//       <Button onPress={handlePay} title="Pay" />
//     </SafeAreaView>
//   );
// };

// export default TestingPage;



// import React, { useMemo, useState,useCallback } from 'react'
// import { WebView } from 'react-native-webview'
// import { generateOnRampURL } from '@coinbase/cbpay-js'
// import 'react-native-url-polyfill/auto'

// const CoinbaseWebView = ({ currentAmount }) => {

//     const [destinationAddress, setDestinationAddress] = useState('0x0FDdBD90d75cfc418E2f1c36598F938843016452');

//   const coinbaseURL = useMemo(() => {
//     const options = {
//       appId: 'com.crypto_lottery_app',
//       destinationWallets: [
//         {
//           address: destinationAddress,
//           blockchains: [ 'ethereum'],
//         },
//       ],
//       handlingRequestedUrls: true,
//       presetCryptoAmount:  1,
//     }

//     return generateOnRampURL(options)
//   }, [currentAmount, destinationAddress])

//   const onMessage = useCallback((event) => {
//     // Check for Success and Error Messages here
//     console.log('onMessage', event.nativeEvent.data)
//     try {
//       const { data } = JSON.parse(event.nativeEvent.data);
//       if (data.eventName === 'request_open_url') {
//         viewUrlInSecondWebview(data.url);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }, [])
//   console.log(coinbaseURL)
//   return (
//     <WebView source={{ uri: coinbaseURL }} 
//     // onMessage={onMessage} 
//     />
//   )
// }

// export default CoinbaseWebView


