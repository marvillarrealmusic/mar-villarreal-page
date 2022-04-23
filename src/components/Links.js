import { Swiper, SwiperSlide } from "swiper/react";
import { customersSliderProps } from "../sliderProps";

const Customers = () => {
  return (
    <section id="customers">
      <div className="container">
        <div className="roww">
          {/* Main Title */}
          <div className="resumo_fn_main_title">
            <h3 className="subtitle">Links</h3>
            <h3 className="title">Platforms &amp; Social</h3>
          </div>
          {/* /Main Title */}
          {/* Partners */}
          <div className="resumo_fn_partners">
            <ul>
              <li>
                <a
                  href="https://www.instagram.com/marvillarrealmusic"
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    src="img/partners/instagram-logo.png"
                    loading="lazy"
                    alt="instagram"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://open.spotify.com/artist/5Yq88YEjyRPaYnOumCq34g"
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    src="img/partners/spotify-logo.png"
                    loading="lazy"
                    alt="spotify"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/c/MarVillarreal"
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    src="img/partners/youtube-logo.png"
                    loading="lazy"
                    alt="youtube"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://soundcloud.com/marvillarrealmusic"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="img/partners/soundcloud-logo.png"
                    loading="lazy"
                    alt="soundcloud"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/marvillarrealcr/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="img/partners/facebook-logo.png"
                    loading="lazy"
                    alt="facebook"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://music.apple.com/es/artist/mar-villarreal/1204725571"
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    src="img/partners/apple-music-logo.png"
                    loading="lazy"
                    alt="apple-music"
                  />
                </a>
              </li>
            </ul>
          </div>
          {/* /Partners */}
          {/* Testimonials */}
          {/* <div className="resumo_fn_testimonials">
            <div className="my__nav">
              <a href="#" className="prev">
                <span />
              </a>
              <a href="#" className="next">
                <span />
              </a>
            </div>
            <Swiper {...customersSliderProps} className="owl-carousel">
              <SwiperSlide className="item" key="1">
                <div className="title_holder">
                  <p className="desc">
                    “ They really nailed it. This is one of the best themes I
                    have seen in a long time. Very nice design with lots of
                    customization available. Many of my clients have chosen this
                    theme for their portfolio sites. ”
                  </p>
                  <h3 className="title">Albert Walker</h3>
                  <h3 className="subtitle">Freelancer &amp; Designer</h3>
                </div>
              </SwiperSlide>
              <SwiperSlide className="item" key="2">
                <div className="title_holder">
                  <p className="desc">
                    {`“ This was exactly what I needed for my portfolio,
                              and it looks great. I had a couple issues that
                              support helped troubleshoot both via email and on
                              the comments, which definitely made it worth the
                              price. I'm very pleased with this purchase. ”`}
                  </p>
                  <h3 className="title">Anna Barbera</h3>
                  <h3 className="subtitle">Photographer</h3>
                </div>
              </SwiperSlide>
              <SwiperSlide className="item" key="3">
                <div className="title_holder">
                  <p className="desc">
                    “ Had a problem with the layout after Installation- found no
                    approach. The support reacted quickly and competently. And
                    solved the problem between Elementor and a WordPress update.
                    Great! ”
                  </p>
                  <h3 className="title">Dana Atkins</h3>
                  <h3 className="subtitle">Customer</h3>
                </div>
              </SwiperSlide>
            </Swiper>
          </div> */}
          {/* /Testimonials */}
        </div>
      </div>
    </section>
  );
};

export default Customers;
