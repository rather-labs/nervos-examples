
const PWCore = require('@lay2/pw-core').default;
const {
  EthProvider,
  PwCollector,
  ChainID,
  Address,
  Amount,
  AmountUnit,
  AddressType,
  RawProvider,
  IndexerCollector,
  Builder,
} = require('@lay2/pw-core');

require('dotenv').config();

const main = async () => {
	const nodeUrl = process.env.REACT_APP_CKB_NODE;
	const indexerUrl = process.env.REACT_APP_CKB_INDEXER;
	console.log("nodeUrl",nodeUrl)
	console.log("indexerUrl",indexerUrl)
	//const PWCoreInstance = new PWCore(nodeUrl);
	//const pwcore = await PWCoreInstance.init(
	//  new EthProvider(), // a built-in Provider for Ethereum env.
	//  new PwCollector() // a custom Collector to retrive cells from cache server.
	//);

	const fromAddressPrivate = process.env.REACT_APP_FROM_ADDRESS_PRIVATE;
	const provider = new RawProvider(fromAddressPrivate);
	const collector = new IndexerCollector(indexerUrl);
	const pwcore = await new PWCore(nodeUrl).init(
		provider,
		collector
	);

	const toAddress = process.env.REACT_APP_TO_ADDRESS;
	console.log("toAddress", toAddress)
	console.log("pwCore", pwcore)
	const toAddressInst = new Address(toAddress, AddressType.ckb)
	console.log("toAddress1",toAddressInst)
	console.log("toAddress1",toAddressInst.toCKBAddress())
	const amount = new Amount('1');
	console.log(amount)

	let ckbBalance = await PWCore.defaultCollector.getBalance(PWCore.provider.address)
	console.log("Current balance of", PWCore.provider.address, "is", ckbBalance.toString(AmountUnit.ckb), "CKBs");
    ckbBalance = await PWCore.defaultCollector.getBalance(new Address(toAddress, AddressType.ckb));
	console.log("Current balance of", new Address(toAddress, AddressType.ckb), "is", ckbBalance.toString(AmountUnit.ckb), "CKBs");

	const ethAddress = new Address('0x26C5F390FF2033CbB44377361c63A3Dd2DE3121d', AddressType.eth)
	console.log("ethAddress", ethAddress)
    ckbBalance = await PWCore.defaultCollector.getBalance(ethAddress);
	console.log("Current balance of", ethAddress, "is", ckbBalance.toString(AmountUnit.ckb), "CKBs");

	const options = { witnessArgs: Builder.WITNESS_ARGS.RawSecp256k1 };
	const txHash = await pwcore.send(
		//new Address("ckb1qyqdmeuqrsrnm7e5vnrmruzmsp4m9wacf6vsxasryq", AddressType.ckt),
		//new Address("ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxtt8el6amwmc4t2k2uk43q33xq3pq0gtxjyx58m", AddressType.ckb),
		toAddressInst,
		new Amount('100'),
		options
	);
		//new Address('0x26C5F390FF2033CbB44377361c63A3Dd2DE3121d', AddressType.eth),
		//toAddressInst,
		//new Address(toAddress, AddressType.ckb),
		//new Address(toAddress, AddressType.ckb),
}
main();
