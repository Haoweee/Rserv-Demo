import styles from './Carousel.module.scss';

const testimonials = [
  {
    stars: '★★★★★',
    text: 'The food was absolutely fantastic! The service made it even better.',
    author: 'John D.',
  },
  {
    stars: '★★★★★',
    text: 'A truly unforgettable dining experience. Highly recommend this restaurant!',
    author: 'Sarah L.',
  },
  {
    stars: '★★★★★',
    text: 'Amazing atmosphere and delicious dishes. Will definitely come back!',
    author: 'Michael T.',
  },
  {
    stars: '★★★★★',
    text: 'A hidden gem! The presentation and flavors were out of this world.',
    author: 'Emily R.',
  },
  {
    stars: '★★★★★',
    text: "Best dining experience I've had in years. Highly professional staff!",
    author: 'Alex G.',
  },
];

export default function TestimonialCarousel() {
  const totalSlides = Math.ceil(window.innerWidth / 300) + 1;
  const carouselItems = Array(totalSlides).fill(testimonials).flat();

  return (
    <div className={styles.slider}>
      <div className={styles.slide_track}>
        {carouselItems.map((testimonial, index) => (
          <div className={styles.slide} key={index}>
            <div className={styles.testimonial}>
              <div className={styles.stars}>{testimonial.stars}</div>
              <p>{testimonial.text}</p>
              <span>{testimonial.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
