const API_KEY = process.env.YOUTUBE_API_KEY ?? "AIzaSyAbRf6tdVRl5RM7QCj3Hgoen5gJtnV6-k0"
export const getExerciseVideoUrl = async (searchString: string) => {
    const url = new URL('https://youtube.googleapis.com/youtube/v3/search')
    url.searchParams.set("key", API_KEY)
    url.searchParams.set("q", `How to do ${searchString} exercise`)
    url.searchParams.set("type", "video")
    url.searchParams.set("maxResults", "10")
    const response = await fetch(url, {
        method: "GET",
        headers: new Headers({
            "Accept": "application/json"
        })
    })
    const result = await response.json()
    const videoID = result?.items[0]?.id?.videoId
    if (!videoID){
        throw new Error("could not find video")
    }
    return `https://www.youtube.com/embed/${videoID}`
}