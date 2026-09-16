import json, pathlib, subprocess, urllib.parse, re, html, datetime

ROOT = pathlib.Path(__file__).parent
TARGETS = [('hibiscus','Hibiscus rosa-sinensis flower'),('ixora','Ixora flower'),('lantana','Lantana camara flower'),('plumeria','Plumeria flower'),('bougainvillea','Bougainvillea flowers'),('bidens','Bidens pilosa flower')]

def fetch(url):
    return subprocess.check_output(['curl','--fail','--silent','--show-error','--max-time','55',url])

def plain(value):
    return html.unescape(re.sub('<[^>]+>', '', value or '')).strip()

images=[]
for label,query in TARGETS:
    params = dict(action='query',format='json',generator='search',gsrsearch=query+' filetype:bitmap',gsrnamespace=6,gsrlimit=12,prop='imageinfo',iiprop='url|extmetadata',iiurlwidth=1000)
    data=json.loads(fetch('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))
    count=0
    for page in sorted(data.get('query',{}).get('pages',{}).values(), key=lambda p:p.get('index',999)):
        if not page['title'].lower().endswith(('.jpg','.jpeg')): continue
        info=page['imageinfo'][0]; meta=info.get('extmetadata',{})
        get=lambda k:plain(meta.get(k,{}).get('value',''))
        if not get('Artist') or not get('LicenseShortName'): continue
        file=f'{label}/{label}-{count+1:02d}.jpg'
        path=ROOT/file; path.parent.mkdir(parents=True,exist_ok=True)
        try: content=fetch(info.get('thumburl',info['url']))
        except subprocess.CalledProcessError: continue
        if not content.startswith(b'\xff\xd8'): continue
        path.write_bytes(content)
        images.append(dict(file=file,expectedLabel=label,labelStatus='unverified',stage='unknown',stageStatus='needs-review',plantPart='unknown',regionStatus='not-annotated',collection='macau-shortlist-reference',geographicProvenance='Not assumed Macau; Commons reference only',commonsTitle=page['title'],sourcePage=info['descriptionurl'],author=get('Artist'),license=get('LicenseShortName'),licenseUrl=get('LicenseUrl'),originalUrl=info['url'],downloadUrl=info.get('thumburl',info['url']),description=get('ImageDescription'),modifications='Wikimedia-generated 1000px thumbnail; no local edits'))
        count+=1
        print(label,count,page['title'],flush=True)
        if count==2: break
    (ROOT/'manifest.json').write_text(json.dumps(dict(generatedAt=datetime.date.today().isoformat(),source='Wikimedia Commons',note='Search labels are unverified. Stage and part require review; images are not claimed to depict Macau specimens. Reference-only, excluded from validated benchmark until reviewed.',images=images),ensure_ascii=False,indent=2))
print('Downloaded',len(images),'images')
