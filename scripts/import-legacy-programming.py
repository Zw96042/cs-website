#!/usr/bin/env python3
"""Import supplied 2003–2012 programming statements without executing contest code."""
import importlib.util, json, os, re, subprocess
from pathlib import Path, PurePosixPath
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('uil', ROOT/'scripts/import-uil.py')
u=importlib.util.module_from_spec(spec);spec.loader.exec_module(u)
STAGE=ROOT/'work/legacy-programming'
DOWNLOADS=Path(os.environ.get('UIL_DOWNLOADS', Path.home()/'Downloads'))
SOFFICE=os.environ.get('UIL_SOFFICE', str(Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/soffice'))

def round_name(path):
 s=str(path).lower().replace('problemstatements','problems')
 if 'utcs' in s:return 'UTCS UIL Invitational ' + ('2011' if '2011' in s else '2010')
 if re.search(r'district\s*a|districta',s):return 'District A'
 if re.search(r'district\s*b|districtb',s):return 'District B'
 if re.search(r'dist(?:rict)?[ _]*1|d1(?:\D|$)',s):return 'District 1'
 if re.search(r'dist(?:rict)?[ _]*2|d2(?:\D|$)',s):return 'District 2'
 if 'state' in s:return 'State'
 if 'reg' in s:return 'Regional'
 return None

def main():
 tests=[];resources=[];report=[]
 for archive in sorted(DOWNLOADS.glob('UIL*.zip')):
  year=re.search(r'20\d\d',archive.name)
  if not year or not 2003<=int(year[0])<=2012 or 'Written' in archive.name:continue
  year=int(year[0]);entries=list(u.nested_entries(archive.read_bytes()))
  zipurl=u.source_pdf('legacy-'+archive.name,archive.read_bytes())
  candidates={}
  for path,data in entries:
   suffix=path.suffix.lower();s=str(path).lower().replace('problemstatements','problems')
   if suffix not in {'.pdf','.doc','.docx'} or path.name.startswith('~$'):continue
   if any(x in s for x in ['judge','dryrun','dry run','written','instructions','guide','form','results']):continue
   contest=round_name(path)
   if not contest or not any(x in s for x in ['probset','problemstatement','problems','handson','hands on','programming','district a','district b','d1_2010','d2_2010']):continue
   priority=2 if suffix=='.pdf' else 1
   if contest not in candidates or priority>candidates[contest][0]:candidates[contest]=(priority,path,data)
  present=set()
  for contest,(_,path,data) in candidates.items():
   packet_year=int(contest[-4:]) if contest.startswith('UTCS') else year
   display_contest=re.sub(r' 20\d\d$','',contest)
   slug=display_contest.lower().replace(' ','-');testid=f'{packet_year}-{slug}-frq';prefix='legacy-'+testid
   originalurl=u.source_pdf(prefix+'-'+path.name,data)
   if path.suffix.lower()!='.pdf':
    local=STAGE/archive.stem/str(path);local.parent.mkdir(parents=True,exist_ok=True);local.write_bytes(data)
    converted=local.parent/'converted';converted.mkdir(exist_ok=True)
    target=converted/(local.stem+'.pdf')
    if not target.exists():
     subprocess.run([SOFFICE,'--headless','--convert-to','pdf','--outdir',str(converted),str(local)],check=True,stdout=subprocess.DEVNULL)
    data=target.read_bytes()
   pdfurl=u.source_pdf(prefix+'.pdf',data);doc=u.pdf.open(stream=data,filetype='pdf')
   starts=[]
   for pno,page in enumerate(doc):
    items=u.page_lines(page)
    program=next((x for x in items if re.search(r'Program\s+Name\s*:',x['raw'],re.I)),None)
    if not program:continue
    before=[x for x in items if x['rect'].y0<program['rect'].y0-0.1 and x['raw'].strip() and not re.search(r'^UIL|^Page\s+\d|^20\d\d$|^[_\s]+$|^\d+\s*Points$|^Problem\s+\d+$',x['raw'].strip(),re.I)]
    if not before:
     before=[x for x in items if re.fullmatch(r'Problem\s+\d+',x['raw'].strip())]
    if not before:continue
    heading=max(before,key=lambda x:x['rect'].y0)
    title=heading['raw'].strip()
    title=re.sub(r'^(?:Problem\s*#)?\d+[.:]\s*','',title,flags=re.I)
    basename=re.search(r'Program\s+Name:\s*([\w -]+?)\.(?:java|cpp|c)',page.get_text(),re.I)
    if not basename:continue
    starts.append((pno,title,basename[1].strip(),heading['rect'].y0))
   # Every problem start must have a source program basename; statement-only
   # continuation pages belong to the preceding problem.
   assert len({x[2].lower() for x in starts})==len(starts), (testid,'duplicate problem basename')
   if not starts:
    resources.append({'year':year,'contest':contest,'title':f'{year} {contest} programming archive','url':zipurl,'note':'Supplied archive; no problem statements could be parsed.'});continue
   scoped=[(p,d) for p,d in entries if round_name(p)==contest or (year<=2006 and ((contest=='State' and 'state' in str(p).lower()) or (contest=='Regional' and 'reg' in str(p).lower())))]
   questions=[]
   for idx,(pno,title,basename,top) in enumerate(starts):
    number=idx+1;following=starts[idx+1] if idx+1<len(starts) else None
    end=following[0]+1 if following else len(doc);content=[];text=[]
    for n in range(pno,end):
     page=doc[n];items=u.page_lines(page)
     bottom=following[3] if following and n==following[0] else 750
     filtered=[x for x in items if x['rect'].y0>=(top+1 if n==pno else 20) and x['rect'].y0<bottom-0.1 and (x['mono'] or not re.search(r'^[_\s]+$',x['raw'].strip())) and (x['mono'] or not re.search(r'^UIL\b|^20\d\d$|^Page\s+\d',x['raw'].strip(),re.I))]
     diagrams=u.graphics(page,top if n==pno else 20,bottom)
     filtered=[x for x in filtered if not any(x['rect'].intersects(r) for r in diagrams)]
     content.extend(u.native_blocks(page,filtered,prefix,f'p{number}-{n}',preserve_gaps=True))
     for i,r in enumerate(diagrams):content.append(u.crop_figure(page,r,prefix,f'p{number}-{n}-figure{i}',f'Diagram for {title}'))
     text.append(page.get_text(clip=u.pdf.Rect(0,top+1 if n==pno else 20,page.rect.width,bottom)))
    # Put dedicated test/judge folders first when old bundles omit Judge naming.
    prioritized=sorted(scoped,key=lambda x: (-int(bool(re.search(r'judge|(?:^|/)tests?(?:/|$)',str(x[0]),re.I))),int(bool(re.search(r'example|sample|student',str(x[0]),re.I)))))
    files=u.judge_files(prioritized,basename,prefix)
    # Earlier packets use .in instead of .dat; preserve their exact filenames.
    for role,extensions in [('input',{'.in'}),('output',{'.ans'}),('solution',{'.c'})]:
     matches=[(p,d) for p,d in scoped if p.suffix.lower() in extensions and p.stem.lower()==basename.lower()]
     if matches and (role=='solution' or not any(f['role']==role for f in files)):
      p,d=max(matches,key=lambda x:('judge' in str(x[0]).lower(),'example' not in str(x[0]).lower()))
      target=u.OUT/'files'/prefix/p.name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(d)
      files.append({'name':p.name,'url':f'/practice-data/files/{prefix}/{p.name}','role':role,'text':d.decode('utf-8-sig',errors='replace') if len(d)<100000 else None,'compressed':False,'byteLength':len(d),'sourcePath':str(p)})
    questions.append({'id':f'{testid}-{number}','number':number,'kind':'programming','title':title,'programName':basename,'text':'\n\n'.join(text),'images':[],'files':files,'content':content})
   meta={'id':testid,'year':packet_year,'contest':display_contest,'mode':'frq','title':f'{packet_year} {display_contest}','pdfUrl':pdfurl,'originalUrl':originalurl,'archiveUrl':zipurl,'dataUrl':f'/practice-data/{testid}.json','questionCount':len(questions)}
   if path.suffix.lower()!='.pdf':meta['documentUrl']=originalurl
   judges=[(p,d) for p,d in entries if p.suffix.lower() in {'.pdf','.doc','.docx'} and 'judge' in str(p).lower() and round_name(p)==contest]
   if judges:
    p,d=max(judges,key=lambda x:x[0].suffix.lower()=='.pdf')
    if p.suffix.lower()=='.pdf':meta['judgePdfUrl']=u.source_pdf(prefix+'-judge.pdf',d)
    else:
     meta['judgeDocumentUrl']=u.source_pdf(prefix+'-judge'+p.suffix.lower(),d)
     local=STAGE/archive.stem/str(p);local.parent.mkdir(parents=True,exist_ok=True);local.write_bytes(d)
     converted=local.parent/'converted';converted.mkdir(exist_ok=True);target=converted/(local.stem+'.pdf')
     if not target.exists():subprocess.run([SOFFICE,'--headless','--convert-to','pdf','--outdir',str(converted),str(local)],check=True,stdout=subprocess.DEVNULL)
     meta['judgePdfUrl']=u.source_pdf(prefix+'-judge.pdf',target.read_bytes())
   u.write_json(u.OUT/(testid+'.json'),{**meta,'questions':questions,'referenceImages':[]})
   tests.append(meta);present.add(contest);report.append({'id':testid,'count':len(questions),'titles':[q['title'] for q in questions],'withFiles':sum(bool(q['files']) for q in questions),'source':str(path)})
   resources.append({'year':packet_year,'contest':display_contest,'title':f'{packet_year} {display_contest} original programming materials','url':zipurl,'note':'Original supplied archive with statements, judge data and source solutions.'})
   if path.suffix.lower()!='.pdf':resources.append({'year':packet_year,'contest':display_contest,'title':f'{packet_year} {display_contest} original statement document','url':originalurl,'note':'Original supplied Word document; the practice statement uses its PDF conversion.'})
  rounds={round_name(p) for p,d in entries if p.suffix.lower() in {'.java','.cpp','.dat','.in','.out'}}-{None}
  for contest in rounds-present:resources.append({'year':year,'contest':contest,'title':f'{year} {contest} programming resources','url':zipurl,'note':'Judge data and source solutions only; no problem statement packet was supplied for this round.'})
 u.write_json(ROOT/'work/legacy-programming-manifest.json',{'tests':tests,'resources':resources,'report':report})
 u.write_json(u.OUT/'legacy-programming-index.json',{'tests':tests,'resources':resources})
 print(json.dumps({'sets':len(tests),'problems':sum(t['questionCount'] for t in tests),'resources':len(resources)}))
if __name__=='__main__':main()
