import { useState, useEffect, useRef } from "react";
import "./Portfolio.css";

/* ── Auth credentials ── */
const AUTH_ID = "hellobro1206";
const AUTH_PASS = "hello@123321";

const SKILL_COLORS = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#fd7043,#ff8a65)",
  "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
  "linear-gradient(135deg,#f7971e,#ffd200)",
  "linear-gradient(135deg,#56ab2f,#a8e063)",
];

const DEFAULT_SKILLS = [
  "React.js", "Node.js", "JavaScript", "Python", "Java",
  "Express.js", "Flask", "FastAPI", "Full-Stack Development", "Back-End Web Development",
  "SQL", "HTML", "HTML5",
  "Microsoft Azure", "Azure DevOps Server", "Azure DevOps Services", "Azure SQL",
  "Amazon Web Services (AWS)", "AWS Lambda", "Cloud Computing",
];

const DEFAULT_EXPERIENCES = [
  { id: 1, role: "Full Stack Developer", company: "Your Company", duration: "Jan 2024 – Present", description: "Built and maintained scalable web applications using React, Node.js, and cloud services." },
  { id: 2, role: "Backend Developer Intern", company: "Previous Company", duration: "Jun 2023 – Dec 2023", description: "Developed REST APIs with Python/FastAPI, integrated Azure services, and improved query performance." },
];

const DEFAULT_PROJECTS = [
  { id: 1, name: "DietWell", description: "Role-based diet management app with AI-powered diet plans.", link: "https://dietwell-pz1z.onrender.com", tags: ["React", "Tailwind CSS", "Flask", "MongoDB", "GitHub Actions"] },
  { id: 2, name: "LearnHub", description: "E-learning platform with authentication, payments, and admin dashboard.", link: "https://rainbow-quokka-10f671.netlify.app", tags: ["React", "Node.js", "Payments", "Admin"] },
  { id: 3, name: "Portfolio Website", description: "Personal portfolio built with React and deployed on Vercel. Features dark theme, editable sections, and resume upload.", link: "https://react-blog-three-iota.vercel.app", tags: ["React", "CSS", "Vercel"] },
  { id: 4, name: "Blog Platform", description: "A two-page React blog with post listing and detail views, built with React Router and Vite.", link: "https://github.com/bankebihari/Portfolio", tags: ["React", "React Router", "Vite"] },
];

const EMPTY_EXP = { role: "", company: "", duration: "", description: "" };
const EMPTY_PROJ = { name: "", description: "", link: "", tags: "" };

/* ── Auth Modal ── */
function AuthModal({ onConfirm, onCancel }) {
  const [uid, setUid] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (uid === AUTH_ID && pwd === AUTH_PASS) { onConfirm(); }
    else { setErr("Invalid ID or password. Try again."); setUid(""); setPwd(""); }
  };

  return (
    <div className="auth-overlay" onClick={onCancel}>
      <div className="auth-modal glass" onClick={(e) => e.stopPropagation()}>
        <h3 className="auth-title">🔒 Admin Access</h3>
        <p className="auth-sub">Enter your credentials to continue</p>
        <form onSubmit={submit} className="auth-form">
          <input className="text-input" placeholder="User ID" autoFocus value={uid} onChange={(e) => setUid(e.target.value)} />
          <input className="text-input" type="password" placeholder="Password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
          {err && <p className="form-error">{err}</p>}
          <div className="form-btns">
            <button type="submit" className="btn btn-primary btn-sm">Confirm</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Portfolio() {
  /* ── Auth gate ── */
  const [authModal, setAuthModal] = useState(null); // null | { onConfirm }
  const requireAuth = (action) => setAuthModal({ onConfirm: () => { setAuthModal(null); action(); } });
  const closeAuth = () => setAuthModal(null);

  /* ── Skills ── */
  const [skills, setSkills] = useState(() => {
    try { const s = localStorage.getItem("pf_skills_v2"); return s ? JSON.parse(s) : DEFAULT_SKILLS; } catch { return DEFAULT_SKILLS; }
  });
  const [newSkill, setNewSkill] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [skillError, setSkillError] = useState("");
  const skillInputRef = useRef(null);

  useEffect(() => { localStorage.setItem("pf_skills_v2", JSON.stringify(skills)); }, [skills]);

  const addSkill = () => {
    const v = newSkill.trim();
    if (!v) { setSkillError("Please enter a skill name."); return; }
    if (skills.some((s) => s.toLowerCase() === v.toLowerCase())) { setSkillError("Skill already exists."); return; }
    setSkills([...skills, v]); setNewSkill(""); setSkillError(""); setShowSkillInput(false);
  };
  const deleteSkill = (i) => requireAuth(() => setSkills(skills.filter((_, idx) => idx !== i)));
  const openSkillInput = () => requireAuth(() => { setShowSkillInput(true); setSkillError(""); setTimeout(() => skillInputRef.current?.focus(), 50); });
  const cancelSkillInput = () => { setShowSkillInput(false); setNewSkill(""); setSkillError(""); };

  /* ── Experience ── */
  const [experiences, setExperiences] = useState(() => {
    try { const e = localStorage.getItem("pf_exp_v1"); return e ? JSON.parse(e) : DEFAULT_EXPERIENCES; } catch { return DEFAULT_EXPERIENCES; }
  });
  const [expForm, setExpForm] = useState(null);

  useEffect(() => { localStorage.setItem("pf_exp_v1", JSON.stringify(experiences)); }, [experiences]);

  const saveExp = () => {
    const { role, company, duration } = expForm.data;
    if (!role.trim() || !company.trim() || !duration.trim()) return;
    if (expForm.mode === "add") { setExperiences([...experiences, { ...expForm.data, id: Date.now() }]); }
    else { setExperiences(experiences.map((e) => e.id === expForm.id ? { ...expForm.data, id: expForm.id } : e)); }
    setExpForm(null);
  };
  const deleteExp = (id) => requireAuth(() => setExperiences(experiences.filter((e) => e.id !== id)));
  const editExp = (exp) => requireAuth(() => setExpForm({ mode: "edit", id: exp.id, data: { ...exp } }));
  const addExp = () => requireAuth(() => setExpForm({ mode: "add", data: { ...EMPTY_EXP } }));

  /* ── Projects ── */
  const [projects, setProjects] = useState(() => {
    try { const p = localStorage.getItem("pf_proj_v2"); return p ? JSON.parse(p) : DEFAULT_PROJECTS; } catch { return DEFAULT_PROJECTS; }
  });
  const [projForm, setProjForm] = useState(null);
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  useEffect(() => { localStorage.setItem("pf_proj_v2", JSON.stringify(projects)); }, [projects]);

  const saveProj = () => {
    const { name: n, description } = projForm.data;
    if (!n.trim() || !description.trim()) return;
    const tags = typeof projForm.data.tags === "string"
      ? projForm.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : projForm.data.tags;
    const data = { ...projForm.data, tags };
    if (projForm.mode === "add") { setProjects([...projects, { ...data, id: Date.now() }]); }
    else { setProjects(projects.map((p) => p.id === projForm.id ? { ...data, id: projForm.id } : p)); }
    setProjForm(null);
  };
  const deleteProj = (id) => requireAuth(() => setProjects(projects.filter((p) => p.id !== id)));
  const editProj = (proj) => requireAuth(() => setProjForm({ mode: "edit", id: proj.id, data: { ...proj, tags: proj.tags.join(", ") } }));
  const addProj = () => requireAuth(() => setProjForm({ mode: "add", data: { ...EMPTY_PROJ } }));

  const onDragStart = (i) => { dragItem.current = i; };
  const onDragEnter = (i) => { dragOver.current = i; };
  const onDragEnd = () => {
    const from = dragItem.current; const to = dragOver.current;
    if (from === null || to === null || from === to) { dragItem.current = null; dragOver.current = null; return; }
    const reordered = [...projects];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setProjects(reordered);
    dragItem.current = null; dragOver.current = null;
  };

  /* ── Resume ── */
  const [resume, setResume] = useState(() => {
    try { const r = localStorage.getItem("pf_resume_v2"); return r ? JSON.parse(r) : null; } catch { return null; }
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setUploadError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = {
        name: file.name,
        size: file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) + " MB" : (file.size / 1024).toFixed(1) + " KB",
        uploadedAt: new Date().toLocaleDateString(),
        dataUrl: ev.target.result,
        isPdf: file.type === "application/pdf",
      };
      try { localStorage.setItem("pf_resume_v2", JSON.stringify(data)); setResume(data); }
      catch { setUploadError("File too large to store. Try a smaller file."); }
      setUploading(false);
    };
    reader.onerror = () => { setUploadError("Failed to read file."); setUploading(false); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const downloadResume = () => { const a = document.createElement("a"); a.href = resume.dataUrl; a.download = resume.name; a.click(); };
  const deleteResume = () => requireAuth(() => { setResume(null); localStorage.removeItem("pf_resume_v2"); });

  /* ── Phone (editable) ── */
  const [phone, setPhone] = useState(() => localStorage.getItem("pf_phone") || "+91 00000 00000");
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const phoneRef = useRef(null);

  const savePhone = () => {
    const v = phoneInput.trim();
    if (v) { setPhone(v); localStorage.setItem("pf_phone", v); }
    setEditingPhone(false);
  };

  const startEditPhone = () => requireAuth(() => {
    setPhoneInput(phone); setEditingPhone(true);
    setTimeout(() => phoneRef.current?.focus(), 50);
  });

  /* ── Contact form ── */
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const handleContact = (e) => {
    e.preventDefault();
    const { name: cn, email, subject, message } = contactForm;
    const body = encodeURIComponent(`Name: ${cn}\nEmail: ${email}\n\n${message}`);
    const sub = encodeURIComponent(subject || `Portfolio contact from ${cn}`);
    window.location.href = `mailto:bankebihari1206@gmail.com?subject=${sub}&body=${body}`;
    setContactSent(true);
    setTimeout(() => setContactSent(false), 4000);
  };

  return (
    <div className="pf">
      {authModal && <AuthModal onConfirm={authModal.onConfirm} onCancel={closeAuth} />}

      {/* ── HERO ── */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="hero-inner">
          {/* LEFT */}
          <div className="hero-left">
            <div className="hero-badge"><span className="badge-dot" />Available for opportunities</div>
            <h1 className="hero-name">Hi, I&apos;m <span className="grad-text">Banke Bihari</span></h1>
            <h2 className="hero-role">Full Stack Developer</h2>
            <p className="hero-bio">I craft beautiful, high-performance web experiences with modern technologies. Passionate about clean code, intuitive design, and building things that matter.</p>
            <div className="hero-btns">
              <a href="#projects" className="btn btn-primary">View My Projects</a>
              <a href="#contact" className="btn btn-outline">Contact Me</a>
              {resume && (
                <button className="btn btn-ghost" onClick={downloadResume}>⬇ Resume</button>
              )}
            </div>
            <div className="hero-socials">
              <a href="https://github.com/bankebihari" target="_blank" rel="noreferrer" className="social-chip">GitHub</a>
              <a href="https://www.linkedin.com/in/bankebihari01/" target="_blank" rel="noreferrer" className="social-chip">LinkedIn</a>
            </div>
          </div>
          {/* RIGHT — coding GIF */}
          <div className="hero-right">
            <div className="hero-gif-wrap">
              <img
                src="https://cdn.dribbble.com/users/926537/screenshots/4502924/python-2.gif"
                alt="Coding animation"
                className="hero-gif"
              />
              <div className="hero-gif-glow" />
            </div>
          </div>
        </div>
        <div className="scroll-hint"><div className="scroll-line" /></div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section about-sec">
        <div className="container">
          <div className="sec-header">
            <span className="sec-badge">About Me</span>
            <h2 className="sec-title">💫 About Me</h2>
            <p className="sec-sub">A passionate Web developer</p>
          </div>
          <div className="about-readme glass">
            <ul className="readme-list">
              <li><span className="readme-icon">🔭</span> I&apos;m skilled in <strong>React.js</strong> and <strong>Flask</strong> web projects</li>
              <li><span className="readme-icon">🌱</span> I&apos;m skilled in <strong>MERN Stack</strong>, <strong>WordPress</strong></li>
              <li><span className="readme-icon">👯</span> I&apos;m looking to collaborate on <strong>Everything</strong></li>
              <li><span className="readme-icon">💬</span> Ask me about <strong>AWS, Python, Java, C++, HTML, CSS, Flask, React.js, Node.js, Express.js</strong></li>
              <li><span className="readme-icon">📫</span> How to reach me: <a href="mailto:bankebihari1206@gmail.com" className="readme-email">bankebihari1206@gmail.com</a></li>
              <li><span className="readme-icon">⚡</span> Fun fact: I think I am Funny 😄</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="section exp-sec">
        <div className="container">
          <div className="sec-header">
            <span className="sec-badge">Experience</span>
            <h2 className="sec-title">Where I&apos;ve Worked</h2>
            <p className="sec-sub">My professional journey</p>
          </div>
          <div className="exp-list">
            {experiences.map((exp) => (
              <div key={exp.id} className="exp-card glass">
                <div className="exp-top">
                  <div>
                    <h3 className="exp-role">{exp.role}</h3>
                    <div className="exp-company">{exp.company} <span className="exp-duration">· {exp.duration}</span></div>
                  </div>
                  <div className="exp-actions">
                    <button className="icon-btn" title="Edit (requires login)" onClick={() => editExp(exp)}>✎</button>
                    <button className="icon-btn icon-btn--danger" title="Delete (requires login)" onClick={() => deleteExp(exp.id)}>✕</button>
                  </div>
                </div>
                {exp.description && <p className="exp-desc">{exp.description}</p>}
              </div>
            ))}
          </div>
          {expForm ? (
            <div className="form-card glass">
              <h3 className="form-title">{expForm.mode === "add" ? "Add Experience" : "Edit Experience"}</h3>
              <div className="form-grid">
                <input className="text-input" placeholder="Job Title *" value={expForm.data.role} onChange={(e) => setExpForm({ ...expForm, data: { ...expForm.data, role: e.target.value } })} />
                <input className="text-input" placeholder="Company *" value={expForm.data.company} onChange={(e) => setExpForm({ ...expForm, data: { ...expForm.data, company: e.target.value } })} />
                <input className="text-input" placeholder="Duration e.g. Jan 2024 – Present *" value={expForm.data.duration} onChange={(e) => setExpForm({ ...expForm, data: { ...expForm.data, duration: e.target.value } })} />
                <textarea className="text-input text-area" placeholder="Description (optional)" value={expForm.data.description} onChange={(e) => setExpForm({ ...expForm, data: { ...expForm.data, description: e.target.value } })} />
              </div>
              <div className="form-btns">
                <button className="btn btn-primary btn-sm" onClick={saveExp}>Save</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setExpForm(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-outline add-btn" onClick={addExp}>+ Add Experience</button>
          )}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="section projects-sec">
        <div className="container">
          <div className="sec-header">
            <span className="sec-badge">Projects</span>
            <h2 className="sec-title">What I&apos;ve Built</h2>
            <p className="sec-sub">A selection of my recent work</p>
          </div>
          <p className="drag-hint">⠿ Drag cards to reorder</p>
          <div className="projects-grid">
            {projects.map((proj, i) => (
              <div key={proj.id} className="proj-card glass" draggable
                onDragStart={() => onDragStart(i)} onDragEnter={() => onDragEnter(i)}
                onDragEnd={onDragEnd} onDragOver={(e) => e.preventDefault()}>
                <div className="proj-top">
                  <div className="proj-drag-handle" title="Drag to reorder">⠿</div>
                  <h3 className="proj-name">{proj.name}</h3>
                  <div className="exp-actions">
                    <button className="icon-btn" title="Edit (requires login)" onClick={() => editProj(proj)}>✎</button>
                    <button className="icon-btn icon-btn--danger" title="Delete (requires login)" onClick={() => deleteProj(proj.id)}>✕</button>
                  </div>
                </div>
                <p className="proj-desc">{proj.description}</p>
                <div className="proj-footer">
                  <div className="proj-tags">{proj.tags.map((t) => <span key={t} className="proj-tag">{t}</span>)}</div>
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="proj-link">View →</a>}
                </div>
              </div>
            ))}
          </div>
          {projForm ? (
            <div className="form-card glass">
              <h3 className="form-title">{projForm.mode === "add" ? "Add Project" : "Edit Project"}</h3>
              <div className="form-grid">
                <input className="text-input" placeholder="Project Name *" value={projForm.data.name} onChange={(e) => setProjForm({ ...projForm, data: { ...projForm.data, name: e.target.value } })} />
                <input className="text-input" placeholder="Project Link (URL)" value={projForm.data.link} onChange={(e) => setProjForm({ ...projForm, data: { ...projForm.data, link: e.target.value } })} />
                <textarea className="text-input text-area" placeholder="Description *" value={projForm.data.description} onChange={(e) => setProjForm({ ...projForm, data: { ...projForm.data, description: e.target.value } })} />
                <input className="text-input" placeholder="Tags (comma separated)" value={projForm.data.tags} onChange={(e) => setProjForm({ ...projForm, data: { ...projForm.data, tags: e.target.value } })} />
              </div>
              <div className="form-btns">
                <button className="btn btn-primary btn-sm" onClick={saveProj}>Save</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setProjForm(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-outline add-btn" onClick={addProj}>+ Add Project</button>
          )}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section skills-sec">
        <div className="container">
          <div className="sec-header">
            <span className="sec-badge">Skills</span>
            <h2 className="sec-title">What I Know</h2>
            <p className="sec-sub">Technologies &amp; tools I work with</p>
          </div>
          <div className="skills-box glass">
            {skills.length === 0 && <p className="skills-empty">No skills yet — add your first one below!</p>}
            <div className="skills-grid">
              {skills.map((skill, i) => (
                <div key={skill + i} className="skill-tag" style={{ background: SKILL_COLORS[i % SKILL_COLORS.length] }}>
                  <span>{skill}</span>
                  <button className="skill-del" onClick={() => deleteSkill(i)} title="Remove (requires login)" aria-label={`Remove ${skill}`}>&times;</button>
                </div>
              ))}
            </div>
            {showSkillInput && (
              <div className="skill-input-row">
                <input ref={skillInputRef} className="text-input" placeholder="e.g. TypeScript, Python, Figma…"
                  value={newSkill} onChange={(e) => { setNewSkill(e.target.value); setSkillError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") addSkill(); if (e.key === "Escape") cancelSkillInput(); }} />
                <button className="btn btn-primary btn-sm" onClick={addSkill}>Add</button>
                <button className="btn btn-ghost btn-sm" onClick={cancelSkillInput}>Cancel</button>
              </div>
            )}
            {skillError && <p className="form-error">{skillError}</p>}
            <div className="skills-footer">
              {!showSkillInput && <button className="btn btn-primary" onClick={openSkillInput}>+ Add Skill</button>}
              <span className="skills-count">{skills.length} skill{skills.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESUME ── */}
      <section id="resume" className="section resume-sec">
        <div className="container">
          <div className="sec-header">
            <span className="sec-badge">Resume</span>
            <h2 className="sec-title">My Resume</h2>
            <p className="sec-sub">Upload &amp; download your resume</p>
          </div>
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} style={{ display: "none" }} />
          <div className="resume-compact glass">
            {resume ? (
              <div className="resume-uploaded-row">
                <span className="resume-ph-icon" style={{ fontSize: "2.2rem" }}>📋</span>
                <div>
                  <p className="resume-ph-name">{resume.name}</p>
                  <p className="resume-ph-sub">{resume.size} · Uploaded {resume.uploadedAt}</p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}>
                  <button className="btn btn-primary" onClick={downloadResume}>⬇ Download</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()}>🔄 Replace</button>
                  <button className="btn btn-danger btn-sm" onClick={deleteResume}>🗑</button>
                </div>
              </div>
            ) : (
              <div className="resume-upload-row">
                <div className="upload-icon-wrap" style={{ width: 60, height: 60 }}><span style={{ fontSize: "2.2rem" }}>📄</span><div className="upload-ring" /></div>
                <div>
                  <p className="resume-ph-name">No resume uploaded yet</p>
                  <p className="resume-ph-sub">PDF, DOC, DOCX supported</p>
                  {uploadError && <p className="form-error">{uploadError}</p>}
                </div>
                <button className="btn btn-primary" style={{ marginLeft: "auto" }}
                  onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? <><span className="spinner" /> Uploading…</> : "📤 Upload Resume"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section contact-sec">
        <div className="container">
          <div className="sec-header">
            <span className="sec-badge">Contact</span>
            <h2 className="sec-title">Let&apos;s Connect</h2>
            <p className="sec-sub">Reach out — I&apos;d love to hear from you</p>
          </div>
          <div className="contact-layout">
            {/* Left — info */}
            <div className="contact-info">
              <a href="mailto:bankebihari1206@gmail.com" className="contact-card glass">
                <span className="contact-icon">📧</span>
                <div><strong>Email</strong><p>bankebihari1206@gmail.com</p></div>
              </a>
              <a href="https://www.linkedin.com/in/bankebihari01/" target="_blank" rel="noreferrer" className="contact-card glass">
                <span className="contact-icon">💼</span>
                <div><strong>LinkedIn</strong><p>linkedin.com/in/bankebihari01</p></div>
              </a>
              <a href="https://github.com/bankebihari" target="_blank" rel="noreferrer" className="contact-card glass">
                <span className="contact-icon">🐙</span>
                <div><strong>GitHub</strong><p>github.com/bankebihari</p></div>
              </a>
            </div>
            {/* Right — form */}
            <form className="contact-form glass" onSubmit={handleContact}>
              <div className="contact-form-header">
                <h3 className="form-title" style={{ margin: 0 }}>Send a Message</h3>
                <div className="call-us-block">
                  <span className="call-us-label">📞 Call us</span>
                  {editingPhone ? (
                    <input
                      ref={phoneRef}
                      className="phone-input"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      onBlur={savePhone}
                      onKeyDown={(e) => { if (e.key === "Enter") savePhone(); if (e.key === "Escape") setEditingPhone(false); }}
                    />
                  ) : (
                    <span className="call-us-number" onClick={startEditPhone} title="Click to edit (requires login)">
                      {phone} <span className="phone-edit-icon">✎</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="form-row-2">
                <input className="text-input" placeholder="Your Name" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                <input className="text-input" type="email" placeholder="Your Email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
              </div>
              <input className="text-input" placeholder="Subject" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} />
              <textarea className="text-input text-area contact-textarea" placeholder="Your message…" required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                {contactSent ? "✓ Opening your mail client…" : "📨 Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <p>Designed &amp; built with <span className="heart">♥</span> by <strong>Banke Bihari</strong></p>
          <a href="https://github.com/bankebihari/Portfolio" target="_blank" rel="noreferrer" className="footer-gh">
            <span>⭐</span> View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
