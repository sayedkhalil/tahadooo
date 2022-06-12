import Head from "next/head";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { db, storage } from "../../firebase";
import { collection, addDoc ,getDocs,doc,Timestamp,deleteDoc , setDoc,getDoc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from "next/router";
import { useAppContext } from "../../AppContext";
import { RWebShare } from "react-web-share";
const Product = ({item}) => {
    const router = useRouter()
    const [appState, setAppState] = useAppContext()
    const [categ,setcateg]=useState([])
    const [count,setcount]=useState(1)
    const [namee,setnamee]=useState("")    
   const product=JSON.parse(item)
   const img =product.imges
   const category=product.category
   const [totalprice,settotalprice]=useState(product.price)
   const onnamee=(e)=>{
       setnamee(e.target.value)
   }
    useEffect(async()=>{
    const pro=[]
    const prodlist = collection(db, 'broductes');
    const q = query(prodlist, where("category", "==",category));
    const prodsnapshot= await getDocs(q);
     prodsnapshot?prodsnapshot.forEach(doc =>{ pro.push({code:doc.data().code,
        title:doc.data().title,category:doc.data().category,imges:doc.data().imges[0]})  }):pro
       const mu= pro.length>4?pro.slice(0,4):pro
        setcateg(mu)

   },[])
   const handelrouter=(e,path)=>{
    e.preventDefault() 
    router.push(`../product/${path}`)
}
   const oncart =async()=> {
    const myArrayFromLocalStorage = localStorage.getItem('mycart')
    if (myArrayFromLocalStorage && myArrayFromLocalStorage.length) {
    var myArray = JSON.parse(myArrayFromLocalStorage)}else{var myArray=[]  }
    if(myArray.find(it=>it.code==product.code)){var i = myArray.find(z=>z.code==product.code  )
    i.count=parseInt(i.count)+1
    setcount(count+1)
    i.totalprice=parseInt(i.totalprice)+ parseInt(product.price)
    localStorage.setItem("mycart", JSON.stringify(myArray))
    console.log("yes")
    }else{
        console.log("no")
         myArray.push({"code":product.code,"title":product.title,"img":product.imges[0],"count":count,"price":product.price ,"totalprice":totalprice})
        localStorage.setItem("mycart", JSON.stringify(myArray))
        setAppState(myArray)
        myArray=[]
        }  }
   return (  
        <div className="container">
            <div className="mt-5">
            <Head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"/>
    <meta name="description" content={product.des} />
    <meta name="keywords" content={product.key} />
    <link rel="icon" href={img[0]} type="image/x-icon" />
    <title>تهادوا:{product.title}</title>
            </Head>
   
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" 
    crossOrigin="anonymous">
    </script>
    <RWebShare 
             data={{
             text: `${product.title}`,
              url:`${product.code}`,
              title:` ${product.title}`,
                }}
               >
             <i class="fa fa-share-alt fa-2x text-danger" aria-hidden="true"></i>
             </RWebShare>
    <div className="row w-100">
        <div className="col-12 col-lg-12">
    <h1 className=" title ms-auto">{product.title}</h1>
    <h4 className=" d-block ms-auto text-right text-secondary mb-4">جنيه مصري {product.price}</h4>
    </ div>

</div>
    <div className="col-12 col-lg-8 mx-auto ">
    <Carousel infiniteLoop="true"	>
    {
       img.map((item)=>(
            <div className="" key={item} >
             <img className=""  src={item}  alt={product.title} />
            
        </div>
        ))
    }
     </Carousel>
                  </div>
                  <div>
                  <h3 className="col-12 col-lg-6 title ms-auto">وصف المنتج</h3>
    <div className="col-12 col-lg-8 mx-auto mt-2 border border-danger rounded p-4">
       <p className="font-weight-bold text-center">{product.des}</p> 
    </div>
    <h3 className="col-12 col-lg-6 title ms-auto">مواصفات المنتج</h3>
    <div className="col-12 col-lg-8 mx-auto mt-2  p-4">
       <p className="font-weight-bold text-end">{`الإرتفاع :${product.height}سم`}</p> 
       <p className="font-weight-bold text-end">{` العرض :${product.width}سم`}</p>
       <p className="font-weight-bold text-end">{`الوزن :${product.weight}جم`}</p>
    </div>
    <div className="col-12 col-lg-8 mx-auto mt-2 row  p-2">
        <div className="col-6">
       <button className="button p-2 m-1" onClick={()=>{if(count>1) {setcount(count-1);
        settotalprice(parseInt(totalprice) - parseInt(product.price) )}}}>-</button>
       <span className="border border-dark p-2 m-1">{count}</span>
       <button className="button p-2 m-1" onClick={()=>{setcount(count+1);
        settotalprice(parseInt(totalprice) + parseInt(product.price) )
        console.log(totalprice)
        }}>+</button>
       </div>
       <p className="col-6 text-danger"> :الكمية</p>
    </div>
 { product.orclient?
       <div className="col-12 col-lg-8 mx-auto mt-2 row  p-2">
       <div className="col-6">
       <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"onChange={onnamee} value={namee}  />
      </div>
      <p className="col-6 text-danger">كتابة الأسماء المطلوبة</p>
   </div>:""
  }
  <div className="col-12 col-lg-8 mx-auto mt-2 row  p-2">
      <p className="col-12 text-info text-end">{product.shipping}</p>
   </div>
   <div className="col-12 col-lg-8 mx-auto mt-2 row  p-2">
      <h4 className="col-12 text-info text-end">السعر: {totalprice}</h4>
   </div>
   <div className="cartstatic w-100 row">
   <button onClick={oncart} type="button" className="btn btn-success mt-3 w-50">إضافة للسلة</button>
    <a className="btn btn-light mt-3 mx-2 w-50" href="https://api.whatsapp.com/send/?phone=966569204439&text&app_absent=0"><img className="whats" src="/WhatsApp.svg.png"  alt="" />تواصل واتساب</a>
   </div>
    
    <h3 className="col-12 col-lg-3 title ms-auto mt-3">منتجات مشابهة</h3>
    <div className="row">
    {
        categ.map((item)=>(
            <div className="col-12 col-lg-3 p-4 " key={item.code} >
             <Image className="col-12 col-lg-3 border border-info p-1 pointer1" onClick={(e)=>handelrouter(e,item.code)}  loader={() => `${item.imges}?w=500px`} src={item.imges} unoptimized="false"    width={"500px"}
      height={"400px"}/>
            <h6 className=" ms-auto m-3 title-img"> {item.title} </h6>
            <button type="button" className="btn btn-success" onClick={()=>oncart(item.code,item.title)} >إضافة لطلب التسعير</button>
        </div>
        ))
    }
    </div>
 <h3 className="col-12 col-lg-3 title ms-auto mt-3">مراجعة المنتج</h3>
 <div className="input-group input-group-sm mb-3 w-75 ms-auto">
  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
  <span className="input-group-text" id="inputGroup-sizing-sm">الاسم</span>
</div>
<div className="input-group  mb-3 w-75 ms-auto">
  <textarea className="form-control" aria-label="With textarea"></textarea>
  <span className="input-group-text">اكتب رسالتك</span>
</div>
<div className="my-3">
    <div className="row ms-auto ">    
     <h5 className="col name m-2">محمد بن علي</h5>
     <img className="col-2 avtar" src="/avtar.png" alt="" />
    </div>
    <div className="col-12 col-lg-8 ms-auto mt-2 border border-success rounded p-4">
       <p className="font-weight-bold text-center">أنصح بالتعامل معهم أهم شئ المواعيد وجودة المنتج</p> 
    </div>


</div>
   
</div>    
</div>
    </div>
     );
}
 
export default Product;
export async function getStaticPaths() {
    const pro=[]
    const prodlist = collection(db, 'broductes');
    const prodsnapshot = await getDocs(prodlist);
     prodsnapshot.docs?prodsnapshot.docs.map(doc =>{ pro.push({code:doc.data().code});   }):[]
    const paths =pro.map((item)=>{
       return{ 
           params:{id:item.code}
       }
    })
  
    return{
        paths,fallback:false
    }
  }
  export async function getStaticProps(context) {
const id        =context.params.id
const docRefpar = doc(db,'broductes',id);
const docSnapar = await getDoc(docRefpar);
const getpartn =  docSnapar.data()?docSnapar.data():[]
   
    return {
      props: {item:JSON.stringify(getpartn)}
    }
  }