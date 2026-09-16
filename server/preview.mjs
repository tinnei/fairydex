// Local-only preview of the same bundled Worker used by the hosted app.
import http from 'node:http';
import worker from '../dist/server/index.js';
const args=process.argv.slice(2),port=Number(args[args.indexOf('--port')+1])||4173;
http.createServer(async(req,res)=>{try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=chunks.length?Buffer.concat(chunks):undefined;const request=new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,body,...(body?{duplex:'half'}:{})});const response=await worker.fetch(request,{});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(e){console.error(e);res.writeHead(500);res.end('Preview error');}}).listen(port,'127.0.0.1',()=>console.log(`Flower Lens preview http://localhost:${port}`));
