import Head from "next/head";
import { db, storage } from "../firebase";
import { collection, addDoc ,getDocs,getDoc,doc,Timestamp,deleteDoc , setDoc, query, where} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from "next/router";
import { useAppContext } from "../AppContext";
import { async } from "@firebase/util";
import { useLayoutEffect } from "react/cjs/react.production.min";
const Cart = () => {
  const [cart,setcart]=useState({})
  const [categ,setcateg]=useState([])
  const [mycart,setmycart]=useState([])
  const [place,setplace]=useState("للحصول على الخصم اكتب بروموكود")
  const [orname,setorname]=useState("")
  const [promo,setpromo]=useState("")
  const [promo1,setpromo1]=useState("")
  const initialValue = 0;  
  const [appState, setAppState] = useAppContext()
  const [total,settotal]=useState()
  const onnamee=(e)=>{
    setorname(e.target.value)
}

  useEffect(()=>{
    const o =[]
    const myArrayFromLocalStorage = localStorage.getItem('mycart')
    if (myArrayFromLocalStorage && myArrayFromLocalStorage.length) {
    var myArray = JSON.parse(myArrayFromLocalStorage)}else{var myArray=[]  }
    const x= myArray.reduce(
      (previousValue, currentValue) => parseInt(previousValue) + parseInt(currentValue.totalprice),
      initialValue
    )
    settotal(x)
    setcateg(myArray)
    var my=myArray.forEach(et=>o.push({code:et.code,title:et.title}))
    setmycart(o)  
    return myArrayFromLocalStorage
  },[])
  const delet=(x)=>{
    const deletx =categ.filter(i=>i.code!=x)
    setcateg(deletx)
    localStorage.setItem('mycart',JSON.stringify(deletx))
    settotal( deletx.reduce(
      (previousValue, currentValue) => parseInt(previousValue) + parseInt(currentValue.totalprice),
      initialValue
    ))
  }
  const onname = (e) => setcart({...cart,name:e.target.value,mycart:categ,price:total,data:Date()})
  const ontele = (e) => setcart({...cart,tele:e.target.value})
  const onemail = (e) => setcart({...cart,email:e.target.value})
  const onmsg = (e) => setcart({...cart,msg:e.target.value})
  const onadress = (e) => setcart({...cart,adress:e.target.value})
 
  const onpromo=(e)=>{
   setpromo(e.target.value)
  }
  const sspromo =async()=>{
   if(promo){
    const promoRef = doc(db, "promocode", promo);
    const promoSnap = await getDoc(promoRef)
    if(promoSnap.data()){
      setpromo1(promo)
      setpromo("")
      setplace("مبروك الحصول على الخصم")
      let dis=total*(promoSnap.data().dis/100)
      if(dis>100){
        settotal(total-100)
        setcart({...cart,price:total-100,promo:promo})
      }else{
        settotal(total-dis)
        setcart({...cart,price:total-dis,promo:promo})
      }
    }else{
      setpromo("")
      setplace("الكود غير صحيح  تحقق من الكود")
    }
   }
  }
  const oncounting=(e,x,z)=>{
    let arr = categ
   let y=  arr.find(it=>it.code==z)
  if( e.target.value){
   y.totalprice=parseInt(x)*parseInt(e.target.value)
   y.count=e.target.value
   localStorage.setItem("mycart", JSON.stringify(arr))
   setcateg(arr)
   settotal( categ.reduce(
    (previousValue, currentValue) => parseInt(previousValue) + parseInt(currentValue.totalprice),
    initialValue
  ))
  }
  }
  const onsend = async(e)=>{
    e.preventDefault() 
    const docRef = await setDoc(doc(db, "orders", cart.tele),cart); 
    setcart({name:"",tele:"",email:"",msg:"",mycart:""}) 
    setcateg([])
    setmycart([])
    localStorage.removeItem("mycart")
    settotal( 0)
    setAppState([])
}

    return ( 
        <div className="container">
            <div className="mt-5">
            <Head>
     <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css'></link>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"/>
    <title>تهادوا|سلة المشتريات</title>
   <link rel="icon" href="wew.png" type="image/x-icon" />
            </Head>
   
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" 
    crossOrigin="anonymous">
    </script>
    <div className="row w-100">
    <h2 className="col-12 col-lg-3 title ms-auto">سلة المشتريات</h2></div>
    <div className="row col-12 flex-row-reverse  ">
    {
        categ.map((item)=>(
            <div className="col-12 col-lg-3 p-4 " key={item.code} >         
        <span className="text-danger h3 m-0 p-0 pointer1" onClick={()=>delet(item.code)}>&times;</span>
             <Image className="col-12 col-lg-3  p-1 pointer1" onClick={(e)=>handelrouter(e,item.code)}  loader={() => `${item.img}?w=500px`} src={item.img} unoptimized="false"    width={"500px"}
      height={"400px"}/>
            <h6 className=" ms-auto m-3 title-img"> {item.title} </h6>
            <div className="row w-100">
            <h6 className=" ms-auto col-6 text-secondary ">{`إجمالي: ${item.totalprice} جنيه`}</h6>
            <p className=" ms-auto col-6 text-dark">{`السعر: ${item.price} جنيه`}</p>
            </div>
            {item.namee?
             <h6 className=" ms-auto m-3 title-img">{` الاسم المطلوب :${item.namee} قطع`}</h6>:""}
             {item.namee?
            "":item.orclient?
            <div className="col-12 col-lg-8 mx-auto mt-2 row  p-2">
            <div className="col-6">
            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"onChange={onnamee} value={namee}  />
           </div>
           <p className="col-6 text-danger">كتابة الأسماء المطلوبة</p>
        </div>:""}
        <div className="w-100 mx-auto mt-2 row  p-2">
        <div className="col-6">
    <input border border-danger  type="number" name="w" id="" placeholder={item.count} onChange={(e)=>oncounting(e,item.price,item.code)}/>
       </div>
       <label  className="col-6" htmlFor="w"> :الكمية</label>
    </div>
            </div>
        ))
    }         
                  
  </div>
  <div className="input-group input-group-lg border-success mb-3 w-100 ms-auto required">
  <input type="tel" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={onpromo}  value={promo} placeholder={place}/>
  <button className="input-group-text bg-primary text-light" id="inputGroup-sizing-sm" onClick={sspromo}>تحقق </button>
</div>
  <h4 className="col-12 col-lg-3 title ms-auto mb-3">{`إجمالي السلة:${total} جنيه`}</h4>
  <form onSubmit={onsend}>
  <div className="input-group input-group-lg border-success mb-3 w-75 ms-auto required">
  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"onChange={onname} value={cart.name} required/>
  <span className="input-group-text bg-primary text-light " id="inputGroup-sizing-sm">الاسم</span>
</div>
<div className="input-group input-group-lg border-success mb-3 w-75 ms-auto required">
  <input type="tel" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value={cart.tele} onChange={ontele} required/>
  <span className="input-group-text bg-primary text-light" id="inputGroup-sizing-sm">رقم الجوال</span>
</div>
<div className="input-group  mb-3 w-75 ms-auto">
  <textarea className="form-control" aria-label="With textarea" onChange={onadress} value={cart.msg} required></textarea>
  <span className="input-group-text bg-primary text-light">اكتب عنوانك</span>
</div>
<div className="input-group input-group-lg border-success mb-3 w-75 ms-auto">
  <input type="email" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value={cart.email} onChange={onemail}/>
  <span className="input-group-text bg-primary text-light" id="inputGroup-sizing-sm">البريد الإلكتروني</span>
</div>
<div className="input-group  mb-3 w-75 ms-auto">
  <textarea className="form-control" aria-label="With textarea" onChange={onmsg} value={cart.msg}></textarea>
  <span className="input-group-text bg-primary text-light">اكتب رسالتك</span>
</div>
< input type="submit" className="btn btn-success my-3"value="إضافة لطلب التسعير" onSubmit={onsend}/>
</form>
    <a className="btn btn-light my-3 mx-2" href="https://api.whatsapp.com/send/?phone=966501513551&text&app_absent=0"><img className="whats" src="/WhatsApp.svg.png"  alt="" />تواصل واتساب</a>
    </div>
    
    </div>
     );
}
 
export default Cart;
