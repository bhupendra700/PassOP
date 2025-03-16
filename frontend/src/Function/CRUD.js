import { v4 as uuid } from "uuid";

const handleSubmit = (e , formdata , setFormdata , data , setData , isEdit) => {
    e.preventDefault();

    const newData = {
      ...formdata,
      id: uuid(),
      userId: "qfgehjrh",
      showPassword: false,
    };

    if(!isEdit){
      setData([...data, newData]);
    }else{

    }

    setFormdata({
      url: "",
      username: "",
      password: "",
    });
  };

  export {handleSubmit}

  const handleEdit = (id , setEditIdx , data , setFormdata)=>{
    setEditIdx(id);

    const Editdata = data.find((ele)=>{
      return ele.id === id;
    })

    const newObj = {url : Editdata.url , username : Editdata.username , password:Editdata.password}

    setFormdata(newObj);
  }

  export {handleEdit}

  const updateData = (e , setData , data , setFormdata , formdata , setIsEdit ,EditIdx)=>{
    e.preventDefault();
    setData(data.map((ele)=>{
      if(ele.id === EditIdx){
        return {...ele , url:formdata.url , username : formdata.username , password : formdata.password}
      }else{
        return {...ele};
      }
    }))

    setFormdata({
      url: "",
      username: "",
      password: "",
    });

    setIsEdit(false)
  }


  export {updateData}