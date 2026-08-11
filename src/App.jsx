import { useEffect } from 'react'
import { initializeAnimations } from './lib/animations.js'
import AffiliationSection from './components/AffiliationSection.jsx'
import Footer from './components/Footer.jsx'
import GeneralCsSection from './components/GeneralCsSection.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import JoinSection from './components/JoinSection.jsx'
import OfficersSection from './components/OfficersSection.jsx'
import ProgramSection from './components/ProgramSection.jsx'
import ClubTracksSection from './components/ClubTracksSection.jsx'

export default function App () {
  useEffect(() => initializeAnimations(), [])

  return (
    <div className='site-page'>
      <a className='skip-link' href='#club-content'>
        Skip to content
      </a>
      <Header />
      <main className='club-main' id='club-content'>
        <Hero />
        <ProgramSection />
        <GeneralCsSection />
        <ClubTracksSection />
        <AffiliationSection />
        <OfficersSection />
        <JoinSection />
      </main>
      <Footer />
    </div>
  )
}
