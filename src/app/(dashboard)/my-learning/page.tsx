'use client';

import { ContentLayout } from '@/components';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePersistedId } from '@/hooks';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';
import { Edit, Eye, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Cards = {
  id: string;
  index: number;
  title: string;
  date: string;
};

export const MyLearning = () => {
  const router = useRouter();
  const {
    id: mylearning_id,
    clearId: clearMyLearningId,
    setPersistedId,
    generateNewId,
  } = usePersistedId('mylearning_id');

  const [cards, setCards] = useState<Cards[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currTitle, setCurrTitle] = useState<string>('');
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const [originalCards, setOriginalCards] = useState<Cards[]>([]);
  const [isDateSorted, setIsDateSorted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [colorMap, setColorMap] = useState<Map<number, string>>(new Map<number, string>());

  const supabaseClient = createClient();

  //DB Storage date
  const dateFormatter = (date: Date) => {
    const formattedDate =
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2);
    const formattedTime =
      ('0' + date.getHours()).slice(-2) +
      ':' +
      ('0' + date.getMinutes()).slice(-2) +
      ':' +
      ('0' + date.getSeconds()).slice(-2);
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
  };

  function assignColors(cards: any[], colorMap: Map<number, string>): Map<number, string> {
    const colors = ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100'];
    cards.forEach((card, index) => {
      if (!colorMap.has(index)) {
        colorMap.set(index, colors[index % colors.length]);
      }
    });
    return colorMap;
  }

  useEffect(() => {
    setColorMap(assignColors(cards, colorMap));
  }, [cards]);

  const fetchData = useCallback(async () => {
    try {
      const uuid = (await supabaseClient.auth.getUser()).data.user?.id;

      if (!uuid) {
        clearMyLearningId();
        throw new Error('User ID not returned from Supabase');
      }

      const res = await axios.get(`/api/v1/learnings?userId=${uuid}`);
      if (res.status === 200 && Array.isArray(res.data.body) && res.data.body.length > 0) {
        const options: Intl.DateTimeFormatOptions = {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        };

        const lastItem = res.data.body[res.data.body.length - 1];
        if (lastItem && lastItem.id) {
          setPersistedId(lastItem.id);
        } else {
          console.warn('Last item or its ID is undefined');
        }

        const fetchedCards: Cards[] = res.data.body
          .filter((item: any) => item && item.id && item.title && item.date)
          .map((item: any, index: number) => {
            const date = new Date(item.date);
            return {
              id: item.id,
              index: index,
              title: item.title,
              date: date.toLocaleDateString('en-GB', options),
            };
          });

        setCards(fetchedCards);
        setOriginalCards(fetchedCards);
      } else {
        console.error('Error fetching data or empty response:', res.data);
        toast.error('Failed to fetch learning data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(`Failed to fetch learning data: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, clearMyLearningId, setPersistedId]);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await fetchData();
      } catch (error) {
        toast.error('Error fetching MyLearnings: ' + (error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [fetchData]);

  const handleAddCard = async () => {
    try {
      const uuid = (await supabaseClient.auth.getUser()).data.user?.id;

      if (!uuid) {
        clearMyLearningId();
        throw new Error('User ID not returned from Supabase');
      }

      const currentDate = new Date();
      const formattedDate = dateFormatter(currentDate);
      const defaultTitle = `New Note ${formattedDate}`;

      const newLearningId = generateNewId();

      const data = {
        uuid: uuid,
        title: defaultTitle,
        date: formattedDate,
        id: newLearningId,
      };

      const res = await axios.post('/api/v1/learnings', data);
      if (res.status === 200) {
        redirectToDashboard(newLearningId);
      } else {
        toast.error(`Error storing data: ${res.data.error}`);
      }
    } catch (error) {
      toast.error(`Error storing data: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: string | null) => {
    try {
      if (id !== null) {
        const uuid = (await supabaseClient.auth.getUser()).data.user?.id as string;

        if (!uuid) {
          clearMyLearningId();
          throw new Error('User ID not returned from superbase');
        }

        const response = await axios.delete('/api/v1/learnings', {
          data: { id, uuid },
        });

        if (response.status === 200) {
          setCards((cards) => cards.filter((card) => card.id !== id));
          setOriginalCards((cards) => cards.filter((card) => card.id !== id));
          setIsDialogOpen(false);
        } else {
          toast.error('Error deleting My leaning data:', response.data.body);
        }
      }
    } catch (error) {
      throw new Error('Error when Delete my learning : ' + (error as Error).message);
    }
  };

  const handleSearch = (search: string) => {
    if (search.length > 0) {
      const filteredCards = cards.filter((card) =>
        card.title.toLowerCase().includes(search.toLowerCase()),
      );
      setCards(filteredCards);
    } else {
      setCards(originalCards);
    }
  };

  function parseDateUTC(dateString: string): Date {
    const [day, month, year] = dateString.split(' ');
    const monthIndex = new Date(Date.parse(month + ' 1, 2012')).getMonth(); // Get month index
    return new Date(Date.UTC(Number(year), monthIndex, Number(day)));
  }

  function handleEdit(id: string): void {
    const filteredCard = cards.find((card) => card.id === id);
    if (filteredCard) {
      const parsedDate = parseDateUTC(filteredCard.date);
      setCurrTitle(filteredCard.title);
      setCurrDate(parsedDate);
      setIsDialogOpen(true);
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrDate(new Date(e.target.value));
  };

  const handleSaveCard = async (card: Cards) => {
    try {
      const supabaseClient = createClient();

      const userId = (await supabaseClient.auth.getUser()).data.user?.id as string;

      if (!userId) throw new Error('User ID not returned from superbase');

      const response = await axios.patch('/api/v1/learnings', {
        id: card.id,
        title: card.title,
        date: card.date,
        uuid: userId,
      });

      const options = {
        day: 'numeric' as const,
        month: 'short' as const,
        year: 'numeric' as const,
      };
      const DateDiplay = new Date(card.date).toLocaleDateString('en-GB', options);

      const updatedCard = { ...card, date: DateDiplay };

      if (response.status === 200) {
        setCards(cards.map((c) => (c.id === card.id ? updatedCard : c)));
        setOriginalCards(cards.map((c) => (c.id === card.id ? updatedCard : c)));
        setIsDialogOpen(false);
      } else {
        console.error('Error updating data:', response.data.body);
      }
    } catch (error) {
      throw new Error('Error Update my learning : ' + (error as Error).message);
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
    setCurrTitle('');
    setIsDialogOpen(false);
  };

  const toggleSort = () => {
    if (isDateSorted === false) {
      const sortedCards = [...cards].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      setCards(sortedCards);
    } else {
      setCards(originalCards);
    }
    setIsDateSorted(!isDateSorted);
  };

  const redirectToDashboard = (id: string) => {
    router.push(`/new?mylearning_id=${id}`);
  };

  const redirectToMyLearningPage = (id: string) => {
    console.log('redirectToMyLearningPage', id);
    setPersistedId(id);
    window.open(`/dashboard?mylearning_id=${id}`, '_self');
  };

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedCards = isDateSorted
    ? [...filteredCards].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : filteredCards;

  return (
    <ContentLayout title="My Learning">
      <Breadcrumb className="flex flex-row items-center justify-between mb-6">
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
      </Breadcrumb>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Learning</h1>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-4 h-4 bg-black rounded-full" />
          <div className="flex-grow h-0.5 bg-black" />
        </div>
        <Tabs
          defaultValue={isDateSorted ? 'date' : 'recent'}
          onValueChange={(value) => setIsDateSorted(value === 'date')}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="date">Date</TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8 pr-4">
            <Card className="flex items-center justify-center h-48 border-2 border-dashed border-blue-300 bg-blue-50">
              <Button variant="ghost" className="h-full w-full" onClick={handleAddCard}>
                <Plus className="h-6 w-6 text-blue-500" />
              </Button>
            </Card>
            {sortedCards.map((card) => (
              <LearningCard
                key={card.id}
                id={card.id}
                title={card.title}
                date={card.date}
                onEdit={() => handleEdit(card.id)}
                handleDashboardScreen={() => redirectToMyLearningPage(card.id)}
              />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
            <DialogDescription>
              Make changes to your Learning here. Click save when you're done.
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
                onChange={(e) => setCurrDate(new Date(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex justify-between">
              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-900 text-white"
                onClick={() => handleDelete(mylearning_id)}
              >
                Delete
              </Button>
              <div>
                <Button type="button" className="mr-2" onClick={cancelChanges}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => saveChanges(mylearning_id)}>
                  Save changes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
        </div>
      )}
    </ContentLayout>
  );
};

const LearningCard = ({
  id,
  title,
  date,
  onEdit,
  handleDashboardScreen,
}: {
  id: string;
  title: string;
  date: string;
  onEdit: () => void;
  handleDashboardScreen: () => void;
}) => {
  const [isHover, setIsHover] = useState(false);
  const bgColors = ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100'];
  const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  return (
    <Card
      className={`relative h-48 ${bgColor} hover:shadow-lg transition-shadow duration-300 ease-in-out`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <CardContent className="flex flex-col justify-between h-full p-4">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{date}</p>
      </CardContent>
      {isHover && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-b-xl">
          <Button variant="secondary" className="mr-2" onClick={handleDashboardScreen}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="secondary" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MyLearning;
