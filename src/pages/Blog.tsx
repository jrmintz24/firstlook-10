import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";

const Blog = () => {
  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
            FirstLook
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Modern insights for the independent homebuyer. Navigate real estate with confidence and clarity.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-20">
          <Link 
            to={`/blog/${featuredPost.slug}`}
            className="group block"
          >
            <Card className="border-0 shadow-none hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-3xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                {/* Featured Image */}
                <div className="relative overflow-hidden">
                  {featuredPost.image ? (
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20"></div>
                    </div>
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm">
                      Featured
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <CardContent className="p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {featuredPost.category}
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-light text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg font-light">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors">
                    <span>Read article</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        </div>

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {regularPosts.map((post, index) => {
            const estimatedReadTime = Math.ceil(post.content.join(' ').split(' ').length / 200);
            
            return (
              <Link 
                key={post.slug} 
                to={`/blog/${post.slug}`}
                className="group block"
              >
                <Card className="h-full border-0 shadow-none hover:shadow-lg transition-all duration-300 bg-white overflow-hidden rounded-2xl">
                  {/* Post Image */}
                  <div className={`h-48 relative overflow-hidden ${
                    index % 3 === 0 ? 'bg-gradient-to-br from-blue-100 to-indigo-200' :
                    index % 3 === 1 ? 'bg-gradient-to-br from-purple-100 to-pink-200' :
                    'bg-gradient-to-br from-green-100 to-emerald-200'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white/20 text-gray-800 backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {estimatedReadTime} min
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm font-light">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors text-sm">
                      <span>Read more</span>
                      <ArrowRight className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Newsletter Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-none bg-gray-900 rounded-3xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-light text-white mb-4">Stay informed</h3>
              <p className="text-gray-300 mb-8 text-lg font-light max-w-2xl mx-auto">
                Get weekly insights on modern homebuying, market trends, and expert tips delivered to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-6 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-light"
                />
                <button className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-2xl hover:bg-indigo-700 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
              
              <p className="text-gray-400 text-sm mt-4 font-light">
                No spam. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;
