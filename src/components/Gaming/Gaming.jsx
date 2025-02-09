import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGamingVideosRequest } from "../../redux/actions/gamingAction";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Gaming = () => {
  const dispatch = useDispatch();
  const { livestreamVideos, normalVideos, loading, error } = useSelector(
    (state) => state.gaming
  );

  const [livestreamPage, setLivestreamPage] = useState(0);
  const [normalPage, setNormalPage] = useState(0);

  const videosPerPage = 5;

  useEffect(() => {
    dispatch(fetchGamingVideosRequest(true));
    dispatch(fetchGamingVideosRequest(false));
    console.log(livestreamVideos);
  }, [dispatch]);

  const currentLivestreamVideos = livestreamVideos.slice(
    livestreamPage * videosPerPage,
    (livestreamPage + 1) * videosPerPage
  );

  const currentNormalVideos = normalVideos.slice(
    normalPage * videosPerPage,
    (normalPage + 1) * videosPerPage
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 ">
      <div className="flex items-center mb-6">
        <img
          alt="Gaming"
          className="h-[72px] w-[72px] rounded-full"
          src="https://yt3.googleusercontent.com/GFc_A-blEltrFJDdN_Hhq7wMxATv1u1LWHF87HZ7duVPBYWfwjeL-mZ8cV2_2hiQfFiHIdM-IXI=s120-c-c0x00ffffff-no-rwa"
        />
        <h1 className="text-4xl font-bold pl-4">Gaming</h1>
      </div>

      <section className="mb-10 relative">
        <h2 className="text-2xl font-bold">Top live streams</h2>
        <p className="text-gray-600 text-sm mb-4">
          Sorted by most viewers in your region
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {currentLivestreamVideos.map((video) => (
            <div key={video.id?.videoId || video.etag} className=" rounded-lg">
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 text-sm font-semibold">
                {video.snippet.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {video.snippet.channelTitle}
              </p>
              <div>
                {video.concurrentViewers > 0 && (
                  <p className="text-sm text-gray-600 font-medium">
                    🔴 {video.concurrentViewers} watching now
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setLivestreamPage((prev) => Math.max(prev - 1, 0))}
          disabled={livestreamPage === 0}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 p-2 bg-white rounded-full hover:bg-gray-400 "
        >
          <ChevronLeftIcon size={24} />
        </button>
        <button
          onClick={() =>
            setLivestreamPage((prev) =>
              prev + 1 < Math.ceil(livestreamVideos.length / videosPerPage)
                ? prev + 1
                : prev
            )
          }
          disabled={
            livestreamPage + 1 >=
            Math.ceil(livestreamVideos.length / videosPerPage)
          }
          className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 p-2 bg-white rounded-full hover:bg-gray-400"
        >
          <ChevronRightIcon size={24} />
        </button>
      </section>

      <section className="relative">
        <h2 className="text-2xl font-bold">Recommended Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 relative">
          {currentNormalVideos.map((video) => (
            <div key={video.id?.videoId || video.etag} className="rounded-lg">
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 text-sm font-semibold">
                {video.snippet.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {video.snippet.channelTitle}
              </p>
              <img src={video.snippet.channelAvatar} alt="" />
            </div>
          ))}
        </div>
        <button
          onClick={() => setNormalPage((prev) => Math.max(prev - 1, 0))}
          disabled={normalPage === 0}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 p-2 bg-white rounded-full hover:bg-gray-400 "
        >
          <ChevronLeftIcon size={24} />
        </button>
        <button
          onClick={() =>
            setNormalPage((prev) =>
              prev + 1 < Math.ceil(normalVideos.length / videosPerPage)
                ? prev + 1
                : prev
            )
          }
          disabled={
            normalPage + 1 >= Math.ceil(normalVideos.length / videosPerPage)
          }
          className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 p-2 bg-white rounded-full hover:bg-gray-400 "
        >
          <ChevronRightIcon size={24} />
        </button>
      </section>
    </div>
  );
};

export default Gaming;
