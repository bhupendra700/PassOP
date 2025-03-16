const checkisLink = (input) => {
    const trimInput = input.trim(); //removing leading & trailing white spaces

    if (trimInput.startsWith("http://") || trimInput.startsWith("https://")) {
      return true; //link
    }
    if (trimInput.includes(".") && !trimInput.includes(" ")) {
      return true; //link
    } else {
      return false; //name
    }
  };

  export {checkisLink};

  const checkHTTPS = (input) => {
    const trimInput = input.trim();

    if (trimInput.startsWith("http://") || trimInput.startsWith("https://")) {
      return true;
    } else {
      return false;
    }
  };

  export {checkHTTPS};