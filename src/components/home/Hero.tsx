import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div>
      <section className="w-full">
        <div className="relative mx-auto w-full max-w-[1600px] overflow-hidden bg-tenton-bg">
          {/* Desktop Hero */}
          <div className="relative hidden sm:block w-full h-[clamp(700px,75vh,820px)] mb-3">
            <Image
              src="/tenton_main.png"
              alt="Tenton Ramen N Tonkatsu"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            <div className={`${styles.steam} ${styles.steam1}`} />
            <div className={`${styles.steam} ${styles.steam2}`} />

            <div className="absolute inset-0 px-4">
              <div
                className="
                  absolute inset-x-0
                  top-[clamp(120px,8vw,420px)]
                  px-5 text-center
                "
              >
                <h1
                  className="
                    font-averia-serif text-tenton-brown
                    text-[clamp(30px,5vw,60px)]
                    leading-[1.12]
                  "
                >
                  Slow-Simmered <span className="text-tenton-red">Ramen</span>
                  <br />
                  Crispy, Golden{" "}
                  <span className="text-tenton-red">Tonkatsu</span>
                </h1>

                <p
                  className="
                    mt-5 font-averia text-tenton-brown/90
                    text-[clamp(14px,2.8vw,30px)]
                    leading-[1.4]
                  "
                >
                  A cozy neighborhood Japanese restaurant in West Vancouver
                </p>

                <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 pt-14">
                  <Link
                    href="/order"
                    className="
                      flex items-center justify-center rounded-full
                      border-2 border-tenton-red bg-tenton-red text-white font-semibold
                      h-[clamp(44px,4.5vw,54px)]
                      min-w-[clamp(160px,22vw,240px)]
                      px-[clamp(20px,3vw,36px)]
                      text-[clamp(16px,1.4vw,24px)]
                      transition-colors duration-200
                      hover:bg-white hover:text-tenton-red
                    "
                  >
                    Order Online
                  </Link>

                  <Link
                    href="/reservation"
                    className="
                      flex items-center justify-center rounded-full
                      border-2 border-tenton-brown text-tenton-brown font-semibold
                      h-[clamp(44px,4.5vw,54px)]
                      min-w-[clamp(160px,22vw,240px)]
                      px-[clamp(20px,3vw,36px)]
                      text-[clamp(16px,1.4vw,24px)]
                      transition-colors duration-200
                      hover:bg-tenton-brown hover:text-white
                    "
                  >
                    Reservation
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Hero */}
          {/* <div className="relative sm:hidden w-full h-[clamp(460px,52vh,620px)] overflow-hidden"> */}
          <div className="relative sm:hidden w-full aspect-[5/6] min-h-[420px] max-h-[600px] overflow-hidden">
            <Image
              src="/tenton_main_mobile.png"
              alt="Tenton Ramen N Tonkatsu"
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />

            {/* Top white fade */}
            {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-tenton-bg via-white/60 to-transparent z-10" /> */}

            {/* Bottom white fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/60 to-transparent z-10" />

            {/* Text */}
            <div
              className="
                absolute inset-x-0
                top-[clamp(14px,8vw,68px)]
                px-5 text-center
                z-20
              "
            >
              <h1
                className="
                  font-averia-serif text-tenton-brown
                  text-[clamp(14px,6vw,32px)]
                  leading-[1.12]
                "
              >
                Slow-Simmered <span className="text-tenton-red">Ramen</span>
                <br />
                Crispy, Golden <span className="text-tenton-red">Tonkatsu</span>
              </h1>

              <p
                className="
                  mt-2 font-averia text-tenton-brown/90
                  text-[clamp(10px,3vw,16px)]
                  font-semibold
                  leading-[1.4]
                  px-[clamp(12px,8vw,48px)]
                "
              >
                A cozy neighborhood Japanese restaurant in West Vancouver
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="
                absolute inset-x-0
                top-[clamp(220px,78vw,460px)]
                px-6
                z-20
              "
            >
              <div className="mx-auto max-w-[300px] flex flex-col gap-3">
                <Link
                  href="/order"
                  className="
                    w-full rounded-full
                    border border-tenton-red
                    bg-tenton-red text-white
                    py-2.5 text-center font-medium
                    text-[16px]
                    shadow-lg
                  "
                >
                  Order Online
                </Link>

                <Link
                  href="/reservation"
                  className="
                    w-full rounded-full
                    border border-tenton-brown
                    bg-tenton-brown text-white
                    py-2.5 text-center font-medium
                    text-[16px]
                  "
                >
                  Reservation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
