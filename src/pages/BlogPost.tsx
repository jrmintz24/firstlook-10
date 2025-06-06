
import { Link, useParams } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, Calendar, Clock, Share2, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-light text-gray-900 mb-4">Article not found</h1>
          <p className="text-gray-600 mb-6 font-light">The article you're looking for doesn't exist or has been moved.</p>
          <Link to="/blog">
            <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const estimatedReadTime = Math.ceil(post.content.join(' ').split(' ').length / 200);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {post.category}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {estimatedReadTime} min read
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 leading-tight max-w-3xl mx-auto">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12">
          <div className="h-64 md:h-80 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-3">
            <div className="max-w-none">
              {post.content.map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg font-light">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-500 font-light">
                  Published on {post.date}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share article
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Related Articles */}
              <Card className="border-0 shadow-none bg-gray-50 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Related Articles</h3>
                  <div className="space-y-6">
                    {blogPosts
                      .filter(p => p.slug !== slug)
                      .slice(0, 3)
                      .map(relatedPost => (
                        <Link 
                          key={relatedPost.slug}
                          to={`/blog/${relatedPost.slug}`}
                          className="block group"
                        >
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{relatedPost.date}</span>
                            <span>•</span>
                            <span>{relatedPost.category}</span>
                          </div>
                        </Link>
                      ))
                    }
                  </div>
                  
                  <Link to="/blog" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors text-sm font-medium mt-6">
                    <span>View all articles</span>
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Link>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="border-0 shadow-none bg-gray-900 rounded-2xl">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium text-white mb-3">Stay updated</h3>
                  <p className="text-gray-300 text-sm mb-6 font-light">
                    Get the latest insights delivered to your inbox weekly.
                  </p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="w-full px-4 py-3 text-sm rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-light"
                    />
                    <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium rounded-xl">
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-gray-400 text-xs mt-3 font-light">
                    No spam. Unsubscribe anytime.
                  </p>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
