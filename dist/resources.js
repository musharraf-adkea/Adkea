// The complete resource content is rendered in HTML; search only filters it locally.
document.querySelectorAll('[data-resource]').forEach(root=>{
 const input=root.querySelector('#resource-search');
 const filters=[...root.querySelectorAll('[data-filter]')];
 const groups=[...root.querySelectorAll('[data-category]')];
 const status=root.querySelector('#resource-count');
 const empty=root.querySelector('.resource-empty');
 const normalise=value=>value.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
 const content=new Map([...root.querySelectorAll('[data-search-item]')].map(item=>[item,normalise(item.textContent)]));
 let category='all';
 function update(){
  const words=normalise(input.value.trim()).split(/\s+/).filter(Boolean);
  let count=0;
  groups.forEach(group=>{
   const selected=category==='all'||group.dataset.category===category;
   let groupCount=0;
   group.querySelectorAll('[data-search-item]').forEach(item=>{
    const matches=selected&&words.every(word=>content.get(item).includes(word));
    item.hidden=!matches;if(matches)groupCount++;
   });
   group.hidden=groupCount===0;count+=groupCount;
  });
  const noun=count===1?root.dataset.resource.replace(/s$/,''):root.dataset.resource;
  status.textContent=count+' '+noun+(count===1?' matches':' match')+(input.value.trim()?' your search':' the selected categories');
  empty.hidden=count!==0;
  filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===category)));
 }
 function reset(){category='all';input.value='';update();input.focus();}
 input.addEventListener('input',update);
 input.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();reset();}});
 root.querySelector('#resource-clear').addEventListener('click',reset);
 root.querySelector('[data-reset]').addEventListener('click',reset);
 filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;update();}));
});
