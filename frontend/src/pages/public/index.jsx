import Hero from "../../components/hero";
import Testimonial from "../../components/testimonial";
import FeaturedBooks from "../../components/featured-books";
import AuthorStories from "../../components/author-stories";

export default function Home() {
    return (
      <div className="home-gradient pb-12">
        <Hero />
        <FeaturedBooks />
        <AuthorStories />
        <Testimonial />
      </div>
    );
}