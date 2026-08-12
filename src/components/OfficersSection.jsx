import advaitPhoto from '../../assets/officers/advait-johari.webp'
import aryanPhoto from '../../assets/officers/aryan-sinha.webp'
import dylanPhoto from '../../assets/officers/dylan-zhong.webp'
import kellyPhoto from '../../assets/officers/kelly-zhou.webp'
import rahilPhoto from '../../assets/officers/rahil-desai.webp'
import zacharyPhoto from '../../assets/officers/zachary-wilson.webp'

const officers = [
  {
    name: 'Dylan Zhong',
    photo: dylanPhoto,
    width: 357,
    height: 500,
    objectPosition: '50% 39%',
    bio: 'Dylan runs the Computer Science Club and works across several languages, with the most experience in Nix and Rust, high-performance computing, and systems programming. He also likes wearing hats and is happy to help with any question.'
  },
  {
    name: 'Zachary Wilson',
    photo: zacharyPhoto,
    width: 749,
    height: 1048,
    objectPosition: '50% 38%',
    bio: 'Zach helps with UIL preparation and teaches competitive programming. He is most familiar with C++, Rusty C++, Java, and Python. He has spent more than 300 hours teaching and is always happy to explain a difficult problem or answer questions. Outside CS Club, Zach enjoys writing, conducting research, and working on the school’s robotics team.'
  },
  {
    name: 'Rahil Desai',
    photo: rahilPhoto,
    width: 1030,
    height: 1125,
    objectPosition: '50% 42%'
    bio: 'Hey! I’m Rahil. I’ll be helping with competitive programming and UIL prep this year. I’m most experienced with Python, Java, C++, and Go, and I also have experience with AI, computer vision,  and robotics. I enjoy building new projects, experimenting with AI tools, and finding ways to use technology to solve real world problems.'
  },
  {
    name: 'Advait Johari',
    photo: advaitPhoto,
    width: 624,
    height: 876,
    objectPosition: '50% 38%',
    bio: 'Aadi has a strong background in software development, with the most experience in Go, Python, and Java, as well as robotics and AI. He will help with UIL preparation and competitive programming this year. Outside CS Club, he is involved in the school’s robotics team and enjoys building new projects and experimenting with the latest tools.'
  },
  {
    name: 'Kelly Zhou',
    photo: kellyPhoto,
    width: 1000,
    height: 1078,
    objectPosition: '50% 50%',
    bio: 'Kelly helps lead club lessons and provides Java tutoring. She has the most experience in cybersecurity, data science, and statistics, and is comfortable with Java and R. Outside computer science, she enjoys digital art and editing.'
  },
  {
    name: 'Aryan Sinha',
    photo: aryanPhoto,
    width: 843,
    height: 843,
    objectPosition: '50% 46%',
    bio: 'Aryan leads the Algorithmic Programming Club (APC) and helps organize new contests and competitions at Westlake. He works with Java, Python, and C++, as well as lower-level and hardware-oriented work in Verilog and NASM. He hopes to use computer science and engineering to invent with physics.'
  }
]

function Officer ({ officer }) {
  return (
    <figure className='officer'>
      <div className='officer-photo-wrap'>
        <img
          className='officer-photo'
          src={officer.photo}
          alt={officer.name}
          width={officer.width}
          height={officer.height}
          loading='lazy'
          decoding='async'
          style={{ objectPosition: officer.objectPosition }}
        />
      </div>
      <figcaption>
        <span className='officer-name'>{officer.name}</span>
        {officer.bio ? <p className='officer-bio'>{officer.bio}</p> : null}
      </figcaption>
    </figure>
  )
}

export default function OfficersSection () {
  return (
    <section className='section-shell officers-section' id='officers' aria-labelledby='officers-heading'>
      <div className='section-inner'>
        <div className='officers-header'>
          <h2 className='section-heading' id='officers-heading'>The people who keep it moving.</h2>
          <p className='section-intro'>
            Student officers plan the sessions, support projects, and make the club easier to join.
          </p>
        </div>
        <div className='officer-grid'>
          {officers.map((officer) => <Officer key={officer.name} officer={officer} />)}
        </div>
      </div>
    </section>
  )
}
