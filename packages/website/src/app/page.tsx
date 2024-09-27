'use client'
import Canvas from '@/components/Canvas'
import NewShape from '@/components/NewShape'
import Options from '../sections/options'
import Shapes from '../sections/shapes'
import GenerateJson from '../sections/shapes/GenerateJson'
import HomeContext from './context'
import styles from './page.module.scss'
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
