
(function(){
 const form=document.getElementById('leadForm');
 if(form){
  form.addEventListener('submit',function(e){
   e.preventDefault();
   const fd=new FormData(form);
   const lead={id:Date.now(),nome:(fd.get('nome')||'').trim(),telefone:(fd.get('telefone')||'').trim(),problema:fd.get('problema')||'',detalhes:(fd.get('detalhes')||'').trim(),data:new Date().toLocaleString('pt-BR'),status:'Novo'};
   if(!lead.nome||!lead.telefone||!lead.problema){alert('Preencha nome, telefone e tipo de problema.');return;}
   const leads=JSON.parse(localStorage.getItem('sg_geladeira_leads')||'[]');leads.unshift(lead);localStorage.setItem('sg_geladeira_leads',JSON.stringify(leads));
   form.reset();const msg=document.getElementById('formMessage');if(msg){msg.textContent='Solicitação registrada neste navegador. A equipe deverá entrar em contato após receber os dados pelo canal configurado.';msg.classList.remove('hidden');}
  });
 }
 const login=document.getElementById('adminLogin');
 if(login){
  login.addEventListener('submit',function(e){e.preventDefault();if(document.getElementById('adminPassword').value==='2504'){sessionStorage.setItem('sg_admin_auth','1');showAdmin();}else{document.getElementById('loginError').classList.remove('hidden');}});
  if(sessionStorage.getItem('sg_admin_auth')==='1')showAdmin();
 }
 function showAdmin(){
  const gate=document.getElementById('loginArea'),area=document.getElementById('adminArea');
  if(gate)gate.classList.add('hidden');if(area)area.classList.remove('hidden');renderLeads();
 }
 function renderLeads(){
  const tbody=document.getElementById('leadRows');if(!tbody)return;
  const leads=JSON.parse(localStorage.getItem('sg_geladeira_leads')||'[]');
  document.getElementById('leadCount').textContent=leads.length+' orçamento(s)';
  if(!leads.length){tbody.innerHTML='<tr><td colspan="6">Nenhum orçamento salvo neste navegador.</td></tr>';return;}
  tbody.innerHTML=leads.map(l=>'<tr><td>'+esc(l.data)+'</td><td>'+esc(l.nome)+'</td><td>'+esc(l.telefone)+'</td><td>'+esc(l.problema)+'</td><td><select data-status="'+l.id+'"><option '+(l.status==='Novo'?'selected':'')+'>Novo</option><option '+(l.status==='Em contato'?'selected':'')+'>Em contato</option><option '+(l.status==='Concluído'?'selected':'')+'>Concluído</option></select></td><td><button class="btn danger" data-delete="'+l.id+'">Excluir</button></td></tr>').join('');
  tbody.querySelectorAll('[data-status]').forEach(el=>el.addEventListener('change',()=>{let a=JSON.parse(localStorage.getItem('sg_geladeira_leads')||'[]');let x=a.find(z=>z.id==el.dataset.status);if(x){x.status=el.value;localStorage.setItem('sg_geladeira_leads',JSON.stringify(a));}}));
  tbody.querySelectorAll('[data-delete]').forEach(el=>el.addEventListener('click',()=>{if(confirm('Excluir este orçamento?')){let a=JSON.parse(localStorage.getItem('sg_geladeira_leads')||'[]').filter(z=>z.id!=el.dataset.delete);localStorage.setItem('sg_geladeira_leads',JSON.stringify(a));renderLeads();}}));
 }
 function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 const exp=document.getElementById('exportLeads');if(exp)exp.addEventListener('click',()=>{const a=JSON.parse(localStorage.getItem('sg_geladeira_leads')||'[]');const blob=new Blob([JSON.stringify(a,null,2)],{type:'application/json'});const u=URL.createObjectURL(blob);const x=document.createElement('a');x.href=u;x.download='orcamentos-geladeira.json';x.click();URL.revokeObjectURL(u);});
 const logout=document.getElementById('logoutAdmin');if(logout)logout.addEventListener('click',()=>{sessionStorage.removeItem('sg_admin_auth');location.reload();});
})();
