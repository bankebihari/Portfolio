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

const DEFAULT_SKILLS = ["React", "JavaScript", "CSS", "HTML", "Node.js"];
const DEFAULT_NAME = "Your Name";

export default function Portfolio() {
  /* ── Name state ── */
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem("pf_name") || DEFAULT_NAME;
    } catch {
      return DEFAULT_NAME;
    }
  });
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const nameInputRef = useRef(null);

  const startEditName = () => {
    setNameInput(name);
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const saveName = () => {
    const val = nameInput.trim();
    if (val) {
      setName(val);
      try { localStorage.setItem("pf_name", val); } catch {}
    }
    setEditingName(false);
  };

  const cancelEditName = () => setEditingName(false);

  /* ── Skills state ── */
  const [skills, setSkills] = useState(() => {
    try {
      const s = localStorage.getItem("pf_skills");
      return s ? JSON.parse(s) : DEFAULT_SKILLS;
    } catch {
      return DEFAULT_SKILLS;
    }
  });
  const [newSkill, setNewSkill] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [skillError, setSkillError] = useState("");
  const skillInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("pf_skills", JSON.stringify(skills));
  }, [skills]);

  const addSkill = () => {
    const val = newSkill.trim();
    if (!val) { setSkillError("Please enter a skill name."); return; }
    if (skills.some((s) => s.toLowerCase() === val.toLowerCase())) {
      setSkillError("Skill already exists."); return;
    }
    setSkills([...skills, val]);
    setNewSkill("");
    setSkillError("");
    setShowInput(false);
  };

  const deleteSkill = (idx) => setSkills(skills.filter((_, i) => i !== idx));

  const openInput = () => {
    setShowInput(true);
    setSkillError("");
    setTimeout(() => skillInputRef.current?.focus(), 50);
  };

  const cancelInput = () => {
    setShowInput(false);
    setNewSkill("");
    setSkillError("");
  };

  /* ── Resume state ── */
  const [resume, setResume] = useState(() => {
    try {
      const r = localStorage.getItem("pf_resume");
      return r ? JSON.parse(r) : null;
    } catch {
      return null;
    }
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = {
        name: file.name,
        size:
          file.size > 1024 * 1024
            ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
            : (file.size / 1024).toFixed(1) + " KB",
        uploadedAt: new Date().toLocaleDateString(),
        dataUrl: ev.target.result,
      };
      try {
        localStorage.setItem("pf_resume", JSON.stringify(data));
        setResume(data);
      } catch {
        setUploadError("File too large to store. Try a smaller file.");
      }
      setUploading(false);
    };
    reader.onerror = () => {
      setUploadError("Failed to read file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const downloadResume = () => {
    const a = document.createElement("a");
    a.href = resume.dataUrl;
    a.download = resume.name;
    a.click();
  };

  const viewResume = () => {
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(
        `<html><body style="margin:0"><iframe src="${resume.dataUrl}" width="100%" height="100%" frameborder="0"></iframe></body></html>`
      );
    }
  };

  const deleteResume = () => {
    setResume(null);
    localStorage.removeItem("pf_resume");
  };

  return (
    <div className="pf">
      {/* ── HERO ── */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Available for opportunities
          </div>
          <h1 className="hero-name">
            Hi, I&apos;m{" "}
            {editingName ? (
              <span className="name-edit-wrap">
                <input
                  ref={nameInputRef}
                  className="name-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={saveName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                    if (e.key === "Escape") cancelEditName();
                  }}
                />
              </span>
            ) : (
              <span
                className="grad-text name-editable"
                onClick={startEditName}
                title="Click to edit your name"
              >
                {name}
                <span className="name-edit-icon">✎</span>
              </span>
            )}
          </h1>
          <h2 className="hero-role">Full Stack Developer</h2>
          <p className="hero-bio">
            I craft beautiful, high-performance web experiences with modern
            technologies. Passionate about clean code, intuitive design, and
            building things that matter.
          </p>
          <div className="hero-btns">
            <a href="#skills" className="btn btn-primary">
              View My Skills
            </a>
            <a href="#resume" className="btn btn-outline">
              My Resume
            </a>
          </div>
          <div className="hero-socials">
            <a href="#contact" className="social-chip">GitHub</a>
            <a href="#contact" className="social-chip">LinkedIn</a>
            <a href="#contact" className="social-chip">Twitter</a>
          </div>
        </div>
        <div className="scroll-hint">
          <div className="scroll-line" />
        </div>
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
            <div className="about-card glass">
              <div className="about-icon">🎯</div>
              <h3>Mission</h3>
              <p>
                Building impactful digital products that solve real-world
                problems with elegant, scalable solutions.
              </p>
            </div>
            <div className="about-card glass">
              <div className="about-icon">💡</div>
              <h3>Approach</h3>
              <p>
                I combine creativity with technical expertise to deliver
                exceptional, user-centered experiences.
              </p>
            </div>
            <div className="about-card glass">
              <div className="about-icon">🚀</div>
              <h3>Goals</h3>
              <p>
                Continuously learning, growing, and pushing boundaries — one
                project at a time.
              </p>
            </div>
          </div>
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
            {skills.length === 0 && (
              <p className="skills-empty">
                No skills yet — add your first one below!
              </p>
            )}
            <div className="skills-grid">
              {skills.map((skill, i) => (
                <div
                  key={skill + i}
                  className="skill-tag"
                  style={{ background: SKILL_COLORS[i % SKILL_COLORS.length] }}
                >
                  <span>{skill}</span>
                  <button
                    className="skill-del"
                    onClick={() => deleteSkill(i)}
                    title="Remove skill"
                    aria-label={`Remove ${skill}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {showInput && (
              <div className="skill-input-row">
                <input
                  ref={skillInputRef}
                  className="text-input"
                  placeholder="e.g. TypeScript, Python, Figma…"
                  value={newSkill}
                  onChange={(e) => {
                    setNewSkill(e.target.value);
                    setSkillError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addSkill();
                    if (e.key === "Escape") cancelInput();
                  }}
                />
                <button className="btn btn-primary btn-sm" onClick={addSkill}>
                  Add
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={cancelInput}
                >
                  Cancel
                </button>
              </div>
            )}

            {skillError && <p className="form-error">{skillError}</p>}

            <div className="skills-footer">
              {!showInput && (
                <button className="btn btn-primary" onClick={openInput}>
                  + Add Skill
                </button>
              )}
              <span className="skills-count">
                {skills.length} skill{skills.length !== 1 ? "s" : ""}
              </span>
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
            <p className="sec-sub">Upload, view &amp; download your resume</p>
          </div>

          {/* Hidden file input always present */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            style={{ display: "none" }}
          />

          <div className="resume-box glass">
            {!resume ? (
              /* Upload state */
              <div className="resume-upload">
                <div className="upload-icon-wrap">
                  <span className="upload-icon">📄</span>
                  <div className="upload-ring" />
                </div>
                <h3>Upload Your Resume</h3>
                <p>Supports PDF, DOC, DOCX files</p>
                {uploadError && <p className="form-error">{uploadError}</p>}
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <><span className="spinner" /> Uploading…</>
                  ) : (
                    "📤 Upload Resume"
                  )}
                </button>
              </div>
            ) : (
              /* Uploaded state */
              <div className="resume-uploaded">
                <div className="resume-info">
                  <div className="resume-file-icon">📋</div>
                  <div>
                    <h3 className="resume-filename">{resume.name}</h3>
                    <p className="resume-meta">
                      {resume.size} &nbsp;·&nbsp; Uploaded {resume.uploadedAt}
                    </p>
                  </div>
                </div>
                {uploadError && <p className="form-error">{uploadError}</p>}
                <div className="resume-actions">
                  <button className="btn btn-primary" onClick={viewResume}>
                    👁 View
                  </button>
                  <button className="btn btn-outline" onClick={downloadResume}>
                    ⬇ Download
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    🔄 Replace
                  </button>
                  <button className="btn btn-danger" onClick={deleteResume}>
                    🗑 Delete
                  </button>
                </div>
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
          <div className="contact-grid">
            <a href="mailto:yourmail@example.com" className="contact-card glass">
              <span className="contact-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>yourmail@example.com</p>
              </div>
            </a>
            <a href="#" className="contact-card glass">
              <span className="contact-icon">💼</span>
              <div>
                <strong>LinkedIn</strong>
                <p>Connect with me</p>
              </div>
            </a>
            <a href="#" className="contact-card glass">
              <span className="contact-icon">🐙</span>
              <div>
                <strong>GitHub</strong>
                <p>Check my projects</p>
              </div>
            </a>
            <a href="#" className="contact-card glass">
              <span className="contact-icon">🐦</span>
              <div>
                <strong>Twitter</strong>
                <p>Follow my thoughts</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>
          Designed &amp; built with <span className="heart">♥</span> using React
        </p>
      </footer>
    </div>
  );
}
