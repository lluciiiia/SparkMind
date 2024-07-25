"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import {
  AudioLinesIcon,
  ImageIcon,
  TextIcon,
  Triangle,
  UploadIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaCaretLeft, FaCaretRight, FaTimes } from "react-icons/fa";
import { PiNoteBlankFill } from "react-icons/pi";
import { useIsomorphicLayoutEffect, useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import { NewNoteSection } from "./new-note";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const drawerRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }

    const handleClickOutside = (e: MouseEvent) => {
      const rect = drawerRef.current?.getBoundingClientRect();
      if (
        rect &&
        (e.clientX < rect.left || e.clientX > rect.right) &&
        (e.clientY < rect.top || e.clientY > rect.bottom)
      ) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [drawerRef, isDrawerOpen, isOpen]);

  const isLaptop = useMediaQuery("(min-width: 1023px)");

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleCreate = (values: z.infer<typeof schema>) => {
    const newNote = {
      id: Date.now().toString(),
      title: values.title,
      content: "",
      createdAt: new Date(),
    };
    setNotes([...notes, newNote]);
    setIsDrawerOpen(false);
  };

  const [fileType, setFileType] = useState<
    "image" | "video" | "audio" | "text"
  >();

  return (
    <>
      <div className="flex flex-col items-center justify-items-start absolute top-[80px] right-0 rounded-l-md rounded-r-none z-[100] w-fit">
        <motion.details
          open={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          className="w-full"
          initial={{ width: 30 }}
          animate={{ width: isOpen ? "100%" : 50 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <summary
            className={`left-0 relative p-2 ${
              isOpen ? "rounded-l-md" : "rounded-md"
            } bg-blue-400 rounded-r-none w-full flex items-center justify-start ${
              isOpen ? "justify-start" : "justify-center"
            }`}
          >
            {isOpen ? <FaCaretLeft size={24} /> : <FaCaretRight size={24} />}
            <PiNoteBlankFill size={24} />

            {showText && <span>New note</span>}
          </summary>
          <NewNoteSection handleCreate={handleCreate} notes={notes} />
        </motion.details>
      </div>
      <ContentLayout title="Dashboard">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="relative border-dashed border-2 border-gray-400 min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] rounded-md mt-[56px]">
          {notes.length === 0 && (
            <div className="w-full h-[calc(100%-20px)] flex items-center justify-center top-0 left-0">
              <span className="text-lg font-bold">No notes</span>
            </div>
          )}
          <Dialog
            onOpenChange={() => {
              setFileType(undefined);
            }}
          >
            <DialogTrigger asChild>
              <div className="w-full flex items-center justify-center my-4">
                <Button className="w-full max-w-sm">
                  <UploadIcon className="w-4 h-4 mr-1" />
                  Upload files
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload files</DialogTitle>
                <DialogDescription>
                  Choose which type of content you want to upload.
                </DialogDescription>
              </DialogHeader>

              {!fileType && (
                <div className="grid md:grid-cols-2 gap-2">
                  <Button
                    className="w-full"
                    onClick={() => setFileType("image")}
                    disabled
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Image
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => setFileType("video")}
                    disabled
                  >
                    <VideoIcon className="w-4 h-4 mr-1" />
                    Video
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => setFileType("audio")}
                    disabled
                  >
                    <AudioLinesIcon className="w-4 h-4 mr-1" />
                    Audio
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => setFileType("text")}
                  >
                    <TextIcon className="w-4 h-4 mr-1" />
                    Text
                  </Button>
                </div>
              )}

              {fileType === "text" && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your content here"
                  />
                </div>
              )}

              {fileType && (
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="w-full max-w-md h-auto relative">
                <CardHeader className="w-full flex flex-col items-center justify-start relative">
                  <CardTitle className="text-lg font-bold left-0 mr-auto">
                    {note.title}
                  </CardTitle>
                  <Button
                    className="absolute top-2 right-2"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(note.id)}
                  >
                    <FaTimes />
                  </Button>
                </CardHeader>
                <CardContent className="h-auto overflow-y-auto">
                  <CardDescription>
                    <Textarea
                      placeholder="Enter your prompt"
                      className="w-full max-h-60 overflow-y-auto resize-y mt-2"
                    >
                      {note.content}
                    </Textarea>
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </section>
        </section>
        <footer className=" absolute w-fit flex-col bottom-0 left-0 right-0 mx-auto flex items-center justify-center">
          <motion.div
            initial={{ y: "90%" }}
            animate={{ y: isDrawerOpen ? 100 : "100%" }}
            transition={{ type: "spring", stiffness: 50 }}
            className={`
                flex flex-col items-center justify-center
              `}
            ref={drawerRef}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`w-5 h-5 bottom-0 cursor-pointer mb-2`}
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                  >
                    <Triangle
                      className={`w-5 h-5 bottom-0 ${
                        isDrawerOpen ? "rotate-180" : ""
                      }`}
                      fill="black"
                    />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  {isDrawerOpen ? "Close" : "Open"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Card
              className={` bottom-0 left-0 right-0  shadow-lg mx-auto ${
                !isLaptop
                  ? "w-[700px] h-[400px]"
                  : "w-[1000px] h-[600px] rounded-t-lg"
              }`}
            >
              <menu className="flex justify-start border-b border-gray-200 ml-4">
                <li>
                  <button
                    className={`px-4 py-2 ${
                      activeTab === "summary"
                        ? "border-b-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setActiveTab("summary")}
                  >
                    Summary
                  </button>
                </li>
                <li>
                  <button
                    className={`px-4 py-2 ${
                      activeTab === "video" ? "border-b-2 border-blue-500" : ""
                    }`}
                    onClick={() => setActiveTab("video")}
                  >
                    Video recommendation
                  </button>
                </li>
              </menu>
              <div className="p-4">
                {activeTab === "summary" && (
                  <div className="h-[calc(100vh-56px-64px-20px-24px-56px-48px)] overflow-y-auto">
                    <Card className="w-full h-[200px] bg-blue-400 mb-4"></Card>

                    <section
                      className={`flex flex-col items-center justify-start`}
                    >
                      <header
                        className={`
                            w-full mr-auto
                          `}
                      >
                        <h3 className="text-lg font-bold">Generate</h3>
                      </header>
                      <div className="grid grid-cols-3 gap-4 mr-auto">
                        {["Q&A", "Discuss with AI", "Further info"].map(
                          (item, index) => (
                            <Card
                              key={index}
                              className="w-[150px] h-[150px] bg-blue-400"
                            >
                              <CardHeader className="w-full h-full flex items-start justify-start">
                                <CardTitle
                                  className={`mt-auto text-center text-sm font-semibold`}
                                >
                                  {item}
                                </CardTitle>
                              </CardHeader>
                            </Card>
                          )
                        )}
                      </div>
                    </section>
                  </div>
                )}
                {activeTab === "video" && (
                  <div className="h-[calc(100vh-56px-64px-20px-24px-56px-48px)] overflow-y-auto">
                    <Card className="w-full h-[200px] bg-blue-400 mb-4"></Card>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </footer>
      </ContentLayout>
    </>
  );
};
