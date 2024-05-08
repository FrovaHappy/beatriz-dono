'use client'
import styles from './page.module.scss'
import Shapes from './sections/shapes'
import HomeContext from './context'
import Options from './sections/options'
import NewShape from '@/components/NewShape'
import Canvas from '@/components/Canvas'
import GenerateJson from './sections/shapes/GenerateJson'
export default function Home() {
  return (
    <HomeContext>
      <main className={styles.main}>
        <NewShape />
        <Shapes />
        <Options />
        <Canvas />
        <GenerateJson />
      </main>
    </HomeContext>
  )
}
