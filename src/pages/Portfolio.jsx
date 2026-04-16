import { useState, useEffect, useRef } from "react";
import "./Portfolio.css";

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

const DEFAULT_NAME = "Banke Bihari";

const DEFAULT_EXPERIENCES = [
  {
    id: 1,
    role: "Full Stack Developer",
    company: "Your Company",
    duration: "Jan 2024 – Present",
    description: "Built and maintained scalable web applications using React, Node.js, and cloud services.",
  },
  {
    id: 2,
    role: "Backend Developer Intern",
    company: "Previous Company",
    duration: "Jun 2023 – Dec 2023",
    description: "Developed REST APIs with Python/FastAPI, integrated Azure services, and improved query performance.",
  },
];

const DEFAULT_PROJECTS = [
  {
    id: 1,
    name: "Portfolio Website",
    description: "Personal portfolio built with React and deployed on Vercel. Features dark theme, editable sections, and resume upload.",
    link: "https://react-blog-three-iota.vercel.app",
    tags: ["React", "CSS", "Vercel"],
  },
  {
    id: 2,
    name: "Blog Platform",
    description: "A two-page React blog with post listing and detail views, built with React Router and Vite.",
    link: "https://github.com/bankebihari/calude-test",
    tags: ["React", "React Router", "Vite"],
  },
];

const EMPTY_EXP = { role: "", company: "", duration: "", description: "" };
const EMPTY_PROJ = { name: "", description: "", link: "", tags: "" };

export default function Portfolio() {
  /* ── Name ── */
  const [name, setName] = useState(() => {
    try { return localStorage.getItem("pf_name_v2") || DEFAULT_NAME; } catch { return DEFAULT_NAME; }
  });
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const nameInputRef = useRef(null);

  const startEditName = () => { setNameInput(name); setEditingName(true); setTimeout(() => nameInputRef.current?.focus(), 50); };
  const saveName = () => { const v = nameInput.trim(); if (v) { setName(v); try { localStorage.setItem("pf_name_v2", v); } catch {} } setEditingName(false); };
  const cancelEditName = () => setEditingName(false);

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
  const deleteSkill = (i) => setSkills(skills.filter((_, idx) => idx !== i));
  const openSkillInput = () => { setShowSkillInput(true); setSkillError(""); setTimeout(() => skillInputRef.current?.focus(), 50); };
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
    if (expForm.mode === "add") {
      setExperiences([...experiences, { ...expForm.data, id: Date.now() }]);
    } else {
      setExperiences(experiences.map((e) => e.id === expForm.id ? { ...expForm.data, id: expForm.id } : e));
    }
    setExpForm(null);
  };
  const deleteExp = (id) => setExperiences(experiences.filter((e) => e.id !== id));

  /* ── Projects ── */
  const [projects, setProjects] = useState(() => {
    try { const p = localStorage.getItem("pf_proj_v1"); return p ? JSON.parse(p) : DEFAULT_PROJECTS; } catch { return DEFAULT_PROJECTS; }
  });
  const [projForm, setProjForm] = useState(null);

  useEffect(() => { localStorage.setItem("pf_proj_v1", JSON.stringify(projects)); }, [projects]);

  const saveProj = () => {
    const { name: n, description } = projForm.data;
    if (!n.trim() || !description.trim()) return;
    const tags = typeof projForm.data.tags === "string"
      ? projForm.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : projForm.data.tags;
    const data = { ...projForm.data, tags };
    if (projForm.mode === "add") {
      setProjects([...projects, { ...data, id: Date.now() }]);
    } else {
      setProjects(projects.map((p) => p.id === projForm.id ? { ...data, id: projForm.id } : p));
    }
    setProjForm(null);
  };
  const deleteProj = (id) => setProjects(projects.filter((p) => p.id !== id));

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
  const deleteResume = () => { setResume(null); localStorage.removeItem("pf_resume_v2"); };

  /* ── Contact form ── */
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const handleContact = (e) => {
    e.preventDefault();
    // Opens default mail client with pre-filled data
    const { name: cn, email, subject, message } = contactForm;
    const body = encodeURIComponent(`Name: ${cn}\nEmail: ${email}\n\n${message}`);
    const sub = encodeURIComponent(subject || `Portfolio contact from ${cn}`);
    window.location.href = `mailto:bankebihari1206@gmail.com?subject=${sub}&body=${body}`;
    setContactSent(true);
    setTimeout(() => setContactSent(false), 4000);
  };

  return (
    <div className="pf">

      {/* ── HERO (two-column) ── */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
          <div className="hero-grid" />
        </div>

        <div className="hero-inner">
          {/* LEFT — intro */}
          <div className="hero-left">
            <div className="hero-badge"><span className="badge-dot" />Available for opportunities</div>
            <h1 className="hero-name">
              Hi, I&apos;m{" "}
              {editingName ? (
                <span className="name-edit-wrap">
                  <input ref={nameInputRef} className="name-input" value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)} onBlur={saveName}
                    onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") cancelEditName(); }} />
                </span>
              ) : (
                <span className="grad-text name-editable" onClick={startEditName} title="Click to edit your name">
                  {name}<span className="name-edit-icon">✎</span>
                </span>
              )}
            </h1>
            <h2 className="hero-role">Full Stack Developer</h2>
            <p className="hero-bio">I craft beautiful, high-performance web experiences with modern technologies. Passionate about clean code, intuitive design, and building things that matter.</p>
            <div className="hero-btns">
              <a href="#projects" className="btn btn-primary">View My Projects</a>
              <a href="#contact" className="btn btn-outline">Contact Me</a>
            </div>
            <div className="hero-socials">
              <a href="https://github.com/bankebihari" target="_blank" rel="noreferrer" className="social-chip">GitHub</a>
              <a href="https://www.linkedin.com/in/bankebihari01/" target="_blank" rel="noreferrer" className="social-chip">LinkedIn</a>
            </div>
          </div>

          {/* RIGHT — resume preview */}
          <div className="hero-right">
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} style={{ display: "none" }} />
            <div className="resume-preview-card glass">
              {resume ? (
                <>
                  {resume.isPdf ? (
                    <iframe
                      src={resume.dataUrl}
                      className="resume-iframe"
                      title="Resume Preview"
                    />
                  ) : (
                    <div className="resume-placeholder">
                      <span className="resume-ph-icon">📋</span>
                      <p className="resume-ph-name">{resume.name}</p>
                      <p className="resume-ph-sub">{resume.size}</p>
                    </div>
                  )}
                  <div className="resume-preview-bar">
                    <span className="resume-ph-name" style={{ fontSize: "0.78rem", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resume.name}</span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn btn-primary btn-sm" onClick={downloadResume}>⬇</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()}>🔄</button>
                      <button className="btn btn-danger btn-sm" onClick={deleteResume}>🗑</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="resume-drop" onClick={() => fileInputRef.current?.click()}>
                  <div className="upload-icon-wrap"><span className="upload-icon">📄</span><div className="upload-ring" /></div>
                  <p className="resume-drop-title">Upload Your Resume</p>
                  <p className="resume-drop-sub">PDF, DOC, DOCX · Click to browse</p>
                  {uploading && <><span className="spinner" style={{ margin: "0 auto" }} /> <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Uploading…</p></>}
                  {uploadError && <p className="form-error">{uploadError}</p>}
                </div>
              )}
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
            <h2 className="sec-title">Who I Am</h2>
            <p className="sec-sub">A little about my journey and values</p>
          </div>
          <div className="about-grid">
            <div className="about-card glass"><div className="about-icon">🎯</div><h3>Mission</h3><p>Building impactful digital products that solve real-world problems with elegant, scalable solutions.</p></div>
            <div className="about-card glass"><div className="about-icon">💡</div><h3>Approach</h3><p>I combine creativity with technical expertise to deliver exceptional, user-centered experiences.</p></div>
            <div className="about-card glass"><div className="about-icon">🚀</div><h3>Goals</h3><p>Continuously learning, growing, and pushing boundaries — one project at a time.</p></div>
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
                    <button className="icon-btn" title="Edit" onClick={() => setExpForm({ mode: "edit", id: exp.id, data: { ...exp } })}>✎</button>
                    <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => deleteExp(exp.id)}>✕</button>
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
            <button className="btn btn-outline add-btn" onClick={() => setExpForm({ mode: "add", data: { ...EMPTY_EXP } })}>+ Add Experience</button>
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
          <div className="projects-grid">
            {projects.map((proj) => (
              <div key={proj.id} className="proj-card glass">
                <div className="proj-top">
                  <h3 className="proj-name">{proj.name}</h3>
                  <div className="exp-actions">
                    <button className="icon-btn" title="Edit" onClick={() => setProjForm({ mode: "edit", id: proj.id, data: { ...proj, tags: proj.tags.join(", ") } })}>✎</button>
                    <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => deleteProj(proj.id)}>✕</button>
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
            <button className="btn btn-outline add-btn" onClick={() => setProjForm({ mode: "add", data: { ...EMPTY_PROJ } })}>+ Add Project</button>
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
                  <button className="skill-del" onClick={() => deleteSkill(i)} title="Remove skill" aria-label={`Remove ${skill}`}>&times;</button>
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

      {/* ── CONTACT ── */}
      <section id="contact" className="section contact-sec">
        <div className="container">
          <div className="sec-header">
            <span className="sec-badge">Contact</span>
            <h2 className="sec-title">Let&apos;s Connect</h2>
            <p className="sec-sub">Reach out — I&apos;d love to hear from you</p>
          </div>

          <div className="contact-layout">
            {/* Left — info cards */}
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

            {/* Right — email form */}
            <form className="contact-form glass" onSubmit={handleContact}>
              <h3 className="form-title">Send a Message</h3>
              <div className="form-row-2">
                <input className="text-input" placeholder="Your Name" required
                  value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                <input className="text-input" type="email" placeholder="Your Email" required
                  value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
              </div>
              <input className="text-input" placeholder="Subject"
                value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} />
              <textarea className="text-input text-area contact-textarea" placeholder="Your message…" required
                value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                {contactSent ? "✓ Opening your mail client…" : "📨 Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Designed &amp; built with <span className="heart">♥</span> using React</p>
      </footer>
    </div>
  );
}
