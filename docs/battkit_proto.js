// Model this from https://stackoverflow.com/questions/5686735/populate-one-dropdown-based-on-selection-in-another
function populateUseCaseDropDown(ddVertical, ddUseCase) {
    var noneselected = ['None Selected'];
    var allverticalUses = ['All Use Cases', 'General DS/ML', 'General ETL'];
    var energyUses = ['All Use Cases', 'General DS/ML', 'General ETL'];
    var finsrvUses = ['All Use Cases', 'General DS/ML', 'General ETL', 'Hyper Personalization', 'Compliance & Risk', 'Fraud Detection', 'Investing Analytics', 'ESG Intelligence'];
    var healthUses = ['All Use Cases', 'General DS/ML', 'General ETL', 'Real World Evidence', 'Personalized Medicine', 'Interoperability & Patient Evidence'];
    var mfgUses = ['All Use Cases', 'General DS/ML', 'General ETL', 'Equipment as a Service', 'Sustainability', 'Digital Twin'];
    var mediaUses = ['All Use Cases', 'General DS/ML', 'General ETL', 'Audience Experience', 'Advertising Optimization'];
    var otherUses = ['All Use Cases', 'General DS/ML', 'General ETL'];
    var pubsecUses = ['All Use Cases', 'General DS/ML', 'General ETL', 'Federal Cybersecurity', 'Government Modernization', 'FSI Engagement'];
    var retailUses = ['All Use Cases', 'General DS/ML', 'General ETL',  'Consumer 360', 'Inventory & Demand Management', 'Control Tower'];

    switch(ddVertical.value) {
        case 'none-selected':
            ddUseCase.options.length = 0;
            for (i=0; i < noneselected.length; i++) {
                createOption(ddUseCase, noneselected[i], tagify(noneselected[i]));
            }
            break;

        case 'all-verticals':
            ddUseCase.options.length = 0;
            for (i=0; i < allverticalUses.length; i++) {
                createOption(ddUseCase, allverticalUses[i], tagify(allverticalUses[i]));
            }
            break;

        case 'energy-and-utilities':
            ddUseCase.options.length = 0;
            for (i = 0; i < energyUses.length; i++) {
                createOption(ddUseCase, energyUses[i], tagify(energyUses[i])); 
            }
            break;

        case 'financial-services':
            ddUseCase.options.length = 0;
            for (i = 0; i < finsrvUses.length; i++){
                createOption(ddUseCase, finsrvUses[i], tagify(finsrvUses[i]));
            }
            break;

        case 'healthcare-and-life-sciences':
            ddUseCase.options.length = 0;
            for (i = 0; i < healthUses.length; i++){
                createOption(ddUseCase, healthUses[i], tagify(healthUses[i]));
            }
            break;

        case 'manufacturing':
            ddUseCase.options.length = 0;
            for (i = 0; i < mfgUses.length; i++){
                createOption(ddUseCase, mfgUses[i], tagify(mfgUses[i]));
            }
            break;

        case 'media-and-entertainment':
            ddUseCase.options.length = 0;
            for (i = 0; i < mediaUses.length; i++){
                createOption(ddUseCase, mediaUses[i], tagify(mediaUses[i]));
            }
            break;

        case 'other-or-unknown':
            ddUseCase.options.length = 0;
            for (i = 0; i < otherUses.length; i++){
                createOption(ddUseCase, otherUses[i], tagify(otherUses[i]));
            }
            break;

        case 'public-sector':
            ddUseCase.options.length = 0;
            for (i = 0; i < pubsecUses.length; i++){
                createOption(ddUseCase, pubsecUses[i], tagify(pubsecUses[i]));
            }
            break;

        case 'retail-and-consumer-goods':
            ddUseCase.options.length = 0;
            for (i = 0; i < retailUses.length; i++){
                createOption(ddUseCase, retailUses[i], tagify(retailUses[i]));
            }
            break;
    }
}

function tagify(pString) {
    // take the given input, lower-case it and replace spaces with dashes.
    // this will make the string usable as a Wordpress tag.
    result = pString.toLowerCase();
    result = result.replaceAll(" ", "-");
    return(result);
}

function createOption(dd, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    dd.options.add(opt);
}

function generateBattleKit() { 
    // Create text and link to product-related assets
    //
    // First, get the selected Vertical
    var vertical_element = document.getElementById("vertical");
    var vertical_selected_value = vertical_element.value;
    // If nothing chosen, get out
    if (vertical_selected_value == "none-selected") {
        return;
    } 

    // Now get the selected Use Case
    var use_case_element = document.getElementById("ddUseCase");
    var use_case_selected_value = use_case_element.value;

    // Now, build the URL you want for Wordpress, based on selected Vertical and Use Case
    product_url = "https://home.databricks.com/frc/battle-kit-product-content/?fr=";
    product_url = product_url + "battle-kit-proto-product-" + vertical_selected_value + "-" + use_case_selected_value;

    // First create <a> element
    var prod_anchor = document.createElement('a');
    // Now create a text node for the link
    var prod_link = document.createTextNode("here");
    // Now append the link as a child to the anchor element
    prod_anchor.appendChild(prod_link);
    // Set the anchor element properties
    prod_anchor.title = "Product-related assets";
    prod_anchor.href = product_url;
    prod_anchor.target = "_blank";
    // Now generate the contents of the product links paragraph
    var paragraph = document.getElementById("product_links");
    paragraph.textContent += 'Product-related assets are ';
    paragraph.appendChild(prod_anchor);

    // Create text and link to cloud provider-related assets
    //
    // First, build the URL you want for Wordpress, based on checked items on the page
    cloud_url = "https://home.databricks.com/frc/battle-kit-cloud-provider-content/?fr=";
    // Loop through the cloud div and examine each checkbox to see if it has been selected.
    // If selected, add the appropriate tag to the query string.
    checkboxes = $(".cloudCkbox");
    // If multiple cloud checboxes are selected, we need to separate them with a "+" in the 
    // query string we are building
    needPlus = false;

    for (let i=0; i<checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            if (needPlus) {
                cloud_url += '+';  // or maybe should be a comma, check with Joel re custom OR query
            }
            cloud_url += "battkit-proto-cloud-";
            cloud_url += checkboxes[i].value;
            needPlus = true;
        }
    }

    // Now create <a> element
        var cloud_anchor = document.createElement('a');
    // Now create a text node for the link
    var cloud_link = document.createTextNode("here");
    // Now append the link as a child to the anchor element
    cloud_anchor.appendChild(cloud_link);
    // Set the anchor element properties
    cloud_anchor.title = "Cloud provider-related assets";
    cloud_anchor.href = cloud_url;
    cloud_anchor.target = "_blank";
    // Now generate the contents of the cloud provider links paragraph
    var paragraph = document.getElementById("cloud_links");
    paragraph.textContent += 'Cloud Provider-related assets are ';
    paragraph.appendChild(cloud_anchor);

    // Create text and link to  competitor-related assets
    //
    // First, build the URL you want for Wordpress, based on checked items on the page
    compete_url = "https://home.databricks.com/frc/battle-kit-compete-content/?fr=";
    // Loop through the compete div and examine each checkbox to see if it has been selected.
    // If selected, add the appropriate tag to the query string.
    checkboxes = $(".competeCkbox");
    // If multiple compete checboxes are selected, we need to separate them with a "+" in the 
    // query string we are building
    needPlus = false;

    for (let i=0; i<checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            if (needPlus) {
                compete_url += '+';  // or maybe should be a comma, check with Joel re custom OR query
            }
            compete_url += "battkit-proto-compete-";
            compete_url += checkboxes[i].value;
            needPlus = true;
        }
    }

    // Now create <a> element
        var compete_anchor = document.createElement('a');
    // Now create a text node for the link
    var compete_link = document.createTextNode("here");
    // Now append the link as a child to the anchor element
    compete_anchor.appendChild(compete_link);
    // Set the anchor element properties
    compete_anchor.title = "Competition-related assets";
    compete_anchor.href = compete_url;
    compete_anchor.target = "_blank";
    // Now generate the contents of the compete links paragraph
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
