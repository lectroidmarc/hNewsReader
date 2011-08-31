
/**
 * Checks to see if an hnews container exists, sends a message to Chrome if it
 * does.
 */
function CheckForHNews () {
	var hNewsContainer = document.getElementsByClassName('hnews');
	if (hNewsContainer.length > 0) {
		// Ok, we have an hNews container... do something...
		// FIXME if there's more than one?  Can there be?

		var hEntryData = navigator.microformats.get('hEntry', hNewsContainer[0].parentNode);
		console.log(hEntryData);

		// Note that the source-org requirement is outside the hAtom spec so we
		// have to deal with it separately
		var source_orgData = {};
		var source_orgContainer = hNewsContainer[0].getElementsByClassName('source-org');
		if (source_orgContainer.length > 0) {
			// Fool microformat-shiv into taking a node that's a microformat
			var tempDiv = document.createElement('div');
			tempDiv.appendChild(source_orgContainer[0].cloneNode(true));

			source_orgData = navigator.microformats.get('hCard', tempDiv);
			console.log(source_orgData);
		}

		// AP/hNews item-license
		var licenseData = {};
		var licenseXpath = document.evaluate("//a[@rel='item-license']", hNewsContainer[0], null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		if (licenseXpath.snapshotLength > 0) {
			licenseData = {
				text: licenseXpath.snapshotItem(0).innerHTML,
				link: licenseXpath.snapshotItem(0).getAttribute('href')
			}
			console.log(licenseData);
		}

		// AP's beacon
		var beaconData = {}
		var beacon = document.evaluate("//img[contains(@src, 'apnewsregistry')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		if (beacon.snapshotLength > 0) {
			beaconData = {
				link: beacon.snapshotItem(0).getAttribute('src')
			}
			console.log(beaconData);
		}

		// Send the data along...
		chrome.extension.sendRequest({hEntry: hEntryData, hCard: source_orgData, itemLicense: licenseData, beacon: beaconData});
	}
}

CheckForHNews();
