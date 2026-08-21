#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const HOME=os.homedir();
function fail(code,status,error,extra={}){process.stdout.write(JSON.stringify({status,agent:null,sdk:'claude-code',profile:process.env.AGENT_BRIDGE_PROFILE||null,...extra,error},null,2)+'\n');process.exit(code)}
const strip=s=>s.trim().replace(/^["']|["']$/g,'').trim();
const asList=v=>Array.isArray(v)?v:String(v||'').split(',').map(x=>x.trim()).filter(Boolean);
function args(argv){const o={readonly:'auto',raw:false,dryRun:false,needsBrowser:false};for(let i=0;i<argv.length;i++){const a=argv[i],n=()=>argv[++i];switch(a){case'--agent':o.agent=n();break;case'--agent-file':o.agentFile=n();break;case'--skill':o.skill=n();break;case'--model':o.model=n();break;case'--effort':o.effort=n();break;case'--scope':o.scope=n();break;case'--scope-file':o.scopeFile=n();break;case'--schema':o.schema=n();break;case'--cwd':o.cwd=n();break;case'--max-turns':o.maxTurns=Number(n());break;case'--readonly':o.readonly=n();break;case'--needs-browser':o.needsBrowser=true;break;case'--raw':o.raw=true;break;case'--dry-run':o.dryRun=true;break;default:fail(2,'ERROR','Unknown argument: '+a)}}return o}
function onPath(bin){return spawnSync(process.platform==='win32'?'where':'which',[bin],{encoding:'utf8'}).status===0}
function agentDirs(base){const out=[];let d=path.resolve(base||process.cwd());for(;;){out.push(path.join(d,'.claude','agents'));const p=path.dirname(d);if(p===d)break;d=p}out.push(path.join(process.env.CLAUDE_CONFIG_DIR||path.join(HOME,'.claude'),'agents'));return out.filter(fs.existsSync)}
function readDef(file){const t=fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'');const m=t.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);if(!m)return{meta:{},body:t.trim()};const meta={};let key=null;for(const line of m[1].split(/\r?\n/)){const li=line.match(/^\s*-\s+(.*)$/);if(li&&key){if(!Array.isArray(meta[key]))meta[key]=[];meta[key].push(strip(li[1]));continue}const kv=line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);if(!kv)continue;key=kv[1];const v=kv[2].trim();if(!v||['>','|','>-','|-'].includes(v))meta[key]=[];else if(v.startsWith('['))meta[key]=v.replace(/^\[|\]$/g,'').split(',').map(strip).filter(Boolean);else meta[key]=strip(v)}return{meta,body:m[2].trim()}}
function resolveAgent(name,explicit,base){if(explicit){if(!fs.existsSync(explicit))fail(2,'ERROR','Agent file not found: '+explicit);return explicit}for(const d of agentDirs(base)){const f=path.join(d,name+'.md');if(fs.existsSync(f))return f;for(const e of fs.readdirSync(d).filter(x=>x.endsWith('.md'))){const c=path.join(d,e);try{if(readDef(c).meta.name===name)return c}catch{}}}fail(2,'ERROR','No definition found for agent "'+name+'"')}
function skillRoots(base){const r=[];if(process.env.AGENT_SKILLS_ROOT)r.push(process.env.AGENT_SKILLS_ROOT);let d=path.resolve(base||process.cwd());for(;;){r.push(path.join(d,'.claude','skills'));const p=path.dirname(d);if(p===d)break;d=p}r.push(path.join(HOME,'.agents','skills'));r.push(path.join(process.env.CLAUDE_CONFIG_DIR||path.join(HOME,'.claude'),'skills'));return r.filter(fs.existsSync)}
function loadSkill(name,roots){for(const r of roots){const f=path.join(r,name,'SKILL.md');if(fs.existsSync(f))return fs.readFileSync(f,'utf8').trim()}return null}
function readonly(meta,override){if(override==='yes')return true;if(override==='no')return false;const denied=asList(meta.disallowedTools).map(x=>x.toLowerCase());if(denied.some(x=>['write','edit','notebookedit'].includes(x)))return true;const allowed=asList(meta.tools).map(x=>x.toLowerCase());return !!allowed.length&&!allowed.includes('*')&&!allowed.includes('write')&&!allowed.includes('edit')}

const o=args(process.argv.slice(2));const hasAgent=!!(o.agent||o.agentFile);if(hasAgent===!!o.skill)fail(2,'ERROR','Pass exactly one anchor: --agent/--agent-file or --skill');if(!o.model)fail(2,'ERROR','Claude Code worker requires an explicit model from its profile');if(!['auto','yes','no'].includes(o.readonly))fail(2,'ERROR','--readonly must be auto, yes, or no');if(o.maxTurns!==undefined&&(!Number.isInteger(o.maxTurns)||o.maxTurns<1))fail(2,'ERROR','--max-turns must be positive');if(o.needsBrowser)fail(3,'BLOCKED','Claude Code external worker browser capability is not verified in worker-profile v1; route this role to a verified browser profile instead.');if(!onPath('claude'))fail(3,'BLOCKED','Claude Code CLI "claude" is not on PATH.');
let def={meta:{},body:''},agentFile=null,name=o.skill;if(hasAgent){agentFile=resolveAgent(o.agent,o.agentFile,o.cwd);def=readDef(agentFile);name=def.meta.name||o.agent||path.basename(agentFile,'.md')}
const roots=skillRoots(o.cwd),skills=[],missing=[];const names=asList(def.meta.skills);if(o.skill)names.unshift(o.skill);for(const n of [...new Set(names)]){const c=loadSkill(n,roots);c?skills.push({name:n,content:c}):missing.push(n)}if(missing.length)fail(2,'ERROR','Unresolved skills: '+missing.join(', '));
let scope='';try{scope=o.scopeFile?fs.readFileSync(o.scopeFile,'utf8'):(o.scope||'')}catch(e){fail(2,'ERROR','Could not read scope file: '+e.message)}if(!scope.trim())fail(2,'ERROR','Missing --scope or --scope-file');
const ro=readonly(def.meta,o.readonly),sections=[];sections.push(`# Operating contract\n\nYou are executing the configured external Claude Code worker role "${name}". The contract below is authoritative. Do not substitute a different workflow.`);if(def.body)sections.push(`## Agent definition: ${name}\n\n${def.body}`);for(const s of skills)sections.push(`## Agent Skill: ${s.name}\n\n${s.content}`);if(ro)sections.push('## Capability boundary\n\nThis run is READ-ONLY. Do not create, edit, or delete files.');sections.push('# Task\n\n'+scope.trim());
let schemaText=null;if(o.schema){const f=path.resolve(o.schema);if(!fs.existsSync(f))fail(2,'ERROR','Schema file not found: '+f);schemaText=fs.readFileSync(f,'utf8');sections.push('# Return contract\n\nReturn only JSON matching this schema:\n```json\n'+schemaText.trim()+'\n```')}else sections.push('# Return contract\n\nReturn a compact evidence-bearing result. Do not narrate private chain-of-thought or repeat the task packet.');const prompt=sections.join('\n\n---\n\n')+'\n';

const denyReadRules=[
  'Read(~/.ssh/**)','Read(~/.aws/**)','Read(~/.gnupg/**)','Read(~/.kube/**)','Read(~/.docker/**)','Read(~/.config/gh/**)',
  'Read(~/.npmrc)','Read(~/.netrc)','Read(.env)','Read(**/.env)','Read(.env.local)','Read(**/.env.local)'
];
const sandboxDenyRead=[
  '~/.ssh','~/.aws','~/.gnupg','~/.kube','~/.docker','~/.config/gh','~/.npmrc','~/.netrc',
  './.env','./**/.env','./.env.local','./**/.env.local'
];
const settings={
  sandbox:{enabled:true,failIfUnavailable:true,allowUnsandboxedCommands:false,filesystem:{denyRead:sandboxDenyRead}},
  permissions:{deny:denyReadRules}
};
if(!ro)settings.permissions.allow=['Edit(./**)'];
const ca=['-p','--safe-mode','--output-format','text','--no-session-persistence','--model',o.model,'--max-turns',String(o.maxTurns||20),'--settings',JSON.stringify(settings),'--strict-mcp-config'];
if(o.effort)ca.push('--effort',o.effort);
if(ro)ca.push('--permission-mode','plan','--tools','Read,Grep,Glob');
else ca.push('--permission-mode','dontAsk','--tools','Read,Grep,Glob,Edit,Write,Bash');
if(schemaText)ca.push('--json-schema',schemaText);
const info={status:'OK',agent:name,agentFile,sdk:'claude-code',profile:process.env.AGENT_BRIDGE_PROFILE||null,workerConfig:process.env.AGENT_BRIDGE_WORKER_CONFIG_RESOLVED||null,model:o.model,effort:o.effort||null,readonly:ro,needsBrowser:false,skills:skills.map(s=>s.name),promptBytes:Buffer.byteLength(prompt)};
if(o.dryRun){process.stdout.write(JSON.stringify({...info,status:'DRY_RUN',command:['claude',...ca]},null,2)+'\n\n----- composed prompt ('+info.promptBytes+' bytes) -----\n'+prompt);process.exit(0)}
const run=spawnSync('claude',ca,{cwd:o.cwd||process.cwd(),input:prompt,encoding:'utf8',env:process.env,maxBuffer:64*1024*1024});const output=run.stdout||'';if(o.raw){process.stdout.write(output);process.exit(run.status===0?0:4)}const envelope={...info,status:run.status===0?'OK':'BACKEND_FAILED',exitCode:run.status,result:output.trim()};if(run.status!==0)envelope.stderr=(run.stderr||run.error?.message||'').trim().slice(0,4000);process.stdout.write(JSON.stringify(envelope,null,2)+'\n');process.exit(run.status===0?0:4);
