import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => (
  <div className="min-h-screen bg-white py-10">
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">FirstLook Blog</h1>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <div key={post.slug} className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              <Link
                to={`/blog/${post.slug}`}
                className="text-purple-700 hover:underline"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-500 text-sm mb-2">{post.date}</p>
            <p className="text-gray-700 mb-2">{post.excerpt}</p>
            <Link
              to={`/blog/${post.slug}`}
              className="text-purple-600 font-medium hover:underline"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Blog;
