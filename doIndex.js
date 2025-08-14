const pageOrder = ['welcome', 'serial', 'patient', 'consent', 'products', 'baseline', 'book', 'activation'];
const baseURL = 'https://manatee-sprout-4nzt.squarespace.com/register';
const urls = {
    'serial': baseURL + '-new', 
    'patient': baseURL + '-patient-info', 
    'consent': baseURL + '-consent', 
    'products': baseURL + '-product-info', 
    'baseline': baseURL + '-baseline-assessment', 
    'book': baseURL + '-book-patient-instruction', 
    'activation': baseURL + '-activation', 
    'error': baseURL + '-error',
    'welcome': baseURL,
    'resume': baseURL + '-returning'
};

const getURLs = {
    'serial': 'https://deviceregistrationapi-fzfpcuhheah7d6hd.westus-01.azurewebsites.net/api/v1.0/registration/validate-serial',
    'patient': 'https://deviceregistrationapi-fzfpcuhheah7d6hd.westus-01.azurewebsites.net/api/v1.0/registration/facilities',
    'book': 'https://deviceregistrationapi-fzfpcuhheah7d6hd.westus-01.azurewebsites.net/api/v1.0/appointment/available-times'
}
const postURLs = {
    'patient': 'https://deviceregistrationapi-fzfpcuhheah7d6hd.westus-01.azurewebsites.net/api/v1.0/registration/account',
    'consent': 'https://deviceregistrationapi-fzfpcuhheah7d6hd.westus-01.azurewebsites.net/api/v1.0/registration/patient-consent',
    'products': 'https://deviceregistrationapi-fzfpcuhheah7d6hd.westus-01.azurewebsites.net/api/v1.0/registration/order',
    'baseline': 'https://deviceregistrationapi-fzfpcuhheah7d6hd.westus-01.azurewebsites.net/api/v1.0/registration/assessment',
    'book': 'https://deviceregistrationapi-fzfpcuhheah7d6hd.westus-01.azurewebsites.net/api/v1.0/appointment/book',
    'resume': 'https://deviceregistrationapi-fzfpcuhheah7d6hd.westus-01.azurewebsites.net/api/v1.0/registration/resume-registration'
}
function getURL(page){
    console.log(urls[page]);
    return urls[page] || urls['error'];
}
function getNextPage(page){
    const i = pageOrder.indexOf(page);
    if(i > -1){
        console.log(pageOrder[i + 1]);
        return pageOrder[i + 1] || 'error';
    } else{
        return 'error';
    }
    
}
function getRetURL(currentPage){
    return getURL(getNextPage(currentPage));
}
function getGetURL(currentPage){
    return getURLs[currentPage] || '';
}
function getPostURL(currentPage){
    return postURLs[currentPage] || '';
}
