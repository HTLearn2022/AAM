(function(){
'use strict';
var KEY='aam-jia-connected-v1',SESSION='aam-jia-account-v1',NAV='aam-portal-sidebar-v1';
var $=function(id){return document.getElementById(id)};
var safe=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var uid=function(prefix){return prefix+'-'+Date.now().toString(36).slice(-6)+'-'+Math.random().toString(36).slice(2,5)};
var now=function(){return new Date().toISOString()};
var notify=function(message){alert(message)};
var PERMISSIONS=[
 ['dashboard:view','View operations dashboard'],['flights:view','View flight requests'],['flights:create','Submit airline flight requests'],['flights:approve','Accept or reject flight requests'],['flights:assign','Allocate parking stands'],['flights:update','Update ETA / ETD'],
 ['private:view','View private airline schedule'],['private:edit','Edit and print private schedules'],
 ['ga:view','View GA and FBO parking'],['ga:edit','Add or update GA records'],
 ['issues:view','View issues and defects'],['issues:report','Report issues'],['issues:assign','Assign and sign off issues'],['issues:resolve','Resolve assigned issues'],
 ['inspections:view','View inspections'],['inspections:record','Record inspections'],
 ['permits:view','View permit requests'],['permits:request','Request permits'],['permits:approve','Approve or reject permits'],['permits:close','Activate or close permits'],
 ['notams:view','View NOTAM requests'],['notams:request','Submit NOTAM requests'],['notams:review','Review NOTAM requests'],['notams:file','Simulate AIS filing'],['notams:ack','Simulate ATC acknowledgement'],
 ['reports:view','View reports and audit'],['admin:manage','Manage account types and departments']
];
var ALL=PERMISSIONS.map(function(p){return p[0]});
var defineRole=function(name,perms){return {name:name,perms:perms}};
var ROLES=[
 defineRole('System Administrator',ALL),
 defineRole('Airport Operations',['dashboard:view','flights:view','flights:approve','flights:assign','flights:update','ga:view','ga:edit','issues:view','issues:report','issues:assign','issues:resolve','inspections:view','inspections:record','permits:view','permits:request','permits:approve','permits:close','notams:view','notams:request','notams:review','reports:view']),
 defineRole('Airport Manager',['dashboard:view','flights:view','ga:view','issues:view','inspections:view','permits:view','notams:view','reports:view']),
 defineRole('ATC',['dashboard:view','flights:view','ga:view','inspections:view','notams:view','notams:request','notams:ack','issues:view','issues:report']),
 defineRole('AIS',['dashboard:view','flights:view','notams:view','notams:file','reports:view']),
 defineRole('Airline',['dashboard:view','flights:view','flights:create','flights:update','private:view','private:edit','ga:view','issues:view','issues:report','permits:view','permits:request','notams:view','notams:request']),
 defineRole('FBO',['dashboard:view','flights:view','ga:view','ga:edit','issues:view','issues:report','permits:view','permits:request']),
 defineRole('Ground Handler',['dashboard:view','flights:view','ga:view','issues:view','issues:report','permits:view','permits:request']),
 defineRole('Maintenance',['dashboard:view','flights:view','issues:view','issues:report','issues:resolve','inspections:view','inspections:record','permits:view','permits:request','permits:close','notams:view','notams:request']),
 defineRole('Safety',['dashboard:view','flights:view','issues:view','issues:report','issues:resolve','inspections:view','inspections:record','permits:view','notams:view','notams:request','reports:view']),
 defineRole('Communications',['dashboard:view','flights:view','notams:view','issues:view']),
 defineRole('Airport Fire Service',['dashboard:view','flights:view','issues:view','issues:report','inspections:view','permits:view','notams:view'])
];
var PAGES=[
 ['dashboard','▦','Operations Dashboard','dashboard:view'],
 ['flights','✈','Flight Schedule','flights:view'],
 ['private','▤','Airline Private Schedule','private:view'],
 ['ga','⌑','GA / FBO Parking','ga:view'],
 ['issues','!','Issues & Permits','issues:view'],
 ['inspections','✓','Inspections','inspections:view'],
 ['notams','✉','NOTAM Requests','notams:view'],
 ['reports','≡','Reports & Audit','reports:view'],
 ['admin','⚙','Administration','admin:manage']
];
var STANDS=['Stand 1','Stand 2','Stand 3','Stand 4','Stand 5','Stand 6','Stand 7L','Stand 7','Stand 8','Stand 9','Stand 10','Cargo'];
var MAP=[['Stand 1',34.7,16.6],['Stand 2',34.7,22.5],['Stand 3',34.7,28.3],['Stand 4',34.7,34],['Stand 5',34.7,39.9],['Stand 6',34.7,45.8],['Stand 7L',35,52.2],['Stand 7',72,19.8],['Stand 8',72,28],['Stand 9',72,36.2],['Stand 10',72,44.4],['G1',16,67.4],['G2',21.4,67.4],['G3',27,67.4],['G4',32.3,67.4],['G5',37.8,67.4],['G6',20,74.2],['G7',25.3,74.2],['G8',30.6,74.2],['G9',36,74.2],['Cargo',68,74.2]];
var ORGS=[
 {id:'airport',name:'JSR International Airport',type:'Airport'},
 {id:'horizon',name:'Island Horizon Airways (fictional)',type:'Airline'},
 {id:'coastal',name:'Coastal Wings (fictional)',type:'Airline'},
 {id:'cargo',name:'Meridian Cargo (fictional)',type:'Airline'},
 {id:'fbo',name:'JIA Executive Aviation (fictional)',type:'FBO'},
 {id:'handler',name:'Island Ground Handling (fictional)',type:'Ground Handler'},
 {id:'technical',name:'JIA Technical Services (fictional)',type:'Airport'}
];
var USERS=[
 {id:'u-admin',name:'JIA System Administrator',role:'System Administrator',org:'airport'},
 {id:'u-ops',name:'JIA Duty Operations Officer',role:'Airport Operations',org:'airport'},
 {id:'u-manager',name:'JIA Airport Manager',role:'Airport Manager',org:'airport'},
 {id:'u-atc',name:'JIA Tower Controller',role:'ATC',org:'airport'},
 {id:'u-ais',name:'JIA AIS Officer',role:'AIS',org:'airport'},
 {id:'u-horizon',name:'Island Horizon Scheduler',role:'Airline',org:'horizon'},
 {id:'u-coastal',name:'Coastal Wings Scheduler',role:'Airline',org:'coastal'},
 {id:'u-cargo',name:'Meridian Cargo Scheduler',role:'Airline',org:'cargo'},
 {id:'u-fbo',name:'JIA Executive Aviation Agent',role:'FBO',org:'fbo'},
 {id:'u-handler',name:'Island Ground Handling Agent',role:'Ground Handler',org:'handler'},
 {id:'u-maint',name:'JIA Maintenance Supervisor',role:'Maintenance',org:'technical'},
 {id:'u-safety',name:'JIA Safety Officer',role:'Safety',org:'airport'},
 {id:'u-comms',name:'JIA Communications Officer',role:'Communications',org:'airport'},
 {id:'u-fire',name:'JIA Fire Service Officer',role:'Airport Fire Service',org:'airport'}
].map(function(u){u.active=true;return u});
var FLIGHTS=[
 ['f1','IH101','horizon','DHC6','ZZZA','ZZZB','Domestic','07:00','07:35','Stand 1','Accepted'],
 ['f2','CW310','coastal','AT76','ZZZC','ZZZA','International','08:45','09:35','Stand 3','Accepted'],
 ['f3','MC801','cargo','C208','ZZZD','ZZZE','Cargo','10:05','10:35','Cargo','Accepted'],
 ['f4','IH204','horizon','B738','ZZZF','ZZZB','International','11:40','13:00','Stand 5','Accepted'],
 ['f5','CW610','coastal','A320','ZZZC','ZZZA','International','12:15','13:30','Stand 6','Accepted'],
 ['f6','IH209','horizon','AT76','ZZZA','ZZZC','Domestic','15:15','16:10','Stand 4','Accepted'],
 ['f7','CW702','coastal','E190','ZZZA','ZZZD','International','17:15','18:15','Stand 7','Accepted'],
 ['f8','IH215','horizon','DHC6','ZZZA','ZZZB','Domestic','14:00','14:40','','Pending'],
 ['f9','CW516','coastal','AT76','ZZZC','ZZZA','International','19:00','20:00','','Pending']
].map(function(f){return {id:f[0],number:f[1],org:f[2],aircraft:f[3],origin:f[4],destination:f[5],category:f[6],sta:f[7],std:f[8],eta:f[7],etd:f[8],stand:f[9],status:f[10],date:'2026-11-20'}});
function makeSample(){
 return {version:1,date:'2026-11-20',roles:ROLES,orgs:ORGS,users:USERS,flights:FLIGHTS,
 privateRows:[{id:'p1',org:'horizon',flight:'IH900',route:'ZZZA–ZZZB',time:'11:50',note:'Internal crew planning only — not submitted'}],
 ga:[{id:'g1',registration:'J8-JIA',aircraft:'C208',spot:'G1',operator:'JIA Executive Aviation',org:'fbo',start:'2026-11-20',end:'2026-11-22',status:'On stand'},{id:'g2',registration:'J8-DEM',aircraft:'PA28',spot:'G5',operator:'JIA Executive Aviation',org:'fbo',start:'2026-11-20',end:'2026-11-20',status:'Reserved'}],
 issues:[{id:'ISS-001',location:'Stand 9',category:'Lighting',severity:'High',owner:'Maintenance',description:'Fictional apron floodlight defect.',status:'Open',due:'2026-11-20T18:00',by:'u-ops',date:'2026-11-20'},{id:'ISS-002',location:'Terminal Arrivals',category:'Equipment',severity:'Medium',owner:'Maintenance',description:'Fictional baggage carousel motor requires inspection.',status:'Resolved',due:'2026-11-20T16:00',by:'u-handler',date:'2026-11-20'}],
 inspections:[{id:'INS-001',type:'Airfield',item:'Runway surface',result:'Pass',location:'RWY 06/24',remarks:'Fictional inspection completed.',date:'2026-11-20',by:'u-ops'}],
 permits:[{id:'PER-001',type:'Hot works',location:'Cargo Hangar',team:'JIA Technical Services',scope:'Fictional welding work with fire watch.',end:'2026-11-20T18:00',status:'Requested',by:'u-maint',date:'2026-11-20'}],
 notams:[{id:'NOT-001',subject:'Taxiway',location:'TWY C',text:'Fictional Taxiway C closure for planned works.',start:'2026-11-20T12:00',end:'2026-11-20T19:00',status:'AIS Filed (simulated)',by:'u-ops',date:'2026-11-20',reference:'SIM-JIA-001'},{id:'NOT-002',subject:'Apron / stands',location:'Stand 9',text:'Fictional restriction on Stand 9 for lighting maintenance.',start:'2026-11-20T12:00',end:'2026-11-21T12:00',status:'Awaiting Operations review',by:'u-maint',date:'2026-11-20',reference:''}],
 audit:[{at:new Date().toISOString(),actor:'System',event:'Fictional JIA sample records initialised'}]};
}
var data;
try{data=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){data=null}
if(!data||data.version!==1||!Array.isArray(data.roles)||!Array.isArray(data.users))data=makeSample();
var user=null,page='dashboard',selectedStand='Stand 1';
function write(message){if(message)data.audit.unshift({at:new Date().toISOString(),actor:user?user.name:'System',event:message});data.audit=data.audit.slice(0,100);try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){console.warn('Demo local storage unavailable')}}
function role(){return user&&data.roles.find(function(x){return x.name===user.role})}
function can(key){var r=role();return !!(r&&(r.name==='System Administrator'||r.perms.indexOf(key)!==-1))}
function orgName(id){var x=data.orgs.find(function(y){return y.id===id});return x?x.name:'Unknown organisation'}
function isAirline(){return user&&user.role==='Airline'}
function filteredFlights(){return data.flights.filter(function(f){return f.date===data.date&&(!isAirline()||f.org===user.org)})}
function admin(){return can('admin:manage')}
function isMine(obj){return obj.org===user.org}
function statusTag(text){var colour=/Overdue|Rejected|Fail|Conflict/.test(text)?' red':/Closed|Approved|Accepted|Resolved|Pass|AIS Filed|Acknowledged/.test(text)?' green':/Pending|Requested|Awaiting|Active|Reserved/.test(text)?' amber':'';return '<span class="tag'+colour+'">'+safe(text)+'</span>'}
function toMinutes(value){if(!/^\d{2}:\d{2}$/.test(value||''))return null;var x=value.split(':').map(Number);return x[0]*60+x[1]}
function overlaps(a,b){var as=toMinutes(a.eta),ae=toMinutes(a.etd),bs=toMinutes(b.eta),be=toMinutes(b.etd);return as!==null&&ae!==null&&bs!==null&&be!==null&&as<be+10&&bs<ae+10}
function standConflict(f,stand){return data.flights.some(function(other){return other.id!==f.id&&other.status==='Accepted'&&other.date===f.date&&other.stand===stand&&overlaps(f,other)})}
function activeOnStand(f,time){var t=toMinutes(time),a=toMinutes(f.eta),b=toMinutes(f.etd);return t!==null&&a!==null&&b!==null&&t>=a&&t<b&&f.status==='Accepted'&&f.date===data.date}
function allowedPage(id){if(id==='issues'||id==='permits')return can('issues:view')||can('permits:view');var entry=PAGES.find(function(x){return x[0]===id});return !!(entry&&can(entry[3]))}
function pageTitle(id){if(id==='issues'||id==='permits')return 'Issues & Permits';var x=PAGES.find(function(p){return p[0]===id});return x?x[2]:'Operations Dashboard'}
function renderNav(){var nav=$('navLinks');nav.innerHTML=PAGES.filter(function(p){return allowedPage(p[0])}).map(function(p){return '<a class="nav-link'+(p[0]===page||p[0]==='issues'&&page==='permits'?' active':'')+'" href="#'+safe(p[0])+'" title="'+safe(p[2])+'"><em aria-hidden="true">'+safe(p[1])+'</em>'+safe(p[2])+'</a>'}).join('')}
function selectPage(id){if(!allowedPage(id))id=PAGES.filter(function(p){return allowedPage(p[0])})[0]?.[0]||'dashboard';if(id==='issues'&&!can('issues:view')&&can('permits:view'))id='permits';page=id;document.querySelectorAll('.section').forEach(function(s){s.classList.toggle('active',s.dataset.page===page)});document.querySelectorAll('[data-jump]').forEach(function(b){b.classList.toggle('active',b.dataset.jump===page)});$('pageTitle').textContent=pageTitle(page);if(location.hash!=='#'+page)history.replaceState(null,'','#'+page);render()}
function render(){if(!user)return;var current=data.users.find(function(u){return u.id===user.id&&u.active});if(!current){showLogin();return}user=current;$('accountLabel').textContent=user.name+' · '+user.role;renderNav();if(page==='dashboard')renderDashboard();else if(page==='flights')renderFlights();else if(page==='private')renderPrivate();else if(page==='ga')renderGa();else if(page==='issues')renderIssues();else if(page==='permits')renderPermits();else if(page==='inspections')renderInspections();else if(page==='notams')renderNotams();else if(page==='reports')renderReports();else if(page==='admin')renderAdmin()}
function showLogin(){$('loginOverlay').hidden=false;var opts=data.users.filter(function(u){return u.active}).map(function(u){return '<option value="'+safe(u.id)+'">'+safe(u.name)+' · '+safe(u.role)+' ('+safe(orgName(u.org))+')</option>'});$('loginChoice').innerHTML=opts.join('');if(user)$('loginChoice').value=user.id}
function openAccount(){var x=data.users.find(function(u){return u.id===$('loginChoice').value&&u.active});if(!x)return notify('Please select a fictional account.');user=x;try{sessionStorage.setItem(SESSION,user.id)}catch(e){}$('loginOverlay').hidden=true;if(!allowedPage(page))page='dashboard';selectPage(page)}
function printPrivate(){window.print()}

function renderDashboard(){
 $('operatingDate').value=data.date;
 var flights=filteredFlights(),accepted=flights.filter(function(f){return f.status==='Accepted'});
 var allIssues=data.issues.filter(function(x){return x.status!=='Closed'});
 var overdue=allIssues.filter(function(x){return x.due&&new Date(x.due).getTime()<Date.now()});
 var permits=data.permits.filter(function(x){return x.status==='Approved'||x.status==='Active'});
 var activeNotams=data.notams.filter(function(x){return x.status==='AIS Filed (simulated)'||x.status==='ATC Acknowledged (simulated)'});
 var metrics=[['Accepted flights',accepted.length,'For '+data.date],['Open defects',can('issues:view')?allIssues.length:'—','Overdue: '+overdue.length],['Active permits',can('permits:view')?permits.length:'—','Fictional approvals'],['NOTAMs simulated in force',can('notams:view')?activeNotams.length:'—','Not official notices']];
 $('dashboardMetrics').innerHTML=metrics.map(function(m){return '<article class="metric"><span>'+safe(m[0])+'</span><strong>'+safe(m[1])+'</strong><small>'+safe(m[2])+'</small></article>'}).join('');
 $('dashboardFlights').innerHTML='<div class="table-wrap"><table><thead><tr><th>Flight</th><th>ETA/ETD</th><th>Stand</th><th>Status</th></tr></thead><tbody>'+accepted.sort(function(a,b){return a.eta.localeCompare(b.eta)}).map(function(f){return '<tr><td><b>'+safe(f.number)+'</b><small>'+safe(orgName(f.org))+'</small></td><td>'+safe(f.eta||'—')+' / '+safe(f.etd||'—')+'</td><td>'+safe(f.stand||'Unassigned')+'</td><td>'+statusTag(f.status)+'</td></tr>'}).join('')+'</tbody></table></div>';
 var handovers=[];
 if(can('issues:view'))handovers.push('<b>Open defects:</b> '+allIssues.length+' ('+overdue.length+' overdue)');
 if(can('permits:view'))handovers.push('<b>Permits active:</b> '+permits.length);
 if(can('notams:view'))handovers.push('<b>Simulated filed NOTAMs:</b> '+activeNotams.length);
 if(can('flights:approve'))handovers.push('<b>Requests awaiting Ops:</b> '+flights.filter(function(f){return f.status==='Pending'}).length);
 $('dashboardWork').innerHTML=handovers.length?handovers.map(function(m){return '<p class="record">'+m+'</p>'}).join(''):'<p class="empty">No further departmental handovers visible for this role.</p>';
 renderMap();
}
function renderMap(){
 var pins=$('mapPins'),time=$('viewTime').value||'12:30';
 pins.replaceChildren();
 var accepted=data.flights.filter(function(f){return f.date===data.date&&f.status==='Accepted'&&(!isAirline()||f.org===user.org)});
 MAP.forEach(function(entry){
   var key=entry[0],related=accepted.filter(function(f){return f.stand===key});
   var occupied=related.filter(function(f){return activeOnStand(f,time)});
   var clash=false;for(var i=0;i<related.length;i++)for(var j=i+1;j<related.length;j++)if(overlaps(related[i],related[j]))clash=true;
   var stays=data.ga.filter(function(g){return g.spot===key&&g.start<=data.date&&g.end>=data.date&&g.status!=='Departed'});
   var state=clash||stays.length>1?'clash':occupied.length||stays.some(function(g){return g.status==='On stand'})?'busy':'free';
   var b=document.createElement('button');b.type='button';b.className='map-pin '+(state==='busy'?'busy':state==='clash'?'clash':'');
   b.style.left=entry[1]+'%';b.style.top=entry[2]+'%';b.title=key+' — '+state;b.setAttribute('aria-label',key+' '+state);
   b.setAttribute('aria-pressed',String(key===selectedStand));b.textContent=state==='clash'?'!':occupied.length?occupied[0].number:stays.length?stays[0].registration:'✓';
   b.addEventListener('click',function(){selectedStand=key;renderMap()});pins.append(b);
   if(key===selectedStand){
    var bits=[key+' · '+(clash?'CONFLICT':occupied.length?'OCCUPIED':stays.length?'RESERVED / GA':'AVAILABLE')];
    occupied.forEach(function(f){bits.push(f.number+' ('+f.aircraft+') · '+f.eta+'–'+f.etd)});
    related.filter(function(f){return !activeOnStand(f,time)}).forEach(function(f){bits.push('Other assignment: '+f.number+' '+f.eta+'–'+f.etd)});
    stays.forEach(function(g){bits.push(g.registration+' · '+g.status+' · '+g.start+' to '+g.end)});
    if(bits.length===1)bits.push('No recorded assignment at the selected time.');
    $('mapDetail').textContent=bits.join('\n');
   }
 });
}
function renderFlights(){
 var rows=filteredFlights().slice().sort(function(a,b){return (a.sta||'').localeCompare(b.sta||'')});
 var options=STANDS.map(function(st){return '<option value="'+safe(st)+'">'+safe(st)+'</option>'}).join('');
 $('flightRows').innerHTML=rows.map(function(f){
  var controls=[];
  if(can('flights:approve')&&f.status==='Pending')controls.push('<button class="btn primary" data-act="accept" data-id="'+safe(f.id)+'">Accept</button> <button class="btn danger" data-act="reject" data-id="'+safe(f.id)+'">Reject</button>');
  if(can('flights:assign')&&f.status==='Accepted')controls.push('<select aria-label="Parking stand" data-stand="'+safe(f.id)+'"><option value="">Unassigned</option>'+options+'</select> <button class="btn" data-act="assign" data-id="'+safe(f.id)+'">Assign</button>');
  if(can('flights:update')&&(f.status==='Accepted'||f.status==='Pending')&&(!isAirline()||f.org===user.org))controls.push('<div style="display:flex;gap:4px;flex-wrap:wrap"><input aria-label="ETA" type="time" data-eta="'+safe(f.id)+'" value="'+safe(f.eta)+'" style="max-width:100px"> <input aria-label="ETD" type="time" data-etd="'+safe(f.id)+'" value="'+safe(f.etd)+'" style="max-width:100px"> <button class="btn" data-act="times" data-id="'+safe(f.id)+'">Save estimates</button></div>');
  return '<tr><td><b>'+safe(f.number)+'</b><small>'+safe(orgName(f.org))+'</small></td><td>'+safe(f.category)+'<small>'+safe(f.aircraft)+'</small></td><td>'+safe(f.sta)+' / '+safe(f.std)+'</td><td>'+safe(f.eta)+' / '+safe(f.etd)+'</td><td>'+statusTag(f.status)+'</td><td>'+safe(f.stand||'Unassigned')+'</td><td><div class="actions">'+controls.join('')+'</div></td></tr>';
 }).join('')||'<tr><td colspan="7">No flights visible for this department or date.</td></tr>';
 document.querySelectorAll('[data-stand]').forEach(function(el){var f=data.flights.find(function(x){return x.id===el.dataset.stand});if(f)el.value=f.stand||''});
 document.querySelector('#flightForm button[type=submit]').disabled=!can('flights:create');
 document.querySelector('#flightForm').style.display=can('flights:create')?'grid':'none';
}
function renderPrivate(){
 var rows=data.privateRows.filter(function(x){return x.org===user.org});
 $('privateRows').innerHTML=rows.map(function(x){return '<tr><td>'+safe(x.flight)+'</td><td>'+safe(x.route)+'</td><td>'+safe(x.time)+'</td><td>'+safe(x.note)+'</td><td><button class="btn" data-act="send-private" data-id="'+safe(x.id)+'">Submit this flight to Ops</button> <button class="btn danger" data-act="delete-private" data-id="'+safe(x.id)+'">Delete local row</button></td></tr>'}).join('')||'<tr><td colspan="5">No private rows for your airline.</td></tr>';
}
function renderGa(){
 var rows=data.ga.filter(function(g){return user.role!=='FBO'||g.org===user.org});
 $('gaRows').innerHTML='<div class="cards">'+rows.map(function(g){return '<article class="record"><h4>'+safe(g.registration)+' · '+safe(g.spot)+' '+statusTag(g.status)+'</h4><p>'+safe(g.aircraft)+' · '+safe(g.operator)+'</p><small>'+safe(g.start)+' to '+safe(g.end)+'</small>'+(can('ga:edit')?'<div class="actions"><select data-ga-status="'+safe(g.id)+'"><option>Reserved</option><option>On stand</option><option>Departed</option></select><button class="btn" data-act="save-ga" data-id="'+safe(g.id)+'">Save status</button></div>':'')+'</article>'}).join('')+'</div>';
 document.querySelectorAll('[data-ga-status]').forEach(function(el){var g=data.ga.find(function(x){return x.id===el.dataset.gaStatus});if(g)el.value=g.status});
 $('gaForm').style.display=can('ga:edit')?'grid':'none';
 $('gaSpotSelect').innerHTML=Array.from({length:9},function(_,i){return '<option>G'+(i+1)+'</option>'}).join('');
}

function isOverdue(x){return x.status!=='Closed'&&x.due&&new Date(x.due).getTime()<Date.now()}
function renderIssues(){
 $('issueRows').innerHTML=data.issues.map(function(x){
  var buttons=[];
  if(can('issues:assign')&&x.status==='Open')buttons.push('<select aria-label="Issue owner" data-owner="'+safe(x.id)+'">'+['Maintenance','Airport Operations','Safety','Ground Handling','Terminal Operations'].map(function(y){return '<option'+(x.owner===y?' selected':'')+'>'+safe(y)+'</option>'}).join('')+'</select> <button class="btn" data-act="owner" data-id="'+safe(x.id)+'">Assign</button>');
  if(x.status==='Open'&&(can('issues:assign')||can('issues:resolve')&&(x.owner===user.role||x.owner==='Safety'&&user.role==='Safety')))buttons.push('<button class="btn" data-act="resolve" data-id="'+safe(x.id)+'">Mark resolved</button>');
  if(x.status==='Resolved'&&can('issues:assign'))buttons.push('<button class="btn primary" data-act="signoff" data-id="'+safe(x.id)+'">Sign off</button>');
  return '<article class="record"><h4>'+safe(x.id)+' · '+safe(x.location)+' '+statusTag(isOverdue(x)?'Overdue':x.status)+'</h4><p>'+safe(x.description)+'</p><small>'+safe(x.category)+' · '+safe(x.severity)+' · Assigned to '+safe(x.owner||'Unassigned')+' · Due '+safe(x.due||'Not set')+(x.inspection?' · Related inspection: '+safe(x.inspection):'')+'</small><div class="actions">'+buttons.join('')+'</div></article>';
 }).join('')||'<p class="empty">No issues.</p>';
 $('issueForm').style.display=can('issues:report')?'grid':'none';
}
function renderInspections(){
 $('inspectionRows').innerHTML='<div class="cards">'+data.inspections.map(function(i){return '<article class="record"><h4>'+safe(i.id)+' · '+safe(i.type)+' · '+statusTag(i.result)+'</h4><p>'+safe(i.item)+' · '+safe(i.location)+'</p><small>'+safe(i.remarks||'No remarks')+' · '+safe(i.date)+'</small></article>'}).join('')+'</div>';
 $('inspectionForm').style.display=can('inspections:record')?'grid':'none';
 var type=$('inspectionType').value;
 $('inspectionItem').innerHTML=(type==='Terminal'?['Public concourse','Baggage claim area','Emergency exits','Fire safety equipment','Lighting and signage']:['Runway surface','Taxiway lights','Apron pavement','FOD inspection','Perimeter fencing','Runway markings']).map(function(x){return '<option>'+safe(x)+'</option>'}).join('');
}
function renderPermits(){
 $('permitRows').innerHTML=data.permits.map(function(p){
  var actions=[];
  if(p.status==='Requested'&&can('permits:approve'))actions.push('<button class="btn primary" data-act="permit-approve" data-id="'+safe(p.id)+'">Approve</button><button class="btn danger" data-act="permit-reject" data-id="'+safe(p.id)+'">Reject</button>');
  if(p.status==='Approved'&&can('permits:close'))actions.push('<button class="btn" data-act="permit-active" data-id="'+safe(p.id)+'">Activate</button>');
  if(p.status==='Active'&&can('permits:close'))actions.push('<button class="btn" data-act="permit-close" data-id="'+safe(p.id)+'">Close out</button>');
  return '<article class="record"><h4>'+safe(p.id)+' · '+safe(p.type)+' '+statusTag(p.status)+'</h4><p>'+safe(p.location)+' — '+safe(p.scope)+'</p><small>Team: '+safe(p.team)+' · Ends: '+safe(p.end||'Not specified')+'</small><div class="actions">'+actions.join('')+'</div></article>';
 }).join('')||'<p class="empty">No permit requests.</p>';
 $('permitForm').style.display=can('permits:request')?'grid':'none';
}
function renderNotams(){
 var records=data.notams.filter(function(n){return can('notams:review')||can('notams:file')||can('notams:ack')||admin()||n.by===user.id||n.status==='AIS Filed (simulated)'||n.status==='ATC Acknowledged (simulated)'});
 $('notamRows').innerHTML=records.map(function(n){
  var actions=[];
  if(n.status==='Awaiting Operations review'&&can('notams:review'))actions.push('<button class="btn primary" data-act="notam-review" data-id="'+safe(n.id)+'">Review / send to AIS (simulation)</button>');
  if(n.status==='Reviewed for AIS'&&can('notams:file'))actions.push('<button class="btn primary" data-act="notam-file" data-id="'+safe(n.id)+'">Simulate AIS filing</button>');
  if(n.status==='AIS Filed (simulated)'&&can('notams:ack'))actions.push('<button class="btn" data-act="notam-ack" data-id="'+safe(n.id)+'">ATC acknowledges</button>');
  return '<article class="record"><h4>'+safe(n.id)+' · '+safe(n.subject)+' '+statusTag(n.status)+'</h4><p>'+safe(n.location)+' — '+safe(n.text)+'</p><small>From '+safe(n.start||'Unspecified')+' UTC · To '+safe(n.end||'Unspecified')+' UTC'+(n.reference?' · Reference '+safe(n.reference):'')+'</small><div class="actions">'+actions.join('')+'</div></article>';
 }).join('')||'<p class="empty">No visible notices or requests.</p>';
 $('notamForm').style.display=can('notams:request')?'grid':'none';
}
function renderReports(){
 var buttons=[['flights','Flight schedule CSV','flights:view'],['issues','Issue register CSV','issues:view'],['permits','Permit register CSV','permits:view'],['notams','NOTAM request CSV','notams:view'],['audit','Activity log CSV','reports:view']];
 $('reportButtons').innerHTML=buttons.filter(function(a){return can(a[2])}).map(function(x){return '<button type="button" class="btn" data-act="export" data-kind="'+x[0]+'">'+x[1]+'</button>'}).join('');
 $('auditRows').innerHTML=data.audit.slice(0,30).map(function(a){return '<div class="audit">'+safe(a.at)+' · '+safe(a.actor)+' — '+safe(a.event)+'</div>'}).join('')||'<p class="empty">No recorded activity.</p>';
}
function renderAdmin(){
 var roles=data.roles.map(function(r){return '<option>'+safe(r.name)+'</option>'}).join('');
 var picker=$('roleEditor'),old=picker.value;picker.innerHTML=roles;if(data.roles.some(function(r){return r.name===old}))picker.value=old;else picker.value='Airport Operations';
 var selected=data.roles.find(function(r){return r.name===picker.value})||data.roles[0];
 $('permissionEditor').innerHTML=PERMISSIONS.map(function(p){return '<label><input type="checkbox" value="'+safe(p[0])+'"'+(selected.perms.indexOf(p[0])>=0?' checked':'')+(selected.name==='System Administrator'?' disabled':'')+'>'+safe(p[1])+'</label>'}).join('');
 $('saveRole').disabled=selected.name==='System Administrator';
 var newRole=$('newUserRole'),prev=newRole.value;newRole.innerHTML=roles;if(data.roles.some(function(r){return r.name===prev}))newRole.value=prev;
 var orgs=$('newUserOrg'),oldOrg=orgs.value;orgs.innerHTML=data.orgs.map(function(o){return '<option value="'+safe(o.id)+'">'+safe(o.name)+' ('+safe(o.type)+')</option>'}).join('');if(data.orgs.some(function(o){return o.id===oldOrg}))orgs.value=oldOrg;
 $('userRows').innerHTML=data.users.map(function(u){
  var roleOptions=data.roles.map(function(r){return '<option'+(r.name===u.role?' selected':'')+'>'+safe(r.name)+'</option>'}).join('');
  return '<tr><td><b>'+safe(u.name)+'</b><small>'+safe(u.id)+'</small></td><td><select aria-label="Account type" data-user-role="'+safe(u.id)+'">'+roleOptions+'</select></td><td>'+safe(orgName(u.org))+'</td><td>'+statusTag(u.active?'Active':'Deactivated')+'</td><td><button class="btn" data-act="user-role" data-id="'+safe(u.id)+'">Save role</button> <button class="btn'+(u.active?' danger':'')+'" data-act="user-active" data-id="'+safe(u.id)+'"'+(u.id===user.id?' disabled':'')+'>'+(u.active?'Deactivate':'Reactivate')+'</button></td></tr>';
 }).join('');
}
function csvEscape(x){return '"'+String(x==null?'':x).replace(/"/g,'""')+'"'}
function exportCSV(kind){
 var rows=data[kind]||[],cols=kind==='flights'?['number','date','org','aircraft','category','sta','std','eta','etd','status','stand']:kind==='issues'?['id','location','category','severity','description','owner','status','due']:kind==='permits'?['id','type','location','team','scope','status','end']:kind==='notams'?['id','subject','location','text','start','end','status','reference']:['at','actor','event'];
 if(kind==='flights'&&isAirline())rows=rows.filter(function(x){return x.org===user.org});
 var str=[cols.join(',')].concat(rows.map(function(x){return cols.map(function(c){return csvEscape(x[c])}).join(',')})).join('\r\n');
 var blob=new Blob([str],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='JIA demo '+kind+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},1500);
}
