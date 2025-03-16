const handlePassword = (e, id , setData , data) => {
    setData(
      data.map((ele) => {
        if (ele.id === id) {
          const newObj = { ...ele, showPassword: !ele.showPassword };
          return newObj;
        }
        return { ...ele };
      })
    );
  };

  export default handlePassword;