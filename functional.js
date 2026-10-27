const page=location.pathname.split('/').pop()||'index.html';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api=async(op,body)=>{const headers={'content-type':'application/json'};const pwd=sessionStorage.getItem('aula-admin');if(pwd)headers['x-admin-password']=pwd;const r=await fetch('/api/'+op,{method:body?'POST':'GET',headers,...(body?{body:JSON.stringify(body)}:{})});let data;try{data=await r.json()}catch{throw Error('El servicio de datos no responde. Comprueba el despliegue de Netlify.')}if(!r.ok)throw Error(data.error||'Error del servidor');return data};
const uuid=()=>crypto.randomUUID();
const panel=document.createElement('section');panel.id='aa-functional';panel.setAttribute('aria-label','Blog Aula Abierta');
const main=$('main')||document.body;main.prepend(panel);
const nav=document.createElement('nav');nav.id='aa-nav';nav.innerHTML='<a href="index.html">Inicio</a><a href="publicaciones.html">Publicaciones</a><a href="recursos.html">Recursos</a><a href="acceso.html">Administración</a>';
document.body.prepend(nav);
const link=a=>'lectura.html?id='+encodeURIComponent(a.id);
const card=a=>'<article class="aa-item"><h3><a href="'+link(a)+'">'+esc(a.title)+'</a></h3><small>'+esc(a.category||'Educación')+'</small><p>'+esc(a.body.slice(0,220))+'</p><a href="'+link(a)+'">Leer artículo completo →</a></article>';
const formInput=(label,id,value='',type='text')=>'<label>'+label+'<input id="'+id+'" type="'+type+'" value="'+esc(value)+'" required></label>';
const adminPages=['editor.html','gestion.html','panel.html','moderacion.html','multimedia.html'];
const isAdmin=adminPages.includes(page);
function setStatus(s){const el=$('#aa-status');if(el)el.textContent=s}
function lock(){panel.innerHTML='<h2>Administración protegida</h2><p>Para gestionar el blog, inicia sesión con la contraseña administrativa.</p><a class="aa-btn" href="acceso.html">Iniciar sesión</a>'}
async function render(){
let articles=[],comments=[];
try{articles=await api('articles');comments=await api('comments')}catch(err){panel.innerHTML='<h2>No se pudo cargar el contenido</h2><p role="alert">'+esc(err.message)+'</p>';return}
if(isAdmin&&!sessionStorage.getItem('aula-admin')){lock();return}
if(page==='acceso.html'){
let configured=false;try{configured=(await api('status')).adminConfigured}catch{}
panel.innerHTML='<h2>Acceso docente</h2><p>'+(configured?'Introduce tu contraseña administrativa.':'El administrador debe configurar la variable AULA_ADMIN_PASSWORD en Netlify (mínimo 16 caracteres).')+'</p><form id="aa-login">'+formInput('Contraseña','aa-password','','password')+'<button>Entrar</button></form><p id="aa-status" role="status"></p>';
$('#aa-login').onsubmit=async ev=>{ev.preventDefault();sessionStorage.setItem('aula-admin',$('#aa-password').value);try{await api('articles');location.href='panel.html'}catch(err){sessionStorage.removeItem('aula-admin');setStatus(err.message)}};
return;
}
if(page==='index.html'||page==='publicaciones.html'){
panel.innerHTML='<h2>'+(page==='index.html'?'Últimas publicaciones':'Artículos publicados')+'</h2><div id="aa-items">'+(articles.length?articles.map(card).join(''):'<p>Aún no hay publicaciones. Vuelve pronto.</p>')+'</div>';
return;
}
if(page==='lectura.html'){
const id=new URLSearchParams(location.search).get('id');const a=articles.find(x=>x.id===id);
if(!a){panel.innerHTML='<h2>Lecturas</h2><p>Selecciona un artículo en <a href="publicaciones.html">Publicaciones</a>.</p>';return}
panel.innerHTML='<article><h1>'+esc(a.title)+'</h1><p>'+esc(a.category)+'</p>'+(a.image?'<img class="aa-media" alt="Ilustración del artículo" src="'+a.image+'">':'')+'<div class="aa-body">'+esc(a.body)+'</div></article><h3>Comentarios</h3><div id="aa-comments"></div><form id="aa-comment">'+formInput('Tu nombre','aa-author')+'<label>Comentario<textarea id="aa-text" required maxlength="2000"></textarea></label><input id="aa-website" style="display:none" tabindex="-1" autocomplete="off"><button>Enviar para moderación</button></form><p id="aa-status" role="status"></p>';
$('#aa-comments').innerHTML=comments.filter(c=>c.articleId===id&&c.status==='approved').map(c=>'<div class="aa-item"><strong>'+esc(c.author)+'</strong><p>'+esc(c.text)+'</p></div>').join('')||'<p>Aún no hay comentarios aprobados.</p>';
$('#aa-comment').onsubmit=async ev=>{ev.preventDefault();try{await api('comments',{articleId:id,author:$('#aa-author').value,text:$('#aa-text').value,website:$('#aa-website').value});$('#aa-comment').reset();setStatus('Comentario recibido; pendiente de aprobación.')}catch(err){setStatus(err.message)}};
return;
}
if(page==='editor.html'){
const id=new URLSearchParams(location.search).get('id');const a=articles.find(x=>x.id===id)||{};
panel.innerHTML='<h2>Editor de artículos</h2><form id="aa-form">'+formInput('Título','aa-title',a.title||'')+formInput('Categoría','aa-category',a.category||'')+'<label>Contenido<textarea id="aa-body" required maxlength="30000"></textarea></label><label>Imagen (máximo 1 MB)<input id="aa-image" type="file" accept="image/png,image/jpeg,image/webp"></label><label>Estado<select id="aa-state"><option value="draft">Borrador</option><option value="published">Publicado</option></select></label><button>Guardar artículo</button> <a class="aa-btn" href="gestion.html">Gestionar</a></form><p id="aa-status" role="status"></p>';
$('#aa-body').value=a.body||'';$('#aa-state').value=a.status||'draft';
$('#aa-form').onsubmit=async ev=>{ev.preventDefault();try{let image=a.image||'';const f=$('#aa-image').files[0];if(f){if(f.size>1024*1024)throw Error('La imagen supera 1 MB');image=await new Promise((ok,no)=>{const reader=new FileReader();reader.onload=()=>ok(reader.result);reader.onerror=()=>no(reader.error);reader.readAsDataURL(f)})}await api('articles',{id:a.id||uuid(),title:$('#aa-title').value,category:$('#aa-category').value,body:$('#aa-body').value,status:$('#aa-state').value,image});location.href='gestion.html'}catch(err){setStatus(err.message)}};
return;
}
if(page==='gestion.html'||page==='panel.html'){
panel.innerHTML='<h2>Panel docente</h2><a class="aa-btn" href="editor.html">Crear artículo</a> <a class="aa-btn" href="moderacion.html">Moderar comentarios</a> <button id="aa-logout">Salir</button><p id="aa-status" role="status"></p><div id="aa-items"></div>';
$('#aa-logout').onclick=()=>{sessionStorage.removeItem('aula-admin');location.href='index.html'};
$('#aa-items').innerHTML=articles.map(a=>'<div class="aa-item"><strong>'+esc(a.title)+'</strong> — '+(a.status==='published'?'Publicado':'Borrador')+'<p><a class="aa-btn" href="editor.html?id='+encodeURIComponent(a.id)+'">Editar</a> <button data-action="toggle" data-id="'+esc(a.id)+'">'+(a.status==='published'?'Retirar':'Publicar')+'</button> <button data-action="delete" data-id="'+esc(a.id)+'">Eliminar</button></p></div>').join('')||'<p>Sin artículos.</p>';
panel.onclick=async ev=>{const b=ev.target.closest('button[data-action]');if(!b)return;const a=articles.find(x=>x.id===b.dataset.id);if(!a)return;try{if(b.dataset.action==='delete'){if(!confirm('¿Eliminar el artículo?'))return;await api('articles',{action:'delete',id:a.id})}else await api('articles',{...a,status:a.status==='published'?'draft':'published'});await render()}catch(err){setStatus(err.message)}};
return;
}
if(page==='moderacion.html'){
panel.innerHTML='<h2>Moderación de comentarios</h2><div id="aa-items">'+(comments.map(c=>'<div class="aa-item"><strong>'+esc(c.author)+'</strong> · '+esc(c.status)+'<p>'+esc(c.text)+'</p><button data-id="'+esc(c.id)+'" data-state="approved">Aprobar</button> <button data-id="'+esc(c.id)+'" data-state="rejected">Rechazar</button> <button data-id="'+esc(c.id)+'" data-state="delete">Eliminar</button></div>').join('')||'<p>No hay comentarios.</p>')+'</div><p id="aa-status" role="status"></p>';
panel.onclick=async ev=>{const b=ev.target.closest('button[data-state]');if(!b)return;try{await api('moderate',{id:b.dataset.id,status:b.dataset.state});await render()}catch(err){setStatus(err.message)}};return;
}
if(page==='multimedia.html'){
panel.innerHTML='<h2>Imágenes publicadas</h2><div class="aa-grid">'+(articles.filter(a=>a.image).map(a=>'<div class="aa-item"><img class="aa-media" alt="'+esc(a.title)+'" src="'+a.image+'"><p>'+esc(a.title)+'</p></div>').join('')||'<p>No hay imágenes.</p>')+'</div>';return;
}
panel.innerHTML='<h2>Recursos educativos</h2><p>Explora las publicaciones docentes y sus materiales.</p><a class="aa-btn" href="publicaciones.html">Ver publicaciones</a>';
}
render().catch(err=>{panel.innerHTML='<p role="alert">'+esc(err.message)+'</p>'});