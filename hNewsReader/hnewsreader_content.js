/**
  Container for an hNews object.  Based on the hNews 0.1 spec at http://microformats.org/wiki/hnews
  @param hNewsElem a DOM element that is a hNews container.
*/
var hNews = function (hNewsElem) {
	// entry-title, from hAtom, required
	var entryTitles = hNewsElem.getElementsByClassName('entry-title');
	if (entryTitles.length > 0) {
		this.title = entryTitles[0].innerText.trim();
	}

	// author, from hAtom, required
	var authors = hNewsElem.getElementsByClassName('author vcard');
	if (authors.length > 0) {
		var authorFNs = authors[0].getElementsByClassName('fn');
		if (authorFNs.length > 0) {
			this.author = authorFNs[0].innerText.trim();
		}
	}

	// updated, from hAtom, required
	var updatedDates = hNewsElem.getElementsByClassName('updated');
	if (updatedDates.length > 0) {
		this.updated = Date.parse(updatedDates[0].getAttribute('title'));
	}

	// source-org, from hNews, required
	var sources = hNewsElem.getElementsByClassName('source-org vcard');
	if (sources.length > 0) {
		var sourceFNs = sources[0].getElementsByClassName('fn');
		if (sourceFNs.length > 0) {
			this.source = sourceFNs[0].innerText.trim();
		}
	}

	// item-license, from hNews, recommended
	var licenseSnapshots = document.evaluate("//a[@rel='item-license']", hNewsElem, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (licenseSnapshots.snapshotLength > 0) {
		this.license = {
			text: licenseSnapshots.snapshotItem(0).innerText.trim(),
			link: licenseSnapshots.snapshotItem(0).getAttribute('href')
		}
	}

	// principles, from hNews, recommended
	var principleSnapshots = document.evaluate("//a[@rel='principles']", hNewsElem, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (principleSnapshots.snapshotLength > 0) {
		this.principle = {
			text: principleSnapshots.snapshotItem(0).innerText.trim(),
			link: principleSnapshots.snapshotItem(0).getAttribute('href')
		}
	}

	// dateline, from hNews, optional
	// Note: not supporting the hCard implementation
	var datelines = hNewsElem.getElementsByClassName('dateline');
	if (datelines.length > 0) {
		this.dateline = datelines[0].innerText.trim();
	}

	// geo, from hNews, optional
	var geoLocations = hNewsElem.getElementsByClassName('geo');
	if (geoLocations.length > 0) {
		var latitudes = geoLocations[0].getElementsByClassName('latitude');
		var longitudes = geoLocations[0].getElementsByClassName('longitude');
		if (latitudes.length > 0 && longitudes.length > 0) {
			// Note we have alternate handlings here
			this.geo = {
				latitude: Number((latitudes[0].getAttribute('title')) ? latitudes[0].getAttribute('title') : latitudes[0].innerText),
				longitude: Number((longitudes[0].getAttribute('title')) ? longitudes[0].getAttribute('title') : longitudes[0].innerText)
			}
		}
	}

	// published, from hAtom, optional
	var publishedDates = hNewsElem.getElementsByClassName('published');
	if (publishedDates.length > 0) {
		this.published = Date.parse(publishedDates[0].getAttribute('title'));
	}

	// finally, set something telling folks we're valid hNews or not.
	this.isValid = (this.title && this.author && this.updated && this.source) ? true : false;
};

if(typeof(String.prototype.trim) === "undefined") {
	String.prototype.trim = function() {
		return String(this).replace(/^\s+|\s+$/g, '');
	};
}

/**
 * Checks to see if an hnews container exists, sends a message to Chrome if it
 * does.
 */
function CheckForHNews () {
	var hNewsContainer = document.getElementsByClassName('hnews hentry');
	if (hNewsContainer.length > 0) {
		var hnews = new hNews(hNewsContainer[0]);
		console.log(hnews);

		// AP's News Registry beacon
		var beacon = {}
		var beaconSnapshots = document.evaluate("//img[contains(@src, 'apnewsregistry')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		if (beaconSnapshots.snapshotLength > 0) {
			beacon = {
				link: beaconSnapshots.snapshotItem(0).getAttribute('src')
			}
			console.log(beacon);
		}

		// Send the data along...
		chrome.extension.sendRequest({hNews: hnews, beacon: beacon});
	}
}

CheckForHNews();
