import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useLanguage } from "../hooks/useLanguage";
import { formatReleaseDate, getLatestReleases, getSpotifyEmbedUrl, getSpotifyArtistEmbedUrl, parseYouTubeUrl, text } from "../lib/site-utils.cjs";
import styles from "./Site.module.css";

const anchors = ["home", "releases", "videos", "biography", "services", "social", "contact"];
const paragraphs = (value) => value.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);

function SocialIcon({ name }) {
  const icons = {
    instagram: "instagram",
    spotify: "spotify",
    youtube: "youtube",
    soundcloud: "soundcloud",
    facebook: "facebook",
    "apple music": "apple-music",
  };
  const file = icons[name.toLowerCase()];
  return file
    ? <img src={`/icons/social/${file}.svg`} alt="" aria-hidden="true" />
    : <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></svg>;
}

function Header({ content, language, setLanguage }) {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape" && open) { setOpen(false); button.current?.focus(); } };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  return <>
    <a className={styles.skip} href="#main-content">{text(content.ui.skipToContent, language)}</a>
    <header className={styles.header}>
      <a className={styles.wordmark} href="#home">{content.site.name}</a>
      <nav id="site-menu" className={styles.nav} aria-label={text(content.ui.navigationLabel, language)} hidden={!open}>
        {anchors.map((anchor) => <a key={anchor} href={`#${anchor}`} onClick={() => setOpen(false)}>{text(content.navigation[anchor], language)}</a>)}
      </nav>
      <div className={styles.headerActions}>
        <label className={styles.srOnly} htmlFor="site-language">{text(content.ui.languageSelector, language)}</label>
        <select id="site-language" className={styles.lang} value={language} onChange={(event) => { setLanguage(event.target.value); setOpen(false); }}>
          <option value="es">{text(content.ui.spanish, language)}</option><option value="en">{text(content.ui.english, language)}</option>
        </select>
        <button id="menu-toggle" ref={button} className={styles.menuButton} type="button" aria-controls="site-menu" aria-expanded={open} aria-label={text(open ? content.ui.closeMenu : content.ui.openMenu, language)} onClick={() => setOpen(!open)}><span aria-hidden="true">{open ? "×" : "☰"}</span></button>
      </div>
    </header>
  </>;
}

function SiteImage({ image, language, className, priority = false }) {
  return <div className={`${styles.imageFrame} ${className || ""}`}><img src={image.src} alt={text(image.alt, language)} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" style={{ objectPosition: image.position }} /></div>;
}

function Releases({ content, language, artistUrl }) {
  const releases = getLatestReleases(content.releases.items, 3);
  return <section id="releases" className={`${styles.section} ${styles.releases}`}><div className={styles.sectionHeading}>
    <p className={styles.eyebrow}>{text(content.releases.eyebrow, language)}</p><h2>{text(content.releases.title, language)}</h2><p>{text(content.releases.description, language)}</p>
  </div>
    {releases.length ? <div className={styles.releaseGrid}>{releases.map((release) => <article className={styles.releaseCard} key={release.spotifyUrl}>
      <a className={styles.cover} href={release.spotifyUrl} target="_blank" rel="noopener noreferrer" aria-label={`${text(content.releases.listenLabel, language)}: ${release.title}`}><img src={release.cover.src} alt={text(release.cover.alt, language)} loading="lazy" decoding="async" style={{ objectPosition: release.cover.position }} /><span aria-hidden="true">↗</span></a>
      <h3>{release.title}</h3><time dateTime={release.releaseDate}>{formatReleaseDate(release.releaseDate, language)}</time>
      <a className={styles.textLink} href={release.spotifyUrl} target="_blank" rel="noopener noreferrer">{text(content.releases.listenLabel, language)} ↗</a>
    </article>)}</div>
      : <p className={styles.empty}>{text(content.releases.emptyMessage, language)}</p>}
    <div className={styles.playerGrid}>
      {releases.length > 0 && <div><h3 className={styles.playerHeading}>{text(content.releases.latestPlayerHeading, language)}</h3><div className={styles.player}><iframe title={`${text(content.releases.playerTitle, language)}${releases[0].title}`} src={getSpotifyEmbedUrl(releases[0].spotifyUrl)} width="100%" height="352" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /></div></div>}
      <div><h3 className={styles.playerHeading}>{text(content.releases.popularPlayerHeading, language)}</h3><div className={styles.player}><iframe title={text(content.releases.popularPlayerTitle, language)} src={getSpotifyArtistEmbedUrl(artistUrl)} width="100%" height="352" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /></div></div>
    </div>
    <a className={styles.textLink} href={artistUrl} target="_blank" rel="noopener noreferrer">{text(content.releases.allMusicLabel, language)} ↗</a>
  </section>;
}

function Videos({ content, language }) {
  const [activeId, setActiveId] = useState(null);
  return <section id="videos" className={styles.section}>
    <div className={styles.sectionHeading}><p className={styles.eyebrow}>{text(content.eyebrow, language)}</p><h2>{text(content.title, language)}</h2><p>{text(content.description, language)}</p></div>
    {content.items.length ? <div className={styles.videoGrid}>{content.items.map((video) => {
      const { id } = parseYouTubeUrl(video.youtubeUrl);
      return <article className={styles.videoCard} key={id}>
        <div className={styles.videoFrame}>
          {activeId === id ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
            : <button type="button" aria-label={`${text(content.playLabel, language)}: ${video.title}`} onClick={() => setActiveId(id)}><img src={video.thumbnail.src} alt={text(video.thumbnail.alt, language)} loading="lazy" decoding="async" style={{ objectPosition: video.thumbnail.position }} /><span className={styles.playButton} aria-hidden="true">▶</span></button>}
        </div>
        <h3>{video.title}</h3><a className={styles.textLink} href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">{text(content.watchLabel, language)} ↗</a>
      </article>;
    })}</div> : <p className={styles.empty}>{text(content.emptyMessage, language)}</p>}
  </section>;
}

function SEO({ content, language }) {
  const title = text(content.seo.title, language);
  const base = content.site.url.replace(/\/$/, "");
  return <Head><title>{title}</title><meta name="description" content={text(content.seo.description, language)} />
    <link rel="canonical" href={`${base}/`} /><meta property="og:type" content="website" /><meta property="og:title" content={title} />
    <meta property="og:description" content={text(content.seo.description, language)} /><meta property="og:url" content={`${base}/`} />
    <meta property="og:image" content={`${base}${content.seo.image}`} /><meta name="twitter:card" content="summary_large_image" />
  </Head>;
}

export default function Site({ content }) {
  const [language, setLanguage] = useLanguage();
  return <><SEO content={content} language={language} /><div className={styles.shell}>
    <Header content={content} language={language} setLanguage={setLanguage} />
    <main id="main-content">
      <section id="home" className={`${styles.section} ${styles.hero}`}><div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{text(content.hero.eyebrow, language)}</p><h1>{text(content.hero.title, language)}</h1>
        <p className={styles.lead}>{text(content.hero.description, language)}</p>
        <div className={styles.actions}><a className={styles.primaryButton} href="#releases">{text(content.hero.primaryCta, language)} ↗</a><a className={styles.secondaryButton} href="#contact">{text(content.hero.secondaryCta, language)}</a></div>
      </div><SiteImage image={content.hero.image} language={language} className={styles.heroImage} priority /><a className={styles.scrollCue} href="#releases" aria-label={text(content.navigation.releases, language)}>↓</a></section>
      <Releases content={content} language={language} artistUrl={content.site.spotifyArtistUrl} />
      <Videos content={content.videos} language={language} />
      <section id="biography" className={`${styles.section} ${styles.biography}`}><SiteImage image={content.biography.image} language={language} className={styles.bioImage} />
        <div><p className={styles.eyebrow}>{text(content.biography.eyebrow, language)}</p><h2>{text(content.biography.title, language)}</h2>
          <div className={styles.prose}>{paragraphs(text(content.biography.body, language)).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></div>
      </section>
      <section id="services" className={`${styles.section} ${styles.services}`}><div className={styles.sectionHeading}><p className={styles.eyebrow}>{text(content.services.eyebrow, language)}</p><h2>{text(content.services.title, language)}</h2><p>{text(content.services.description, language)}</p></div>
        <div className={styles.serviceGrid}>{content.services.items.map((item, i) => <article className={styles.serviceCard} key={text(item.title, language)}><span className={styles.number} aria-hidden="true">0{i + 1}</span><h3>{text(item.title, language)}</h3><p>{text(item.description, language)}</p></article>)}</div>
        <a className={styles.textLink} href="#contact">{text(content.services.contactLabel, language)} ↗</a>
      </section>
      <section id="social" className={`${styles.section} ${styles.social}`}><div><p className={styles.eyebrow}>{text(content.social.eyebrow, language)}</p><h2>{text(content.social.title, language)}</h2><p>{text(content.social.description, language)}</p></div>
        <ul>{content.social.items.map((item) => <li key={item.name}><a href={item.url} target="_blank" rel="noopener noreferrer"><span className={styles.socialIcon}><SocialIcon name={item.name} /></span><span className={styles.socialName}>{item.name}</span><span className={styles.socialArrow} aria-hidden="true">↗</span></a></li>)}</ul>
      </section>
      <section id="contact" className={`${styles.section} ${styles.contact}`}><p className={styles.eyebrow}>{text(content.contact.eyebrow, language)}</p><h2>{text(content.contact.title, language)}</h2><p>{text(content.contact.description, language)}</p>
        <a className={styles.lightButton} href={`mailto:${content.site.contactEmail}`}>{text(content.contact.emailLabel, language)} ↗</a><a className={styles.email} href={`mailto:${content.site.contactEmail}`}>{content.site.contactEmail}</a>
      </section>
    </main>
    <footer className={styles.footer}><span>{content.site.name} © {new Date().getFullYear()}</span><span>{text(content.footer.rights, language)}</span><a href="#home">{text(content.ui.backToTop, language)} ↑</a></footer>
  </div></>;
}
