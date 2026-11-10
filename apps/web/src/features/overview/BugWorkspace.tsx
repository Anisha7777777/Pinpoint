import { useRef, useState, type RefObject } from 'react';
import { ArrowLeft, Bug, Check, ChevronRight, Code2, Image, Search, SlidersHorizontal } from 'lucide-react';
import { Badge, ResultBadge } from '../../components/Badge';
import { demoBugs, type DemoBug } from './demo';

export function ReproductionMatrix({bug}:{bug:DemoBug}) {
 return <><p className="section-description">Manually recorded observations{bug.fix ? ` · ${bug.fix.split(' · ')[0]}` : ''}. Reproduction and verification outcomes stay separate from bug status. A pass applies only to the environment tested.</p>
 {bug.matrix.length ? <div className="table-scroll" role="region" aria-label="Environment results" tabIndex={0}><table><caption className="sr-only">Synthetic reproduction and fix verification results for {bug.id}</caption><thead><tr><th scope="col">Environment</th><th scope="col">App version</th><th scope="col">Reproduction result</th><th scope="col">Fix verification</th></tr></thead><tbody>{bug.matrix.map(row=><tr key={row.environment}><th scope="row">{row.environment}</th><td>{row.version}</td><td><ResultBadge value={row.reproduction}/></td><td><ResultBadge value={row.verification}/></td></tr>)}</tbody></table></div>:<div className="inline-empty">No attempts recorded. All environments remain untested.</div>}
 {bug.fix && <p className="table-note">Version arrow: original build → fix build. Verifications refer to the fix build.</p>}</>;
}
function BugDetail({bug,onBack,headingRef}:{bug:DemoBug;onBack:()=>void;headingRef:RefObject<HTMLHeadingElement|null>}) {
 return <article className="bug-detail" aria-label={`Sample details for ${bug.id}`}>
 <button className="back-to-list text-button" onClick={onBack}><ArrowLeft size={16}/>Back to sample list</button>
 <div className="detail-kicker"><span>{bug.id}</span><span>/</span><span>{bug.area}</span><Badge>Sample report</Badge></div>
 <h2 ref={headingRef} tabIndex={-1}>{bug.title}</h2>
 <div className="detail-meta"><Badge tone={bug.severity==='High'?'danger':bug.severity==='Medium'?'warning':'neutral'}>{bug.severity} severity</Badge><Badge tone="purple">{bug.status}</Badge><span className="assignee"><span className="avatar">{bug.initials}</span>{bug.assignee}</span></div>
 <p className="detail-description">A manually documented sample report. Review the original behavior, recorded environments and evidence for a specific fix.</p>
 <div className="behavior-grid"><section><h3><Check size={16}/>Expected behavior</h3><p>{bug.expected}</p></section><section><h3><Bug size={16}/>Actual behavior</h3><p>{bug.actual}</p></section></div>
 <section className="detail-section"><h3>Reproduction steps</h3><ol className="steps">{bug.steps.map(step=><li key={step}>{step}</li>)}</ol></section>
 <section className="detail-section"><div className="section-title"><h3>Screenshot evidence</h3><Badge>Planned</Badge></div><div className="evidence-empty"><Image size={20}/><div><strong>No screenshots in this sample</strong><p>Private screenshot attachments arrive in Phase 3.</p></div></div></section>
 <section className="detail-section"><div className="section-title"><h3>Reproduction & verification</h3><span className="muted">{bug.matrix.length} environments</span></div><ReproductionMatrix bug={bug}/></section>
 <section className="detail-section"><h3>Proposed fix</h3>{bug.fix?<div className="fix-summary"><Code2 size={18}/><div><strong>{bug.fix}</strong><p>Synthetic fix reference · commit / pull-request linking is planned.</p></div></div>:<p className="section-description">No proposed fix recorded in this sample.</p>}</section>
 <section className="detail-section"><h3>Verification history</h3><ul className="detail-history">{bug.history.map(event=><li key={event}>{event}</li>)}</ul></section>
 <p className="detail-footnote">Read-only sample. Reporting, uploads, verification and closure are planned features.</p></article>;
}
export function BugWorkspace() {
 const [query,setQuery]=useState('');const [status,setStatus]=useState('All statuses');const [severity,setSeverity]=useState('All severities');const [selectedId,setSelectedId]=useState(demoBugs[0].id);const [showDetail,setShowDetail]=useState(false);
 const headingRef=useRef<HTMLHeadingElement>(null);const listHeadingRef=useRef<HTMLHeadingElement>(null);
 const filtered=demoBugs.filter(bug=>`${bug.id} ${bug.title} ${bug.assignee}`.toLowerCase().includes(query.toLowerCase())&&(status==='All statuses'||bug.status===status)&&(severity==='All severities'||bug.severity===severity));
 const selected=filtered.find(bug=>bug.id===selectedId)??filtered[0];
 const selectBug=(id:string)=>{setSelectedId(id);setShowDetail(true);requestAnimationFrame(()=>headingRef.current?.focus());};
 const backToList=()=>{setShowDetail(false);requestAnimationFrame(()=>listHeadingRef.current?.focus());};
 return <section className={`workspace-panel panel ${showDetail?'detail-visible':''}`} aria-label="Synthetic bug workspace"><div className="bug-browser">
 <div className="browser-heading"><div><h2 ref={listHeadingRef} tabIndex={-1}>Bug inbox</h2><p>Explore the sample reports</p></div><span className="count-pill">{demoBugs.length}</span></div>
 <div className="list-controls"><label className="search-field"><Search size={17}/><span className="sr-only">Search sample bugs</span><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search bugs or assignees…"/></label><div className="filter-row"><SlidersHorizontal size={16} aria-hidden="true"/><label><span className="sr-only">Filter sample bugs by status</span><select value={status} onChange={event=>setStatus(event.target.value)}>{['All statuses','Open','In progress','In verification','Closed'].map(value=><option key={value}>{value}</option>)}</select></label><label><span className="sr-only">Filter sample bugs by severity</span><select value={severity} onChange={event=>setSeverity(event.target.value)}>{['All severities','High','Medium','Low'].map(value=><option key={value}>{value}</option>)}</select></label></div></div>
 <p className="list-count" role="status">{filtered.length} sample {filtered.length===1?'bug':'bugs'}</p><ul className="bug-rows">{filtered.map(bug=><li key={bug.id}><button className={`bug-row ${selected?.id===bug.id?'selected':''}`} aria-pressed={selected?.id===bug.id} onClick={()=>selectBug(bug.id)}><div className="row-top"><span className="bug-id">{bug.id}</span><span className="row-time">Sample</span></div><h3>{bug.title}</h3><div className="row-tags"><Badge tone={bug.severity==='High'?'danger':bug.severity==='Medium'?'warning':'neutral'}>{bug.severity}</Badge><span className="row-status">{bug.status}</span><ChevronRight className="row-arrow" size={16}/></div><div className="row-bottom"><span>{bug.area}</span><span className="assignee"><span className="avatar small">{bug.initials}</span>{bug.assignee}</span></div></button></li>)}</ul>
 {!filtered.length&&<div className="empty-state"><Search size={24}/><h3>No matching sample bugs</h3><p>Try another search or clear the filters.</p><button className="secondary-button" onClick={()=>{setQuery('');setStatus('All statuses');setSeverity('All severities');}}>Clear filters</button></div>}
 <div className="list-footnote">Local preview · changes are not saved</div></div>
 {selected?<BugDetail bug={selected} headingRef={headingRef} onBack={backToList}/>:<div className="detail-empty"><Bug size={32}/><h2>No bug selected</h2><p>Clear the filters to explore a sample report.</p></div>}</section>;
}
