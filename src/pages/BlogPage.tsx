import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/siteContent';
import { SeoHead } from '../components/SeoHead';

export function BlogPage() {
  const { slug } = useParams<{ slug?: string }>();
  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : null;

  if (slug && !post) {
    return (
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center space-y-4">
        <h1 className="font-display text-3xl font-semibold text-[#0F3D2E]">
          Article Not Found
        </h1>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F3D2E] text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Export Insights</span>
        </Link>
      </div>
    );
  }

  if (post) {
    return (
      <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
        <SeoHead
          title={`${post.title} | Mondal Export Import`}
          description={post.excerpt}
          image={post.image}
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            author: { '@type': 'Organization', name: 'Mondal Export Import' },
          }}
        />
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F3D2E] hover:text-[#2E8B57]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Export Guides</span>
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#2E8B57] font-medium">
              <span>{post.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1B1B1B]/60">{post.date}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1B1B1B]/60">{post.readTime}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0F3D2E] text-balance leading-tight">
              {post.title}
            </h1>
          </div>

          <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-white border border-[#0F3D2E]/10">
            <img
              src={post.image}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white rounded-3xl border border-[#0F3D2E]/10 p-8 sm:p-10 space-y-5">
            <p className="text-lg font-medium text-[#0F3D2E] leading-relaxed">
              {post.excerpt}
            </p>
            {post.content.map((para, i) => (
              <p key={i} className="text-base text-[#1B1B1B]/80 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          <div className="bg-[#0F3D2E] text-[#FAF7F0] rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold">
                Ready to source from India?
              </h2>
              <p className="text-xs text-[#FAF7F0]/75 mt-1">
                Request pricing, specifications, and private-label packaging options.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E0A526] text-[#09271D] text-sm font-semibold whitespace-nowrap"
            >
              <span>Contact Export Desk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
      <SeoHead
        title="Export Tips & Market Insights Blog | Mondal Export Import"
        description="Guides on Indian Basmati rice exports, APEDA cold-chain produce logistics, Spice Board standards, and export documentation."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold text-[#2E8B57] mb-2">
            Market Intelligence
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0F3D2E]">
            Export Tips &amp; Trade Insights
          </h1>
          <p className="mt-3 text-base text-[#1B1B1B]/75">
            Practical resources for international importers sourcing agricultural
            commodities, fresh produce, and spices from India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((item) => (
            <Link
              key={item.slug}
              to={`/blog/${item.slug}`}
              className="group bg-white rounded-3xl border border-[#0F3D2E]/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-[16/9] overflow-hidden bg-[#F1ECE0]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#2E8B57] font-medium mb-2">
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#1B1B1B]/55">{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#1B1B1B]/55">{item.readTime}</span>
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-[#0F3D2E] group-hover:text-[#2E8B57] transition-colors">
                    {item.title}
                  </h2>
                  <p className="mt-2.5 text-sm text-[#1B1B1B]/75 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F3D2E]">
                  <span>Read Guide</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
