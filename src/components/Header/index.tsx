import Image from "next/image";
import styles from "./styles.module.scss";
import logo from "../../../public/images/logo.svg";
import { ActiveLink } from "../ActiveLink";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <ActiveLink href="/" activeClassName={styles.active}>
          <Image src={logo} alt="Sujeito Programador Logo" />
        </ActiveLink>

        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <span>Início</span>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <span>Conteúdo</span>
          </ActiveLink>
          <ActiveLink href="/about" activeClassName={styles.active}>
            <span> Quem somos?</span>
          </ActiveLink>
        </nav>

        <a
          className={styles.readyButton}
          type="button"
          href="#"
          target="_blank"
        >
          COMEÇAR
        </a>
      </div>
    </header>
  );
}
