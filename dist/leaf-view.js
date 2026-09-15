const LeafView=(()=>{
 const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 function summary(leaf){if(!leaf)return 'Leaf analysis unavailable';const o=leaf.observations;return `<strong>${esc(o.shape?o.shape+' blade silhouette':'Blade shape unresolved')}</strong><p>${esc(o.reason)}</p><p>Ends: ${esc(o.endShape?.replaceAll('_',' ')||'unresolved')}. Tip / base orientation unverified.</p><small>Nearby leaf or leaflet; connection to flower unverified. Edge type and arrangement not measured.</small>`;}
 function render(result){const {out,leafCanvas:source}=result;if(!source||!out.leaf)return;const leaf=out.leaf,w=source.width,h=source.height,selected=leaf.candidates.find(c=>c.id===(leaf.selectedId||leaf.previewId)),ids=['leafCandidates','leafBlade','leafOutline'],mask=leaf.selectedId?leaf.mask:Uint8Array.from(leaf.labels,v=>v===leaf.previewId?1:0);
  for(const id of ids){const canvas=document.getElementById(id);if(!canvas)continue;canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');if(id==='leafOutline'&&canvas.nextElementSibling)canvas.nextElementSibling.textContent=leaf.selectedId?'Measured outline and long axis':'Candidate boundary · unresolved';ctx.fillStyle='#111';ctx.fillRect(0,0,w,h);
   if(id==='leafCandidates'){ctx.drawImage(source,0,0);ctx.font='bold 12px Arial';for(const c of leaf.candidates){if(!c.box)continue;ctx.strokeStyle=c.id===leaf.selectedId?'white':'#999';ctx.lineWidth=c.id===leaf.selectedId?2:1;ctx.strokeRect(c.box.x,c.box.y,c.box.right-c.box.x+1,c.box.bottom-c.box.y+1);ctx.fillStyle='black';ctx.fillRect(c.box.x,c.box.y,48,16);ctx.fillStyle='white';ctx.fillText('#'+c.id+(c.usable?'':' ?'),c.box.x+3,c.box.y+12);}continue;}
   if(!selected){ctx.fillStyle='white';ctx.font='14px Arial';ctx.fillText('No complete blade',12,24);continue;}
   const b=selected.box,pad=5,x=Math.max(0,b.x-pad),y=Math.max(0,b.y-pad),cw=Math.min(w-x,b.right-b.x+pad*2+1),ch=Math.min(h-y,b.bottom-b.y+pad*2+1);canvas.width=cw;canvas.height=ch;ctx.fillStyle='#111';ctx.fillRect(0,0,cw,ch);
   if(id==='leafBlade'){ctx.drawImage(source,x,y,cw,ch,0,0,cw,ch);continue;}
   const original=source.getContext('2d').getImageData(0,0,w,h),im=ctx.createImageData(cw,ch);for(let yy=0;yy<ch;yy++)for(let xx=0;xx<cw;xx++){const p=(y+yy)*w+x+xx,j=(yy*cw+xx)*4;if(mask[p]){const edge=!mask[p-1]||!mask[p+1]||!mask[p-w]||!mask[p+w];im.data.set(edge?[255,255,255,255]:[original.data[p*4],original.data[p*4+1],original.data[p*4+2],255],j);}else im.data.set([17,17,17,255],j);}ctx.putImageData(im,0,0);
   const a=selected.axis;ctx.strokeStyle='white';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(a.x1-x,a.y1-y);ctx.lineTo(a.x2-x,a.y2-y);ctx.stroke();ctx.setLineDash([]);
  }
  const note=document.getElementById('leafNote');if(note)note.textContent=leaf.selectedId?`Selected region #${selected.id} · ${leaf.observations.shape} silhouette · nearby leaf/leaflet, association unverified`:`${leaf.candidates.length} green candidates · ${leaf.observations.reason}`;
 }
 function clear(){for(const id of ['leafCandidates','leafBlade','leafOutline']){const c=document.getElementById(id);if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);}const n=document.getElementById('leafNote');if(n)n.textContent='Awaiting leaf measurements';}
 return{render,summary,clear};
})();
