import advaitPhoto from "../../assets/officers/advait-johari.webp";
import dylanPhoto from "../../assets/officers/dylan-zhong.webp";
import kellyPhoto from "../../assets/officers/kelly-zhou.webp";
import rahilPhoto from "../../assets/officers/rahil-desai.webp";
import zacharyPhoto from "../../assets/officers/zachary-wilson.webp";

const officers = [
  {
    name: "Dylan Zhong",
    photo: dylanPhoto,
    width: 357,
    height: 500,
    objectPosition: "50% 39%",
    bio: "I run the Computer Science Club. I work in several languages, with the most experience in Nix and Rust, high-performance computing, and systems programming. I also like wearing hats. You can come to me with any question you have!",
  },
  {
    name: "Zachary Wilson",
    photo: zacharyPhoto,
    width: 749,
    height: 1048,
    objectPosition: "50% 38%",
  },
  {
    name: "Rahil Desai",
    photo: rahilPhoto,
    width: 1030,
    height: 1125,
    objectPosition: "50% 42%",
  },
  {
    name: "Advait Johari",
    photo: advaitPhoto,
    width: 624,
    height: 876,
    objectPosition: "50% 38%",
  },
  {
    name: "Kelly Zhou",
    photo: kellyPhoto,
    width: 1000,
    height: 1078,
    objectPosition: "50% 50%",
  },
];

function Officer({ officer }) {
  return (
    <figure className="officer">
      <div className="officer-photo-wrap">
        <img
          className="officer-photo"
          src={officer.photo}
          alt={officer.name}
          width={officer.width}
          height={officer.height}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: officer.objectPosition }}
        />
      </div>
      <figcaption>
        <span className="officer-name">{officer.name}</span>
        {officer.bio ? <p className="officer-bio">{officer.bio}</p> : null}
      </figcaption>
    </figure>
  );
}

export default function OfficersSection() {
  return (
    <section className="section-shell officers-section" id="officers" aria-labelledby="officers-heading">
      <div className="section-inner">
        <div className="officers-header">
          <h2 className="section-heading" id="officers-heading">The people who keep it moving.</h2>
          <p className="section-intro">
            Student officers plan the sessions, support projects, and make the club easier to join.
          </p>
        </div>
        <div className="officer-grid">
          {officers.map((officer) => <Officer key={officer.name} officer={officer} />)}
        </div>
      </div>
    </section>
  );
}
