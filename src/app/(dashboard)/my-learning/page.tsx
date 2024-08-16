"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEdit, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import { PiDotsThreeOutlineVerticalThin } from "react-icons/pi";

import { UserNav } from "@/components/dashboard/user-nav";
import { ModeToggle } from "@/providers/theme/mode-toggle";

import { assignColors } from "@/utils/assignColors";

import Image from "next/image";

import { ContentLayout } from "@/components";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/utils/supabase/client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import axios from "axios";
import Link from "next/link";

type Cards = {
  id: string;
  index: number;
  title: string;
  date: string;
};

export const MyLearning = () => {
  const router = useRouter();

  const [cards, setCards] = useState<Cards[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currTitle, setCurrTitle] = useState<string>("");
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const [originalCards, setOriginalCards] = useState<Cards[]>([]);
  const [isDateSorted, setIsDateSorted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colorMap, setColorMap] = useState<Map<number, string>>(new Map());

  //DB Storage date
  const dateFormatter = (date: Date) => {
    const formattedDate =
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2);
    const formattedTime =
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2) +
      ":" +
      ("0" + date.getSeconds()).slice(-2);
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
  };

  useEffect(() => {
    setColorMap(assignColors(cards, colorMap));
  }, [cards]);

  const fetchData = async () => {
    try {
      const supabaseClient = createClient();

      const uuid = (await supabaseClient.auth.getUser()).data.user
        ?.id as string;

      if (!uuid) throw new Error("User ID not returned from superbase");

      const res = await axios.get(`/api/v1/store-learnings?userId=${uuid}`);
      if (res.status === 200) {
        const options = {
          day: "numeric" as const,
          month: "short" as const,
          year: "numeric" as const,
        };
        const fetchedCards: Cards[] = res.data.body.map(
          (item: any, index: number) => {
            const date = new Date(item.date);
            return {
              id: item.id,
              index: index,
              title: item.title,
              date: date.toLocaleDateString("en-GB", options),
            };
          }
        );

        setCards(fetchedCards);
        setOriginalCards(fetchedCards);
      } else {
        console.error("Error fetching data:", res.data.body);
      }
    } catch (error) {
      throw new Error("Error fetching data : " + (error as Error).message);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await fetchData();
      } catch (error) {
        console.log(
          "this is Error is Fatch the MyLearnings : " + (error as Error).message
        );
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleAddCard = async () => {
    const supabaseClient = createClient();

    const uuid = (await supabaseClient.auth.getUser()).data.user?.id as string;

    if (!uuid) throw new Error("User ID not returned from superbase");

    const data = {
      uuid: uuid,
      title: "New Note",
      date: dateFormatter(new Date()),
    };

    try {
      const res = await axios.post("/api/v1/store-learnings", data);
      if (res.status === 200) {
        const newLearningId = res.data.body[0].id;
        redirectToDashboard(newLearningId);
      } else {
        console.error("Error storing data:", res.data.error);
      }
    } catch (error) {
      throw new Error("Error storing data : " + (error as Error).message);
    }
  };

  const handleDelete = async (id: string | null) => {
    try {
      if (id !== null) {
        const supabaseClient = createClient();

        const uuid = (await supabaseClient.auth.getUser()).data.user
          ?.id as string;

        if (!uuid) throw new Error("User ID not returned from superbase");

        const response = await axios.delete("/api/v1/store-learnings", {
          data: { id, uuid },
        });

        if (response.status === 200) {
          setCards((cards) => cards.filter((card) => card.id !== id));
          setOriginalCards((cards) => cards.filter((card) => card.id !== id));
          setIsDialogOpen(false);
        } else {
          console.error("Error deleting My leaning data:", response.data.body);
        }
      }
    } catch (error) {
      throw new Error(
        "Error when Delete my learning : " + (error as Error).message
      );
    }
  };

  const handleSearch = (search: string) => {
    if (search.length > 0) {
      const filteredCards = cards.filter((card) =>
        card.title.toLowerCase().includes(search.toLowerCase())
      );
      setCards(filteredCards);
    } else {
      setCards(originalCards);
    }
  };

  function parseDateUTC(dateString: string): Date {
    const [day, month, year] = dateString.split(" ");
    const monthIndex = new Date(Date.parse(month + " 1, 2012")).getMonth(); // Get month index
    return new Date(Date.UTC(Number(year), monthIndex, Number(day)));
  }

  function handleEdit(id: string): void {
    const filteredCard = cards.find((card) => card.id === id);
    if (filteredCard) {
      const parsedDate = parseDateUTC(filteredCard.date);
      setCurrTitle(filteredCard.title);
      setCurrDate(parsedDate);
      setEditingCardId(id);
      setIsDialogOpen(true);
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrDate(new Date(e.target.value));
  };

  const handleSaveCard = async (card: Cards) => {
    try {
      const supabaseClient = createClient();

      const userId = (await supabaseClient.auth.getUser()).data.user
        ?.id as string;

      if (!userId) throw new Error("User ID not returned from superbase");

      const response = await axios.patch("/api/v1/store-learnings", {
        id: card.id,
        title: card.title,
        date: card.date,
        uuid: userId,
      });

      const options = {
        day: "numeric" as const,
        month: "short" as const,
        year: "numeric" as const,
      };
      const DateDiplay = new Date(card.date).toLocaleDateString(
        "en-GB",
        options
      );

      const updatedCard = { ...card, date: DateDiplay };

      if (response.status === 200) {
        setCards(cards.map((c) => (c.id === card.id ? updatedCard : c)));
        setOriginalCards(
          cards.map((c) => (c.id === card.id ? updatedCard : c))
        );
        setIsDialogOpen(false);
      } else {
        console.error("Error updating data:", response.data.body);
      }
    } catch (error) {
      throw new Error("Error Update my learning : " + (error as Error).message);
    }
  };

  const saveChanges = (id: string | null) => {
    if (id !== null) {
      const cardToUpdate = cards.find((c) => c.id === id) as Cards;

      const updatedCard = {
        id: id,
        index: cardToUpdate?.index,
        title: currTitle,
        date: dateFormatter(currDate).toString(),
      };

      handleSaveCard(updatedCard);
    }
  };

  const cancelChanges = () => {
    setCurrDate(new Date());
    setCurrTitle("");
    setIsDialogOpen(false);
  };

  const toggleSort = () => {
    if (isDateSorted === false) {
      const sortedCards = [...cards].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setCards(sortedCards);
    } else {
      setCards(originalCards);
    }
    setIsDateSorted(!isDateSorted);
  };

  const redirectToDashboard = (id: string) => {
    router.push(`/new?id=${id}`);
  };

  const redirectToMyLearningPage = (id: string) => {
    router.push(`/dashboard?id=${id}`);
  };

  return (
    <ContentLayout title="My Learning">
      <Breadcrumb className={`flex flex-row items-center justify-between`}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Learning</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        <div className="flex flex-row items-center ml-6">
          <div className="h-9 w-9 -mr-[2.30rem] bg-black text-white rounded-xl z-10 flex justify-center items-center">
            <FaSearch size={18} />
          </div>
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 h-9 pl-10 bg-[#e6e6e6]"
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </Breadcrumb>
      <section className="bg-[#fef9f5] min-h-screen">
        <div className={`flex flex-col gap-4 sm:px-14 px-2 py-4`}>
          <div className="p-4">
            <div className="flex flex-row items-center">
              <h1 className="text-4xl font-mediums text-black">My</h1>
              <div className="ml-10 w-4 h-4 rounded-full bg-black"></div>
              <div className="w-full h-1 bg-black"></div>
            </div>
            <div className="flex sm:flex-row flex-col sm:items-center">
              <h1 className="text-4xl font-mediums text-black">Learnings</h1>
              <div className="sm:ml-10 md:mt-0 mt-2 flex items-center mx-auto">
                <Tabs defaultValue="recent" onValueChange={toggleSort}>
                  <TabsList>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="date">Date</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          <ScrollArea className="h-full w-full">
            <article
              className={`h-[60vh] overflow-y-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 pb-8 pr-3`}>
              <div className={`w-full h-full flex items-center justify-center`}>
                <Button
                  className={`
                    bg-transparent border-dashed border-2 border-blue-500 w-full 
                    h-full mx-auto hover:bg-transparent hover:border-blue-500 
                    hover:text-blue-500 rounded-tl-none rounded-tr-3xl rounded-b-3xl
                    flex flex-col justify-center items-center
                    p-8
                  `}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddCard();
                  }}>
                  <FaPlus size={24} color="#60a5fa" />
                </Button>
              </div>
              {cards.map((card) => (
                <LearningCard
                  id={card.id}
                  key={card.id}
                  title={card.title}
                  date={card.date}
                  onEdit={handleEdit}
                  bgColor={colorMap.get(card.index) || "#ffffff"}
                  handleDashboardScreen={redirectToMyLearningPage}
                />
              ))}
            </article>
            <ScrollBar orientation={`vertical`} />
          </ScrollArea>
          <Dialog open={isDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Details</DialogTitle>
                <DialogDescription>
                  Make changes to your Learning here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="titleinput" className="text-right">
                    Title
                  </Label>
                  <Input
                    type="text"
                    id="titleinput"
                    value={currTitle}
                    className="col-span-3"
                    onChange={(e) => setCurrTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateinput" className="text-right">
                    Date
                  </Label>
                  <Input
                    type="date"
                    id="dateinput"
                    value={currDate.toISOString().substring(0, 10)}
                    className="col-span-3"
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <div className="w-full flex justify-between">
                  <Button
                    type="submit"
                    className="bg-red-500 hover:bg-red-900 text-white"
                    onClick={() => handleDelete(editingCardId)}>
                    Delete
                  </Button>
                  <div>
                    <Button
                      type="submit"
                      className="mr-2"
                      onClick={cancelChanges}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={() => saveChanges(editingCardId)}>
                      Save changes
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 z-20 backdrop-blur-sm">
            <div className="Circleloader" />
          </div>
        )}
      </section>
    </ContentLayout>
  );
};

const LearningCard = ({
  id,
  title,
  date,
  bgColor,
  onEdit,
  handleDashboardScreen,
}: {
  id: string;
  title: string;
  date: string;
  onEdit: (id: string) => void;
  bgColor: string;
  handleDashboardScreen: (id: string) => void;
}) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}>
      <Card
        className={`
          w-full h-full flex flex-col justify-between
          rounded-tl-none rounded-tr-3xl rounded-b-3xl shadow-xl border-none cursor-pointer
        `}
        style={{
          backgroundColor: bgColor,
          filter: isHover ? "brightness(0.5)" : "brightness(1)",
        }}>
        <CardHeader className="flex items-center">
          <CardTitle className="w-full text-left text-black">{title}</CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-between items-center ">
          <div className="text-left text-black">{date}</div>
        </CardFooter>
      </Card>
      {isHover && (
        <div
          className="absolute inset-0 bg-opacity-50 flex items-center justify-center transition-opacity"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex space-x-4">
            <div
              className="bg-white p-2 rounded-full cursor-pointer"
              onClick={() => handleDashboardScreen(id)}>
              <FaEye size={24} className="text-black" title="View" />
            </div>
            <div
              className="bg-white p-2 rounded-full cursor-pointer"
              onClick={() => onEdit(id)}>
              <FaEdit size={24} className="text-black" title="Edit" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearning;
