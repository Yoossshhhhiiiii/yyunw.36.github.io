import { useEffect, useRef, useState } from 'react';
import stories from './captions.json';

const chapters = [
  { label: 'THE ASCENT', note: '獨自出發', number: '01' },
  { label: 'FIRST LIGHT', note: '在火山口等待日出', number: '02' },
  { label: 'ABOVE CLOUDS', note: '雲海與天空之間', number: '03' },
];

const qualities = [
  { label: 'COURAGE', score: '92%' },
  { label: 'SILENCE', score: '85%' },
  { label: 'TIME', score: '78%' },
  { label: 'WONDER', score: '88%' },
];

function ControlIcon({ name }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
      {name === 'pause' && <><path d="M8 5v14" /><path d="M16 5v14" /></>}
      {name === 'play' && <path d="m8 5 11 7-11 7z" />}
      {name === 'stop' && <path d="M6 6h12v12H6z" />}
      {name === 'close' && <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>}
    </svg>
  );
}

export function App() {
  const [selected, setSelected] = useState(0);
  const [activeStory, setActiveStory] = useState(0);
  const [playing, setPlaying] = useState(false);
  const dialogRef = useRef(null);
  const audioRef = useRef(null);
  const touchX = useRef(0);

  function selectStory(index) {
    setSelected((index + stories.length) % stories.length);
  }

  function openStory(index = selected) {
    setSelected(index);
    setActiveStory(index);
    dialogRef.current?.showModal();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setPlaying(false));
    }
  }

  function closeStory() {
    dialogRef.current?.close();
  }

  function onDialogClose() {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setPlaying(false);
  }

  function toggleAudio() {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play().catch(() => setPlaying(false));
    else audioRef.current.pause();
  }

  function stopAudio() {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (dialogRef.current?.open) return;
      if (event.key === 'ArrowRight') selectStory(selected + 1);
      if (event.key === 'ArrowLeft') selectStory(selected - 1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected]);

  const story = stories[activeStory];

  return (
    <main className="canvas">
      <section className="site-frame" aria-label="富士山明信片故事">
        <div className="inner-frame">
          <div className="experience">
            <div
              className="visual-panel"
              onTouchStart={(event) => { touchX.current = event.changedTouches[0].clientX; }}
              onTouchEnd={(event) => {
                const distance = event.changedTouches[0].clientX - touchX.current;
                if (Math.abs(distance) > 45) selectStory(selected + (distance < 0 ? 1 : -1));
              }}
            >
              <nav className="chapter-rail" aria-label="選擇明信片">
                {stories.map((item, index) => (
                  <button
                    key={item.id}
                    className={selected === index ? 'rail-step is-active' : 'rail-step'}
                    type="button"
                    aria-current={selected === index ? 'true' : undefined}
                    aria-label={'第 ' + (index + 1) + ' 張：' + item.title}
                    onClick={() => selectStory(index)}
                  />
                ))}
              </nav>
              <button className="hero-photo-button" type="button" onClick={() => openStory(selected)} aria-label={'閱讀「' + stories[selected].title + '」的故事'}>
                {stories.map((item, index) => (
                  <img key={item.id} className={selected === index ? 'hero-photo is-visible' : 'hero-photo'} src={import.meta.env.BASE_URL + item.image} alt={item.alt} />
                ))}
                <span className="photo-overlay" aria-hidden="true" />
                <span className="photo-caption" aria-live="polite">
                  <span>{chapters[selected].label}</span>
                  <span>{chapters[selected].note}</span>
                </span>
              </button>
            </div>

            <div className="atlas-panel">
              <div className="atlas-top">
                <span className="small-rule" aria-hidden="true" />
                <span className="atlas-page-number">{chapters[selected].number}</span>
                <h1>F U J I</h1>
                <p className="coordinates">3,776 M · JAPAN · 2024</p>
                <div className="qualities" aria-label="旅程印象">
                  {qualities.map((quality) => (
                    <div className="quality-row" key={quality.label}>
                      <span>{quality.label}</span>
                      <span className="quality-track"><span style={{ width: quality.score }} /></span>
                      <span>{quality.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="atlas-map">
                <div className="map-rule" />
                <div className="star-field" aria-label="點選星點閱讀明信片故事">
                  {chapters.map((chapter, index) => (
                    <button
                      key={chapter.number}
                      className={'star-hit star-hit-' + (index + 1) + (selected === index ? ' is-selected' : '')}
                      type="button"
                      aria-label={'閱讀第 ' + (index + 1) + ' 張明信片：' + stories[index].title}
                      onClick={() => openStory(index)}
                    >
                      <span className="star-tooltip">{chapter.number} · {stories[index].title}</span>
                    </button>
                  ))}
                </div>
                <div className="map-instruction">
                  <span className="small-rule" aria-hidden="true" />
                  <p>SELECT A STAR · DISCOVER THE STORY</p>
                  <em>三個片刻，在雲海與天空之間連成一段旅程。</em>
                </div>
              </div>

              <div className="atlas-navigation">
                <button type="button" onClick={() => selectStory(selected - 1)} aria-label="上一張明信片">PREV</button>
                <span aria-live="polite">{chapters[selected].number} / 03 — {stories[selected].title}</span>
                <button type="button" onClick={() => selectStory(selected + 1)} aria-label="下一張明信片">NEXT</button>
              </div>
            </div>
          </div>
          <footer className="frame-footer">
            <span>FUJI — A SOLO JOURNEY ABOVE THE CLOUDS</span>
            <span>2024.09.08 — 09.09</span>
          </footer>
        </div>
      </section>

      <dialog ref={dialogRef} className="story-dialog" onClose={onDialogClose} aria-labelledby="dialog-title" onClick={(event) => { if (event.target === dialogRef.current) closeStory(); }}>
        <div className="dialog-frame">
          <div className="dialog-image"><img src={import.meta.env.BASE_URL + story.image} alt={story.alt} /></div>
          <article className="dialog-content">
            <div className="dialog-topline">
              <span>POSTCARD {story.number} / 03</span>
              <div className="dialog-actions">
                <button className="icon-control" type="button" onClick={toggleAudio} aria-label={playing ? '暫停音樂' : '播放音樂'} title={playing ? '暫停音樂' : '播放音樂'}><ControlIcon name={playing ? 'pause' : 'play'} /></button>
                <button className="icon-control" type="button" onClick={stopAudio} aria-label="停止音樂" title="停止音樂"><ControlIcon name="stop" /></button>
                <button className="icon-control close-control" type="button" onClick={closeStory} aria-label="關閉故事" title="關閉故事"><ControlIcon name="close" /></button>
              </div>
            </div>
            <p className="dialog-overline">FUJI · {story.date}</p>
            <h2 id="dialog-title">{story.title}</h2>
            <p className="dialog-subtitle">{story.subtitle}</p>
            <div className="dialog-copy">{story.text}</div>
            <div className="dialog-bottom"><span>原文 · {story.credit}</span></div>
          </article>
        </div>
      </dialog>
      <audio ref={audioRef} src={import.meta.env.BASE_URL + 'assets/postcard-song.mp3'} preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    </main>
  );
}
