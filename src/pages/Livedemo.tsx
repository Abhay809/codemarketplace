import { useState } from "react";
import { ThumbsUp, MessageSquare, Share2, Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
const Livedemo = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  return (
    <>
      <div className=" h-20 bg-black">
        <Navbar />
      </div>

      <Card>
        <CardContent>
          <div className="aspect-video border border-purple-400 bg-black rounded-t-lg overflow-hidden shadow-xl">
            <iframe
              className="w-full h-full"
              src=""
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4 bg-purple-900/80">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-purple-100 hover:bg-purple-800"
              onClick={() => setIsLiked(!isLiked)}
            >
              <ThumbsUp
                className={`mr-2 h-4 w-4 ${
                  isLiked ? "fill-purple-300 text-purple-300" : ""
                }`}
              />
              <span>{isLiked ? "Liked" : "Like"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-purple-100 hover:bg-purple-800"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Comment</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-purple-100 hover:bg-purple-800"
            >
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
export default Livedemo;
