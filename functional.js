const page=location.pathname.split('/').pop()||'index.html';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api=async(op,body)=>{const headers={'content-type':'application/json'};const pwd=sessionStorage.getItem('aula-admin');if(pwd)headers['x-admin-password']=pwd;const r=await fetch('/.netlify/functions/content?op='+encodeURIComponent(op),{method:body?'POST':'GET',headers,...(body?{body:JSON.stringify(body)}:{})});let data;try{data=await r.json()}catch{throw Error('El servicio de datos no responde. Comprueba el despliegue de Netlify.')}if(!r.ok)throw Error(data.error||'Error del servidor');return data};
const uuid=()=>crypto.randomUUID();
const panel=document.createElement('section');panel.id='aa-functional';panel.setAttribute('aria-label','Blog Aula Abierta');
const main=$('main')||document.body;
const publicDesignPages=['index.html','publicaciones.html','recursos.html'];
document.body.classList.add(publicDesignPages.includes(page)?'aa-original-design':'aa-functional-screen');
main.append(panel);
const nav=document.createElement('nav');nav.id='aa-nav';nav.innerHTML='<a href="index.html">Inicio</a><a href="publicaciones.html">Publicaciones</a><a href="recursos.html">Recursos</a><a href="acceso.html">Administración</a>';
document.querySelectorAll('#aa-nav').forEach(n=>n.remove());
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
try{articles=await api('articles')}catch(err){panel.innerHTML='<h2>El contenido está temporalmente indisponible</h2><p role="alert">'+esc(err.message)+'</p><p>La aplicación está publicada, pero el servicio de datos aún presenta un problema.</p>';return}try{comments=await api('comments')}catch(err){console.warn('Comentarios no disponibles',err);comments=[]}
if(isAdmin&&!sessionStorage.getItem('aula-admin')){lock();return}
if(page==='acceso.html'){
const heading=document.querySelector('header h1');if(heading)heading.textContent='Acceso docente';
let configured=false;try{configured=(await api('status')).adminConfigured}catch{}
panel.innerHTML='<h2>Acceso docente</h2><p>'+(configured?'Introduce tu contraseña administrativa.':'El servidor no detecta una contraseña administrativa válida. Comprueba AULA_ADMIN_PASSWORD en las variables de entorno de Netlify (mínimo 8 caracteres).')+'</p><form id="aa-login">'+formInput('Contraseña','aa-password','','password')+'<button>Entrar</button></form><p id="aa-status" role="status"></p>';
$('#aa-login').onsubmit=async ev=>{ev.preventDefault();sessionStorage.setItem('aula-admin',$('#aa-password').value);try{const check=await api('status');if(!check.authorized)throw Error('Contraseña incorrecta o administración no configurada');location.href='panel.html'}catch(err){sessionStorage.removeItem('aula-admin');setStatus(err.message)}};
return;
}
if(page==='index.html'||page==='publicaciones.html'){
const tile=a=>'<article class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md p-5 flex flex-col gap-3"><div class="text-secondary text-sm font-semibold">'+esc(a.category||'Educación')+'</div>'+(a.image?'<img class="w-full rounded-xl object-cover max-h-72" alt="" src="'+esc(a.image)+'">':'')+'<h2 class="font-headline-sm text-primary font-bold text-xl">'+esc(a.title)+'</h2><p class="text-on-surface-variant">'+esc(a.body.slice(0,260))+'</p><a class="inline-flex self-start rounded-lg bg-primary-container text-on-primary px-4 py-2 font-semibold" href="'+link(a)+'">Leer artículo completo →</a></article>';
if(page==='index.html'){
const featured=main.querySelector('article');if(featured){const sec=featured.closest('section');if(sec)sec.style.display='none';else featured.style.display='none'}
main.querySelectorAll('a[href="#"]').forEach(a=>{if(/ver todas/i.test(a.textContent||''))a.href='publicaciones.html'});
panel.innerHTML='<h2 class="font-headline-sm text-primary font-bold text-2xl mb-4">Últimas publicaciones</h2>'+(articles.length?'<div class="grid gap-5 md:grid-cols-2">'+articles.slice(0,6).map(tile).join('')+'</div>':'<p class="text-on-surface-variant">Aún no hay publicaciones. Los artículos aparecerán aquí cuando el docente publique el primero.</p>');
}else{
main.querySelectorAll('article').forEach(a=>a.remove());
panel.innerHTML='<h2 class="font-headline-sm text-primary font-bold text-2xl mb-4">Publicaciones docentes</h2>'+(articles.length?'<div class="grid gap-5 md:grid-cols-2">'+articles.map(tile).join('')+'</div>':'<p class="text-on-surface-variant">Todavía no hay artículos publicados.</p>');
}
return;
}
if(page==='lectura.html'){
main.querySelectorAll(':scope > :not(#aa-functional)').forEach(el=>el.style.display='none');
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