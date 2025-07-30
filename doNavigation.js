
  const totalPagesComputer = 7;
  const totalPagesMobile = 18;
  
  // Initialize sessionStorage navigation stack
  const NAV_KEY = 'navStack';
  const INDEX_KEY = 'navIndex';

  const path = window.location.pathname;

  let stack = JSON.parse(sessionStorage.getItem(NAV_KEY)) || [];
  let index = parseInt(sessionStorage.getItem(INDEX_KEY)) || 0;

  // If user navigated to a new page, trim forward history and push new
  if (stack[index] !== path) {
    stack = stack.slice(0, index + 1);
    stack.push(path);
    index = stack.length - 1;
  }

  // Save updated stack and index
  sessionStorage.setItem(NAV_KEY, JSON.stringify(stack));
  sessionStorage.setItem(INDEX_KEY, index);

  // Helpers
  function canGoBack() {
    return index > 0;
  }

  function canGoForward() {
    return index < stack.length - 1;
  }

  function goBack() {
    if (canGoBack()) {
      index--;
      sessionStorage.setItem(INDEX_KEY, index);
      history.back();
    }
  }

  function goForward(fallbackUrl) {
    console.log('next');
    if (canGoForward()) {
      index++;
      sessionStorage.setItem(INDEX_KEY, index);
      history.forward();
    } else {
      window.location.href = fallbackUrl;
    }
  }
  function setProgressBar(computer, mobile){
    mobileBar = document.getElementById('mobile_progress');
    mobileBar.max = totalPagesMobile;
    mobileBar.value = mobile;
    computerBar = document.getElementById('computer_progress');
    computerBar.max = totalPagesComputer;
    computerBar.value = computer;
  }
  function advanceMobileBar(i){
    mobileBar = document.getElementById('mobile_progress');
    if(mobileBar){
      mobileBar.value += i;
    }
  }