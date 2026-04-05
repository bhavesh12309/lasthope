import React from 'react';
import { Target, Award, Heart, Zap } from 'lucide-react';

const C = {
  navy:       '#0B0F1A',
  navyMid:    '#141924',
  navyBorder: 'rgba(245,166,35,0.12)',
  amber:      '#F5A623',
  amberLight: '#FFC85A',
  amberDim:   'rgba(245,166,35,0.1)',
  white:      '#F2F0E8',
  whiteDim:   'rgba(242,240,232,0.5)',
  whiteFaint: 'rgba(242,240,232,0.06)',
};

const features = [
  { title: 'Adaptive Learning',       desc: 'Our AI-powered system adapts to your skill level and learning pace.',                               icon: Zap    },
  { title: 'Comprehensive Tracking',  desc: 'Detailed analytics help you understand your progress and areas for improvement.',                   icon: Target },
  { title: 'Gamified Experience',     desc: 'Achievements, levels, and challenges make learning typing genuinely enjoyable.',                    icon: Award  },
];

const About = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Lora:ital,wght@0,400;1,400&display=swap');

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes gridReveal {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      .ab-card {
        border: 1px solid ${C.navyBorder};
        border-radius: 4px;
        background: ${C.whiteFaint};
        transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
      }
      .ab-card:hover {
        border-color: rgba(245,166,35,0.35);
        background: ${C.amberDim};
        transform: translateY(-4px);
      }
      .ab-card:hover .ab-icon { color: ${C.amber}; }

      .ab-icon {
        color: ${C.whiteDim};
        transition: color 0.2s ease;
      }

      .fu { animation: fadeUp 0.85s cubic-bezier(0.22,1,0.36,1) both; }
      .d1 { animation-delay: 0.05s; }
      .d2 { animation-delay: 0.15s; }
      .d3 { animation-delay: 0.25s; }

      .ab-eyebrow {
        font-family: 'DM Mono', monospace;
        font-size: 0.62rem; letter-spacing: 0.22em;
        text-transform: uppercase;
        color: ${C.amber};
        opacity: 0.7;
        margin-bottom: 8px;
        display: flex; align-items: center; gap: 10px;
      }
      .ab-eyebrow::before {
        content: '';
        display: inline-block;
        width: 28px; height: 2px;
        background: ${C.amber};
        opacity: 0.7;
      }

      .ab-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(245,166,35,0.2), transparent);
        margin: 0;
      }

      @media(max-width: 768px) {
        .ab-3col { grid-template-columns: 1fr !important; }
        .ab-mission { grid-template-columns: 1fr !important; }
      }
    `}</style>

    <div style={{ background: C.navy, color: C.white, minHeight: '100vh', fontFamily: "'Lora', serif" }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', padding: '7rem 2.5rem 5rem', overflow: 'hidden' }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridReveal 1.8s ease forwards',
        }} />
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: 500, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(245,166,35,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div className="fu d1 ab-eyebrow" style={{ justifyContent: 'center' }}>
            Our Story
          </div>
          <div className="fu d2">
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              lineHeight: 0.9, letterSpacing: '0.02em',
              color: C.white,
            }}>About</div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              lineHeight: 0.9, letterSpacing: '0.02em',
              color: C.amber,
              marginBottom: '2rem',
            }}>TypeMaster</div>
          </div>
          <p className="fu d3" style={{
            fontFamily: "'Lora', serif", fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: C.whiteDim, lineHeight: 1.85, maxWidth: 560, margin: '0 auto',
          }}>
            On a mission to help people worldwide improve their typing skills through innovative,
            engaging, and genuinely effective learning experiences.
          </p>
        </div>
      </section>

      <div className="ab-divider" />

      {/* ── MISSION ── */}
      <section style={{ padding: '6rem 2.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div className="ab-mission" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div className="ab-eyebrow">Our Purpose</div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: C.white, letterSpacing: '0.04em',
              lineHeight: 1, marginBottom: '1.5rem',
            }}>Our Mission</h2>
            <p style={{
              fontFamily: "'Lora', serif", fontStyle: 'italic',
              fontSize: '1rem', color: C.whiteDim,
              lineHeight: 1.9, marginBottom: '1rem',
            }}>
              In today's digital world, typing is a fundamental skill that affects productivity,
              communication, and career opportunities. We believe everyone deserves access to
              high-quality typing education that's both effective and enjoyable.
            </p>
            <p style={{
              fontFamily: "'Lora', serif",
              fontSize: '0.95rem', color: C.whiteDim,
              lineHeight: 1.85,
            }}>
              TypeMaster combines proven learning methodologies with modern technology to create
              a platform that adapts to each user's needs and keeps them motivated throughout
              their learning journey.
            </p>
          </div>

          {/* Mission visual */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 220, height: 220,
              border: `1px solid ${C.navyBorder}`,
              borderRadius: 4,
              background: C.amberDim,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Corner accents */}
              {[
                { top: 0, left: 0, borderRight: 'none', borderBottom: 'none' },
                { top: 0, right: 0, borderLeft: 'none', borderBottom: 'none' },
                { bottom: 0, left: 0, borderRight: 'none', borderTop: 'none' },
                { bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none' },
              ].map((s, i) => (
                <div key={i} style={{
                  position: 'absolute', width: 24, height: 24,
                  border: `2px solid ${C.amber}`,
                  borderRadius: 2, ...s,
                }} />
              ))}
              <Heart size={64} style={{ color: C.amber, opacity: 0.8 }} strokeWidth={1} />
            </div>
          </div>
        </div>
      </section>

      <div className="ab-divider" />

      {/* ── FEATURES ── */}
      <section style={{ padding: '6rem 2.5rem', background: C.navyMid, borderTop: `1px solid ${C.navyBorder}`, borderBottom: `1px solid ${C.navyBorder}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem' }}>
            <div className="ab-eyebrow">Why Us</div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: C.white, letterSpacing: '0.04em', lineHeight: 1,
            }}>What Makes Us Different</h2>
          </div>

          <div className="ab-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} className="ab-card" style={{ padding: '2rem' }}>
                {/* Number */}
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '3.5rem', letterSpacing: '0.04em',
                  color: 'rgba(245,166,35,0.12)', lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>0{i + 1}</div>
                <f.icon size={22} className="ab-icon" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />
                <h3 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1.4rem', letterSpacing: '0.06em',
                  color: C.white, marginBottom: 8, lineHeight: 1,
                }}>{f.title}</h3>
                <p style={{
                  fontFamily: "'Lora', serif", fontStyle: 'italic',
                  fontSize: '0.87rem', color: C.whiteDim, lineHeight: 1.8,
                }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  </>
);

export default About;
