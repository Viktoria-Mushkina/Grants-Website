import { useState, useEffect, useRef, useCallback } from "react";
import type { Scholarship } from "../../types/scholarship";
import styles from "./recommendations.module.css";

interface RecommendationsProps {
  scholarships: Scholarship[];
  onCardClick?: (scholarship: Scholarship) => void;
}

const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return "";
  const trimmedText = text.trim();
  if (trimmedText.length <= maxLength) {
    return trimmedText;
  }

  return trimmedText.slice(0, maxLength).trim() + "...";
};

export const Recommendations: React.FC<RecommendationsProps> = ({
  scholarships,
  onCardClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  const [visibleScholarships, setVisibleScholarships] = useState<
    Scholarship[][]
  >([]);
  const totalSlides = visibleScholarships.length;

  useEffect(() => {
    const slides: Scholarship[][] = [];
    for (let i = 0; i < scholarships.length; i += 3) {
      slides.push(scholarships.slice(i, i + 3));
    }
    setVisibleScholarships(slides);
  }, [scholarships]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0) index = 0;
      if (index >= totalSlides) index = totalSlides - 1;

      setCurrentSlide(index);
      setTranslateX(-index * 100);
    },
    [totalSlides]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX - translateX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    let currentX = e.clientX - startX;
    const maxTranslate = -(totalSlides - 1) * 100;

    if (currentX > 0) currentX = 0;
    if (currentX < maxTranslate) currentX = maxTranslate;

    setTranslateX(currentX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const slideIndex = Math.round(-translateX / 100);
    goToSlide(slideIndex);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const slideIndex = Math.round(-translateX / 100);
      goToSlide(slideIndex);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX - translateX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    let currentX = e.touches[0].clientX - startX;
    const maxTranslate = -(totalSlides - 1) * 100;

    if (currentX > 0) currentX = 0;
    if (currentX < maxTranslate) currentX = maxTranslate;

    setTranslateX(currentX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const slideIndex = Math.round(-translateX / 100);
    goToSlide(slideIndex);
  };

  // Обработчик клика на карточку
  const handleCardClick = (scholarship: Scholarship, e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    onCardClick?.(scholarship);
  };

  if (visibleScholarships.length === 0) return null;

  return (
    <div className={styles.recommendationsContainer}>
      <h2 className={styles.title}>Рекомендации</h2>

      <div
        ref={carouselRef}
        className={styles.carouselContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={carouselTrackRef}
          className={`${styles.carouselTrack} ${
            isDragging ? styles.dragging : ""
          }`}
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isDragging ? "none" : "transform 0.3s ease",
          }}
        >
          {visibleScholarships.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className={styles.slide}
              style={{ width: "100%" }}
            >
              <div className={styles.cardsContainer}>
                {slide.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className={styles.card}
                    onClick={(e) => handleCardClick(scholarship, e)}
                  >
                    <h3 className={styles.scholarshipName}>
                      {scholarship.name}
                    </h3>
                    {scholarship.description && (
                      <div className={styles.description}>
                        <p className={styles.descriptionText}>
                          {truncateText(scholarship.description, 80)}
                        </p>
                      </div>
                    )}
                    {scholarship.paymentAmount && (
                      <div className={styles.amountValue}>
                        {scholarship.paymentAmount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dotsContainer}>
        {visibleScholarships.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${styles.dot} ${
              index === currentSlide ? styles.activeDot : ""
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
