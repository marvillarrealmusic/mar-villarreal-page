const Home = () => {
  return (
    <section id="home">
      <div className="container">
        <div className="roww">
          {/* Main Title */}
          <div className="resumo_fn_main_title">
            {/* <h3 className="subtitle">Introduction</h3> */}
            <h3 className="title">Introduction</h3>
            <p className="desc">
              Hey there! I'm Mar, born in Costa Rica, but currently living in
              Spain. I'm creative: I sing, write, produce songs, design and much
              more!
            </p>
            <p className="desc">
              Influenced by Jazz, Reggae, R&B, Funk, Soul, etc... I started
              singing at the age of 4 and I have been performing since I was 5.
              I'm currently working on new music!
            </p>
            <img src="img/signature.png" alt="image" />
          </div>
          {/* /Main Title */}
        </div>
      </div>
    </section>
  );
};

export default Home;
