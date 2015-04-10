/**
 * Loop through an elements parents until we find one that matches <type> or return null
 */
function findParentOfType(el, type){
	var par = el;
	while(par !== null) {
		if(par.tagName == type) return par;
		par = par.parentElement;
	}
	return null;
}

/**
 * Create an IMG-element with properties and events ready to inject into a sites markup
 */
function createNgIcon(id, href, cat, name_override){
	eNgIcon = document.createElement('img');
	eNgIcon.src=chrome.extension.getURL("img/nzbget-arrow.svg");
	eNgIcon.title="Click to download with NZBGet.";
	eNgIcon.className = 'nzbgc_download';

	eNgIcon.href = href;
	eNgIcon.id = id;
	eNgIcon.nameOverride = name_override;
	eNgIcon.category = cat;

	eNgIcon.addEventListener('click', function(e) {
		e.preventDefault();

		//console.log('ID: '+this.id,'HREF:'+this.href,'CATEGORY:'+this.category);
		chrome.runtime.sendMessage({message: "addURL", href: this.href, id: this.id, category: this.category, name_override: this.nameOverride});

		this.classList.add('nzbgc_adding');

		return false;
	});

	// Check for match in stored URLs
	chrome.runtime.sendMessage(
		{message: "checkCachedURL", url: href}, function(response) {
		if(response)
			document.getElementById(id).classList.add('nzbgc_added_ok');
	});

	return eNgIcon;
}

/**
 * Listen to events sent to the tab. Update icon class to reflect add status
 * @TODO: Implement fail status
 */
chrome.runtime.onMessage.addListener(function(m, sender, sendResponse) {
	switch(m.message) {
		case 'addedurl':
			var eInject = document.getElementById(m.id);
			if(!eInject) return;
			eInject.classList.remove('nzbgc_adding');
			if(m.status) {
				eInject.classList.add('nzbgc_added_ok');
			}
		break;
	}
	return true;
});
