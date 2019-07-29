import React from 'react'
import styles from "./Nav.module.scss"
import Icon from "../Icon/Icon"

export default function Nav(props) {

  return (
    <footer className={styles.test}>
      <nav className={styles.mainNav}>
        <ul className={styles.mainMenu}>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon classes={styles.icon} icon="home" text="home" />
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon classes={styles.icon} icon="floors" text="Rooms" />   
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon classes={styles.icon} icon="calendar" text="Date & Time" /> 
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon classes={styles.icon} icon="stats" text="Stats" />
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon classes={styles.icon} icon="cog" text="Settings" />
          </li>
        </ul>
      </nav>
    </footer>
  )
}