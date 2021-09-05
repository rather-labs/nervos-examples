
const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const ckbSdkUtils = require("@nervosnetwork/ckb-sdk-utils");
const axios = require('axios').default;
const dotenv = require('dotenv');

dotenv.config();

const doTransaction = async() => {

	let fromAddress = process.env.FROM_ADDRESS;
	let fromAddressPrivate = process.env.FROM_ADDRESS_PRIVATE;
	const toAddress = process.env.TO_ADDRESS;
	const nodeUrl = process.env.CKB_NODE; // 'http://rpc-testnet.ckb.tools';
	const indexerUrl = process.env.CKB_INDEXER; // 'http://indexer-testnet.ckb.tools';

	console.log(`we send 99 CKBs from ${fromAddress} to ${toAddress}`)

	let lockScript = ckbSdkUtils.addressToScript(fromAddress);

	let post_data = {
		id: Date.now(),
		jsonrpc: "2.0",
		method: "get_cells",
		params: [
			{
				"script": {
					"code_hash": lockScript.codeHash,
					"hash_type": lockScript.hashType,
					"args": lockScript.args
				},
				"script_type": "lock"
			},
			"asc",
			"0x100"
		],
	};

	let post_options = {headers: {'Content-Type': 'application/json'}};

	let cells;
	axios.post(indexerUrl, post_data, post_options)
		.then((response) => {
			cells = response.data.result.objects.map((value) => {
				return {
					lock: {
						codeHash: value.output.lock.code_hash,
						hashType: value.output.lock.hash_type,
						args: value.output.lock.args,
					},
					outPoint: {
						txHash: value.out_point.tx_hash,
						index: value.out_point.index,
					},
					capacity: value.output.capacity,
					data: value.output_data,
				};
			});
		})
		.catch((error) => {
			console.log("error:", error);
		});

	const signAndSend = async () => {
		const ckb = new CKB(nodeUrl);
		await ckb.loadDeps();
		const rawTransaction = await ckb.generateRawTransaction({
			fromAddress: fromAddress,
			toAddress,
			capacity: BigInt(99 * 1E8),//1E8 shannons = 1CKB, min 61E8 shannon = 61CKB
			fee: BigInt(0.001 * 1E8),
			safeMode: true,
			cells,
			deps: ckb.config.secp256k1Dep,
		});

		const signedTx = ckb.signTransaction(fromAddressPrivate)(rawTransaction);
		const realTxHash = await ckb.rpc.sendTransaction(signedTx);
	}
	signAndSend();
}

doTransaction();