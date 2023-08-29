process.env.NETWORK = 'testnet';

var fs = require('fs');

const whats_api = require ('whatsonchain/index.js');

const {
    Address,
    TxBuilder,
    TxOut,
    KeyPair,
    Bn,
    PrivKey,
    Script,
    Tx
  } = require('bsv');

  console.log("Executing on the", process.env.NETWORK);
  
  (async function main(){
  const woc = new whats_api( 'testnet' );  

  const access_chain = async function (param) {
      console.log("Contacting WhatsOnChain...");
      try {
            return await woc.utxos(param);
      }
      catch (e) {
          console.log(e);
      }
  }

  async function broadcast_tx (utxos, utxo_from, message) {
      let builder = new TxBuilder();

      let fLen = utxos.length;

      for (let i = 0; i < fLen ; i++){
        const utxo_value = utxos[i].value;
        const utxo_index = utxos[i].tx_pos;
        const utxo_txid = utxos[i].tx_hash;

        const utxo_fund = TxOut.fromProperties(
          Bn().fromNumber(utxo_value),
          Address.Testnet.fromString(utxo_from).toTxOutScript()
        );
      
        const utxo_txid_buff = Buffer.from(utxo_txid, 'hex').reverse();
        
        builder.inputFromPubKeyHash(utxo_txid_buff, utxo_index, utxo_fund);
    
    }

      const utxo_privkey_wif = 'cSG81qXYui1PqeQ8EBJQer9K8Hw6hsiRNfCvrSqRJovxTz4snmCm'
      const change_addr = utxo_from;
      const keyPairs = [KeyPair.Testnet.fromPrivKey(PrivKey.fromWif(utxo_privkey_wif))];
    
      let msg_to_write = [message];
      const data = msg_to_write.map((str) => {
        return Buffer.from(str);
      });
    

      builder.outputToScript (
        Bn().fromNumber(0),
        Script.fromSafeDataArray(data)
      ) ;
      
    builder.setChangeAddress(Address.Testnet.fromString(change_addr));

      builder.build({ useAllInputs: false });
    
      builder.signWithKeyPairs(keyPairs);

      let signed_tx = builder.tx.toHex();

      let result = woc.broadcast(signed_tx);
      
      return result;

    }
  

  async function appendToFile(info) {
  fs.appendFile('blockchain_id.txt', (info+ "\r\n"), function (err) {
      if (err) throw err;
      console.log('Transaction written in file');
    })
  }

  async function finalAppendToFile(info) {
  fs.appendFile('blockchain_id.txt', (info), function (err) {
      if (err) throw err;
      console.log('Transaction written in file');
    })
  }

  let pub_addr = "mvfNybKZCEzacnrDUaue1vTeUx6NUg4Yau";
  

  console.log("Transaction 1:");
  let result = await access_chain(pub_addr)
  let transaction1 = await broadcast_tx(result, pub_addr, "Firma A Fangst 100")
  appendToFile(transaction1)
  await sleep(1000*60*5)
  
  console.log("Transaction 2:");
  let result2 = await access_chain(pub_addr)
  let transaction2 = await broadcast_tx(result2, pub_addr, "Firma A Selger 100 til Firma B")
  finalAppendToFile(transaction2)

  })()

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }