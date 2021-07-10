
var qrcodeAddress = new QRCode(document.getElementById("qrcodeAddress"),{width: 120,height: 120});
var qrcodeSecret = new QRCode(document.getElementById("qrcodeSecret"),{width: 120, height: 120});

newrtm();

function getConfig() {
	var networkConfigs = {
		'RAPTOREUM': {
			'uri': 'RTM:',
			'title': 'Raptoreum Wallet',
			'name': 'RTM',
			'ticker': 'RTM',
			'network': {
				'messagePrefix': '\x19RTM Signed Message:\n',
				'bip32': {
					'public': 0x0488b21e,
					'private': 0x0488ade4
				},
				'pubKeyHash': 0x3c,
				'scriptHash': 0x7a,
				'wif': 0x80
			}
		}
	}
	network=Object.keys(networkConfigs)[0]
	return networkConfigs[network]
}

// Create new wallet
function newrtm(){
	var keys = bitcoin.ECPair.makeRandom({'network': getConfig()['network']})
	var address = getAddress(keys)

	if (address != undefined) {
		var addrurl = "https://explorer.raptoreum.com/address/"+address;
		document.getElementById("address").innerHTML = address;
		document.getElementById("secret").innerHTML = keys.toWIF();
		document.getElementById("addr").href = addrurl;
		qrcodeAddress.makeCode(address);
		qrcodeSecret.makeCode(keys.toWIF());
	}
}

function getAddress(keys) {
	var network = getConfig()['network']
	var address = undefined

	
	if (getAddressType() == 'bech32') {
		address = bitcoin.payments.p2wpkh({
			'pubkey': keys.publicKey,
			'network': network
		}).address
	} else if (getAddressType() == 'segwit') {
		address = bitcoin.payments.p2sh({
			'redeem': getP2WPKHScript(keys.publicKey),
			'network': network
		}).address
	} else if (getAddressType() == 'legacy') {
		address = bitcoin.payments.p2pkh({
			'pubkey': keys.publicKey,
			'network': getConfig()['network']
		}).address
	}

	return address
}

function getAddressType() {
	var type = 'legacy'
	return type
}
