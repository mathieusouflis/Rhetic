"use client";
import { DropdownSelect } from "@/components/ui/Dropdown";
import PostWriter from "@/components/ui/PostWriter";
import { useEffect, useState } from "react";
import { Post } from "@/components/ui/Post";
import { PostType } from "@/types/post";
import { fetchMany } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetchMany<PostType>(API_PATHS.POSTS, {
          populate: {
            author: {
              fields: ["username"],
            },
            votes: {
              fields: ["type"],
              filters: {
                user: {
                  id: {
                    $eq: user?.id,
                  },
                },
              },
            },
            saved_items: {
              filters: {
                users_permissions_user: {
                  id: {
                    $eq: user?.id, // Replace with actual user ID
                  },
                },
              },
            },
            comments: {
              count: true,
            },
          },
        });
        console.log("Posts fetched:", response);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 5">
        <PostWriter />
        <div className="w-full h-px bg-[var(--black-400)]"></div>
        <div className="flex flex-row gap-2.5">
          <DropdownSelect
            options={[{ label: "Option 1", value: "option1" }]}
            placeholder="For You"
            onChange={() => console.log("change")}
          />
          <DropdownSelect
            options={[{ label: "Option 1", value: "option1" }]}
            placeholder="New"
            onChange={() => console.log("change")}
          />
        </div>
        {loading ? (
          <div className="text-center py-4">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-4">No posts found</div>
        ) : (
          posts.map((post) => (
            <div
              key={post.documentId || post.id}
              className="flex flex-col gap-2"
            >
              <Post post={post} />
              <div className="w-full h-px bg-[var(--black-500)]"></div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
