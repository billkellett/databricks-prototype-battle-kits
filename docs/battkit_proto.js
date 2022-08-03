// Model this from https://stackoverflow.com/questions/5686735/populate-one-dropdown-based-on-selection-in-another
function populateUseCaseDropDown(ddVertical, ddUseCase) {
var allverticalUses = ['All Use Cases']
var energyUses = ['All Use Cases'];
var finsrvUses = ['All Use Cases', 'Hyper Personalization', 'Compliance & Risk', 'Fraud Detection', 'Investing Analytics', 'ESG Intelligence'];
var healthUses = ['All Use Cases', 'Real World Evidence', 'Personalized Medicine', 'Interoperability & Patient Evidence'];
var mfgUses = ['All Use Cases', 'Equipment as a Service', 'Sustainability', 'Digital Twin'];
var mediaUses = ['All Use Cases', 'Audience Experience', 'Advertising Optimization'];
var otherUses = ['All Use Cases'];
var pubsecUses = ['All Use Cases', 'Federal Cybersecurity', 'Government Modernization', 'FSI Engagement'];
var retailUses = ['All Use Cases', 'Consumer 360', 'Inventory & Demand Management', 'Control Tower'];

switch(ddVertical.value) {
    case 'allverticals':
    ddUseCase.options.length = 0;
    for (i=0; i < allverticalUses.length; i++) {
        createOption(ddUseCase, allverticalUses[i])
    }
    break;

    case 'energy':
    ddUseCase.options.length = 0;
    for (i = 0; i < energyUses.length; i++) {
        createOption(ddUseCase, energyUses[i], energyUses[i]) 
    }
    break;

    case 'finsrv':
    ddUseCase.options.length = 0;
    for (i = 0; i < finsrvUses.length; i++){
        createOption(ddUseCase, finsrvUses[i], finsrvUses[i])
    }
    break;

    case 'health':
    ddUseCase.options.length = 0;
    for (i = 0; i < healthUses.length; i++){
        createOption(ddUseCase, healthUses[i], healthUses[i])
    }
    break;

    case 'mfg':
    ddUseCase.options.length = 0;
    for (i = 0; i < mfgUses.length; i++){
        createOption(ddUseCase, mfgUses[i], mfgUses[i])
    }
    break;

    case 'media':
    ddUseCase.options.length = 0;
    for (i = 0; i < mediaUses.length; i++){
        createOption(ddUseCase, mediaUses[i], mediaUses[i])
    }
    break;

    case 'other':
    ddUseCase.options.length = 0;
    for (i = 0; i < otherUses.length; i++){
        createOption(ddUseCase, otherUses[i], otherUses[i])
    }
    break;

    case 'pubsec':
    ddUseCase.options.length = 0;
    for (i = 0; i < pubsecUses.length; i++){
        createOption(ddUseCase, pubsecUses[i], pubsecUses[i])
    }
    break;

    case 'retail':
    ddUseCase.options.length = 0;
    for (i = 0; i < retailUses.length; i++){
        createOption(ddUseCase, retailUses[i], retailUses[i])
    }
    break;
}
}

function createOption(dd, text, value) {
var opt = document.createElement('option');
opt.value = value;
opt.text = text;
dd.options.add(opt);
}

function generateBattleKit() { 
// Create text and link to product-related assets
// First create <a> element
var prod_anchor = document.createElement('a');
// Now create a text node for the link
var prod_link = document.createTextNode("here");
// Now append the link as a child to the anchor element
prod_anchor.appendChild(prod_link);
// Set the anchor element properties
prod_anchor.title = "Product-related assets";
prod_anchor.href = "https://www.amazon.com";
prod_anchor.target = "_blank";
// Now generate the contents of the product links paragraph
var paragraph = document.getElementById("product_links");
paragraph.textContent += 'Product-related assets are ';
paragraph.appendChild(prod_anchor);

// Create text and link to cloud provider-related assets
// First create <a> element
    var cloud_anchor = document.createElement('a');
// Now create a text node for the link
var cloud_link = document.createTextNode("here");
// Now append the link as a child to the anchor element
cloud_anchor.appendChild(cloud_link);
// Set the anchor element properties
cloud_anchor.title = "Cloud provider-related assets";
cloud_anchor.href = "https://www.google.com";
cloud_anchor.target = "_blank";
// Now generate the contents of the cloud provider links paragraph
var paragraph = document.getElementById("cloud_links");
paragraph.textContent += 'Cloud Provider-related assets are ';
paragraph.appendChild(cloud_anchor);

// Create text and link to  competitor-related assets
// First create <a> element
    var compete_anchor = document.createElement('a');
// Now create a text node for the link
var compete_link = document.createTextNode("here");
// Now append the link as a child to the anchor element
compete_anchor.appendChild(compete_link);
// Set the anchor element properties
compete_anchor.title = "Competition-related assets";
compete_anchor.href = "https://www.databricks.com";
compete_anchor.target = "_blank";
// Now generate the contents of the cloud provider links paragraph
var paragraph = document.getElementById("compete_links");
paragraph.textContent += 'Competition-related assets are ';
paragraph.appendChild(compete_anchor);

//
// disable the Generate button
document.getElementById("btnGenerate").disabled = true;

//
// Finally, make the generated info div visible
var x = document.getElementById("div_battlekit_op");
x.style.visibility = 'visible';
return;
}