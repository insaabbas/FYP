import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import kidsLaughImg from '../assets/emojis/kids laugh.png'; 

const TextHumor = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [activeMode, setActiveMode] = useState("words"); 
  
  const [headline, setHeadline] = useState("");
  const [headlineJoke, setHeadlineJoke] = useState("");
  const [isGeneratingHeadline, setIsGeneratingHeadline] = useState(false);

  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [wordJoke, setWordJoke] = useState("");
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);

  const [activeFilter, setActiveFilter] = useState("All");
  const [likedCards, setLikedCards] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [ratings, setRatings] = useState({});
  const [hoveredRating, setHoveredRating] = useState({});
  const [savedCards, setSavedCards] = useState({});
  const [shareToast, setShareToast] = useState("");

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["lab", "trending"];
      const currentSection = sections.find(id => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 400;
        }
        return false;
      });
      setActiveSection(currentSection || "");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const humorStories = [
    { 
      title: "The Senior Dev's Prayer", 
      content: "Our Father, who art in Silicon Valley, hallowed be thy Code. Thy Kingdom come, thy Bug be fixed, on Localhost as it is in Production.", 
      tag: "Coding",
      emoji: "🙏",
      punchline: "And lead us not into recursion, but deliver us from NullPointerException.",
      likes: 142
    },
    { 
      title: "Internet Logic", 
      content: "I have a 'stable' internet connection. It's so stable that it hasn't moved or downloaded anything in 20 minutes.", 
      tag: "Tech",
      emoji: "📶",
      punchline: "The WiFi password is 'definitely_working' — emphasis on the 'definitely'.",
      likes: 98
    },
    { 
      title: "The CSS Marriage", 
      content: "Why did the HTML break up with CSS? Because they just weren't in the same 'class' anymore.", 
      tag: "Coding",
      emoji: "💔",
      punchline: "Now HTML is seeing JavaScript and things are getting... dynamic.",
      likes: 207
    },
    { 
      title: "The Gym Membership", 
      content: "I asked my trainer if he could teach me how to do the splits. He asked, 'How flexible are you?' I said, 'I can't make Tuesdays.'", 
      tag: "Life",
      emoji: "🏋️",
      punchline: "He said I was the most technically correct person he'd ever trained.",
      likes: 315
    },
    {
      title: "The Debug Session",
      content: "A programmer's spouse says: 'Go to the store and get a gallon of milk, and if they have eggs, get a dozen.' The programmer returns with 12 gallons of milk.",
      tag: "Coding",
      emoji: "🥛",
      punchline: "They had eggs.",
      likes: 521
    },
    {
      title: "AI Therapy",
      content: "Me: I feel like nobody understands me. ChatGPT: I understand you completely. Me: See, even you're just saying what I want to hear.",
      tag: "Tech",
      emoji: "🤖",
      punchline: "ChatGPT: Based on your previous 847 messages, you knew I'd say that too.",
      likes: 389
    },
    {
      title: "Coffee & Deadlines",
      content: "My productivity follows a strict schedule: 9am — coffee. 10am — more coffee. 11am — realize coffee can't fix the deadline I've been ignoring.",
      tag: "Life",
      emoji: "☕",
      punchline: "12pm — order coffee and pretend it's a fresh start.",
      likes: 276
    },
    {
      title: "The Meeting That Could've Been",
      content: "We've scheduled a 2-hour meeting to discuss why our last 2-hour meeting was unproductive. Please review the 47-slide deck beforehand.",
      tag: "Life",
      emoji: "📊",
      punchline: "Slide 1: 'Why are we here?' — Nobody has ever answered this successfully.",
      likes: 433
    }
  ];

  const tags = ["All", ...new Set(humorStories.map(s => s.tag))];

  const filteredStories = activeFilter === "All" 
    ? humorStories 
    : humorStories.filter(s => s.tag === activeFilter);

  const generateHeadlineJoke = async (e) => {
    e.preventDefault();
    setIsGeneratingHeadline(true);
    setHeadlineJoke("");
    try {
      const response = await fetch('http://localhost:5000/api/generate-joke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Write a funny punchline for this headline: "${headline}"` }),
      });
      const data = await response.json();
      setHeadlineJoke(data.joke || "The AI is speechless!");
    } catch (error) {
      setHeadlineJoke("Connection error.");
    } finally { setIsGeneratingHeadline(false); }
  };

  const generateWordJoke = async (e) => {
    e.preventDefault();
    setIsGeneratingWord(true);
    setWordJoke("");
    try {
      const response = await fetch('http://localhost:5000/api/generate-joke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Create a joke using the words "${word1}" and "${word2}".` }),
      });
      const data = await response.json();
      setWordJoke(data.joke || "The alchemy failed!");
    } catch (error) {
      setWordJoke("Connection error.");
    } finally { setIsGeneratingWord(false); }
  };

  const toggleLike = (index) => {
    setLikedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleFlip = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSave = (index) => {
    setSavedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const setRating = (index, star) => {
    setRatings(prev => ({ ...prev, [index]: star }));
  };

  const handleShare = (story) => {
    navigator.clipboard?.writeText(`"${story.content}" — ${story.title} | Lollify`);
    setShareToast(`"${story.title}" copied!`);
    setTimeout(() => setShareToast(""), 2500);
  };

  const tagColors = {
    Coding: { bg: '#ede9fe', color: '#6d28d9' },
    Tech: { bg: '#dbeafe', color: '#1d4ed8' },
    Life: { bg: '#fce7f3', color: '#be185d' },
  };

  return (
    <div className="lollify-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;700;900&display=swap');
        
        :root {
          --deep-purple: #2d002d;
          --bright-yellow: #ffdd00;
          --pink-glow: #db2777;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #fff; overflow-x: hidden; }
        html { scroll-behavior: smooth; }

        @keyframes movingGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
          0% { transform: scale(0.85); opacity: 0; }
          60% { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes likeWiggle {
          0%,100% { transform: scale(1); }
          30% { transform: scale(1.4) rotate(-10deg); }
          60% { transform: scale(1.2) rotate(8deg); }
        }

        @keyframes toastIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .animated-bg {
          background: linear-gradient(-45deg, #2d012d, #3d003d, #184b63, #2d002d);
          background-size: 400% 400%;
          animation: movingGradient 12s infinite;
        }

        .navbar { display: flex; align-items: center; padding: 0 5%; height: 90px; position: fixed; width: 100%; top: 0; z-index: 1000; transition: 0.4s; background: white; justify-content: space-between; }
        .navbar.scrolled { background: #fdfdff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); height: 80px; }
        
        .nav-logo { font-family: 'Lobster', cursive; font-size: 2.7rem; color: var(--deep-purple); text-decoration: none; min-width: 180px; }
        
        .nav-sections { flex: 1; display: flex; justify-content: center; gap: 30px; }
        .nav-pages { display: flex; gap: 25px; align-items: center; min-width: 400px; justify-content: flex-end; }

        .navbar a { text-decoration: none; color: var(--deep-purple); font-weight: 700; transition: 0.3s; cursor: pointer; position: relative; padding: 5px 0; }
        .navbar a:hover { color: var(--pink-glow); }

        .navbar a.active-link { color: var(--pink-glow) !important; }
        .navbar a.active-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 3px; background: var(--pink-glow); border-radius: 10px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes imgFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }

        .page-header {
          padding: 160px 8% 100px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
          color: white;
          overflow: hidden;
          position: relative;
          min-height: 88vh;
        }

        .hero-text-side { animation: fadeUp 0.8s ease both; }

        .hero-eyebrow {
          display: inline-block;
          background: rgba(255,221,0,0.15);
          border: 1px solid rgba(255,221,0,0.4);
          color: var(--bright-yellow);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 30px;
          margin-bottom: 22px;
        }

        .hero-h1 {
          font-size: clamp(3rem, 5.5vw, 5rem);
          font-weight: 900;
          line-height: 1.08;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .highlight { color: var(--bright-yellow); }

        .hero-desc {
          font-size: 1.05rem;
          opacity: 0.72;
          line-height: 1.8;
          max-width: 400px;
          margin-bottom: 36px;
        }

        .hero-btn {
          display: inline-block;
          background: var(--bright-yellow);
          color: var(--deep-purple);
          padding: 14px 34px;
          border-radius: 50px;
          font-weight: 900;
          font-size: 0.95rem;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 24px rgba(255,221,0,0.3);
        }
        .hero-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(255,221,0,0.45); }

        .hero-image-side {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeUp 0.8s ease 0.2s both;
        }

        .hero-img-wrap {
          position: relative;
          width: 340px;
          height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-img-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px dashed rgba(255,221,0,0.3);
          animation: imgFloat 5s ease-in-out infinite;
        }

        .hero-img-ring-2 {
          position: absolute;
          inset: 20px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          animation: imgFloat 5s ease-in-out infinite reverse;
        }

        .hero-img-element {
          width: 220px;
          height: auto;
          position: relative;
          z-index: 2;
          animation: imgFloat 5s ease-in-out infinite;
          filter: drop-shadow(0 20px 40px rgba(219,39,119,0.4));
        }

        .lab-section { padding: 60px 5%; background: #fff; text-align: center; }
        .lab-container { background: #f0f0f0; border-radius: 40px; padding: 50px 5%; max-width: 1100px; margin: 0 auto; box-shadow: 0 15px 35px rgba(0,0,0,0.05); border: 1px solid #ececef; }
        
        .lab-tabs { display: flex; justify-content: center; gap: 20px; margin-bottom: 30px; }
        .tab-btn { background: #ddd; border: none; padding: 10px 25px; border-radius: 30px; cursor: pointer; font-weight: 800; transition: 0.3s; }
        .tab-btn.active { background: var(--pink-glow); color: white; }

        .lab-card-animated { background: linear-gradient(-45deg, #2d012d, #4a0e4e, #1e3a5f, #2d002d); background-size: 400% 400%; max-width: 600px; margin: 0 auto; animation: movingGradient 8s infinite; color: white !important; padding: 40px; border-radius: 25px; display: flex; flex-direction: column; }

        .lab-input, .lab-textarea { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 15px; outline: none; background: rgba(255,255,255,0.9); color: #333; }
        .lab-btn { background: var(--bright-yellow); color: var(--deep-purple); padding: 14px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; transition: 0.3s; margin-top: 10px; }
        .result-box { margin-top: 20px; padding: 15px; border-radius: 12px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); }

        /* ── Vault Filters ── */
        .vault-filters { display: flex; justify-content: center; gap: 10px; margin-bottom: 50px; flex-wrap: wrap; }
        .filter-pill {
          padding: 7px 20px;
          border-radius: 6px;
          border: 1.5px solid #e5e7eb;
          background: white;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #777;
          letter-spacing: 0.03em;
        }
        .filter-pill:hover { border-color: var(--deep-purple); color: var(--deep-purple); }
        .filter-pill.active-filter { background: var(--deep-purple); color: var(--bright-yellow); border-color: var(--deep-purple); }

        /* ── Flip Card System ── */
        .story-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto; }

        .flip-wrapper { perspective: 1200px; height: 300px; }
        .flip-inner {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .flip-inner.flipped { transform: rotateY(180deg); }

        .flip-front, .flip-back {
          position: absolute; width: 100%; height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          padding: 28px 30px;
          display: flex; flex-direction: column;
        }

        .flip-front {
          background: #fff;
          border: 1px solid #ebebf0;
          border-left: 4px solid var(--pink-glow);
          transition: box-shadow 0.25s, border-left-color 0.25s;
        }
        .flip-front:hover { box-shadow: 0 12px 36px rgba(45,0,45,0.09); border-left-color: var(--deep-purple); }

        .flip-back {
          background: var(--deep-purple);
          transform: rotateY(180deg);
          color: white;
          justify-content: space-between;
          border-left: 4px solid var(--bright-yellow);
        }

        .card-tag {
          display: inline-block; padding: 2px 10px; border-radius: 4px;
          font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.08em; margin-bottom: 12px;
        }
        .card-title { font-size: 1rem; font-weight: 900; color: var(--deep-purple); margin-bottom: 10px; line-height: 1.3; }
        .card-content { font-size: 0.875rem; line-height: 1.7; color: #555; flex: 1; }

        .card-actions {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 18px; padding-top: 14px; border-top: 1px solid #f0f0f4;
        }
        .action-btn {
          background: none; border: none; cursor: pointer;
          padding: 5px 9px; border-radius: 6px; transition: all 0.18s;
          display: flex; align-items: center; gap: 5px;
          color: #999; font-weight: 700; font-size: 0.78rem;
          font-family: 'Poppins', sans-serif;
        }
        .action-btn:hover { background: #f5f3ff; color: var(--deep-purple); }
        .action-btn.liked { color: var(--pink-glow); animation: likeWiggle 0.4s ease; }

        .star-row { display: flex; gap: 2px; }
        .star-btn { background: none; border: none; cursor: pointer; font-size: 0.9rem; transition: transform 0.15s; line-height: 1; }
        .star-btn:hover { transform: scale(1.3); }

        .flip-hint { font-size: 0.7rem; color: #c0bec8; text-align: right; margin-top: 6px; cursor: pointer; }
        .flip-hint:hover { color: var(--pink-glow); }

        .back-label { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--bright-yellow); margin-bottom: 14px; }
        .back-punchline { font-size: 1.05rem; line-height: 1.75; font-style: italic; font-weight: 600; flex: 1; opacity: 0.95; }
        .back-source { font-size: 0.75rem; opacity: 0.4; margin-top: 8px; font-weight: 600; }
        .back-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1); }
        .back-btn {
          background: transparent; border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.85);
          padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 0.78rem; font-weight: 700;
          font-family: 'Poppins', sans-serif; transition: 0.2s; letter-spacing: 0.02em;
        }
        .back-btn:hover { background: rgba(255,255,255,0.1); color: white; }

        /* ── Toast ── */
        .share-toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--deep-purple);
          color: var(--bright-yellow);
          padding: 12px 28px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.9rem;
          z-index: 9999;
          animation: toastIn 0.3s ease;
          box-shadow: 0 8px 24px rgba(45,0,45,0.3);
          white-space: nowrap;
        }

        .footer { color: white; padding: 80px 5% 40px; border-top: 6px solid var(--bright-yellow); margin-top: 100px; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1.5fr; gap: 50px; }
      `}</style>

      {shareToast && <div className="share-toast">{shareToast}</div>}

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">Lollify</Link>
        <div className="nav-sections">
          <a href="#lab" className={activeSection === "lab" ? "active-link" : ""}>Comedy Lab</a>
          <a href="#trending" className={activeSection === "trending" ? "active-link" : ""}>Trending</a>
        </div>
        <div className="nav-pages">
          <Link to="/" className={location.pathname === "/" ? "active-link" : ""}>Home</Link>
          <Link to="/text-humor" className={location.pathname === "/text-humor" ? "active-link" : ""}>Text Humor</Link>
          <Link to="/gif-caption" className={location.pathname === "/gif-caption" ? "active-link" : ""}>Gif Caption</Link>
          <Link to="/gif-prompt" className={location.pathname === "/gif-prompt" ? "active-link" : ""}>Gif Prompt</Link>
        </div>
      </nav>

      <header className="page-header animated-bg">
        <div className="hero-text-side">
          <span className="hero-eyebrow">✦ Text-Based Comedy</span>
          <h1 className="hero-h1">
            The Humor<br /><span className="highlight">Vault</span>
          </h1>
          <p className="hero-desc">
            Exclusively curated jokes, stories, and AI-powered punchlines — all in one place.
          </p>
          <a href="#trending" className="hero-btn">Browse Stories →</a>
        </div>

        <div className="hero-image-side">
          <div className="hero-img-wrap">
            <div className="hero-img-ring" />
            <div className="hero-img-ring-2" />
            <img src={kidsLaughImg} alt="Laughing kids" className="hero-img-element" />
          </div>
        </div>
      </header>

      <section id="lab" className="lab-section">
        <div className="lab-container">
          <h2 style={{fontSize: '2.5rem', color: 'var(--deep-purple)', marginBottom: '30px'}}>The Comedy <span style={{color: 'var(--pink-glow)'}}>Lab</span></h2>
          <div className="lab-tabs">
            <button className={`tab-btn ${activeMode === 'words' ? 'active' : ''}`} onClick={() => setActiveMode('words')}>Word Alchemy</button>
            <button className={`tab-btn ${activeMode === 'headlines' ? 'active' : ''}`} onClick={() => setActiveMode('headlines')}>News Headline</button>
          </div>
          {activeMode === 'words' ? (
            <div className="lab-card-animated">
              <form onSubmit={generateWordJoke}>
                <input className="lab-input" placeholder="First word..." value={word1} onChange={(e) => setWord1(e.target.value)} required />
                <input className="lab-input" placeholder="Second word..." value={word2} onChange={(e) => setWord2(e.target.value)} required />
                <button type="submit" className="lab-btn">{isGeneratingWord ? "Brewing..." : "Generate Word Joke"}</button>
              </form>
              {wordJoke && <div className="result-box">{wordJoke}</div>}
            </div>
          ) : (
            <div className="lab-card-animated">
              <form onSubmit={generateHeadlineJoke}>
                <textarea className="lab-textarea" rows="4" placeholder="Paste a news headline..." value={headline} onChange={(e) => setHeadline(e.target.value)} required />
                <button type="submit" className="lab-btn">{isGeneratingHeadline ? "Scanning..." : "Generate Punchline"}</button>
              </form>
              {headlineJoke && <div className="result-box">{headlineJoke}</div>}
            </div>
          )}
        </div>
      </section>

      <section id="trending" style={{padding: '90px 5%', background: '#fafafa'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>

          {/* Section header */}
          <div style={{marginBottom: '48px'}}>
            <p style={{fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--pink-glow)', marginBottom: '10px'}}>Curated Picks</p>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'}}>
              <h2 style={{fontSize: '2.6rem', fontWeight: '900', color: 'var(--deep-purple)', lineHeight: 1.1}}>
                Latest <span style={{color: 'var(--pink-glow)'}}>Stories</span>
              </h2>
              <p style={{color: '#aaa', fontSize: '0.85rem', fontWeight: '600'}}>Click a card to reveal the punchline</p>
            </div>
            <div style={{width: '48px', height: '4px', background: 'var(--bright-yellow)', borderRadius: '2px', marginTop: '16px'}} />
          </div>

          {/* Filters */}
          <div className="vault-filters" style={{justifyContent: 'flex-start'}}>
            {tags.map(tag => (
              <button key={tag} className={`filter-pill ${activeFilter === tag ? 'active-filter' : ''}`} onClick={() => setActiveFilter(tag)}>
                {tag}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="story-grid">
            {filteredStories.map((story, index) => {
              const globalIndex = humorStories.indexOf(story);
              const isLiked = likedCards[globalIndex];
              const isSaved = savedCards[globalIndex];
              const isFlipped = flippedCards[globalIndex];
              const currentRating = ratings[globalIndex] || 0;
              const hovered = hoveredRating[globalIndex] || 0;
              const tagStyle = tagColors[story.tag] || { bg: '#f3f4f6', color: '#374151' };
              const likeCount = story.likes + (isLiked ? 1 : 0);

              return (
                <div key={globalIndex} className="flip-wrapper">
                  <div className={`flip-inner ${isFlipped ? 'flipped' : ''}`}>

                    {/* FRONT */}
                    <div className="flip-front">
                      <span className="card-tag" style={{ background: tagStyle.bg, color: tagStyle.color }}>{story.tag}</span>
                      <h3 className="card-title">{story.title}</h3>
                      <p className="card-content">{story.content}</p>

                      <div className="card-actions">
                        <div style={{display:'flex', gap:'2px'}}>
                          <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={() => toggleLike(globalIndex)}>
                            <svg viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            {likeCount}
                          </button>
                          <button className={`action-btn ${isSaved ? 'liked' : ''}`} onClick={() => toggleSave(globalIndex)}>
                            <svg viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                          </button>
                          <button className="action-btn" onClick={() => handleShare(story)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                          </button>
                        </div>
                        <div className="star-row">
                          {[1,2,3,4,5].map(star => (
                            <button key={star} className="star-btn"
                              onMouseEnter={() => setHoveredRating(prev => ({...prev, [globalIndex]: star}))}
                              onMouseLeave={() => setHoveredRating(prev => ({...prev, [globalIndex]: 0}))}
                              onClick={() => setRating(globalIndex, star)}>
                              {star <= (hovered || currentRating) ? '★' : '☆'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flip-hint" onClick={() => toggleFlip(globalIndex)}>Reveal punchline →</div>
                    </div>

                    {/* BACK */}
                    <div className="flip-back">
                      <div>
                        <div className="back-label">Punchline</div>
                        <p className="back-punchline">"{story.punchline}"</p>
                        <p className="back-source">— {story.title}</p>
                      </div>
                      <div className="back-actions">
                        <button className="back-btn" onClick={() => handleShare(story)}>Share</button>
                        <button className="back-btn" onClick={() => toggleFlip(globalIndex)}>← Back</button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {filteredStories.length === 0 && (
            <p style={{color:'#bbb', marginTop:'40px', fontSize:'1rem', textAlign:'center'}}>No stories in this category yet.</p>
          )}
        </div>
      </section>

      <footer className="footer animated-bg">
        <div className="footer-grid">
          <div>
            <h3 className="nav-logo" style={{color:'white'}}>Lollify</h3>
            <p style={{opacity:'0.8', marginTop:'15px'}}>Making the world brighter, one punchline at a time.</p>
          </div>
          <div>
            <h4 className="highlight">Explore</h4>
            <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'15px'}}>
              <Link to="/" style={{color:'white', textDecoration:'none'}}>Home</Link>
              <Link to="/text-humor" style={{color:'white', textDecoration:'none'}}>Text Humor</Link>
              <Link to="/gif-caption" style={{color:'white', textDecoration:'none'}}>Gif Caption</Link>
              <Link to="/gif-prompt" style={{color:'white', textDecoration:'none'}}>Gif Prompt</Link>
            </div>
          </div>
          <div>
            <h4 className="highlight">Newsletter</h4>
            <p style={{fontSize:'0.9rem', margin:'15px 0'}}>Get the week's best jokes.</p>
            <div style={{display:'flex', gap:'5px'}}>
              <input type="email" placeholder="Email" style={{padding:'10px', borderRadius:'8px', border:'none', flex:1}} />
              <button style={{padding:'10px 20px', borderRadius:'8px', border:'none', background:'var(--bright-yellow)', fontWeight:'bold', color: 'var(--deep-purple)'}}>Join</button>
            </div>
          </div>
        </div>
        <p style={{textAlign:'center', marginTop:'60px', opacity:0.6}}>© 2026 Lollify — Designed for Comedy & Code</p>
      </footer>
    </div>
  );
};

export default TextHumor;