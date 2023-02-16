import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";
import {
  LeftArrowIcon,
  LeftDoubleArrowIcon,
  RightArrowIcon,
  RightDoubleArrowIcon,
} from "@/components/icons";
import { GetStaticProps } from "next";
import { getPrismicClient } from "@/services/prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";
import { useState } from "react";

type PostsType = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  updatedAt: string;
};

interface PostsProps {
  posts: PostsType[];
  totalPage: string;
  page: string;
}

export default function Posts({
  posts: postsBlog,
  page,
  totalPage,
}: PostsProps) {
  const [posts, setPosts] = useState(postsBlog || []);
  const [currentPage, setCurrentPage] = useState(Number(page));

  //novos posts

  async function reqPost(pageNumber: number){
    const prismic = getPrismicClient() 

    const response = await prismic.query([
      Prismic.Predicates.at('document.type', 'post')
    ], {
      orderings: "[document.last_publication_date desc]",
      fetch: ["post.title", "post.description", "post.cover"],
      pageSize: 1,
      page: String(pageNumber)
    })

    return response
  }

  async function navigatePage(pageNumber: number){
    const response = await reqPost(pageNumber)

    if(response.results.length === 0){
      return;
    } 

    const getPosts = response.results.map((post) => {
      return {
        slug: post.uid,
        title: RichText.asText(post.data.title),
        description:
          post.data.description.find(
            (content: { type: string }) => content.type === "paragraph"
          )?.text ?? "",
        cover: post.data.cover.url,
        updatedAt: new Date(post.last_publication_date!).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
      };
    });

    setCurrentPage(pageNumber)
    //@ts-ignore
    setPosts(getPosts)
  
  }

  return (
    <>
      <Head>
        <title>Blog | Full System NextJs</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <Image
                src={post.cover}
                alt={post.title}
                width={720}
                height={410}
                quality={100}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUExNfDwABgQD0UtGuFQAAAABJRU5ErkJggg=="
              />
              <strong>{post.title}</strong>
              <time>{post.updatedAt}</time>
              <p>{post.description}...</p>
            </Link>
          ))}
          <div className={styles.buttonNavigate}>
            {Number(currentPage) >= 2 && (
              <div>
                <button onClick={() => navigatePage(1)}>
                  <LeftDoubleArrowIcon />
                </button>
                <button onClick={() => navigatePage(Number(currentPage - 1))}>
                  <LeftArrowIcon />
                </button>
              </div>
            )}
            {Number(currentPage) < Number(totalPage) && (
              <div>
                <button onClick={() => navigatePage(Number(currentPage + 1))}>
                  <RightArrowIcon />
                </button>
                <button onClick={() => navigatePage(Number(totalPage))}>
                  <RightDoubleArrowIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.Predicates.at("document.type", "post")],
    {
      orderings: "[document.last_publication_date desc]", //ordendando por mais recente
      fetch: ["post.title", "post.description", "post.cover"],
      pageSize: 1,
    }
  );

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description:
        post.data.description.find(
          (content: { type: string }) => content.type === "paragraph"
        )?.text ?? "",
      cover: post.data.cover.url,
      updatedAt: new Date(post.last_publication_date!).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts,
      totalPage: response.total_pages,
      page: response.page,
    },
    revalidate: 60 * 60, //nova requisição em 1h
  };
};
