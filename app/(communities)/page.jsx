import Link from "next/link";
import {
  Bars3BottomLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

import { Sidebar } from "@/components/layouts/sidebar";
import { Section } from "@/components/section";
import { Placeholder } from "@/components/empty";
import { Circle, CirclePlaceholder } from "@/components/circle";
import { Post, PostPlaceholder } from "@/components/post";

import { createClient } from "@/utils/supabase/server";

export default async function Communities() {
  const supabase = createClient();
  const { data: circles } = await supabase.from("circles").select();
  const { data: posts } = await supabase.from("posts").select(
    `
      id,
      created_at,
      deleted,
      deleted_at,
      nsfw,
      title,
      content,
      history,
      tags (*),
      images,
      views (users!views_user_id_fkey (*)),
      likes (users!likes_user_id_fkey (*)),
      comments (*),
      shares (users!shares_user_id_fkey (*)),
      writer:users!posts_writer_id_fkey (*),
      circle:circles!posts_circle_id_fkey (*)
    `,
  );

  return (
    <div className="container mx-auto space-y-4 p-4 lg:space-y-12 lg:p-12">
      <div className="card h-80 overflow-hidden rounded-2xl bg-base-100 bg-gradient-to-br from-transparent to-primary/20">
        <div className="card-body place-content-end items-end text-end">
          <h1 className="card-title z-[1] font-bold">
            Welcome to your spaces your community!
          </h1>
          <span className="z-[1]">
            This is the epicenter of the gaming community you love.
          </span>
          <div className="absolute bottom-0 left-0 h-1/4 w-1/4 rounded-bl-2xl rounded-tr-2xl bg-primary" />
          <div className="absolute bottom-0 left-0 h-2/4 w-2/5 rounded-bl-2xl rounded-tr-2xl bg-primary/30" />
          <div className="absolute bottom-0 left-0 h-3/4 w-2/4 rounded-bl-2xl rounded-tr-2xl bg-primary/10 backdrop-blur-md" />
          <span className="absolute -right-1/4 top-1/4 text-8xl font-bold opacity-10">
            COMMUNITY
          </span>
        </div>
      </div>
      <Sidebar>
        <div className="flex justify-between">
          <Section
            Icon={UserGroupIcon}
            inline
            title="Communities"
            hint={
              <>
                (<kbd className="kbd kbd-xs">Shift</kbd>
                <span>+</span>
                <kbd className="kbd kbd-xs">Scroll</kbd>)
              </>
            }
            hintClass="hidden space-x-1 text-gray-500 lg:block"
          />
          <Link href="/circles" className="btn btn-ghost btn-sm">
            View All
            <ChevronRightIcon className="size-5 rounded-full bg-primary p-1 text-primary-content" />
          </Link>
        </div>
        {circles?.length ? (
          <div className="carousel carousel-center relative w-full space-x-4 rounded-box bg-base-100 p-4 hover:overflow-x-scroll">
            {circles.map((circle, index) => (
              <div className="carousel-item" key={index}>
                <Circle
                  id={circle.id}
                  coverURL={circle.cover_url}
                  name={circle.name}
                  description={circle.description}
                />
              </div>
            ))}
          </div>
        ) : (
          <Placeholder
            title="Empty Circles"
            description="There are currently no circles."
          >
            <div className="carousel carousel-center relative w-full space-x-4 p-4 hover:overflow-x-scroll">
              {Array.from({ length: 2 }).map((_, index) => (
                <div className="carousel-item" key={index}>
                  <CirclePlaceholder />
                </div>
              ))}
            </div>
          </Placeholder>
        )}
        <Section Icon={Bars3BottomLeftIcon} title="Posts" />
        {posts?.length ? (
          <div className="rounded-2xl bg-base-100">
            {posts.map((post, index) => (
              <Post
                id={post.id}
                createdAt={post.created_at}
                title={post.title}
                content={post.content}
                tags={post.tags}
                images={post.images}
                view={post.views}
                likes={post.likes}
                comments={post.comments}
                shares={post.shares}
                writerID={post.writer?.id}
                writerAvatarURL={post.writer?.avatar_url}
                writerNickname={post.writer?.nickname}
                writerRole={post.writer?.role}
                circleID={post.circle?.id}
                circleIconURL={post.circle?.icon_url}
                circleName={post.circle?.name}
                isEnded={index + 1 === posts.length}
                key={index}
              />
            ))}
          </div>
        ) : (
          <Placeholder
            title="Empty Posts"
            description="There are currently no posts."
          >
            <PostPlaceholder isEnded={true} />
          </Placeholder>
        )}
      </Sidebar>
    </div>
  );
}