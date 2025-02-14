import Image from "next/image";
import { useEffect } from "react";
import useSWR from "swr";

export default function Slide() {
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data: banner, error: bannerError } = useSWR(`http://localhost:3000/banner`, fetcher);
  if (bannerError) {
    return <div>Error loading banner data</div>;
  }
  
  if (!banner) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex justify-center mt-3 ms-5">
      <div className="container">
        <div className="row">
          <div className="col-md-8 p-0">
            <div id="carouselExample" className="carousel slide">
              <div className="carousel-inner">
                {banner.filter(item => item.type === 'A'&& item.hidden === false).map((item, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <Image
                      src={`http://localhost:3000/img/banner/${item.img}`}
                      alt={`Banner image ${index + 1}`}
                      width={879}
                      height={420}
                      className="d-block w-100 rounded"
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
          <div className="col-md-4">
            {
              banner.filter(item => item.type === 'B' && item.hidden === false).map((item, index) => (
                <div key={index} className="mb-3">
                  <Image
                    src={`http://localhost:3000/img/banner/${item.img}`}
                    alt={`Banner image ${index + 1}`}
                    width={380}
                    height={202}
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}