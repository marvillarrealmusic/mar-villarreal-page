import { useEffect } from "react";

const PanelContent = () => {
  useEffect(() => {
    const Typed = require("typed.js");
    new Typed(".animated_title", {
      strings: [
        "Mar Villarreal",
        "Singer",
        "Composer",
        "Producer",
        "Creative",
        "Designer",
        "Content Manager",
      ],
      loop: true,
      smartBackspace: false,
      typeSpeed: 40,
      startDelay: 700,
      backDelay: 3e3,
    });
  }, []);
  return (
    <div className="right_in">
      <div className="right_top">
        <div className="border1" />
        <div className="border2" />
        <div className="img_holder">
          <img src="img/thumb/square.jpg" alt="image" />
          <div className="abs_img" data-bg-img="img/photo.jpg" />
        </div>
        <div className="title_holder">
          <div className="h5">Hi There! I am</div>
          <p className="h3 animated_title_wrapper">
            <span className="animated_title" />
          </p>
        </div>
      </div>
      <div className="right_bottom">
        {/* <iframe
          title="Soundcloud widget"
          src="https://w.soundcloud.com/player/?url=https://soundcloud.com/marvillarrealmusic/tracks&amp;download=false&amp;sharing=false&amp;show_artwork=false&amp;show_playcount=false&amp;show_user=false&amp;auto_play=true"
          width="100%"
          height="166"
          scrolling="no"
          frameborder="no"
          allow="autoplay"
        /> */}
        <iframe
          title="Spotify widget"
          style={{ borderRadius: 12 }}
          src="https://open.spotify.com/embed/artist/5Yq88YEjyRPaYnOumCq34g?utm_source=generator"
          width="100%"
          height="80"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        ></iframe>
        {/* <a href="#contact">
          <span className="circle" />
          <span className="text">
            I’m available for a freelance job. Hire me
          </span>
        </a> */}
      </div>
    </div>
  );
};

export default PanelContent;
