import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Bridge from "../components/Icons/Bridge";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

// Auth Button Component
function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="text-white/60">
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-white/80">
          Welcome, {session.user.username}
        </span>
        {session.user.role === 'admin' && (
          <Link
            href="/admin/dashboard"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
          >
            Dashboard
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
    >
      Login
    </Link>
  );
}

const Home: NextPage = () => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const [images, setImages] = useState<ImageProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/images');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch images');
        }
        
        if (data.success) {
          setImages(data.images);
        } else {
          throw new Error(data.error || 'Failed to load images');
        }
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>LNBits Gallery</title>
        <meta
          property="og:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {/* Header with Login/Logout */}
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <AuthButton />
        </div>
        
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <h1 className="text-4xl text-center text-white font-bold sm:p-10">My Gallery</h1>
        <p className="text-white/80 sm:p-5"> Here are some of my photos, if you see something you like, you can purchase the full-size version through the LNBits paywall link.</p>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <span className="ml-4 text-white/80">Loading gallery...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-red-400 font-semibold mb-2">Error Loading Gallery</h3>
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && (
          <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
            {images.map(({ id, public_id, format, blurDataUrl, display_name }) => (
              <Link
                key={id}
                href={`/?photoId=${id}`}
                as={`/p/${id}`}
                ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                shallow
                className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
              >
                <Image
                  alt={display_name}
                  className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                  width={720}
                  height={480}
                  sizes="(max-width: 640px) 100vw,
                    (max-width: 1280px) 50vw,
                    (max-width: 1536px) 33vw,
                    25vw"
                />  
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && images.length === 0 && (
          <div className="text-center py-20">
            <div className="text-white/60">
              <h3 className="text-xl font-semibold mb-2">No Images Found</h3>
              <p>The gallery is empty. Check back later for new photos!</p>
            </div>
          </div>
        )}
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Follow me on {" "}
        <a
          href={`${process.env.NEXT_PUBLIC_NOSTR_PROFILE}`}
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Nostr
        </a>
        !
      </footer>
    </>
  );
};

export default Home;
