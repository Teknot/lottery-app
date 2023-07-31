/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, useMemo } from 'react';
// import type {Node} from 'react';
import {
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  Alert
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import BackgroundTimer from 'react-native-background-timer';

import MetaMaskSDK from '@metamask/sdk';
import { MMKV } from 'react-native-mmkv';

import { ethers } from 'ethers';


const storage = new MMKV();

const sdk = new MetaMaskSDK({
  openDeeplink: link => {
    Linking.openURL(link);
  },
  timer: BackgroundTimer,

  dappMetadata: {
    name: 'Crypto_Lottery_App',
    // url: 'https://docs.metamask.io/wallet/how-to/use-sdk/react-native/',
    url: 'https://goerli.infura.io/v3/2ddacf7ad8c84db58157e98d8842999b',  //very Important .. it must be correct.

  },
});

const ethereum = sdk.getProvider();
// console.log("ethereum",ethereum)
const provider = new ethers.providers.Web3Provider(ethereum);

const App = () => {
  const [response, setResponse] = useState();
  const cachedAddress = useMemo(() => storage.getString('address'), []);
  const [account, setAccount] = useState(cachedAddress);
  const [chain, setChain] = useState();
  const [balance, setBalance] = useState();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const textStyle = {
    color: isDarkMode ? Colors.lighter : Colors.darker,
    margin: 10,
    fontSize: 16,
  };

  const getBalance = async () => {
    if (!ethereum.selectedAddress) {
      return;
    }
    const bal = await provider.getBalance(ethereum.selectedAddress);
    setBalance(ethers.utils.formatEther(bal));
  };

  useEffect(() => {
    ethereum.on('chainChanged', chain => {
      console.log("I am chain", chain);
      setChain(chain);
    });
    ethereum.on('accountsChanged', accounts => {
      console.log("I am account", accounts);
      setAccount(accounts?.[0]);
      storage.set('address', accounts?.[0]);
      getBalance();
    });

  }, []);

  // useEffect(()=>{
  //   const sdk = new MetaMaskSDK({
  //     openDeeplink: link => {
  //       Linking.openURL(link);
  //     },
  //     timer: BackgroundTimer,
  //     dappMetadata: {
  //       name: 'Crypto_Lottery_App',
  //       url: 'https://mydapp.com',

  //     },
  //   });

  //   const ethereum = sdk.getProvider();
  //   console.log("ethereum",ethereum)
  //   const provider = new ethers.providers.Web3Provider(ethereum);
  // },[])
  // if(account)
  // Alert.alert("Account",account,[{text:"Ok"}])

  const connect = async () => {

    try {
      // const result =  await provider.send("eth_requestAccounts", [])
      const result = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('RESULT', result?.[0]);
      setAccount(result?.[0]);
      storage.set('address', result?.[0]);

      Alert.alert("Account", "Success", [{ text: "Ok" }])
      getBalance();
    } catch (e) {
      Alert.alert("Account", "" + e, [{ text: "Bye" }])
      console.log('ERROR', e);
    }
  };

  const exampleRequest = async () => {
    try {
      const result = await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x89',
            chainName: 'Polygon',
            blockExplorerUrls: ['https://polygonscan.com'],
            nativeCurrency: { symbol: 'MATIC', decimals: 18 },
            rpcUrls: ['https://polygon-rpc.com/'],
          },
        ],
      });
      console.log('RESULT', result);
      setResponse(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const sign = async () => {
    const msgParams = JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: parseInt(ethereum.chainId, 16),
        // Give a user friendly name to the specific contract you are signing for.
        name: 'Ether Mail',
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1',
      },

      // Defining the message signing data content.
      message: {
        /*
         - Anything you want. Just a JSON Blob that encodes the data you want to send
         - No required fields
         - This is DApp Specific
         - Be as explicit as possible when building out the message schema.
        */
        contents: 'Hello, Bob!',
        attachedMoneyInEth: 4.2,
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'Mail',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        // Refer to PrimaryType
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        // Not an EIP712Domain definition
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    });

    var from = ethereum.selectedAddress;

    var params = [from, msgParams];
    var method = 'eth_signTypedData_v4';

    const resp = await ethereum.request({ method, params });
    setResponse(resp);
  };

  const sendTransaction = async () => {

    const to = '0x4A79A44301d234743CeC7337928DE0F3c27c1E76';
    const transactionParameters = {
      to,
      from: account,
      value: '0x5AF3107A4000',
    };

    try {
      const txHash = await ethereum.request(
        {
          method: "eth_sendTransaction",
          params: [transactionParameters]
        }).then(res => console.log("Res", res))
      setResponse(txHash);
    } catch (e) {
      Alert.alert("Account", "" + e, [{ text: "Bye" }])
      console.log(e);
    }
  };

  const reset = () => {

  }


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Button title={account ? 'Connected' : 'Connect'} onPress={connect} />
        <Button title="Sign" onPress={sign} />
        <Button title="Send transaction" onPress={sendTransaction} />
        <Button title="Add chain" onPress={exampleRequest} />
        <Button title="Reset" onPress={reset} />

        <Text style={textStyle}>{chain && `Connected chain: ${chain}`}</Text>
        <Text style={textStyle}>
          {' '}
          {account && `Connected account: ${account}\n\n`}
          {account && balance && `Balance: ${balance} ETH`}
        </Text>
        <Text style={textStyle}>
          {' '}
          {response && `Last request response: ${response}`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
