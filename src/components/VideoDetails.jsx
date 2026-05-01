import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { abbreviateNumber } from "js-abbreviation-number";

import { fetchDataFromApi } from "../utils/api";
import { Context } from "../context/contextApi";
import SuggestionVideoCard from "./SuggestionVideoCard";

const VideoDetails = () => {
    const [video, setVideo] = useState();
    const [relatedVideos, setRelatedVideos] = useState();
    const { id } = useParams();
    const { setLoading } = useContext(Context);

    useEffect(() => {
        document.getElementById("root").classList.add("custom-h");
        setLoading(true);
        fetchDataFromApi(`video/details/?id=${id}`)
            .then((res) => {
                setVideo(res);
                setLoading(false);
                fetchDataFromApi(`video/related-contents/?id=${id}`)
                    .then((related) => {
                        if (related?.contents?.length) {
                            setRelatedVideos(related.contents);
                        } else {
                            const query = encodeURIComponent(
                                res?.author?.title || res?.title || "trending"
                            );
                            return fetchDataFromApi(`search/?q=${query}`).then(
                                (search) => setRelatedVideos(search?.contents)
                            );
                        }
                    })
                    .catch(() => {});
            })
            .catch(() => setLoading(false));
    }, [id, setLoading]);

    return (
        <div className="flex justify-center flex-row h-[calc(100%-56px)] bg-black">
            <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
                <div className="flex flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 overflow-y-auto">
                    <div className="shrink-0 h-[200px] md:h-[400px] lg:h-[400px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0">
                        <ReactPlayer
                            url={`https://www.youtube.com/watch?v=${id}`}
                            controls
                            width="100%"
                            height="100%"
                            style={{ backgroundColor: "#000000" }}
                            playing={true}
                        />
                    </div>
                    <div className="text-white font-bold text-sm md:text-xl mt-4 line-clamp-2">
                        {video?.title}
                    </div>
                    <div className="flex justify-between flex-col md:flex-row mt-4">
                        <div className="flex">
                            <div className="flex items-start">
                                <div className="flex h-11 w-11 rounded-full overflow-hidden bg-white/[0.2] items-center justify-center shrink-0">
                                    {video?.author?.avatar?.[0]?.url ? (
                                        <img
                                            className="h-full w-full object-cover"
                                            src={video.author.avatar[0].url}
                                            alt={video?.author?.title}
                                        />
                                    ) : (
                                        <span className="text-white font-bold text-lg">
                                            {video?.author?.title?.[0]?.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col ml-3">
                                <div className="text-white text-md font-semibold flex items-center">
                                    {video?.author?.title}
                                    {video?.author?.badges?.[0]?.type ===
                                        "VERIFIED_CHANNEL" && (
                                        <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] ml-1" />
                                    )}
                                </div>
                                <div className="text-white/[0.7] text-sm">
                                    {video?.author?.stats?.subscribersText}
                                </div>
                            </div>
                        </div>
                        <div className="flex text-white mt-4 md:mt-0 items-center gap-3 flex-wrap">
                            <div className="flex items-center rounded-3xl bg-white/[0.15] overflow-hidden">
                                <div className="flex items-center gap-2 px-5 h-10 border-r border-white/[0.2] hover:bg-white/[0.1] cursor-pointer">
                                    <AiOutlineLike className="text-xl" />
                                    <span className="text-sm font-medium">
                                        {abbreviateNumber(video?.stats?.likes, 2)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-5 h-10 hover:bg-white/[0.1] cursor-pointer">
                                    <AiOutlineDislike className="text-xl" />
                                </div>
                            </div>
                            <div className="flex items-center h-10 px-5 rounded-3xl bg-white/[0.15] text-sm font-medium">
                                {abbreviateNumber(video?.stats?.views, 2)} Views
                            </div>
                        </div>
                    </div>
                    {video?.description && (
                        <div className="text-white/[0.7] text-sm mt-4 bg-white/[0.05] rounded-xl p-4 whitespace-pre-wrap">
                            {video.description}
                        </div>
                    )}
                </div>
                <div className="flex flex-col py-6 px-4 overflow-y-auto lg:w-[350px] xl:w-[400px]">
                    {relatedVideos?.map((item, index) => {
                        if (item?.type !== "video") return false;
                        return (
                            <SuggestionVideoCard
                                key={index}
                                video={item?.video}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default VideoDetails;
