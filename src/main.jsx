import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const alternatives = [
  { id: 'terrace', name: 'Terrace Spine', note: 'Under review' },
  { id: 'courtyard', name: 'Courtyard Loop', note: 'Viewed' },
  { id: 'harbor', name: 'Harbor Edge', note: 'Draft' },
];

const baseComments = [
  { name: 'Emma Chen', time: '9:32 AM', text: 'Strengthen north light strategy', detail: 'Proposed louver adjustment to reduce glare and increase daylight depth.' },
  { name: "Liam O’Connor", time: '9:47 AM', text: 'Confirm guardrail transparency', detail: 'Recommend low-iron glass with minimal posts to retain the waterfront view.' },
  { name: 'Priya Shah', time: '10:02 AM', text: 'Consider deeper shade at entry plaza', detail: 'Explore canopy extension or tree coverage to improve summer comfort.' },
];

function App() {
  const [selected, setSelected] = useState(alternatives[0]);
  const [comments, setComments] = useState(baseComments);
  const [commentText, setCommentText] = useState('');
  const [proposalText, setProposalText] = useState('Test a deeper south canopy and retain the north-light louver study.');
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalState, setProposalState] = useState('none');
  const [approvals, setApprovals] = useState([]);
  const [view, setView] = useState('review');
  const [briefOpen, setBriefOpen] = useState(false);
  const [provenanceOpen, setProvenanceOpen] = useState(false);

  const approved = approvals.length === 2;
  const status = approved ? 'Approved direction' : proposalState === 'pending' ? 'Proposal in review' : 'Under review';
  const handoffReady = approved;

  const addComment = () => {
    const clean = commentText.trim();
    if (!clean) return;
    setComments((items) => [...items, { name: 'You', time: 'Now', text: clean, detail: 'Added to the review record.' }]);
    setCommentText('');
  };

  const submitProposal = () => {
    if (!proposalText.trim()) return;
    setProposalState('pending');
    setApprovals([]);
    setProposalOpen(false);
    setComments((items) => [...items, { name: 'Ava Patel', time: 'Now', text: 'Proposal created for team review', detail: proposalText.trim() }]);
  };

  const approveAs = (person) => {
    if (proposalState !== 'pending' || approvals.includes(person)) return;
    setApprovals((items) => [...items, person]);
  };

  const navigate = (next) => {
    if (next === 'handoff' && !handoffReady) return;
    setView(next);
  };

  const selectedTitle = useMemo(() => `${selected.name} · ${status}`, [selected, status]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="wordmark" onClick={() => setBriefOpen(true)}>Fieldline<span>/</span></button>
        <div className="crumbs">Harborview Civic Center <b>›</b> Design Review <b>›</b> <strong>{selectedTitle}</strong></div>
        <div className="top-actions"><span className="people">EC&nbsp; LO&nbsp; PS&nbsp; +2</span><button className="quiet-button">Share review</button><button className="quiet-button" onClick={() => setBriefOpen(true)}>Brief</button></div>
      </header>

      <section className="workspace">
        <aside className="left-rail">
          <div className="project-title"><strong>Harborview Civic Center</strong><span>Design Review · May 20, 2025</span></div>
          <div className="rail-section">
            <p className="eyebrow">Brief</p>
            <button className="nav-row" onClick={() => setBriefOpen(true)}>Project brief <span>v3 · May 10</span></button>
            <p className="ritual-note">Designed to fit the studio's existing review ritual.</p>
          </div>
          <div className="rail-section">
            <div className="section-head"><p className="eyebrow">Alternatives</p><button onClick={() => setProposalOpen(true)}>New</button></div>
            {alternatives.map((alt, index) => <button className={`alternative ${selected.id === alt.id ? 'active' : ''}`} key={alt.id} onClick={() => { setSelected(alt); setView('review'); }}><span className="thumbnail"><img src="/assets/harborview-concept.png" alt="Architectural concept" /></span><span><b>Alt {index + 1} · {alt.name}</b><small>{alt.note}</small></span></button>)}
          </div>
          <div className="rail-section input-list">
            <p className="eyebrow">Model inputs</p>
            <button>Site & context <span>SketchUp · v2</span></button>
            <button>Massing model <span>Rhino · v7 · source of record</span></button>
            <button>Material palette <span>Library · v1</span></button>
            <button>Sustainability targets <span>Brief · v1</span></button>
          </div>
          <div className="rail-bottom"><button onClick={() => setProvenanceOpen(true)}>View model provenance</button><button onClick={() => setBriefOpen(true)}>Product exercise</button></div>
        </aside>

        <section className="main-stage">
          <div className="stage-topline"><span>Alt 1</span><b>{selected.name}</b><span className={`status ${approved ? 'approved' : ''}`}>{status}</span><div><button onClick={() => setProposalOpen(true)}>Propose change</button><button onClick={() => setProvenanceOpen(true)}>Provenance</button></div></div>
          {view === 'review' ? <ReviewCanvas comments={comments} selected={selected} approved={approved} onPropose={() => setProposalOpen(true)} /> : <Handoff selected={selected} />}
          <DecisionBar proposalState={proposalState} approvals={approvals} onApprove={approveAs} approved={approved} onHandoff={() => navigate('handoff')} onPropose={() => setProposalOpen(true)} />
          <div className="journey" aria-label="Workflow progress">
            <JourneyStep number="01" label="Concept" state="Complete" />
            <JourneyStep number="02" label="Review" state={approved ? 'Complete' : 'In progress'} active={!approved} />
            <JourneyStep number="03" label="Approved direction" state={approved ? 'Complete' : 'Pending'} active={approved} />
            <JourneyStep number="04" label="3D handoff" state={handoffReady ? 'Ready to sync' : 'Blocked'} active={view === 'handoff'} />
            <span className={`sync ${handoffReady ? 'ready' : ''}`}>{handoffReady ? 'Human review complete · safe to sync' : 'Needs human review before sync'}</span>
          </div>
        </section>

        <aside className="activity-rail">
          <div className="activity-tabs"><button className="tab-active">Activity</button><button>Files (12)</button></div>
          <p className="eyebrow">Focused reviews</p>
          <div className="comment-list">{comments.map((comment, index) => <article className="comment" key={`${comment.name}-${index}`}><div className="avatar">{comment.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div><div><div className="comment-meta"><b>{comment.name}</b><span>{comment.time}</span></div><strong>{comment.text}</strong><p>{comment.detail}</p></div></article>)}</div>
          <section className="rationale"><p className="eyebrow">Decision owner rationale</p><b>Ava Patel</b><p>Advance only with adjustments that strengthen daylight performance and public comfort.</p><ul><li>Daylight performance: +18% average sDA</li><li>Public terrace area: +12%</li><li>Energy use: within target</li></ul></section>
          <div className="comment-compose"><input value={commentText} onChange={(event) => setCommentText(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addComment()} placeholder="Add a comment…" aria-label="Add a comment" /><button onClick={addComment}>Add</button></div>
        </aside>
      </section>

      {proposalOpen && <ProposalModal proposalText={proposalText} setProposalText={setProposalText} onClose={() => setProposalOpen(false)} onSubmit={submitProposal} />}
      {briefOpen && <BriefPanel onClose={() => setBriefOpen(false)} />}
      {provenanceOpen && <ProvenancePanel onClose={() => setProvenanceOpen(false)} />}
    </main>
  );
}

function ReviewCanvas({ comments, selected, approved, onPropose }) {
  return <div className="review-canvas">
    <img className="hero-image" src="/assets/harborview-concept.png" alt="Waterfront civic building concept with a layered timber roof" />
    <div className="annotation annotation-one"><span>1</span><b>Strengthen north light strategy</b><small>Emma · 9:32 AM</small></div>
    <div className="annotation annotation-two"><span>2</span><b>Confirm guardrail transparency</b><small>Liam · 9:47 AM</small></div>
    <div className="annotation annotation-three"><span>3</span><b>Consider deeper shade at entry plaza</b><small>Priya · 10:02 AM</small></div>
    <section className="provenance-card"><p>AI-assisted model provenance</p><strong>This view was generated from Alt 1’s massing study.</strong><dl><div><dt>Source model</dt><dd>Rhino v7 · Commit 24fa7c1</dd></div><div><dt>Inputs</dt><dd>Site, program, massing, materials</dd></div><div><dt>Generated by</dt><dd>Emma Chen · AI v1.4</dd></div></dl><button onClick={onPropose}>{approved ? 'Create a new proposal' : 'Start proposal review'}</button></section>
    <div className="canvas-label"><span>{selected.name}</span><b>{approved ? 'Decision recorded' : `${comments.length} review notes`}</b></div>
  </div>;
}

function Handoff({ selected }) {
  return <div className="handoff-view"><div><p className="eyebrow">Handoff package</p><h1>{selected.name}</h1><p className="handoff-copy">The selected direction moves into the team's existing 3D workflow with its decision rationale and source context preserved. Fieldline does not become the system of record.</p><div className="handoff-package"><b>Included in this simulated package</b><ul><li>Rhino massing geometry · v7</li><li>Model inputs and provenance</li><li>Decision owner rationale</li><li>Review comments and approvals</li></ul></div></div><img src="/assets/harborview-concept.png" alt="Approved waterfront civic building concept" /><div className="integration-list"><p className="eyebrow">Existing studio tools</p><article><b>Rhino</b><span>Source of record · package ready</span><button>Sync package</button></article><article><b>Speckle</b><span>Coordination link will update</span><button>Sync package</button></article><article><b>Revit</b><span>Export after existing coordination</span><button>Prepare export</button></article></div></div>;
}

function DecisionBar({ proposalState, approvals, onApprove, approved, onHandoff, onPropose }) {
  if (proposalState !== 'pending') return <section className="decision-bar"><div><p className="eyebrow">Decision checkpoint · Design direction</p><b>{approved ? 'Alt 1 is approved and the decision record is locked.' : 'Should we advance Alt 1: Terrace Spine as the approved direction?'}</b><span>{approved ? 'Human review completed. A new change must become a new proposal.' : 'Review evidence, discuss with the team, and record a decision.'}</span></div><div className="decision-actions">{approved ? <button className="primary" onClick={onHandoff}>Open 3D handoff</button> : <><button onClick={onPropose}>Request changes</button><button>Hold decision</button><button className="primary" onClick={onPropose}>Start proposal</button></>}</div></section>;
  return <section className="decision-bar proposal-bar"><div><p className="eyebrow">Live proposal · not yet applied</p><b>Two distinct editors must approve before this becomes the live direction.</b><span>{approvals.length}/2 approvals recorded. The existing direction remains unchanged.</span></div><div className="decision-actions"><button className={approvals.includes('Maya') ? 'done' : ''} onClick={() => onApprove('Maya')}>{approvals.includes('Maya') ? 'Maya approved' : 'Approve as Maya'}</button><button className={approvals.includes('Liam') ? 'done' : ''} onClick={() => onApprove('Liam')}>{approvals.includes('Liam') ? 'Liam approved' : 'Approve as Liam'}</button></div></section>;
}

function JourneyStep({ number, label, state, active }) { return <div className={`journey-step ${active ? 'active' : ''}`}><span>{number}</span><b>{label}</b><small>{state}</small></div>; }

function ProposalModal({ proposalText, setProposalText, onClose, onSubmit }) { return <div className="overlay" role="dialog" aria-modal="true" aria-label="Create review proposal"><section className="modal"><p className="eyebrow">Proposal-first collaboration</p><h2>Create a non-live design proposal</h2><p>This change will be visible to the team for review. It will not replace the current live direction until two distinct editors approve it.</p><label htmlFor="proposal">Proposed change</label><textarea id="proposal" value={proposalText} onChange={(event) => setProposalText(event.target.value)} /><div className="modal-actions"><button onClick={onClose}>Cancel</button><button className="primary" onClick={onSubmit}>Create proposal</button></div></section></div>; }

function BriefPanel({ onClose }) { return <div className="overlay" role="dialog" aria-modal="true" aria-label="Product exercise brief"><section className="side-panel"><button className="close" onClick={onClose}>Close</button><p className="eyebrow">Speculative founding-PM product exercise</p><h2>Decision continuity for AEC teams</h2><dl className="brief-list"><div><dt>Problem</dt><dd>Teams generate many AI options but lose context and accountability when selecting work to become real geometry or BIM-ready output.</dd></div><div><dt>Primary user</dt><dd>Architects and design leads coordinating early-stage design directions.</dd></div><div><dt>Product bet</dt><dd>Improve the review ritual architects already use: connect outputs to inputs, critique, decision rationale, and downstream handoff rather than inserting a parallel workflow.</dd></div><div><dt>Interoperability principle</dt><dd>Rhino, Speckle, and Revit are core workflow partners. BIM and CAD remain the studio's source of record; the platform carries context between them.</dd></div><div><dt>Pilot hypothesis</dt><dd>Reduce time from concept review to approved handoff while retaining traceability of the design decision and preserving the team's existing review cadence.</dd></div><div><dt>Discovery</dt><dd>Weekly interviews with design leads, project architects, and computational designers; observe real review-to-Rhino/Revit handoffs before changing the ritual.</dd></div><div><dt>Non-goals</dt><dd>Autonomous architecture, replacing CAD/BIM, or presenting generative output as deterministic professional judgment.</dd></div></dl></section></div>; }

function ProvenancePanel({ onClose }) { return <div className="overlay" role="dialog" aria-modal="true" aria-label="Model provenance"><section className="modal provenance-modal"><p className="eyebrow">Traceability</p><h2>What informed this view</h2><dl className="brief-list"><div><dt>Source geometry</dt><dd>Rhino v7 massing model · simulated commit 24fa7c1 · the studio's source of record.</dd></div><div><dt>Context inputs</dt><dd>Site boundary, waterfront setback, program areas, material palette.</dd></div><div><dt>Generation</dt><dd>Visual exploration model v1.4 · generated by Emma Chen.</dd></div><div><dt>Reliability note</dt><dd>This simulated view is a design input, not verified geometry or an autonomous recommendation. It supplements—never replaces—the existing BIM/CAD record.</dd></div></dl><div className="modal-actions"><button className="primary" onClick={onClose}>Return to review</button></div></section></div>; }

createRoot(document.getElementById('root')).render(<App />);
