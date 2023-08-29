const whatsonchain = require ('whatsonchain');
const woc = new whatsonchain('testnet');

const get_data = async function (txid) {
    console.log("Contacting WhatsOnChain...");
    try {
        let result = await woc.txHash(txid);
        let fLen = result.vout.length;
        for (let i = 0; i < fLen; i++) {
            let scriptHex = result.vout[i].scriptPubKey.hex; 
            const isData = scriptHex.startsWith("006a");
            if (isData) {
                console.log(Buffer.from(scriptHex.substring(4), "hex").toString());
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}


let tx_id0 = "82ebf8c3134cd0a620196e88748c33e849321d5cf82c9e7684a4a95fc436b9ae";
get_data(tx_id0)
console.log(get_data(tx_id0))

let tx_id1 = "18c72765d8168b52abd641f27019a1cc63d679cae6078454f9eeeef42df27450";
get_data(tx_id1)
console.log(get_data(tx_id1))
