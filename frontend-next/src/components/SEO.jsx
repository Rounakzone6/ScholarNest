import { Helmet } from "react-helmet-async";

const SEO = ({ 
  title, 
  description = "ScholarNest is a trusted digital marketplace where students help other students buy, sell, reuse and discover useful second-hand products around their campus.", 
  keywords = "student marketplace, second hand, campus commerce, used books, dorm essentials",
  image = "/vite.svg", 
  type = "website" 
}) => {
  const siteName = "ScholarNest";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
