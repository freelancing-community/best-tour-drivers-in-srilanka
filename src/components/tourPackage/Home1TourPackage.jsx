import Link from "next/link";
import React from "react";
import toursData from "@/data/tours.json";

const WaveIcon = ({ flip = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={16}
    viewBox="0 0 15 16"
    style={flip ? { transform: "scaleX(-1)" } : undefined}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#F6A824"
      d="M1.92556 7.69046C2.35744 7.63298 2.78906 7.57563 3.21925 7.51077C4.14925 7.37065 5.08588 7.29138 6.01763 7.21249L6.01888 7.21243C6.15888 7.20055 6.29875 7.18874 6.43844 7.17668C7.50663 6.968 8.58732 6.89083 9.66644 6.94628C10.7733 7.06837 11.8592 7.41421 12.8857 7.97163L12.8857 8.23655C11.8592 8.79397 10.7733 9.13981 9.66644 9.26191C8.58732 9.31735 7.50663 9.24018 6.43844 9.03151C5.36831 8.93932 4.29813 8.82412 3.21925 8.69742C2.14031 8.57065 1.07012 8.42092 -6.78702e-07 8.23655L-7.01862e-07 7.97163C0.639938 7.86135 1.28306 7.77588 1.92556 7.69046ZM10.7633 15.8502C10.9332 15.4596 11.12 15.0855 11.3061 14.7127C11.389 14.5468 11.4717 14.3811 11.5527 14.2144C11.8159 13.6729 12.1141 13.1545 12.4299 12.6477C12.5448 12.4632 12.64 12.2604 12.7336 12.061C12.8972 11.7124 13.056 11.3741 13.3071 11.1616C13.7816 10.7768 14.3283 10.5734 14.886 10.574L15 10.7353C14.9945 11.4677 14.8235 12.1813 14.5088 12.7859C14.3311 13.1802 14.0336 13.4059 13.7358 13.6317C13.6073 13.7292 13.4787 13.8268 13.3597 13.9379C12.965 14.3066 12.5615 14.6637 12.1492 15.0093C11.7369 15.3549 11.3159 15.689 10.8685 16L10.7633 15.8502ZM11.7543 0.665536C11.4882 0.436859 11.2226 0.208798 10.9388 -1.5523e-06L10.816 0.149784C11.0528 0.725784 11.3072 1.27877 11.5703 1.82018C11.8335 2.3616 12.1142 2.89157 12.3949 3.40997C12.4795 3.56628 12.5538 3.73514 12.628 3.90394C12.8 4.29501 12.9718 4.68572 13.2721 4.91908C13.7312 5.33563 14.2754 5.56049 14.8334 5.56418L14.9562 5.4144C14.9651 4.68055 14.8095 3.95951 14.5089 3.3408C14.3471 3.01108 14.0894 2.80252 13.824 2.58763C13.6722 2.46474 13.5178 2.33975 13.3773 2.1888C12.9914 1.77409 12.6142 1.3824 12.1931 1.0368C12.0446 0.91489 11.8994 0.790152 11.7543 0.665536Z"
    />
  </svg>
);

const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
  >
    <path d="M8.15624 10.2261L7.70276 12.3534L5.60722 18L6.85097 17.7928L12.6612 10.1948C13.4812 10.1662 14.2764 10.1222 14.9674 10.054C18.1643 9.73783 17.9985 8.99997 17.9985 8.99997C17.9985 8.99997 18.1643 8.26211 14.9674 7.94594C14.2764 7.87745 13.4811 7.8335 12.6611 7.80518L6.851 0.206972L5.60722 -5.41705e-07L7.70276 5.64663L8.15624 7.77386C7.0917 7.78979 6.37132 7.81403 6.37132 7.81403C6.37132 7.81403 4.90278 7.84793 2.63059 8.35988L0.778036 5.79016L0.000253424 5.79016L0.554115 8.91458C0.454429 8.94514 0.454429 9.05483 0.554115 9.08539L0.000253144 12.2098L0.778036 12.2098L2.63059 9.64035C4.90278 10.1523 6.37132 10.1857 6.37132 10.1857C6.37132 10.1857 7.0917 10.2102 8.15624 10.2261Z" />
    <path d="M12.0703 11.9318L12.0703 12.7706L8.97041 12.7706L8.97041 11.9318L12.0703 11.9318ZM12.0703 5.23292L12.0703 6.0714L8.97059 6.0714L8.97059 5.23292L12.0703 5.23292ZM9.97892 14.7465L9.97892 15.585L7.11389 15.585L7.11389 14.7465L9.97892 14.7465ZM9.97892 2.41846L9.97892 3.2572L7.11389 3.2572L7.11389 2.41846L9.97892 2.41846Z" />
  </svg>
);

const PeopleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const Home1TourPackage = () => {
  // 6 tours starting from tour id 2 (index 1 to 7 -> tour-002 through tour-007)
  const homeTours = toursData.slice(1, 7);

  return (
    <>
      <div className="package-card-section pt-120 mb-120">
        <img
          src="/assets/img/home1/section-vector1.png"
          alt=""
          className="section-vector1"
        />
        <img
          src="/assets/img/home1/section-vector3.png"
          alt=""
          className="section-vector3"
        />
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-40">
                <span>
                  <WaveIcon />
                  <span style={{ color: "#F6A824", padding: "0 10px" }}>
                    Tour Package
                  </span>
                  <WaveIcon flip />
                </span>
                <h2 style={{ color: "#000000", fontWeight: "800" }}>
                  Affordable Vacation Bundles
                </h2>
              </div>
            </div>
          </div>
          <div className="row g-lg-4 gy-5 mb-70">
            {homeTours.map((tour) => {
              const price = tour.details?.price_from || tour.price || "";
              const duration = tour.details?.duration || tour.days || "";
              const maxPeople = tour.details?.max_people || "";

              return (
                <div className="col-lg-4 col-md-6" key={tour.id}>
                  <div className="package-card">
                    <div className="package-card-img-wrap">
                      <Link
                        href={`/package/${tour.id}`}
                        className="card-img"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={tour.image} alt={tour.title} />
                      </Link>
                      <div className="batch">
                        <span className="date">{duration}</span>
                        {maxPeople && (
                          <div
                            className="location"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <PeopleIcon />
                            <span style={{ fontSize: "13px", fontWeight: 500 }}>
                              Max {maxPeople}{" "}
                              {parseInt(maxPeople) === 1 ? "Person" : "People"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="package-card-content">
                      <div className="card-content-top">
                        <h5>
                          <Link href={`/package/${tour.id}`}>
                            {tour.title}
                          </Link>
                        </h5>
                      </div>
                      <div className="card-content-bottom">
                        <div className="price-area">
                          <h6>Price From:</h6>
                          <span>{price}</span>
                        </div>
                        <Link
                          href={`/package/${tour.id}`}
                          className="primary-btn2"
                        >
                          Book Tour
                          <BookIcon />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-center">
              <Link href="/package" className="secondary-btn1">
                View All Package
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home1TourPackage;
