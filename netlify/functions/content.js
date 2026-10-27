import {getStore} from '@netlify/blobs';
import {timingSafeEqual,createHash,randomUUID} from 'node:crypto';
const json=(code,data)=>({statusCode:code,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':'*'},body:JSON.stringify(data)});
const safe=(s,max=3000)=>String(s??'').trim().slice(0,max);
const auth=(h)=>{const secret=process.env.AULA_ADMIN_PASSWORD;if(!secret||secret.length<8)return false;const given=(h['x-admin-password']||'');const a=createHash('sha256').update(secret).digest(),b=createHash('sha256').update(given).digest();return timingSafeEqual(a,b);};
export const handler=async(event)=>{
try{
const method=event.httpMethod, op=event.queryStringParameters?.op||'articles';
if(method==='GET'&&op==='status')return json(200,{online:true,adminConfigured:!!(process.env.AULA_ADMIN_PASSWORD?.length>=8),authorized:auth(event.headers)});
const store=getStore({name:'aula-abierta-content',consistency:'strong'});
if(method==='GET'){
 if(op==='articles'){const data=await store.get('articles',{type:'json'})||[];return json(200,auth(event.headers)?data:data.filter(a=>a.status==='published'));}
 if(op==='comments'){const data=await store.get('comments',{type:'json'})||[];return json(200,auth(event.headers)?data:data.filter(c=>c.status==='approved'));}
 return json(404,{error:'Recurso no encontrado'});
}
if(method!=='POST')return json(405,{error:'Método no permitido'});
let body;try{body=JSON.parse(event.body||'{}')}catch{return json(400,{error:'JSON inválido'})}
if(op==='comments'){
 const articles=await store.get('articles',{type:'json'})||[];
 if(!articles.some(a=>a.id===body.articleId&&a.status==='published'))return json(400,{error:'Artículo no disponible'});
 if(body.website)return json(200,{ok:true});
 const author=safe(body.author,80),text=safe(body.text,2000);
 if(!author||text.length<3)return json(400,{error:'Nombre y comentario obligatorios'});
 const comments=await store.get('comments',{type:'json'})||[];
 if(comments.length>=3000)return json(503,{error:'Capacidad temporalmente agotada'});
 comments.push({id:randomUUID(),articleId:body.articleId,author,text,status:'pending',created:new Date().toISOString()});
 await store.setJSON('comments',comments);return json(201,{ok:true,message:'Comentario pendiente de moderación'});
}
if(!auth(event.headers))return json(401,{error:'Acceso administrativo no configurado o contraseña incorrecta'});
if(op==='articles'){
 const list=await store.get('articles',{type:'json'})||[];
 if(body.action==='delete'){await store.setJSON('articles',list.filter(a=>a.id!==body.id));return json(200,{ok:true})}
 const title=safe(body.title,180),category=safe(body.category,80),content=safe(body.body,30000);
 if(!title||!content)return json(400,{error:'Título y contenido obligatorios'});
 const id=safe(body.id,100)||randomUUID();
 const item={id,title,category,body:content,status:body.status==='published'?'published':'draft',image:safe(body.image,1800000),updated:new Date().toISOString()};
 const index=list.findIndex(a=>a.id===id);if(index>=0)list[index]=item;else list.unshift(item);
 if(list.length>500)return json(400,{error:'Límite de artículos alcanzado'});
 await store.setJSON('articles',list);return json(200,{ok:true,id});
}
if(op==='moderate'){
 const list=await store.get('comments',{type:'json'})||[];
 const c=list.find(c=>c.id===body.id);if(!c)return json(404,{error:'Comentario no encontrado'});
 if(body.status==='delete'){await store.setJSON('comments',list.filter(x=>x.id!==body.id));return json(200,{ok:true})}
 if(!['approved','rejected'].includes(body.status))return json(400,{error:'Estado inválido'});
 c.status=body.status;await store.setJSON('comments',list);return json(200,{ok:true});
}
return json(404,{error:'Operación no encontrada'});
}catch(err){console.error('Aula API:',err);return json(500,{error:'No se pudo procesar la solicitud'})}
};