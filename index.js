const fs=require("fs");
const  http=require("http");

const url=require('url');


////////////////////////FILE SYTEM
// const out=fs.readFileSync("./txt/input.txt","utf-8");

// fs.writeFileSync("output.txt","Hello There");
// console.log(out);


// fs.readFile('./txt/start.txt','utf-8',(error,data)=>{
    
//     fs.readFile(`./txt/${data}.txt`,'utf-8',(error,data1)=>{
//         console.log(data1);
//         fs.readFile('./txt/append.txt','utf-8',(error,data2)=>{
//             console.log(data2);
//             fs.writeFile('./txt/final.txt',`${data1}\n${data2}`,'utf-8',error=>{
//                 console.log("Your File Has Been Written");
//               })
        
//          })
        
//         })
// })

//////////////////////HTTP  
const replaceTemplate=(temp,product)=>{

    let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%FROM%}/g,product.from);
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%DESCRIPTION%}/g,product.description);
    output=output.replace(/{%ID%}/g,product.id);

    if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
   
    return output;
}


const tempOverview=fs.readFileSync(`${__dirname}/templates/template-Overview.html`,'utf-8');
const tempcard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/Template-Product.html`,'utf-8');

const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataOBj=JSON.parse(data);




const server=http.createServer((req,res)=>{
    
  
    //console.log(dataOBj);
    const {query,pathname}=url.parse(req.url,true);
   
   
    
    

    //OverView Page
    if(pathname=='/' ||pathname=='/overview')
    {
        res.writeHead(200,{
            'Content-type':'text/html',
        })
        const cardsHTML=dataOBj.map(el=>replaceTemplate(tempcard,el)).join('');
        const output=tempOverview.replace('{%PRODUCT_CARD%}',cardsHTML);
         res.end(output);
    }

    //Product Page
    else if(pathname ==='/product')
    {
      
        res.writeHead(200,{
            'Content-type':'text/html',
        })

          console.log(query);
          const product=dataOBj[query.id];

          const output=replaceTemplate(tempProduct,product);
        res.end(output);
    }

    //api
    else if(pathname ==='/api')
    {
        res.writeHead(200,{
            'Content-type':'Application/json',
            
        })
    
        res.end(data);
        //console.log(data);
    }
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-owner-header':'hello-world'
        })

        res.end("<h1>Page Not Fount<\h1>");
    }


    res.end("Hello From Server");
});

server.listen(8080,'127.0.0.1',()=>{
    console.log("Listening on PORT ");
});
