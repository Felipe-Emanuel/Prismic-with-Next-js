import styles from "./styles.module.scss";
import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "@/services/prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import { FaLinkedin } from "react-icons/fa";

type AboutType = {
  title: string;
  description: string;
  banner: string;
  linkedin: string;
};

interface AboutProps {
  content: AboutType;
}

export default function About({ content }: AboutProps) {
  return (
    <>
      <Head>
        <title>Quem somos? | Empresa Teste</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <p>{content.description}</p>

            <a href={content.linkedin}>
              <FaLinkedin size={40} />
            </a>
          </section>

          <img src={content.banner} alt="Sobre" />
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.Predicates.at("document.type", "about"),
  ]);

  const { title, description, banner, linkedin } = response.results[0].data;

  const content = {
    title: RichText.asText(title),
    description: RichText.asText(description),
    banner: banner.url,
    linkedin: linkedin.url,
  };

  return {
    props: { content },
    revalidate: 60 * 60,
  };
};
